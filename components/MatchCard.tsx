import type { Match } from "@/types";
import { formatMatchDate, formatMatchTime } from "@/lib/matchPresentation";
import { StatusBadge } from "./StatusBadge";

function Club({ name }: { name: string }) {
  return (
    <div className="match-card__club">
      <span className="club-mark" aria-hidden="true">{name.slice(0, 2).toUpperCase()}</span>
      <strong>{name}</strong>
    </div>
  );
}

export function MatchCard({ match }: { match: Match }) {
  const hasScore = (match.status === "finished" || match.status === "live") && match.homeScore != null && match.awayScore != null;

  return (
    <article className="match-card" aria-label={`${match.homeTeamId} contra ${match.awayTeamId}`}>
      <div className="match-card__top">
        <span className="match-card__category">{match.categoryId === "master" ? "Master" : "Libre"}</span>
        <span>{formatMatchDate(match.kickoffAt)}</span>
        <StatusBadge status={match.status} />
      </div>
      <div className="match-card__body">
        <Club name={match.homeTeamId} />
        <div className="match-card__center">
          {hasScore ? <strong className="match-card__score">{match.homeScore}<span>:</span>{match.awayScore}</strong> : <strong className="match-card__versus">VS</strong>}
          <span>{formatMatchTime(match.kickoffAt)}</span>
        </div>
        <Club name={match.awayTeamId} />
      </div>
      <div className="match-card__bottom">
        <span>{match.roundLabel ?? "Copa Atahualpa"}</span>
        {match.phase && match.phase !== "REGULAR" && match.penaltyA != null && match.penaltyB != null && <span>Penales {match.penaltyA} : {match.penaltyB}</span>}
      </div>
    </article>
  );
}
