import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const team = await prisma.team.create({
    data: {
      name: body.name,
      category: body.category.toUpperCase(),
    },
  });

  return NextResponse.json(team);
}