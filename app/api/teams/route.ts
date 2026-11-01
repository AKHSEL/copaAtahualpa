import { prisma } from "@/lib/prisma";
import { AdminError, errorResponse, parseTeam, readBody } from "@/lib/adminValidation";
import { getActiveSeason } from "@/lib/season";

export async function GET() {
  try {
    const season = await getActiveSeason();
    return Response.json(await prisma.team.findMany({ where: { seasonId: season.id }, orderBy: [{ category: "asc" }, { name: "asc" }] }));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const data = parseTeam(await readBody(request));
    const season = await getActiveSeason();
    if (await prisma.match.count({ where: { seasonId: season.id, teamA: { category: data.category }, phase: { not: "REGULAR" } } })) throw new AdminError("La categoría ya está en eliminatorias; no se pueden agregar equipos.", 409);
    const existing = await prisma.team.findFirst({ where: { seasonId: season.id, category: data.category, name: { equals: data.name, mode: "insensitive" } } });
    if (existing) throw new AdminError("Ya existe un equipo con ese nombre en la categoría.", 409);
    return Response.json(await prisma.team.create({ data: { ...data, seasonId: season.id } }), { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
