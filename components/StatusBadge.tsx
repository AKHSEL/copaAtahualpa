import type { MatchStatus } from "@/types";

const labels: Record<MatchStatus, string> = {
  scheduled: "Programado",
  live: "En juego",
  finished: "Finalizado",
  cancelled: "Cancelado",
};

export function StatusBadge({ status }: { status: MatchStatus }) {
  return <span className={`status-badge status-badge--${status}`}>{status === "live" && <span className="status-badge__dot" aria-hidden="true" />}{labels[status]}</span>;
}
