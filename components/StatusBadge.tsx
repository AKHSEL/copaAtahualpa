export type MatchStatus = "scheduled" | "live" | "finished";

type StatusBadgeProps = {
  status: MatchStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const label =
    status === "finished"
      ? "Finalizado"
      : status === "live"
      ? "En juego"
      : "Próximo";

  const classes =
    status === "finished"
      ? "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)]"
      : status === "live"
      ? "border border-[color-mix(in_srgb,var(--brand-primary)_35%,transparent)] bg-[color-mix(in_srgb,var(--brand-primary)_10%,transparent)] text-[var(--brand-primary)]"
      : "border border-[color-mix(in_srgb,var(--brand-navy)_35%,transparent)] bg-[color-mix(in_srgb,var(--brand-navy)_8%,transparent)] text-[var(--brand-navy)]";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${classes}`}
    >
      {status === "live" && (
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--brand-primary)]"
        />
      )}
      <span>{label}</span>
      <span className="sr-only">Estado del partido</span>
    </span>
  );
}

