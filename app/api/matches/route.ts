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

    // Adaptamos a tu UI actual
    const formatted = matches.map((m) => ({
      id: String(m.id),
      categoryId: m.teamA.category.toLowerCase(),
      homeTeam: m.teamA.name,
      awayTeam: m.teamB.name,
      kickoffAt: m.kickoffAt.toISOString(),
      status:
        m.status === "LIVE"
          ? "live"
          : m.status === "FINISHED"
          ? "finished"
          : "scheduled",
      homeScore: m.goalsA,
      awayScore: m.goalsB,
      venue: m.venue,
      roundLabel: m.round.name,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}