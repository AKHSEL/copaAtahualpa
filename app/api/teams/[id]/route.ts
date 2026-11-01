import { prisma } from "@/lib/prisma";
import { AdminError, errorResponse, parseId, parseTeam, readBody } from "@/lib/adminValidation";
import { getActiveSeason } from "@/lib/season";

type Context = { params: { id: string } };

export async function PATCH(request: Request, { params }: Context) {
  try {
    const id = parseId(params.id);
    const current = await prisma.team.findUnique({ where: { id } });
    const season = await getActiveSeason();
    if (!current || current.seasonId !== season.id) throw new AdminError("Equipo no encontrado en la temporada activa.", 404);
    const data = parseTeam(await readBody(request));
    const duplicate = await prisma.team.findFirst({ where: { seasonId: season.id, id: { not: id }, category: data.category, name: { equals: data.name, mode: "insensitive" } } });
    if (duplicate) throw new AdminError("Ya existe un equipo con ese nombre en la categoría.", 409);
    if (current.category !== data.category) {
      if (await prisma.match.count({ where: { seasonId: season.id, teamA: { category: { in: [current.category, data.category] } }, phase: { not: "REGULAR" } } })) throw new AdminError("No puedes cambiar categorías después de iniciar eliminatorias.", 409);
      const matches = await prisma.match.count({ where: { OR: [{ teamAId: id }, { teamBId: id }] } });
      if (matches) throw new AdminError("No puedes cambiar la categoría de un equipo que ya tiene partidos.", 409);
    }
    return Response.json(await prisma.team.update({ where: { id }, data }));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  try {
    const id = parseId(params.id);
    const current = await prisma.team.findUnique({ where: { id } });
    const season = await getActiveSeason();
    if (!current || current.seasonId !== season.id) throw new AdminError("Equipo no encontrado en la temporada activa.", 404);
    if (await prisma.match.count({ where: { seasonId: season.id, teamA: { category: current.category }, phase: { not: "REGULAR" } } })) throw new AdminError("La categoría ya está en eliminatorias; no se pueden eliminar equipos.", 409);
    const matches = await prisma.match.count({ where: { OR: [{ teamAId: id }, { teamBId: id }] } });
    if (matches) throw new AdminError("Elimina primero los partidos de este equipo.", 409);
    await prisma.team.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}
