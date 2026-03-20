export type CategoryId = "master" | "libre";

export interface Team {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  categoryId: CategoryId;
}

export type MatchStatus = "scheduled" | "live" | "finished" | "cancelled";

export interface Match {
  id: string;
  categoryId: CategoryId;
  homeTeamId: string;
  awayTeamId: string;
  kickoffAt: string;
  finishedAt?: string;
  status: MatchStatus;
  homeScore: number | null;
  awayScore: number | null;
  roundLabel?: string;
  venue?: string;
  liveTimeLabel?: string;
}

export interface StandingsRow {
  teamId: string;
  categoryId: CategoryId;
  position: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  recentForm?: Array<"W" | "D" | "L">;
}

