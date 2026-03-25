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

  venue: m.venue ?? "Cancha",
  roundLabel: m.round?.name ?? "Jornada",
}));
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw error; 
  }
}