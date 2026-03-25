import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: any) {
  try {
    const id = Number(params.id);
    const body = await req.json();

    console.log('API Route - Recibiendo PATCH para match ID:', id);
    console.log('API Route - Body recibido:', body);

    const updated = await prisma.match.update({
      where: { id },
      data: {
        goalsA: body.goalsA,
        goalsB: body.goalsB,
        status: body.status,
      },
    });

    console.log('API Route - Match actualizado:', updated);

    return NextResponse.json(updated);
  } catch (error) {
    console.error('API Route - Error al actualizar match:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el partido', details: error.message },
      { status: 500 }
    );
  }
}