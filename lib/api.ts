import { prisma } from "./prisma";

export async function getMatches() {
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
    return matches.map((m) => ({
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
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
}