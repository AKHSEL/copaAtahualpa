import Image from "next/image";
import { AdminDashboard } from "@/components/AdminDashboard";
import { prisma } from "@/lib/prisma";
import { getActiveSeason } from "@/lib/season";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const season = await getActiveSeason();
  const [teams, rounds, matches] = await Promise.all([
    prisma.team.findMany({ where: { seasonId: season.id }, orderBy: [{ category: "asc" }, { name: "asc" }] }),
    prisma.round.findMany({ where: { seasonId: season.id }, orderBy: [{ date: "desc" }, { id: "desc" }] }),
    prisma.match.findMany({ where: { seasonId: season.id }, include: { teamA: true, teamB: true, round: true }, orderBy: { kickoffAt: "desc" } }),
  ]);

  return <main className="admin-page">
    <header className="admin-header"><div className="site-container admin-header__inner"><div className="admin-header__brand"><Image src="/copa-atahualpa.jpg" alt="" width={48} height={48} /><div><strong>Copa Atahualpa</strong><span>Panel de administración</span></div></div><a href="/">Ver sitio ↗</a></div></header>
    <div className="site-container admin-page__content"><div className="admin-heading"><p className="eyebrow">Temporada {season.name}</p><h1>Gestiona la competencia</h1><p>Equipos, jornadas y partidos reales guardados en la base de datos.</p></div>
      <AdminDashboard
        key={season.id}
        seasonName={season.name}
        teams={teams.map((team) => ({ id: team.id, name: team.name, category: team.category }))}
        rounds={rounds.map((round) => ({ id: round.id, name: round.name, category: round.category, date: round.date.toISOString() }))}
        matches={matches.map((match) => ({
          id: match.id,
          teamAId: match.teamAId,
          teamBId: match.teamBId,
          teamAName: match.teamA.name,
          teamBName: match.teamB.name,
          category: match.teamA.category,
          roundId: match.roundId,
          roundName: match.round.name,
          kickoffAt: match.kickoffAt.toISOString(),
          status: match.status,
          goalsA: match.goalsA,
          goalsB: match.goalsB,
          phase: match.phase,
          penaltyA: match.penaltyA,
          penaltyB: match.penaltyB,
        }))}
      />
    </div>
  </main>;
}
