import { Category, MatchPhase, MatchStatus, Prisma } from "@prisma/client";
import { AdminError, errorResponse, readBody } from "@/lib/adminValidation";
import { officialTable, winnerId } from "@/lib/competition";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await readBody(request);
    const category = body.category;
    if (category !== Category.MASTER && category !== Category.LIBRE) throw new AdminError("Selecciona Master o Libre.");
    if (typeof body.kickoffAt !== "string") throw new AdminError("Indica la fecha de los partidos.");
    const kickoffAt = new Date(body.kickoffAt);
    if (Number.isNaN(kickoffAt.getTime())) throw new AdminError("La fecha no es válida.");

    const result = await prisma.$transaction(async (tx) => {
      const season = await tx.season.findFirst({ where: { active: true } });
      if (!season) throw new AdminError("No hay temporada activa.", 409);
      const existing = await tx.match.findMany({
        where: { seasonId: season.id, teamA: { category }, phase: { not: MatchPhase.REGULAR } },
        orderBy: { id: "asc" },
      });
      const finals = existing.filter((match) => match.phase === MatchPhase.FINAL);
      const semis = existing.filter((match) => match.phase === MatchPhase.SEMI_FINAL);
      const quarters = existing.filter((match) => match.phase === MatchPhase.QUARTER_FINAL);
      if (finals.length) throw new AdminError("La final de esta categoría ya existe.", 409);

      let phase: MatchPhase;
      let pairs: Array<[number, number]>;
      if (semis.length) {
        if (semis.length !== 2 || semis.some((match) => winnerId(match) === null)) throw new AdminError("Finaliza ambas semifinales antes de generar la final.", 409);
        phase = MatchPhase.FINAL;
        pairs = [[winnerId(semis[0])!, winnerId(semis[1])!]];
      } else if (quarters.length) {
        if (quarters.length !== 4 || quarters.some((match) => winnerId(match) === null)) throw new AdminError("Finaliza los cuatro cuartos antes de generar semifinales.", 409);
        phase = MatchPhase.SEMI_FINAL;
        pairs = [[winnerId(quarters[0])!, winnerId(quarters[3])!], [winnerId(quarters[1])!, winnerId(quarters[2])!]];
      } else {
        const pending = await tx.match.count({ where: { seasonId: season.id, phase: MatchPhase.REGULAR, status: { not: MatchStatus.FINISHED }, teamA: { category } } });
        if (pending) throw new AdminError("Finaliza todos los partidos de la fase regular antes de generar cuartos.", 409);
        const table = await officialTable(tx, season.id, category);
        if (table.length < 8 || table.slice(0, 8).some((row) => row.played === 0)) throw new AdminError("Se necesitan ocho equipos con partidos reales jugados para comenzar cuartos.", 409);
        phase = MatchPhase.QUARTER_FINAL;
        pairs = [[table[0].teamId, table[7].teamId], [table[1].teamId, table[6].teamId], [table[2].teamId, table[5].teamId], [table[3].teamId, table[4].teamId]];
      }

      const label = phase === MatchPhase.QUARTER_FINAL ? "Cuartos de final" : phase === MatchPhase.SEMI_FINAL ? "Semifinales" : "Final";
      const round = await tx.round.create({ data: { seasonId: season.id, category, name: label, date: kickoffAt } });
      const matches = await Promise.all(pairs.map(([teamAId, teamBId]) => tx.match.create({ data: {
        seasonId: season.id, roundId: round.id, teamAId, teamBId, phase, kickoffAt,
      } })));
      return { phase, category, count: matches.length };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    return Response.json(result, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
