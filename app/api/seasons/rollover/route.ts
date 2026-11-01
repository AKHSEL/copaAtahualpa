import { Category, MatchPhase, Prisma } from "@prisma/client";
import { AdminError, errorResponse, readBody } from "@/lib/adminValidation";
import { officialTable, winnerId } from "@/lib/competition";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await readBody(request);
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name || name.length > 60) throw new AdminError("Escribe el nombre de la nueva temporada (máximo 60 caracteres).");

    const result = await prisma.$transaction(async (tx) => {
      const current = await tx.season.findFirst({ where: { active: true } });
      if (!current) throw new AdminError("No hay temporada activa.", 409);
      if (await tx.season.findUnique({ where: { name } })) throw new AdminError("Ya existe una temporada con ese nombre.", 409);
      const finals = await tx.match.findMany({ where: { seasonId: current.id, phase: MatchPhase.FINAL }, include: { teamA: true } });
      const champions = [Category.MASTER, Category.LIBRE].map((category) => {
        const games = finals.filter((match) => match.teamA.category === category);
        const championId = games.length === 1 ? winnerId(games[0]) : null;
        if (championId === null) throw new AdminError(`Finaliza la final de ${category === Category.MASTER ? "Master" : "Libre"} antes de cerrar la temporada.`, 409);
        return { category, teamId: championId };
      });
      const standings = (await Promise.all([Category.MASTER, Category.LIBRE].map(async (category) => {
        const table = await officialTable(tx, current.id, category);
        return table.map((row) => ({
          seasonId: current.id, category, position: row.position, teamName: row.teamName,
          played: row.played, wins: row.wins, draws: row.draws, losses: row.losses,
          goalsFor: row.goalsFor, goalsAgainst: row.goalsAgainst, goalDifference: row.goalDifference, points: row.points,
        }));
      }))).flat();
      await tx.seasonStanding.createMany({ data: standings });
      await tx.seasonChampion.createMany({ data: champions.map((champion) => ({ ...champion, seasonId: current.id })) });
      await tx.season.update({ where: { id: current.id }, data: { active: false, closedAt: new Date() } });
      const next = await tx.season.create({ data: { name, active: true } });
      return { archived: current.name, active: next.name };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    return Response.json(result, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
