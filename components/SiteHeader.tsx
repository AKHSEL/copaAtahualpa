import Image from "next/image";
import { getActiveSeason } from "@/lib/season";

type Page = "home" | "standings" | "today" | "previous" | "playoffs" | "history";

const links: Array<{ href: string; label: string; page: Page }> = [
  { href: "/", label: "Inicio", page: "home" },
  { href: "/standings", label: "Tabla de posiciones", page: "standings" },
  { href: "/matches/today", label: "Partidos de hoy", page: "today" },
  { href: "/matches/previous", label: "Resultados", page: "previous" },
  { href: "/playoffs", label: "Eliminatorias", page: "playoffs" },
  { href: "/history", label: "Historial", page: "history" },
];

export async function SiteHeader({ active }: { active: Page }) {
  const season = await getActiveSeason();
  return (
    <header className="site-header">
      <div className="site-header__utility">
        <div className="site-container site-header__utility-inner">
          <span>Copa Atahualpa · Temporada {season.name}</span>
          <span>Pasión por el fútbol de barrio</span>
        </div>
      </div>
      <div className="site-container site-header__main">
        <a className="site-brand" href="/" aria-label="Copa Atahualpa, inicio">
          <span className="site-brand__logo"><Image src="/copa-atahualpa.jpg" alt="" width={56} height={56} priority /></span>
          <span className="site-brand__text"><strong>COPA</strong><strong>ATAHUALPA</strong></span>
        </a>
        <nav className="site-nav" aria-label="Navegación principal">
          {links.map((link) => (
            <a key={link.href} href={link.href} aria-current={active === link.page ? "page" : undefined}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
