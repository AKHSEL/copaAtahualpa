import type { Match, StandingsRow, CategoryId } from "@/types";

export const masterStandings: StandingsRow[] = [
  {
    teamId: "los-andes-fc",
    categoryId: "master",
    position: 1,
    played: 10,
    wins: 8,
    draws: 1,
    losses: 1,
    goalsFor: 24,
    goalsAgainst: 8,
    goalDifference: 16,
    points: 25,
    recentForm: ["W", "W", "W", "D", "W"]
  },
  {
    teamId: "cd-quito",
    categoryId: "master",
    position: 2,
    played: 10,
    wins: 7,
    draws: 2,
    losses: 1,
    goalsFor: 20,
    goalsAgainst: 10,
    goalDifference: 10,
    points: 23,
    recentForm: ["W", "W", "D", "W", "W"]
  }
];

export const libreStandings: StandingsRow[] = [
  {
    teamId: "los-rayos",
    categoryId: "libre",
    position: 1,
    played: 5,
    wins: 5,
    draws: 0,
    losses: 0,
    goalsFor: 15,
    goalsAgainst: 2,
    goalDifference: 13,
    points: 15,
    recentForm: ["W", "W", "W", "W", "W"]
  },
  {
    teamId: "la-maquina",
    categoryId: "libre",
    position: 2,
    played: 5,
    wins: 4,
    draws: 0,
    losses: 1,
    goalsFor: 12,
    goalsAgainst: 5,
    goalDifference: 7,
    points: 12,
    recentForm: ["W", "W", "L", "W", "W"]
  }
];

export const todayMatches: Match[] = [
  {
    id: "m1",
    categoryId: "master",
    homeTeamId: "los-andes-fc",
    awayTeamId: "cd-quito",
    kickoffAt: "2025-04-13T18:00:00-05:00",
    status: "live",
    homeScore: 1,
    awayScore: 0,
    liveTimeLabel: "32’",
    venue: "Losa Deportiva Atahualpa"
  },
  {
    id: "m2",
    categoryId: "master",
    homeTeamId: "real-atahualpa",
    awayTeamId: "union-fc",
    kickoffAt: "2025-04-13T20:00:00-05:00",
    status: "scheduled",
    homeScore: null,
    awayScore: null,
    venue: "Losa Deportiva Atahualpa"
  },
  {
    id: "m3",
    categoryId: "libre",
    homeTeamId: "los-rayos",
    awayTeamId: "la-maquina",
    kickoffAt: "2025-04-13T16:30:00-05:00",
    status: "finished",
    finishedAt: "2025-04-13T18:10:00-05:00",
    homeScore: 3,
    awayScore: 2,
    roundLabel: "Jornada 5",
    venue: "Losa Deportiva Atahualpa"
  }
];

export function getStandingsByCategory(categoryId: CategoryId): StandingsRow[] {
  return categoryId === "master" ? masterStandings : libreStandings;
}

export function getTodayMatches(): Match[] {
  return todayMatches;
}

export function getPreviousMatches(): Match[] {
  return todayMatches.map((m) => ({
    ...m,
    kickoffAt: "2025-04-12T18:00:00-05:00",
    status: m.status === "scheduled" ? "finished" : m.status
  }));
}

