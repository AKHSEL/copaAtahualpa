import type { Match } from "@/types";

export function formatMatchDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime()) || date.getUTCFullYear() < 2000) return "Fecha por confirmar";
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Lima",
  }).format(date);
}

export function formatMatchTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime()) || date.getUTCFullYear() < 2000) return "—";
  return new Intl.DateTimeFormat("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Lima",
  }).format(date);
}

export function isMatchToday(match: Match, now = new Date()): boolean {
  const date = new Date(match.kickoffAt);
  if (Number.isNaN(date.getTime())) return false;
  const day = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "America/Lima",
  });
  return day.format(date) === day.format(now);
}
