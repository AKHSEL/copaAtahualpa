import { prisma } from "@/lib/prisma";
import { AdminError, errorResponse, parseId, parseMatch, readBody } from "@/lib/adminValidation";
import { matchResponse } from "@/lib/matchResponse";
import { getActiveSeason } from "@/lib/season";

type Context = { params: { id: string } };

export async function PATCH(request: Request, { params }: Context) {
  try {
    const id = parseId(params.id);
    const current = await prisma.match.findUnique({ where: { id } });
    if (!current) throw new AdminError("Partido no encontrado.", 404);
    const season = await getActiveSeason();
    if (current.seasonId !== season.id) throw new AdminError("La temporada está cerrada.", 409);
    const laterPhase = current.phase === "REGULAR" ? "QUARTER_FINAL" : current.phase === "QUARTER_FINAL" ? "SEMI_FINAL" : current.phase === "SEMI_FINAL" ? "FINAL" : null;
    if (laterPhase && await prisma.match.count({ where: { seasonId: season.id, phase: laterPhase } })) throw new AdminError("La siguiente fase ya inició; este resultado está cerrado.", 409);
    const changes = await readBody(request);
    const data = await parseMatch({
      teamAId: current.teamAId,
      teamBId: current.teamBId,
      roundId: current.roundId,
      phase: current.phase,
      penaltyA: current.penaltyA,
      penaltyB: current.penaltyB,
      kickoffAt: current.kickoffAt.toISOString(),
      status: current.status,
      goalsA: current.goalsA,
      goalsB: current.goalsB,
      ...changes,
    }, current.roundId);
    if (data.phase !== current.phase) throw new AdminError("La fase del partido no se puede cambiar.", 409);
    if (current.phase !== "REGULAR" && (data.teamAId !== current.teamAId || data.teamBId !== current.teamBId || data.roundId !== current.roundId)) throw new AdminError("Los cruces eliminatorios no se pueden cambiar.", 409);
    return Response.json(matchResponse(await prisma.match.update({ where: { id }, data })));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  try {
    const id = parseId(params.id);
    const current = await prisma.match.findUnique({ where: { id } });
    const season = await getActiveSeason();
    if (!current || current.seasonId !== season.id) throw new AdminError("Partido no encontrado en la temporada activa.", 404);
    if (current.phase !== "REGULAR") throw new AdminError("Los cruces eliminatorios no se eliminan individualmente.", 409);
    const laterPhase = current.phase === "REGULAR" ? "QUARTER_FINAL" : current.phase === "QUARTER_FINAL" ? "SEMI_FINAL" : current.phase === "SEMI_FINAL" ? "FINAL" : null;
    if (laterPhase && await prisma.match.count({ where: { seasonId: season.id, phase: laterPhase } })) throw new AdminError("La siguiente fase ya inició; no se puede eliminar este partido.", 409);
    await prisma.match.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}
