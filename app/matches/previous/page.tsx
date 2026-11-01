import { Footer } from "@/components/Footer";
import { MatchCard } from "@/components/MatchCard";
import { PageIntro } from "@/components/PageIntro";
import { SiteHeader } from "@/components/SiteHeader";
import { getMatches } from "@/lib/api";
import type { CategoryId, Match } from "@/types";

export const dynamic = "force-dynamic";

export default async function PreviousMatchesPage() {
  const matches = ((await getMatches()) as Match[])
    .filter((match) => match.status === "finished")
    .sort((a, b) => Date.parse(b.kickoffAt) - Date.parse(a.kickoffAt));
  const groups: Array<{ id: CategoryId; title: string }> = [
    { id: "master", title: "Categoría Master" },
    { id: "libre", title: "Categoría Libre" },
  ];

  return (
    <div className="site-page">
      <SiteHeader active="previous" />
      <main>
        <PageIntro eyebrow="Marcadores · Copa Atahualpa" title="Resultados" description="Los partidos finalizados que ya escribieron la historia de esta temporada." />
        <section className="site-container matches-page-content">
          <div className="section-heading"><div><p className="eyebrow">Archivo de partidos</p><h2>Todos los marcadores</h2><p>Resultados reales de Master y Libre.</p></div><a className="text-link" href="/standings">Ver tabla de posiciones <span aria-hidden="true">↗</span></a></div>
          {matches.length ? <div className="results-groups">{groups.map((group) => {
            const categoryMatches = matches.filter((match) => match.categoryId === group.id);
            return <section key={group.id} aria-labelledby={`${group.id}-results-title`}><div className="category-heading"><div><span className={`category-heading__bar ${group.id === "libre" ? "category-heading__bar--libre" : ""}`} /><h3 id={`${group.id}-results-title`}>{group.title}</h3></div><span>{categoryMatches.length} resultados</span></div>{categoryMatches.length ? <div className="match-grid">{categoryMatches.map((match) => <MatchCard key={match.id} match={match} />)}</div> : <div className="empty-state">Aún no hay resultados en esta categoría.</div>}</section>;
          })}</div> : <div className="empty-state"><h3>Todavía no hay resultados</h3><p>Los marcadores aparecerán cuando terminen los primeros encuentros.</p></div>}
        </section>
      </main>
      <Footer />
    </div>
  );
}
