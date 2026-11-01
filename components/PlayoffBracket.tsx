import { MatchCard } from "./MatchCard";
import type { Match } from "@/types";

const phases = [
  { id: "QUARTER_FINAL", name: "Cuartos de final" },
  { id: "SEMI_FINAL", name: "Semifinales" },
  { id: "FINAL", name: "Final" },
] as const;

export function PlayoffBracket({ matches }: { matches: Match[] }) {
  return <div className="playoff-bracket">{(["master", "libre"] as const).map((category) => <section key={category} className="playoff-category"><h2>Categoría {category === "master" ? "Master" : "Libre"}</h2><div className="playoff-phases">{phases.map((phase) => {
    const games = matches.filter((match) => match.categoryId === category && match.phase === phase.id);
    return <section key={phase.id}><h3>{phase.name}</h3>{games.length ? <div className="playoff-games">{games.map((match) => <MatchCard key={match.id} match={match} />)}</div> : <p className="empty-state">Pendiente</p>}</section>;
  })}</div></section>)}</div>;
}
