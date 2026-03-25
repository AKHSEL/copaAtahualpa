import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      include: {
        teamA: true,
        teamB: true,
        round: true,
      },
      orderBy: {
        kickoffAt: "asc",
      },
      
    });
console.log("MATCHES FROM DB:", matches);
return NextResponse.json(matches);
    // Adaptamos a tu UI actual
    const formatted = matches.map((m) => ({
  id: String(m.id),
  categoryId: m.teamA?.category?.toLowerCase() ?? "master",
  homeTeam: m.teamA?.name ?? "Equipo A",
  awayTeam: m.teamB?.name ?? "Equipo B",
  homeTeamId: m.teamA?.name ?? "Equipo A",
  awayTeamId: m.teamB?.name ?? "Equipo B",
  kickoffAt: m.kickoffAt.toISOString(),
  status:
    m.status === "LIVE"
      ? "live"
      : m.status === "FINISHED"
      ? "finished"
      : "scheduled",
  homeScore: m.goalsA ?? 0,
  awayScore: m.goalsB ?? 0,
  venue: m.venue,
  roundLabel: m.round?.name ?? "Jornada",
}));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();

  const match = await prisma.match.create({
    data: {
      teamAId: body.teamAId,
      teamBId: body.teamBId,
      kickoffAt: new Date(body.kickoffAt),
      venue: body.venue,
      roundId: body.roundId,
    },
  });

  return NextResponse.json(match);
}

