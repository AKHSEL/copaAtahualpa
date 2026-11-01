import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getActiveSeason } from "@/lib/season";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const season = await getActiveSeason();

  const teams = await prisma.team.findMany({
    where: {
      seasonId: season.id,
      name: {
        contains: q,
        mode: "insensitive",
      },
    },
    take: 5,
  });

  return NextResponse.json(teams);
}
