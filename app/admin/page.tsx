import CreateTeamForm from "@/components/CreateTeamForm";
import CreateRoundForm from "@/components/CreateRoundForm";
import CreateMatchForm from "@/components/CreateMatchForm";
import { getMatches } from "@/lib/api";
import MatchForm from "@/components/MatchForm";
import { SectionHeader } from "@/components/SectionHeader";

export default async function AdminPage() {
  const matches = await getMatches();

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--brand-navy)] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-primary)] text-xl">
              ⚽
            </div>
            <span className="text-sm font-bold tracking-wide md:text-base">
              Copa Atahualpa - Panel Admin
            </span>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-12 pt-6 md:pt-10">
        <SectionHeader
          title="Panel de Administración"
          subtitle="Gestiona equipos, rondas y partidos del torneo"
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* FORMS SECTION */}
          <div className="space-y-6">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-[var(--brand-navy)]">
                Crear Nuevo Equipo
              </h3>
              <CreateTeamForm />
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-[var(--brand-navy)]">
                Crear Nueva Ronda
              </h3>
              <CreateRoundForm />
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-[var(--brand-navy)]">
                Crear Nuevo Partido
              </h3>
              <CreateMatchForm />
            </div>
          </div>

          {/* MATCHES SECTION */}
          <div className="space-y-6">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-[var(--brand-navy)]">
                Gestionar Partidos
              </h3>

              {matches.length === 0 ? (
                <p className="text-[var(--text-muted)]">
                  No hay partidos registrados
                </p>
              ) : (
                <div className="space-y-4">
                  {matches.map((m) => (
                    <div
                      key={m.id}
                      className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-sm"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <p className="font-semibold text-[var(--text)]">
                          {m.homeTeamId} vs {m.awayTeamId}
                        </p>
                        <span className="rounded bg-[color-mix(in_srgb,var(--brand-primary)_10%,transparent)] px-2 py-1 text-xs font-medium text-[var(--brand-primary)]">
                          {m.status}
                        </span>
                      </div>

                      <MatchForm match={m} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}