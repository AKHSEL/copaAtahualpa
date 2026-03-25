"use client";

import { useState } from "react";

export default function CreateMatchForm() {
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="border p-4 rounded mb-6 flex flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = new FormData(e.currentTarget);

        await fetch("/api/matches", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            teamAId: Number(form.get("teamA")),
            teamBId: Number(form.get("teamB")),
            kickoffAt: form.get("date"),
            venue: "Cancha Atahualpa",
            roundId: Number(form.get("round")),
          }),
        });

        setLoading(false);
        location.reload();
      }}
    >
      <h2 className="font-bold text-lg">Crear Partido</h2>

      <input
        name="teamA"
        placeholder="ID Team A"
        className="border px-2 py-1"
        required
      />

      <input
        name="teamB"
        placeholder="ID Team B"
        className="border px-2 py-1"
        required
      />

      <input
        name="round"
        placeholder="Round ID"
        className="border px-2 py-1"
        required
      />

      <input
        name="date"
        type="datetime-local"
        className="border px-2 py-1"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-green-500 text-white py-2 rounded"
      >
        {loading ? "Creando..." : "Crear Partido"}
      </button>
    </form>
  );
}