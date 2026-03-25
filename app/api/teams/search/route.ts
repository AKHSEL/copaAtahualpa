import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  const teams = await prisma.team.findMany({
    where: {
      name: {
        contains: q,
        mode: "insensitive",
      },
    },
    take: 5,
  });

  return NextResponse.json(teams);
}