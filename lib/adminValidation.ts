import { Category, MatchPhase, MatchStatus, Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { getActiveSeason } from "./season";

export class AdminError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

export async function readBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const body: unknown = await request.json();
    if (body && typeof body === "object" && !Array.isArray(body)) return body as Record<string, unknown>;
  } catch {
    // The response below covers malformed JSON as well as non-object payloads.
  }
  throw new AdminError("Envía un objeto JSON válido.");
}

export function parseId(value: string): number {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) throw new AdminError("Identificador inválido.");
  return id;
}

function text(value: unknown, label: string, max: number): string {
  if (typeof value !== "string") throw new AdminError(`${label} es obligatorio.`);
  const clean = value.trim();
  if (!clean || clean.length > max) throw new AdminError(`${label} debe tener entre 1 y ${max} caracteres.`);
  return clean;
}

function date(value: unknown, label: string): Date {
  if (typeof value !== "string") throw new AdminError(`${label} es obligatoria.`);
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) throw new AdminError(`${label} no es válida.`);
  return parsed;
}

function integer(value: unknown, label: string): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) throw new AdminError(`${label} no es válido.`);
  return parsed;
}

export function parseCategory(value: unknown): Category {
  if (typeof value === "string") {
    const category = value.toUpperCase();
    if (category === "MASTER" || category === "LIBRE") return category;
  }
  throw new AdminError("La categoría debe ser MASTER o LIBRE.");
}

export function parseTeam(body: Record<string, unknown>) {
  return { name: text(body.name, "El nombre del equipo", 80), category: parseCategory(body.category) };
}

export function parseRound(body: Record<string, unknown>) {
  return { name: text(body.name, "El nombre de la jornada", 80), category: parseCategory(body.category), date: date(body.date, "La fecha") };
}

function score(value: unknown, label: string): number | null {
  if (value === null || value === "") return null;
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value > 99) throw new AdminError(`${label} debe ser un entero entre 0 y 99.`);
  return value;
}

export async function parseMatch(body: Record<string, unknown>, legacyRoundId?: number): Promise<Omit<Prisma.MatchUncheckedCreateInput, "seasonId">> {
  const season = await getActiveSeason();
  const teamAId = integer(body.teamAId, "El equipo local");
  const teamBId = integer(body.teamBId, "El equipo visitante");
  const roundId = integer(body.roundId, "La jornada");
  if (teamAId === teamBId) throw new AdminError("Un equipo no puede jugar contra sí mismo.");
  const [teams, round] = await Promise.all([
    prisma.team.findMany({ where: { id: { in: [teamAId, teamBId] } } }),
    prisma.round.findUnique({ where: { id: roundId } }),
  ]);
  if (teams.length !== 2 || !round) throw new AdminError("Selecciona equipos y jornada existentes.");
  if (teams.some((team) => team.seasonId !== season.id) || round.seasonId !== season.id) throw new AdminError("Equipos y jornada deben pertenecer a la temporada activa.");
  if (teams[0].category !== teams[1].category) throw new AdminError("Los equipos deben pertenecer a la misma categoría.");
  if (teams[0].category !== round.category && roundId !== legacyRoundId) throw new AdminError("La jornada debe pertenecer a la categoría de los equipos.");

  const status = body.status;
  if (status !== MatchStatus.PENDING && status !== MatchStatus.LIVE && status !== MatchStatus.FINISHED) throw new AdminError("Estado de partido inválido.");
  const goalsA = score(body.goalsA, "El marcador local");
  const goalsB = score(body.goalsB, "El marcador visitante");
  if (status !== MatchStatus.PENDING && (goalsA === null || goalsB === null)) throw new AdminError("Un partido en juego o finalizado necesita ambos marcadores.");
  const phase = body.phase ?? MatchPhase.REGULAR;
  if (!Object.values(MatchPhase).includes(phase as MatchPhase)) throw new AdminError("Fase inválida.");
  const penaltyA = score(body.penaltyA ?? null, "Los penales del local");
  const penaltyB = score(body.penaltyB ?? null, "Los penales del visitante");
  if (phase === MatchPhase.REGULAR && (penaltyA !== null || penaltyB !== null)) throw new AdminError("La fase regular no usa penales.");
  if (phase !== MatchPhase.REGULAR && status === MatchStatus.FINISHED) {
    if (goalsA === goalsB && (penaltyA === null || penaltyB === null || penaltyA === penaltyB)) throw new AdminError("El empate eliminatorio requiere penales con ganador.");
    if (goalsA !== goalsB && (penaltyA !== null || penaltyB !== null)) throw new AdminError("Solo registra penales cuando el partido termine empatado.");
  }

  return {
    teamAId,
    teamBId,
    roundId,
    phase: phase as MatchPhase,
    penaltyA: phase === MatchPhase.REGULAR || status !== MatchStatus.FINISHED ? null : penaltyA,
    penaltyB: phase === MatchPhase.REGULAR || status !== MatchStatus.FINISHED ? null : penaltyB,
    kickoffAt: date(body.kickoffAt, "La fecha del partido"),
    status,
    goalsA: status === MatchStatus.PENDING ? null : goalsA,
    goalsB: status === MatchStatus.PENDING ? null : goalsB,
  };
}

export function errorResponse(error: unknown): Response {
  if (error instanceof AdminError) return Response.json({ error: error.message }, { status: error.status });
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") return Response.json({ error: "Registro no encontrado." }, { status: 404 });
    if (error.code === "P2003") return Response.json({ error: "El registro está en uso. Elimina primero los partidos relacionados." }, { status: 409 });
  }
  console.error("Admin API error:", error);
  return Response.json({ error: "No se pudo completar la operación." }, { status: 500 });
}
