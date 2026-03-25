import { SectionHeader } from "@/components/SectionHeader";
import { MatchCard } from "@/components/MatchCard";
import { getPreviousMatches } from "@/lib/mockData";

export default function PreviousMatchesPage() {
  const matches = getPreviousMatches();

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
          title="Partidos Anteriores"
          subtitle="Resultados recientes por fecha"
        />
        <div className="mt-4 flex flex-col gap-3">
          {matches.map((m) => {
            const status =
              m.status === "finished"
                ? "finished"
                : m.status === "live"
                ? "live"
                : "scheduled";

            if (status === "scheduled") {
              return (
                <MatchCard
                  key={m.id}
                  id={m.id}
                  categoryId={m.categoryId as CategoryId}
                  status="scheduled"
                  homeTeamName={m.homeTeamId}
                  awayTeamName={m.awayTeamId}
                  kickoffTimeLabel="Ayer"
                  kickoffTimeISO={m.kickoffAt}
                  venueLabel={m.venue}
                />
              );
            }

            return (
              <MatchCard
                key={m.id}
                id={m.id}
                categoryId={m.categoryId as CategoryId}
                status={status}
                homeTeamName={m.homeTeamId}
                awayTeamName={m.awayTeamId}
                homeScore={m.homeScore ?? 0}
                awayScore={m.awayScore ?? 0}
                kickoffTimeLabel="Ayer"
                kickoffTimeISO={m.kickoffAt}
                venueLabel={m.venue}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}

