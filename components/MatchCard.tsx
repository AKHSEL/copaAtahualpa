import type { CategoryId, MatchStatus } from "@/types";
import { StatusBadge } from "./StatusBadge";

type MatchCardBaseProps = {
  id: string;
  categoryId: CategoryId;
  homeTeamName: string;
  awayTeamName: string;
  kickoffTimeLabel: string;
  kickoffTimeISO?: string;
  venueLabel?: string;
  ariaLabel?: string;
};

type MatchCardScoredProps = MatchCardBaseProps & {
  status: "live" | "finished";
  homeScore: number;
  awayScore: number;
  liveTimeLabel?: string;
  roundLabel?: string;
};

type MatchCardScheduledProps = MatchCardBaseProps & {
  status: "scheduled";
  homeScore?: undefined;
  awayScore?: undefined;
};

export type MatchCardProps = MatchCardScoredProps | MatchCardScheduledProps;

export function MatchCard(props: MatchCardProps) {
  const {
    categoryId,
    homeTeamName,
    awayTeamName,
    kickoffTimeLabel,
    kickoffTimeISO,
    venueLabel,
    ariaLabel
  } = props;

  const isMaster = categoryId === "master";

  return (
    <article
      aria-label={ariaLabel}
      className="flex w-full flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm md:flex-row md:items-center md:justify-between md:p-4"
    >
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${
              isMaster
                ? "bg-[color-mix(in_srgb,var(--brand-primary)_12%,transparent)] text-[var(--brand-primary)]"
                : "bg-[color-mix(in_srgb,var(--brand-navy)_12%,transparent)] text-[var(--brand-navy)]"
            }`}
          >
            {isMaster ? "Categoría Master" : "Categoría Libre"}
          </span>
          <StatusBadge status={mapStatus(props.status)} />
        </div>

        <div className="mt-1 flex flex-col gap-1">
          <TeamRow name={homeTeamName} isEmphasized />
          <TeamRow name={awayTeamName} isEmphasized={false} />
        </div>
      </div>

      <div className="mt-3 flex flex-col items-start gap-2 md:mt-0 md:items-end">
        <ScoreOrTime {...props} />
        <div className="flex flex-col items-start text-xs text-[var(--text-muted)] md:items-end">
          <time dateTime={kickoffTimeISO}>{kickoffTimeLabel}</time>
          {venueLabel && <span>{venueLabel}</span>}
        </div>
      </div>
    </article>
  );
}

type TeamRowProps = {
  name: string;
  isEmphasized?: boolean;
};

function TeamRow({ name, isEmphasized = false }: TeamRowProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        aria-hidden="true"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600"
      >
        {name.slice(0, 2).toUpperCase()}
      </div>
      <p
        className={`truncate text-sm ${
          isEmphasized ? "font-semibold" : "font-medium text-[var(--text-muted)]"
        }`}
      >
        {name}
      </p>
    </div>
  );
}

type ScoreOrTimeProps = MatchCardProps;

function ScoreOrTime(props: ScoreOrTimeProps) {
  if (props.status === "scheduled") {
    return (
      <div className="flex flex-col items-start text-right md:items-end">
        <p className="text-sm font-medium text-[var(--text-muted)]">Próximo</p>
        <p className="text-lg font-semibold text-[var(--text)]">
          {props.kickoffTimeLabel}
        </p>
      </div>
    );
  }

  const { homeScore, awayScore } = props;

  return (
    <div className="flex flex-col items-end">
      <div className="flex min-w-[88px] items-baseline justify-between rounded-md bg-white px-3 py-1 text-2xl font-bold tracking-tight text-[var(--text)] [font-variant-numeric:tabular-nums]">
        <span>{homeScore}</span>
        <span aria-hidden="true" className="mx-2 text-base text-[var(--text-muted)]">
          -
        </span>
        <span>{awayScore}</span>
      </div>
      {props.status === "live" && props.liveTimeLabel && (
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[var(--brand-primary)]">
          {props.liveTimeLabel}
        </p>
      )}
      {props.status === "finished" && props.roundLabel && (
        <p className="mt-1 text-xs text-[var(--text-muted)]">{props.roundLabel}</p>
      )}
    </div>
  );
}

function mapStatus(status: MatchCardProps["status"]): MatchStatus {
  if (status === "live") return "live";
  if (status === "finished") return "finished";
  return "scheduled";
}

