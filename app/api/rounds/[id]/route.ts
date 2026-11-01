import { prisma } from "@/lib/prisma";
import { AdminError, errorResponse, parseId, parseRound, readBody } from "@/lib/adminValidation";
import { getActiveSeason } from "@/lib/season";

type Context = { params: { id: string } };

export async function PATCH(request: Request, { params }: Context) {
  try {
    const id = parseId(params.id);
    const current = await prisma.round.findUnique({ where: { id } });
    const season = await getActiveSeason();
    if (!current || current.seasonId !== season.id) throw new AdminError("Jornada no encontrada en la temporada activa.", 404);
    const data = parseRound(await readBody(request));
    if (current.category !== data.category && await prisma.match.count({ where: { roundId: id } })) {
      throw new AdminError("No puedes cambiar la categoría de una jornada que ya tiene partidos.", 409);
    }
    return Response.json(await prisma.round.update({ where: { id }, data }));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  try {
    const id = parseId(params.id);
    const current = await prisma.round.findUnique({ where: { id } });
    const season = await getActiveSeason();
    if (!current || current.seasonId !== season.id) throw new AdminError("Jornada no encontrada en la temporada activa.", 404);
    if (await prisma.match.count({ where: { roundId: id } })) throw new AdminError("Elimina primero los partidos de esta jornada.", 409);
    await prisma.round.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}
