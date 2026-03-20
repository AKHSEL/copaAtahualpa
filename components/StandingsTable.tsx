import type { StandingsRow, CategoryId } from "@/types";

type StandingsTableProps = {
  categoryId: CategoryId;
  rows: StandingsRow[];
};

export function StandingsTable({ categoryId, rows }: StandingsTableProps) {
  const isMaster = categoryId === "master";

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
      <table className="w-full border-collapse text-left text-xs md:text-sm">
        <thead className="sticky top-0 bg-[var(--brand-navy)] text-[0.7rem] font-semibold uppercase tracking-wide text-white">
          <tr>
            <th className="px-4 py-3 text-center">Pos</th>
            <th className="px-4 py-3">Equipo</th>
            <th className="px-2 py-3 text-center">PJ</th>
            <th className="px-2 py-3 text-center">G</th>
            <th className="px-2 py-3 text-center">E</th>
            <th className="px-2 py-3 text-center">P</th>
            <th className="hidden px-2 py-3 text-center sm:table-cell">GF</th>
            <th className="hidden px-2 py-3 text-center sm:table-cell">GC</th>
            <th className="hidden px-2 py-3 text-center md:table-cell">DG</th>
            <th className="px-4 py-3 text-center">Pts</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)] text-xs md:text-sm">
          {rows.map((row) => (
            <tr key={row.teamId} className="group hover:bg-slate-50">
              <td
                className={`px-4 py-3 text-center font-semibold ${
                  row.position <= 3
                    ? isMaster
                      ? "border-l-4 border-l-[var(--brand-primary)] bg-[color-mix(in_srgb,var(--brand-primary)_5%,transparent)]"
                      : "border-l-4 border-l-[var(--brand-navy)] bg-[color-mix(in_srgb,var(--brand-navy)_5%,transparent)]"
                    : ""
                }`}
              >
                {row.position}
              </td>
              <td className="px-4 py-3 font-medium text-[var(--text)]">
                {row.teamId}
              </td>
              <td className="px-2 py-3 text-center">{row.played}</td>
              <td className="px-2 py-3 text-center font-medium">
                {row.wins}
              </td>
              <td className="px-2 py-3 text-center text-[var(--text-muted)]">
                {row.draws}
              </td>
              <td className="px-2 py-3 text-center text-[var(--text-muted)]">
                {row.losses}
              </td>
              <td className="hidden px-2 py-3 text-center text-[var(--text-muted)] sm:table-cell">
                {row.goalsFor}
              </td>
              <td className="hidden px-2 py-3 text-center text-[var(--text-muted)] sm:table-cell">
                {row.goalsAgainst}
              </td>
              <td className="hidden px-2 py-3 text-center text-[var(--text-muted)] md:table-cell">
                {row.goalDifference >= 0 ? `+${row.goalDifference}` : row.goalDifference}
              </td>
              <td className="px-4 py-3 text-center font-bold text-[var(--text)]">
                {row.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

