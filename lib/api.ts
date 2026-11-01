import { prisma } from "./prisma";
import { getActiveSeason } from "./season";

export async function getTeams() {
  try {
    const season = await getActiveSeason();
    const teams = await prisma.team.findMany({ where: { seasonId: season.id }, orderBy: { name: "asc" } });
    return teams.map((team) => ({
      name: team.name,
      categoryId: team.category.toLowerCase() as "master" | "libre",
    }));
  } catch (error) {
    console.error("Error fetching teams:", error);
    if (process.env.NODE_ENV === "development") {
      return [];
    }
    throw error;
  }
}

export async function getMatches() {
  try {
    const season = await getActiveSeason();
    const matches = await prisma.match.findMany({
      where: { seasonId: season.id },
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
      : m.status === "PENDING"
      ? "scheduled"
      : "scheduled",

  homeScore: m.goalsA,
  awayScore: m.goalsB,
  phase: m.phase,
  penaltyA: m.penaltyA,
  penaltyB: m.penaltyB,

  roundLabel: m.round?.name ?? "Jornada",
}));
  } catch (error) {
    console.error("Error fetching matches:", error);
    if (process.env.NODE_ENV === "development") {
      return [];
    }
    throw error;
  }
}
