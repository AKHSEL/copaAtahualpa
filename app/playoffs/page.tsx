import { Footer } from "@/components/Footer";
import { PageIntro } from "@/components/PageIntro";
import { PlayoffBracket } from "@/components/PlayoffBracket";
import { SiteHeader } from "@/components/SiteHeader";
import { getActiveSeason } from "@/lib/season";
import { getMatches } from "@/lib/api";
import type { Match } from "@/types";

export const dynamic = "force-dynamic";

export default async function PlayoffsPage() {
  const [season, matches] = await Promise.all([getActiveSeason(), getMatches()]);
  return <div className="site-page"><SiteHeader active="playoffs" /><main><PageIntro eyebrow={`Temporada ${season.name}`} title="Fase eliminatoria" description="Los ocho mejores de cada categoría disputan cuartos, semifinales y final. Los empates se definen por penales." /><section className="site-container standings-page-content"><PlayoffBracket matches={matches as Match[]} /></section></main><Footer /></div>;
}
