export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* BRANDING */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-primary)] text-lg">
                ⚽
              </div>
              <span className="font-bold text-[var(--brand-navy)]">Copa Atahualpa</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Torneo oficial 2026
            </p>
          </div>

          {/* NAVEGACIÓN - TABLA */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--text)]">
              Clasificación
            </h3>
            <a
              href="/standings"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors"
            >
              Tabla de Posiciones
            </a>
          </div>

          {/* NAVEGACIÓN - PARTIDOS */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--text)]">
              Partidos
            </h3>
            <div className="space-y-2">
              <a
                href="/matches/today"
                className="block text-sm text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors"
              >
                Partidos de Hoy
              </a>
              <a
                href="/matches/previous"
                className="block text-sm text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors"
              >
                Partidos Anteriores
              </a>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-6 border-t border-[var(--border)]"></div>

        {/* COPYRIGHT */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-[var(--text-muted)]">
            © 2026 Copa Atahualpa. Todos los derechos reservados.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Desarrollado por AKHSELdev
          </p>
        </div>
      </div>
    </footer>
  );
}
