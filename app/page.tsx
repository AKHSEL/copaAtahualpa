import Image from "next/image";
import { Footer } from "@/components/Footer";
import { MatchCard } from "@/components/MatchCard";
import { SiteHeader } from "@/components/SiteHeader";
import { StandingsTable } from "@/components/StandingsTable";
import { getMatches, getTeams } from "@/lib/api";
import { formatMatchDate } from "@/lib/matchPresentation";
import { getStandingsByCategory } from "@/lib/standings";
import { getActiveSeason } from "@/lib/season";
import type { Match } from "@/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [matches, teams, season] = await Promise.all([getMatches(), getTeams(), getActiveSeason()]);
  const realMatches = matches as Match[];
  const masterStandings = getStandingsByCategory(realMatches, teams, "master");
  const libreStandings = getStandingsByCategory(realMatches, teams, "libre");
  const orderedMatches = [...realMatches].sort((a, b) => Date.parse(b.kickoffAt) - Date.parse(a.kickoffAt));
  const featured = orderedMatches.find((match) => match.status === "finished" && match.homeScore != null && match.awayScore != null);
  const hasPlayoffs = realMatches.some((match) => match.phase && match.phase !== "REGULAR");

  return (
    <div className="site-page">
      <SiteHeader active="home" />
      <main>
        <section className="home-hero">
          <div className="site-container home-hero__grid">
            <div className="home-hero__copy">
              <div className="home-hero__logo"><Image src="/copa-atahualpa.jpg" alt="Escudo oficial de la Copa Atahualpa" width={104} height={104} priority /></div>
              <p className="eyebrow eyebrow--light"><span className="eyebrow__line" /> Temporada {season.name} · Copa Atahualpa</p>
              <h1>El fútbol se vive <em>en cada barrio.</em></h1>
              <p>Resultados, partidos y posiciones de las categorías Master y Libre en un solo lugar.</p>
              <div className="home-hero__actions">
                <a className="button button--white" href="/standings">Ver tabla de posiciones <span aria-hidden="true">↗</span></a>
                <a className="button button--outline" href="/matches/previous">Explorar resultados <span aria-hidden="true">→</span></a>
              </div>
            </div>
            <div className="hero-feature">
              <div className="hero-feature__top"><span>Marcador destacado</span><span className="hero-feature__live">Resultado final</span></div>
              {featured ? (
                <>
                  <p className="hero-feature__meta">{featured.categoryId === "master" ? "Categoría Master" : "Categoría Libre"} · {formatMatchDate(featured.kickoffAt)}</p>
                  <div className="hero-feature__teams">
                    <div><span className="hero-feature__crest">{featured.homeTeamId.slice(0, 2).toUpperCase()}</span><strong>{featured.homeTeamId}</strong></div>
                    <span className="hero-feature__score">{featured.homeScore}<small>:</small>{featured.awayScore}</span>
                    <div><span className="hero-feature__crest">{featured.awayTeamId.slice(0, 2).toUpperCase()}</span><strong>{featured.awayTeamId}</strong></div>
                  </div>
                  <p className="hero-feature__footer">{featured.roundLabel ?? "Copa Atahualpa"}</p>
                </>
              ) : <p className="hero-feature__empty">Los resultados aparecerán aquí cuando termine el primer partido.</p>}
            </div>
          </div>
          <div className="site-container home-hero__stats" aria-label="Datos del torneo">
            <div><strong>{teams.length}</strong><span>Equipos</span></div>
            <div><strong>02</strong><span>Categorías</span></div>
            <div className="home-hero__stats-link"><a href="/matches/today">Ver partidos de hoy <span aria-hidden="true">↗</span></a></div>
          </div>
        </section>

        <section className="site-container content-section" aria-labelledby="matches-title">
          <div className="section-heading">
            <div><p className="eyebrow">La competencia</p><h2 id="matches-title">Marcadores y partidos</h2><p>Los últimos encuentros registrados en el torneo.</p></div>
            <a className="text-link" href="/matches/previous">Ver todos los resultados <span aria-hidden="true">↗</span></a>
          </div>
          {orderedMatches.length ? <div className="match-grid">{orderedMatches.slice(0, 4).map((match) => <MatchCard key={match.id} match={match} />)}</div> : <div className="empty-state">Todavía no hay partidos registrados.</div>}
        </section>

        <section className="standings-section" aria-labelledby="home-standings-title">
          <div className="site-container">
            <div className="section-heading">
              <div><p className="eyebrow">La carrera por la copa</p><h2 id="home-standings-title">Tabla de posiciones</h2><p>Dos categorías, una misma pasión.</p></div>
              <a className="text-link" href="/standings">Ver clasificación completa <span aria-hidden="true">↗</span></a>
            </div>
            <p className="simulation-note"><span aria-hidden="true">ⓘ</span> {hasPlayoffs ? "La tabla de la fase regular usa solo resultados reales y ya no cambia con las eliminatorias." : "Se completan hasta 5 partidos por equipo con resultados simulados. La clasificación a cuartos usa solo partidos reales."}</p>
            <div className="standings-stack">
              <section aria-labelledby="home-master-title"><div className="category-heading"><div><span className="category-heading__bar" /><h3 id="home-master-title">Categoría Master</h3></div><span>{masterStandings.length} equipos</span></div><StandingsTable categoryId="master" rows={masterStandings} /></section>
              <section aria-labelledby="home-libre-title"><div className="category-heading"><div><span className="category-heading__bar category-heading__bar--libre" /><h3 id="home-libre-title">Categoría Libre</h3></div><span>{libreStandings.length} equipos</span></div><StandingsTable categoryId="libre" rows={libreStandings} /></section>
            </div>
          </div>
        </section>

        <section className="site-container home-cta"><div><p className="eyebrow eyebrow--light">Sigue el torneo</p><h2>Cada fecha cuenta.</h2><p>Consulta los partidos del día o revisa los resultados que ya marcaron la tabla.</p></div><div><a className="button button--white" href="/matches/today">Partidos de hoy <span aria-hidden="true">↗</span></a><a className="button button--outline" href="/matches/previous">Resultados <span aria-hidden="true">→</span></a></div></section>
      </main>
      <Footer />
    </div>
  );
}
