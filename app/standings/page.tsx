import { SectionHeader } from "@/components/SectionHeader";
import { StandingsTable } from "@/components/StandingsTable";
import { masterStandings, libreStandings } from "@/lib/mockData";

export default function StandingsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[var(--bg)]">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--brand-navy)] text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-primary)] text-xl">
              ⚽
            </div>
            <span className="text-sm font-bold tracking-wide md:text-base">
              Copa Atahualpa
            </span>
          </div>
          <nav className="hidden gap-4 text-xs font-medium md:flex">
            <a href="/" className="rounded px-2 py-1 hover:bg-white/10">
              Inicio
            </a>
            <a href="/standings" className="rounded px-2 py-1 hover:bg-white/10">
              Tabla de Posiciones
            </a>
            <a href="/matches/today" className="rounded px-2 py-1 hover:bg-white/10">
              Partidos de Hoy
            </a>
            <a href="/matches/previous" className="rounded px-2 py-1 hover:bg-white/10">
              Partidos Anteriores
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto w-full max-w-5xl px-4 pb-10 pt-6 md:pt-10">
        <SectionHeader
          title="Tabla de Posiciones"
          subtitle="Clasificación actual de la Copa Atahualpa"
        />
        <div className="mt-6 space-y-10">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-[var(--brand-primary)]" />
              <h3 className="text-lg font-semibold text-[var(--brand-navy)]">
                Categoría Master
              </h3>
              <span className="rounded bg-[color-mix(in_srgb,var(--brand-primary)_10%,transparent)] px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--brand-primary)]">
                12 equipos
              </span>
            </div>
            <StandingsTable categoryId="master" rows={masterStandings} />
          </div>

          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-[var(--brand-navy)]" />
              <h3 className="text-lg font-semibold text-[var(--brand-navy)]">
                Categoría Libre
              </h3>
              <span className="rounded bg-[color-mix(in_srgb,var(--brand-navy)_10%,transparent)] px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--brand-navy)]">
                6 equipos
              </span>
            </div>
            <StandingsTable categoryId="libre" rows={libreStandings} />
          </div>
        </div>
      </section>
    </main>
  );
}

