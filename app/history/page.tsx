import { Footer } from "@/components/Footer";
import { PageIntro } from "@/components/PageIntro";
import { SiteHeader } from "@/components/SiteHeader";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const seasons = await prisma.season.findMany({ where: { active: false }, include: { champions: { include: { team: true } } }, orderBy: { closedAt: "desc" } });
  return <div className="site-page"><SiteHeader active="history" /><main><PageIntro eyebrow="Copa Atahualpa" title="Temporadas anteriores" description="Tablas finales, camino a la final y campeones de cada categoría." /><section className="site-container standings-page-content"><div className="history-list">{seasons.length ? seasons.map((season) => <a className="admin-panel" key={season.id} href={`/history/${season.id}`}><h2>Temporada {season.name} →</h2><p>Master: {season.champions.find((entry) => entry.category === "MASTER")?.team.name ?? "Sin campeón"} · Libre: {season.champions.find((entry) => entry.category === "LIBRE")?.team.name ?? "Sin campeón"}</p></a>) : <p className="empty-state">Aún no hay temporadas cerradas.</p>}</div></section></main><Footer /></div>;
}
