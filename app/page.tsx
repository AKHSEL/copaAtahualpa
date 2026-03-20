import { SectionHeader } from "@/components/SectionHeader";
import { MatchCard } from "@/components/MatchCard";
import { StandingsTable } from "@/components/StandingsTable";
import { getTodayMatches, masterStandings, libreStandings } from "@/lib/mockData";

export default function HomePage() {
  const matches = getTodayMatches();

  return (
    <main className="flex min-h-screen flex-col bg-[var(--bg)]">

      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--brand-navy)] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
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


      {/* HERO */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-8 pt-6 md:pt-10">
        <div className="relative overflow-hidden rounded-xl shadow-xl">
          <div
            className="relative z-10 flex min-h-[320px] flex-col items-center justify-center gap-6 bg-cover bg-center bg-no-repeat p-6 sm:p-8"
            style={{
              backgroundImage:
                'linear-gradient(rgba(13,12,60,0.7) 0%, rgba(13,12,60,0.9) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCj4Sai6Y01PmybFT4fvc88FDmJ4XA0qQ3_TfvT-7eNrIMrfwBTLZqMrh_nsRcXryyMqEJXjNEb7aXNrocnj6uemwp7v1NFrnZDutuGmkMmhsq8xgY-qzfpuhdpoACq9MIwUUeZwsEHBG2UniaZJlTPji3GuwJopx05sWQM-wurMKDaBy22paLgVyiWG3aorkK2EbYejmbDwkpkjeKQi3aXYrhSFJlwNsxcaWnOaPXJQvhdqZuTV-huM-iI9ns9kMPXA2nOh7kxXF8")'
            }}
          >

            <div className="flex max-w-2xl flex-col gap-2 text-center">
              <span className="mx-auto w-fit rounded-full border border-white/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white/80 backdrop-blur-sm">
                Torneo Oficial 2026
              </span>

              <h1 className="text-4xl font-black text-white sm:text-5xl lg:text-6xl">
                Copa Atahualpa
              </h1>

              <p className="mx-auto max-w-lg text-sm text-slate-200 sm:text-base">
                Vive la pasión del fútbol profesional. Resultados en vivo, estadísticas detalladas y la emoción de cada partido.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="/standings"
                className="flex h-11 items-center justify-center rounded-lg bg-white px-6 font-bold text-[var(--brand-primary)] shadow hover:scale-105 transition"
              >
                Ver Tabla
              </a>

              <a
                href="/matches/today"
                className="flex h-11 items-center justify-center rounded-lg bg-white px-6 font-bold text-[var(--brand-primary)] shadow hover:scale-105 transition"
              >
                Ver Partidos de Hoy
              </a>
            </div>

          </div>
        </div>
      </section>


      {/* MAIN CONTENT */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-12">

        <div className="grid lg:grid-cols-3 gap-8">

          {/* TABLA */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            <SectionHeader
              title="Tabla de posiciones"
              subtitle="Clasificación actual por categoría"
            />
            <select class="bg-white dark:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 border border-neutral-border dark:border-slate-700 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary/20 cursor-pointer hover:border-primary transition-colors">
<option>Categoría Master</option>
<option>Categoría Libre</option>
</select>

            <div className="space-y-4">
              <StandingsTable categoryId="master" rows={masterStandings} />
              <StandingsTable categoryId="libre" rows={libreStandings} />
            </div>

          </div>


          {/* PARTIDOS HOY */}
          <div className="flex flex-col gap-4">

            <SectionHeader
              title="Partidos de hoy"
              subtitle="En juego, finalizados y próximos"
            />

            <div className="flex flex-col gap-3">
              {matches.map((m) => (
                <MatchCard
                  key={m.id}
                  id={m.id}
                  categoryId={m.categoryId}
                  status={
                    m.status === "live"
                      ? "live"
                      : m.status === "finished"
                      ? "finished"
                      : "scheduled"
                  }
                  homeTeamName={m.homeTeamId}
                  awayTeamName={m.awayTeamId}
                  homeScore={m.homeScore ?? undefined}
                  awayScore={m.awayScore ?? undefined}
                  liveTimeLabel={m.liveTimeLabel}
                  roundLabel={m.roundLabel}
                  kickoffTimeLabel="Hoy"
                  kickoffTimeISO={m.kickoffAt}
                  venueLabel={m.venue}
                />
              ))}
            </div>

          </div>

        </div>

      </section>

    </main>
  );
}