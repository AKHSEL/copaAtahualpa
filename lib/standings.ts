import type { CategoryId, Match, StandingsRow } from "@/types";

export type StandingTeam = { name: string; categoryId: CategoryId };

const DEMO_MATCHES_PER_TEAM = 5;

type TeamStats = {
  teamId: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  recentForm: Array<"W" | "D" | "L">;
};

export function calculateStandings(matches: Match[], teamNames: string[] = []) {
  const table: Record<string, TeamStats> = {};

  teamNames.forEach((teamId) => {
    table[teamId] = {
      teamId,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      recentForm: [],
    };
  });

  [...matches].sort((a, b) => Date.parse(a.kickoffAt) - Date.parse(b.kickoffAt)).forEach((m) => {
    if (m.status !== "finished") return;

    if (m.homeScore == null || m.awayScore == null) return;
    if (!Number.isInteger(m.homeScore) || !Number.isInteger(m.awayScore)) return;
    if (m.homeScore < 0 || m.awayScore < 0) return;
    if (m.homeTeamId == null || m.awayTeamId == null) return;

    const home = m.homeTeamId;
    const away = m.awayTeamId;

    if (!table[home]) {
      table[home] = {
        teamId: home,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        recentForm: [],
      };
    }

    if (!table[away]) {
      table[away] = {
        teamId: away,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        recentForm: [],
      };
    }

    table[home].played++;
    table[away].played++;

    table[home].goalsFor += m.homeScore;
    table[home].goalsAgainst += m.awayScore;

    table[away].goalsFor += m.awayScore;
    table[away].goalsAgainst += m.homeScore;

    if (m.homeScore > m.awayScore) {
      table[home].wins++;
      table[home].points += 3;
      table[away].losses++;
      table[home].recentForm.push("W");
      table[away].recentForm.push("L");
    } else if (m.homeScore < m.awayScore) {
      table[away].wins++;
      table[away].points += 3;
      table[home].losses++;
      table[home].recentForm.push("L");
      table[away].recentForm.push("W");
    } else {
      table[home].draws++;
      table[away].draws++;
      table[home].points++;
      table[away].points++;
      table[home].recentForm.push("D");
      table[away].recentForm.push("D");
    }
  });

  return Object.values(table)
    .map((t) => ({
      ...t,
      goalDifference: t.goalsFor - t.goalsAgainst,
      recentForm: t.recentForm.slice(-5),
    }))
    .sort((a, b) =>
      b.points - a.points ||
      b.goalDifference - a.goalDifference ||
      b.goalsFor - a.goalsFor ||
      a.teamId.localeCompare(b.teamId)
    );
}

export function getStandingsByCategory(matches: Match[], teams: StandingTeam[], category: CategoryId): StandingsRow[] {
  const filtered = matches.filter((m) => m.categoryId === category && (!m.phase || m.phase === "REGULAR"));
  const teamNames = teams.filter((team) => team.categoryId === category).map((team) => team.name);
  const simulated = matches.some((match) => match.phase && match.phase !== "REGULAR") ? [] : createSimulatedMatches(filtered, teamNames, category);
  return calculateStandings([...filtered, ...simulated], teamNames).map((row, index) => ({
    ...row,
    categoryId: category,
    position: index + 1,
  }));
}

export function getOfficialStandingsByCategory(matches: Match[], teams: StandingTeam[], category: CategoryId): StandingsRow[] {
  const filtered = matches.filter((m) => m.categoryId === category && (!m.phase || m.phase === "REGULAR"));
  const teamNames = teams.filter((team) => team.categoryId === category).map((team) => team.name);
  return calculateStandings(filtered, teamNames).map((row, index) => ({ ...row, categoryId: category, position: index + 1 }));
}

export function createSimulatedMatches(matches: Match[], teamNames: string[], category: CategoryId): Match[] {
  if (teamNames.length < 6 || teamNames.length % 2 !== 0) return [];
  const remaining = new Map(teamNames.map((name) => [name, DEMO_MATCHES_PER_TEAM]));
  const pairKey = (a: string, b: string) => [a, b].sort().join("\u0000");
  const usedPairs = new Set(matches.map((match) => pairKey(match.homeTeamId, match.awayTeamId)));

  for (const match of matches) {
    if (match.status !== "finished" || match.homeScore == null || match.awayScore == null) continue;
    if (!Number.isInteger(match.homeScore) || !Number.isInteger(match.awayScore)) continue;
    if (match.homeScore < 0 || match.awayScore < 0) continue;
    for (const name of [match.homeTeamId, match.awayTeamId]) {
      if (remaining.has(name)) remaining.set(name, remaining.get(name)! - 1);
    }
  }

  const fixtures: Array<[string, string]> = [];
  function fill(): boolean {
    const open = teamNames.filter((name) => (remaining.get(name) ?? 0) > 0);
    if (open.length === 0) return true;
    open.sort((a, b) => remaining.get(b)! - remaining.get(a)! || a.localeCompare(b));
    const home = open[0];
    const options = open
      .filter((away) => away !== home && !usedPairs.has(pairKey(home, away)))
      .sort((a, b) => remaining.get(b)! - remaining.get(a)! || a.localeCompare(b));
    if (options.length < remaining.get(home)!) return false;

    for (const away of options) {
      const key = pairKey(home, away);
      remaining.set(home, remaining.get(home)! - 1);
      remaining.set(away, remaining.get(away)! - 1);
      usedPairs.add(key);
      fixtures.push([home, away]);
      if (fill()) return true;
      fixtures.pop();
      usedPairs.delete(key);
      remaining.set(home, remaining.get(home)! + 1);
      remaining.set(away, remaining.get(away)! + 1);
    }
    return false;
  }

  if (!fill()) return [];

  return fixtures.map(([homeTeamId, awayTeamId], index) => {
    const home = teamNames.indexOf(homeTeamId);
    const away = teamNames.indexOf(awayTeamId);
    return {
      id: `${category}-sim-${index + 1}`,
      categoryId: category,
      homeTeamId,
      awayTeamId,
      kickoffAt: new Date(Date.UTC(2026, 3, 1 + index)).toISOString(),
      status: "finished",
      homeScore: (home * 2 + away + index) % 4,
      awayScore: (home + away * 3 + index * 2) % 4,
    };
  });
}
