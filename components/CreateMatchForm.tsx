"use client";

import { useState } from "react";

export default function CreateMatchForm() {
  const [teamsA, setTeamsA] = useState<any[]>([]);
  const [teamsB, setTeamsB] = useState<any[]>([]);
  const [selectedA, setSelectedA] = useState<any>(null);
  const [selectedB, setSelectedB] = useState<any>(null);
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");

  async function searchTeams(query: string, setter: any) {
    if (!query.trim()) {
      setter([]);
      return;
    }
    const res = await fetch(`/api/teams/search?q=${query}`);
    const data = await res.json();
    setter(data);
  }

  const handleSelectTeamA = (team: any) => {
    setSelectedA(team);
    setSearchA(team.name);
    setTeamsA([]);
  };

  const handleSelectTeamB = (team: any) => {
    setSelectedB(team);
    setSearchB(team.name);
    setTeamsB([]);
  };

  const handleClearA = () => {
    setSelectedA(null);
    setSearchA("");
    setTeamsA([]);
  };

  const handleClearB = () => {
    setSelectedB(null);
    setSearchB("");
    setTeamsB([]);
  };

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();

        if (!selectedA || !selectedB) {
          alert("Por favor selecciona ambos equipos");
          return;
        }

        try {
          const response = await fetch("/api/matches", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              teamAId: selectedA.id,
              teamBId: selectedB.id,
              roundId: 1,
              kickoffAt: new Date(),
              venue: "Cancha",
            }),
          });

          if (response.ok) {
            location.reload();
          } else {
            alert("Error al crear el partido");
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Error al crear el partido");
        }
      }}
    >
      <div className="space-y-4">
        {/* TEAM A */}
        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            Equipo Local
          </label>
          <div className="relative">
            <input
              placeholder="Buscar equipo local..."
              value={searchA}
              onChange={(e) => {
                setSearchA(e.target.value);
                searchTeams(e.target.value, setTeamsA);
              }}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
            />
            {selectedA && (
              <button
                type="button"
                onClick={handleClearA}
                className="absolute right-3 top-2.5 text-[var(--text-muted)] hover:text-[var(--text)]"
                title="Limpiar selección"
              >
                ✕
              </button>
            )}

            {teamsA.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 max-h-32 overflow-y-auto rounded-lg border border-[var(--border)] bg-white shadow-lg z-10">
                {teamsA.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => handleSelectTeamA(t)}
                    className="cursor-pointer px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface)] border-b border-[var(--border)] last:border-b-0"
                  >
                    {t.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* TEAM B */}
        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            Equipo Visitante
          </label>
          <div className="relative">
            <input
              placeholder="Buscar equipo visitante..."
              value={searchB}
              onChange={(e) => {
                setSearchB(e.target.value);
                searchTeams(e.target.value, setTeamsB);
              }}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
            />
            {selectedB && (
              <button
                type="button"
                onClick={handleClearB}
                className="absolute right-3 top-2.5 text-[var(--text-muted)] hover:text-[var(--text)]"
                title="Limpiar selección"
              >
                ✕
              </button>
            )}

            {teamsB.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 max-h-32 overflow-y-auto rounded-lg border border-[var(--border)] bg-white shadow-lg z-10">
                {teamsB.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => handleSelectTeamB(t)}
                    className="cursor-pointer px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface)] border-b border-[var(--border)] last:border-b-0"
                  >
                    {t.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!selectedA || !selectedB}
        className="w-full rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Crear Partido
      </button>
    </form>
  );
}