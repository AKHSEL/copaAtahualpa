import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const round = await prisma.round.create({
    data: {
      name: body.name,
      category: body.category.toUpperCase(),
      date: new Date(body.date),
    },
  });

  return NextResponse.json(round);
}