import { Category, Match, MatchPhase, MatchStatus, Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { calculateStandings } from "./standings";

type Db = Prisma.TransactionClient | typeof prisma;

export function winnerId(match: Pick<Match, "teamAId" | "teamBId" | "goalsA" | "goalsB" | "penaltyA" | "penaltyB" | "status">): number | null {
  if (match.status !== MatchStatus.FINISHED || match.goalsA === null || match.goalsB === null) return null;
  if (match.goalsA > match.goalsB) return match.teamAId;
  if (match.goalsB > match.goalsA) return match.teamBId;
  if (match.penaltyA === null || match.penaltyB === null || match.penaltyA === match.penaltyB) return null;
  return match.penaltyA > match.penaltyB ? match.teamAId : match.teamBId;
}

export async function officialTable(db: Db, seasonId: number, category: Category) {
  const [teams, matches] = await Promise.all([
    db.team.findMany({ where: { seasonId, category }, orderBy: { name: "asc" } }),
    db.match.findMany({ where: { seasonId, phase: MatchPhase.REGULAR, teamA: { category } }, include: { teamA: true, teamB: true } }),
  ]);
  const byName = new Map(teams.map((team) => [team.name, team.id]));
  const rows = calculateStandings(matches.map((match) => ({
    id: String(match.id), categoryId: category.toLowerCase() as "master" | "libre",
    homeTeamId: match.teamA.name, awayTeamId: match.teamB.name,
    kickoffAt: match.kickoffAt.toISOString(), status: match.status === MatchStatus.FINISHED ? "finished" as const : "scheduled" as const,
    homeScore: match.goalsA, awayScore: match.goalsB,
  })), teams.map((team) => team.name));
  return rows.map((row, index) => ({ ...row, teamId: byName.get(row.teamId)!, position: index + 1, teamName: row.teamId }));
}
