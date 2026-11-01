import type { CategoryId, StandingsRow } from "@/types";

const formLabels = { W: "Victoria", D: "Empate", L: "Derrota" } as const;
const formLetters = { W: "G", D: "E", L: "P" } as const;

export function StandingsTable({ categoryId, rows }: { categoryId: CategoryId; rows: StandingsRow[] }) {
  const category = categoryId === "master" ? "Master" : "Libre";

  return (
    <div className="standings-shell">
      <div className="standings-scroll">
        <table className="standings-table">
          <caption className="sr-only">Tabla de posiciones de la categoría {category}</caption>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Equipo</th>
              <th scope="col" title="Partidos jugados">PJ</th>
              <th scope="col" title="Partidos ganados">PG</th>
              <th scope="col" title="Partidos empatados">PE</th>
              <th scope="col" title="Partidos perdidos">PP</th>
              <th scope="col" title="Goles a favor">GF</th>
              <th scope="col" title="Goles en contra">GC</th>
              <th scope="col" title="Diferencia de goles">DG</th>
              <th scope="col">PTS</th>
              <th scope="col">Últ. 5</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.teamId}>
                <td><span className={`standings-rank ${row.position <= 3 ? "standings-rank--top" : ""}`}>{row.position}</span></td>
                <th scope="row"><span className="standings-club"><span className="club-mark club-mark--small" aria-hidden="true">{row.teamId.slice(0, 2).toUpperCase()}</span><span>{row.teamId}</span></span></th>
                <td>{row.played}</td>
                <td>{row.wins}</td>
                <td>{row.draws}</td>
                <td>{row.losses}</td>
                <td>{row.goalsFor}</td>
                <td>{row.goalsAgainst}</td>
                <td>{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                <td className="standings-points">{row.points}</td>
                <td><div className="standings-form" aria-label={`Últimos resultados: ${row.recentForm?.map((form) => formLabels[form]).join(", ") || "Sin partidos"}`}>
                  {row.recentForm?.length ? row.recentForm.map((form, index) => <span key={index} className={`form-dot form-dot--${form}`} aria-hidden="true">{formLetters[form]}</span>) : <span className="standings-form__empty">—</span>}
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
