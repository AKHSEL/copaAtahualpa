import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { PageIntro } from "@/components/PageIntro";
import { PlayoffBracket } from "@/components/PlayoffBracket";
import { SiteHeader } from "@/components/SiteHeader";
import { StandingsTable } from "@/components/StandingsTable";
import { prisma } from "@/lib/prisma";
import type { CategoryId, Match, StandingsRow } from "@/types";

export const dynamic = "force-dynamic";

export default async function SeasonHistoryPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isSafeInteger(id) || id <= 0) notFound();
  const season = await prisma.season.findFirst({ where: { id, active: false }, include: {
    standings: { orderBy: { position: "asc" } },
    champions: { include: { team: true } },
    matches: { where: { phase: { not: "REGULAR" } }, include: { teamA: true, teamB: true, round: true }, orderBy: { id: "asc" } },
  } });
  if (!season) notFound();
  const matches: Match[] = season.matches.map((game) => ({
    id: String(game.id), categoryId: game.teamA.category.toLowerCase() as CategoryId,
    homeTeamId: game.teamA.name, awayTeamId: game.teamB.name,
    kickoffAt: game.kickoffAt.toISOString(), status: game.status === "FINISHED" ? "finished" : game.status === "LIVE" ? "live" : "scheduled",
    homeScore: game.goalsA, awayScore: game.goalsB, roundLabel: game.round.name,
    phase: game.phase, penaltyA: game.penaltyA, penaltyB: game.penaltyB,
  }));
  return <div className="site-page"><SiteHeader active="history" /><main><PageIntro eyebrow="Archivo del torneo" title={`Temporada ${season.name}`} description="Clasificación final y recorrido de cuartos a la final." /><section className="site-container standings-page-content"><div className="history-champions">{(["MASTER", "LIBRE"] as const).map((category) => <div className="admin-panel" key={category}><p className="eyebrow">Campeón {category === "MASTER" ? "Master" : "Libre"}</p><h2>{season.champions.find((entry) => entry.category === category)?.team.name ?? "Sin definir"}</h2></div>)}</div><div className="standings-stack">{(["MASTER", "LIBRE"] as const).map((category) => {
    const rows: StandingsRow[] = season.standings.filter((row) => row.category === category).map((row) => ({
      teamId: row.teamName, categoryId: category.toLowerCase() as CategoryId, position: row.position,
      played: row.played, wins: row.wins, draws: row.draws, losses: row.losses,
      goalsFor: row.goalsFor, goalsAgainst: row.goalsAgainst, goalDifference: row.goalDifference, points: row.points,
    }));
    return <section key={category}><div className="category-heading"><div><span className="category-heading__bar" /><h2>Tabla final · {category === "MASTER" ? "Master" : "Libre"}</h2></div></div><StandingsTable categoryId={category.toLowerCase() as CategoryId} rows={rows} /></section>;
  })}</div><h2 className="history-bracket-title">Camino a la final</h2><PlayoffBracket matches={matches} /></section></main><Footer /></div>;
}
