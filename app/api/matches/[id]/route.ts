import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: any) {
  const id = Number(params.id);
  const body = await req.json();

  const updated = await prisma.match.update({
    where: { id },
    data: {
      goalsA: body.goalsA,
      goalsB: body.goalsB,
      status: body.status,
    },
  });

  return NextResponse.json(updated);
}