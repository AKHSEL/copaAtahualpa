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
};

export function calculateStandings(matches: any[]) {
  const table: Record<string, TeamStats> = {};

  matches.forEach((m) => {
    if (m.status !== "finished") return;

    if (m.homeScore == null || m.awayScore == null) return;
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
    } else if (m.homeScore < m.awayScore) {
      table[away].wins++;
      table[away].points += 3;
      table[home].losses++;
    } else {
      table[home].draws++;
      table[away].draws++;
      table[home].points++;
      table[away].points++;
    }
  });

  return Object.values(table)
    .map((t) => ({
      ...t,
      goalDifference: t.goalsFor - t.goalsAgainst,
    }))
    .sort((a, b) =>
      b.points - a.points ||
      b.goalDifference - a.goalDifference ||
      b.goalsFor - a.goalsFor
    );
}

export function getStandingsByCategory(matches: any[], category: string) {
  const filtered = matches.filter((m) => m.categoryId === category);
  return calculateStandings(filtered);
}