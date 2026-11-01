import { Footer } from "@/components/Footer";
import { MatchCard } from "@/components/MatchCard";
import { PageIntro } from "@/components/PageIntro";
import { SiteHeader } from "@/components/SiteHeader";
import { getMatches } from "@/lib/api";
import { isMatchToday } from "@/lib/matchPresentation";
import type { Match } from "@/types";

export const dynamic = "force-dynamic";

export default async function TodayMatchesPage() {
  const matches = ((await getMatches()) as Match[])
    .filter((match) => isMatchToday(match))
    .sort((a, b) => Date.parse(a.kickoffAt) - Date.parse(b.kickoffAt));
  const today = new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Lima" }).format(new Date());

  return (
    <div className="site-page">
      <SiteHeader active="today" />
      <main>
        <PageIntro eyebrow="Fixture · Copa Atahualpa" title="Partidos de hoy" description="Horarios, marcadores y estado de los encuentros programados para esta fecha." aside={<div className="intro-counter"><strong>{matches.length.toString().padStart(2, "0")}</strong><span>partidos hoy</span></div>} />
        <section className="site-container matches-page-content">
          <div className="section-heading"><div><p className="eyebrow">Agenda del torneo</p><h2>{today}</h2><p>{matches.length ? "Todos los encuentros de hoy, en orden de inicio." : "No hay encuentros registrados para hoy."}</p></div><a className="text-link" href="/matches/previous">Ver resultados anteriores <span aria-hidden="true">↗</span></a></div>
          {matches.length ? <div className="match-grid">{matches.map((match) => <MatchCard key={match.id} match={match} />)}</div> : <div className="empty-state"><span className="empty-state__icon" aria-hidden="true">CA</span><h3>Sin partidos para hoy</h3><p>Consulta los resultados del torneo mientras se programa la próxima fecha.</p><a className="button button--blue" href="/matches/previous">Ver resultados <span aria-hidden="true">↗</span></a></div>}
        </section>
      </main>
      <Footer />
    </div>
  );
}
