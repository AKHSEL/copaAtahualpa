import { prisma } from "@/lib/prisma";
import { errorResponse, parseRound, readBody } from "@/lib/adminValidation";
import { getActiveSeason } from "@/lib/season";

export async function GET() {
  try {
    const season = await getActiveSeason();
    return Response.json(await prisma.round.findMany({ where: { seasonId: season.id }, orderBy: [{ date: "desc" }, { id: "desc" }] }));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const data = parseRound(await readBody(request));
    const season = await getActiveSeason();
    return Response.json(await prisma.round.create({ data: { ...data, seasonId: season.id } }), { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
