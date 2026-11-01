"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export type AdminTeam = { id: number; name: string; category: "MASTER" | "LIBRE" };
export type AdminRound = { id: number; name: string; category: "MASTER" | "LIBRE"; date: string };
export type AdminMatch = {
  id: number;
  teamAId: number;
  teamBId: number;
  teamAName: string;
  teamBName: string;
  category: "MASTER" | "LIBRE";
  roundId: number;
  roundName: string;
  kickoffAt: string;
  status: "PENDING" | "LIVE" | "FINISHED";
  goalsA: number | null;
  goalsB: number | null;
  phase: "REGULAR" | "QUARTER_FINAL" | "SEMI_FINAL" | "FINAL";
  penaltyA: number | null;
  penaltyB: number | null;
};

type Props = { seasonName: string; teams: AdminTeam[]; rounds: AdminRound[]; matches: AdminMatch[] };
type Tab = "matches" | "teams" | "rounds" | "season";
type Save = (body: Record<string, unknown>) => Promise<boolean>;

function localDateTime(value?: string) {
  const date = value ? new Date(value) : new Date();
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

function TeamEditor({ initial, onSave, busy }: { initial?: AdminTeam; onSave: Save; busy: boolean }) {
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (await onSave({ name: data.get("name"), category: data.get("category") }) && !initial) form.reset();
  }
  return <form className="admin-form" onSubmit={submit}>
    <label>Nombre del equipo<input name="name" defaultValue={initial?.name} maxLength={80} required /></label>
    <label>Categoría<select name="category" defaultValue={initial?.category ?? "MASTER"}><option value="MASTER">Master</option><option value="LIBRE">Libre</option></select></label>
    <button className="admin-button" disabled={busy}>{initial ? "Guardar equipo" : "Crear equipo"}</button>
  </form>;
}

function RoundEditor({ initial, onSave, busy }: { initial?: AdminRound; onSave: Save; busy: boolean }) {
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (await onSave({ name: data.get("name"), category: data.get("category"), date: data.get("date") }) && !initial) form.reset();
  }
  return <form className="admin-form" onSubmit={submit}>
    <label>Nombre de la jornada<input name="name" defaultValue={initial?.name} maxLength={80} required /></label>
    <div className="admin-form__row">
      <label>Categoría<select name="category" defaultValue={initial?.category ?? "MASTER"}><option value="MASTER">Master</option><option value="LIBRE">Libre</option></select></label>
      <label>Fecha<input name="date" type="date" defaultValue={initial?.date.slice(0, 10)} required /></label>
    </div>
    <button className="admin-button" disabled={busy}>{initial ? "Guardar jornada" : "Crear jornada"}</button>
  </form>;
}

function MatchEditor({ initial, teams, rounds, onSave, busy }: { initial?: AdminMatch; teams: AdminTeam[]; rounds: AdminRound[]; onSave: Save; busy: boolean }) {
  const [category, setCategory] = useState<AdminTeam["category"]>(initial?.category ?? "MASTER");
  const [status, setStatus] = useState<AdminMatch["status"]>(initial?.status ?? "PENDING");
  const [scoreA, setScoreA] = useState(initial?.goalsA?.toString() ?? "");
  const [scoreB, setScoreB] = useState(initial?.goalsB?.toString() ?? "");
  const lockedFixture = initial?.phase !== undefined && initial.phase !== "REGULAR";
  const needsPenalties = initial?.phase !== undefined && initial.phase !== "REGULAR" && status === "FINISHED" && scoreA !== "" && scoreB !== "" && scoreA === scoreB;
  const categoryTeams = teams.filter((team) => team.category === category);
  const categoryRounds = rounds.filter((round) => round.category === category || (initial?.roundId === round.id && initial.category === category));
  const ready = categoryTeams.length >= 2 && categoryRounds.length > 0;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const kickoff = data.get("kickoffAt");
    if (typeof kickoff !== "string") return;
    const saved = await onSave({
      teamAId: lockedFixture ? initial!.teamAId : Number(data.get("teamAId")),
      teamBId: lockedFixture ? initial!.teamBId : Number(data.get("teamBId")),
      roundId: lockedFixture ? initial!.roundId : Number(data.get("roundId")),
      kickoffAt: new Date(kickoff).toISOString(),
      status,
      phase: initial?.phase ?? "REGULAR",
      goalsA: status === "PENDING" ? null : Number(data.get("goalsA")),
      goalsB: status === "PENDING" ? null : Number(data.get("goalsB")),
      penaltyA: needsPenalties ? Number(data.get("penaltyA")) : null,
      penaltyB: needsPenalties ? Number(data.get("penaltyB")) : null,
    });
    if (saved && !initial) { form.reset(); setStatus("PENDING"); setScoreA(""); setScoreB(""); }
  }

  return <form className="admin-form" onSubmit={submit}>
    {initial?.phase !== "REGULAR" && initial?.phase && <p className="admin-form__hint">{initial.phase === "QUARTER_FINAL" ? "Cuartos de final" : initial.phase === "SEMI_FINAL" ? "Semifinal" : "Final"} · Si el marcador termina empatado, registra los penales.</p>}
    <label>Categoría<select value={category} disabled={lockedFixture} onChange={(event) => setCategory(event.target.value as AdminTeam["category"])}><option value="MASTER">Master</option><option value="LIBRE">Libre</option></select></label>
    {!ready && <p className="admin-form__hint">Esta categoría necesita al menos dos equipos y una jornada antes de crear o editar partidos.</p>}
    <div className="admin-form__row">
      <label>Local<select name="teamAId" defaultValue={initial?.teamAId ?? categoryTeams[0]?.id} key={`a-${category}`} disabled={lockedFixture} required>{categoryTeams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}</select></label>
      <label>Visitante<select name="teamBId" defaultValue={initial?.teamBId ?? categoryTeams[1]?.id} key={`b-${category}`} disabled={lockedFixture} required>{categoryTeams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}</select></label>
    </div>
    <div className="admin-form__row">
      <label>Jornada<select name="roundId" defaultValue={initial?.roundId ?? categoryRounds[0]?.id} key={`r-${category}`} disabled={lockedFixture} required>{categoryRounds.map((round) => <option key={round.id} value={round.id}>{round.name} · {round.date.slice(0, 10)}{round.category !== category ? " · jornada anterior" : ""}</option>)}</select></label>
      <label>Inicio<input name="kickoffAt" type="datetime-local" defaultValue={localDateTime(initial?.kickoffAt)} required /></label>
    </div>
    <div className="admin-form__row admin-form__row--scores">
      <label>Estado<select value={status} onChange={(event) => setStatus(event.target.value as AdminMatch["status"])}><option value="PENDING">Programado</option><option value="LIVE">En juego</option><option value="FINISHED">Finalizado</option></select></label>
      <label>Goles local<input name="goalsA" type="number" min={0} max={99} value={scoreA} onChange={(event) => setScoreA(event.target.value)} disabled={status === "PENDING"} required={status !== "PENDING"} /></label>
      <label>Goles visitante<input name="goalsB" type="number" min={0} max={99} value={scoreB} onChange={(event) => setScoreB(event.target.value)} disabled={status === "PENDING"} required={status !== "PENDING"} /></label>
    </div>
    {needsPenalties && <div className="admin-form__row"><label>Penales local<input name="penaltyA" type="number" min={0} max={99} defaultValue={initial?.penaltyA ?? ""} required /></label><label>Penales visitante<input name="penaltyB" type="number" min={0} max={99} defaultValue={initial?.penaltyB ?? ""} required /></label></div>}
    <button className="admin-button" disabled={busy || !ready}>{initial ? "Guardar partido" : "Crear partido"}</button>
  </form>;
}

export function AdminDashboard({ seasonName, teams, rounds, matches }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("matches");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [nextName, setNextName] = useState(/^\d{4}$/.test(seasonName) ? String(Number(seasonName) + 1) : "");

  async function mutate(method: "POST" | "PATCH" | "DELETE", path: string, body?: Record<string, unknown>): Promise<boolean> {
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch(path, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || `La operación falló (${response.status}).`);
      }
      setMessage({ text: "Cambios guardados correctamente.", error: false });
      router.refresh();
      return true;
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : "Ocurrió un error.", error: true });
      return false;
    } finally {
      setBusy(false);
    }
  }

  function remove(path: string, label: string) {
    if (window.confirm(`¿Eliminar ${label}? Esta acción no se puede deshacer.`)) void mutate("DELETE", path);
  }

  return <div className="admin-dashboard">
    <div className="admin-tabs" role="tablist" aria-label="Secciones del panel">
      <button role="tab" aria-selected={tab === "matches"} onClick={() => setTab("matches")}>Partidos <span>{matches.length}</span></button>
      <button role="tab" aria-selected={tab === "teams"} onClick={() => setTab("teams")}>Equipos <span>{teams.length}</span></button>
      <button role="tab" aria-selected={tab === "rounds"} onClick={() => setTab("rounds")}>Jornadas <span>{rounds.length}</span></button>
      <button role="tab" aria-selected={tab === "season"} onClick={() => setTab("season")}>Temporada</button>
    </div>
    {message && <p className={`admin-message ${message.error ? "admin-message--error" : ""}`} role="status">{message.text}</p>}

    {tab === "teams" && <section className="admin-grid" aria-label="Gestión de equipos">
      <div className="admin-panel"><h2>Nuevo equipo</h2><p>Registra un club en Master o Libre.</p><TeamEditor busy={busy} onSave={(body) => mutate("POST", "/api/teams", body)} /></div>
      <div className="admin-panel"><h2>Equipos ({teams.length})</h2><p>Edita nombres y categorías o elimina equipos sin partidos.</p><div className="admin-list">{teams.map((team) => <details className="admin-item" key={team.id}><summary><strong>{team.name}</strong><span>{team.category === "MASTER" ? "Master" : "Libre"} · Editar</span></summary><TeamEditor initial={team} busy={busy} onSave={(body) => mutate("PATCH", `/api/teams/${team.id}`, body)} /><button className="admin-delete" disabled={busy} onClick={() => remove(`/api/teams/${team.id}`, `el equipo ${team.name}`)}>Eliminar equipo</button></details>)}</div></div>
    </section>}

    {tab === "rounds" && <section className="admin-grid" aria-label="Gestión de jornadas">
      <div className="admin-panel"><h2>Nueva jornada</h2><p>Define la categoría y la fecha de juego.</p><RoundEditor busy={busy} onSave={(body) => mutate("POST", "/api/rounds", body)} /></div>
      <div className="admin-panel"><h2>Jornadas ({rounds.length})</h2><p>Una jornada con partidos no puede cambiar de categoría ni eliminarse.</p><div className="admin-list">{rounds.map((round) => <details className="admin-item" key={round.id}><summary><strong>{round.name}</strong><span>{round.category === "MASTER" ? "Master" : "Libre"} · {round.date.slice(0, 10)} · Editar</span></summary><RoundEditor initial={round} busy={busy} onSave={(body) => mutate("PATCH", `/api/rounds/${round.id}`, body)} /><button className="admin-delete" disabled={busy} onClick={() => remove(`/api/rounds/${round.id}`, `la jornada ${round.name}`)}>Eliminar jornada</button></details>)}</div></div>
    </section>}

    {tab === "matches" && <section className="admin-grid" aria-label="Gestión de partidos">
      <div className="admin-panel"><h2>Nuevo partido</h2><p>Elige equipos, jornada, fecha y estado.</p><MatchEditor teams={teams} rounds={rounds} busy={busy} onSave={(body) => mutate("POST", "/api/matches", body)} /></div>
      <div className="admin-panel"><h2>Partidos ({matches.length})</h2><p>Edita el encuentro y su marcador. Los resultados simulados de la tabla no aparecen aquí.</p><div className="admin-list">{matches.map((match) => <details className="admin-item" key={match.id}><summary><strong>{match.teamAName} vs {match.teamBName}</strong><span>{match.category === "MASTER" ? "Master" : "Libre"} · {match.phase === "REGULAR" ? "Fase regular" : match.phase === "QUARTER_FINAL" ? "Cuartos" : match.phase === "SEMI_FINAL" ? "Semifinal" : "Final"} · {match.status} · Editar</span></summary><MatchEditor initial={match} teams={teams} rounds={rounds} busy={busy} onSave={(body) => mutate("PATCH", `/api/matches/${match.id}`, body)} />{match.phase === "REGULAR" && <button className="admin-delete" disabled={busy} onClick={() => remove(`/api/matches/${match.id}`, `el partido ${match.teamAName} vs ${match.teamBName}`)}>Eliminar partido</button>}</details>)}</div></div>
    </section>}

    {tab === "season" && <section className="admin-grid" aria-label="Gestión de temporada">
      <div className="admin-panel"><h2>Fase eliminatoria</h2><p>Por categoría: los ocho primeros de la tabla oficial pasan a cuartos. Al terminar cada fase, genera la siguiente.</p>{(["MASTER", "LIBRE"] as const).map((category) => {
        const categoryMatches = matches.filter((match) => match.category === category);
        const phase = categoryMatches.some((match) => match.phase === "FINAL") ? null : categoryMatches.some((match) => match.phase === "SEMI_FINAL") ? "Final" : categoryMatches.some((match) => match.phase === "QUARTER_FINAL") ? "Semifinales" : "Cuartos de final";
        return <form className="admin-form" key={category} onSubmit={(event) => { event.preventDefault(); const date = new FormData(event.currentTarget).get("kickoffAt"); if (typeof date === "string") void mutate("POST", "/api/playoffs/advance", { category, kickoffAt: new Date(date).toISOString() }); }}><h3>{category === "MASTER" ? "Master" : "Libre"}</h3>{phase ? <><label>Fecha de {phase.toLowerCase()}<input type="datetime-local" name="kickoffAt" defaultValue={localDateTime()} required /></label><button className="admin-button" disabled={busy}>Generar {phase.toLowerCase()}</button></> : <p>Final generada. Registra el resultado para definir al campeón.</p>}</form>;
      })}</div>
      <div className="admin-panel"><h2>Cerrar {seasonName}</h2><p>La tabla oficial, los cruces de cuartos a final y los campeones quedarán en el historial. La siguiente temporada comenzará sin equipos ni partidos. Deben estar terminadas ambas finales.</p><form className="admin-form" onSubmit={(event) => { event.preventDefault(); if (window.confirm(`¿Cerrar la temporada ${seasonName} e iniciar ${nextName}? Se conservará el historial.`)) void mutate("POST", "/api/seasons/rollover", { name: nextName }); }}><label>Nueva temporada<input value={nextName} onChange={(event) => setNextName(event.target.value)} maxLength={60} required /></label><button className="admin-button" disabled={busy}>Cerrar e iniciar nueva temporada</button></form><a className="text-link" href="/history">Ver historial →</a></div>
    </section>}
  </div>;
}
