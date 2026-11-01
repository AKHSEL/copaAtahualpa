import { prisma } from "@/lib/prisma";
import { AdminError, errorResponse, parseMatch, readBody } from "@/lib/adminValidation";
import { matchResponse } from "@/lib/matchResponse";
import { getActiveSeason } from "@/lib/season";

export async function GET() {
  try {
    const season = await getActiveSeason();
    const matches = await prisma.match.findMany({
      where: { seasonId: season.id },
      include: { teamA: true, teamB: true, round: true },
      orderBy: { kickoffAt: "desc" },
    });
    return Response.json(matches.map(matchResponse));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const data = await parseMatch(await readBody(request));
    if (data.phase !== "REGULAR") throw new AdminError("Los partidos eliminatorios se generan desde el panel de fases.");
    const season = await getActiveSeason();
    const team = await prisma.team.findUniqueOrThrow({ where: { id: data.teamAId } });
    if (await prisma.match.count({ where: { seasonId: season.id, teamA: { category: team.category }, phase: { not: "REGULAR" } } })) throw new AdminError("La fase regular de esta categoría ya terminó.", 409);
    return Response.json(matchResponse(await prisma.match.create({ data: { ...data, seasonId: season.id } })), { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
