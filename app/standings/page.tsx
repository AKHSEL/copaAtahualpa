import { Footer } from "@/components/Footer";
import { PageIntro } from "@/components/PageIntro";
import { SiteHeader } from "@/components/SiteHeader";
import { StandingsTable } from "@/components/StandingsTable";
import { getMatches, getTeams } from "@/lib/api";
import { getStandingsByCategory } from "@/lib/standings";
import { getActiveSeason } from "@/lib/season";
import type { Match } from "@/types";

export const dynamic = "force-dynamic";

export default async function StandingsPage() {
  const [matches, teams, season] = await Promise.all([getMatches(), getTeams(), getActiveSeason()]);
  const masterStandings = getStandingsByCategory(matches as Match[], teams, "master");
  const libreStandings = getStandingsByCategory(matches as Match[], teams, "libre");
  const hasPlayoffs = (matches as Match[]).some((match) => match.phase && match.phase !== "REGULAR");

  return (
    <div className="site-page">
      <SiteHeader active="standings" />
      <main>
        <PageIntro eyebrow={`Competencia · Temporada ${season.name}`} title="Tabla de posiciones" description="Sigue el rendimiento de cada equipo en las categorías Master y Libre." aside={<div className="intro-counter"><strong>{teams.length.toString().padStart(2, "0")}</strong><span>equipos en competencia</span></div>} />
        <section className="site-container standings-page-content">
          <div className="section-heading section-heading--tight"><div><p className="eyebrow">Clasificación</p><h2>La pelea por cada punto</h2></div><nav className="category-jump" aria-label="Ir a categoría"><a href="#master">Master</a><a href="#libre">Libre</a></nav></div>
          <p className="simulation-note"><span aria-hidden="true">ⓘ</span> {hasPlayoffs ? "La fase regular está cerrada; esta tabla usa solo resultados reales." : "Se completan hasta 5 partidos por equipo con resultados simulados. La clasificación a cuartos usa solo partidos reales."}</p>
          <div className="standings-stack">
            <section id="master" aria-labelledby="master-title"><div className="category-heading"><div><span className="category-heading__bar" /><h3 id="master-title">Categoría Master</h3></div><span>{masterStandings.length} equipos</span></div><StandingsTable categoryId="master" rows={masterStandings} /></section>
            <section id="libre" aria-labelledby="libre-title"><div className="category-heading"><div><span className="category-heading__bar category-heading__bar--libre" /><h3 id="libre-title">Categoría Libre</h3></div><span>{libreStandings.length} equipos</span></div><StandingsTable categoryId="libre" rows={libreStandings} /></section>
          </div>
          <p className="standings-legend">PJ partidos jugados · PG ganados · PE empatados · PP perdidos · GF goles a favor · GC goles en contra · DG diferencia de goles · PTS puntos</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
