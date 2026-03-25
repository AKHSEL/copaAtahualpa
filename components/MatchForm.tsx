'use client';

import { FormEvent } from 'react';

interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
}

export default function MatchForm({ match }: { match: Match }) {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    await fetch(`/api/matches/${match.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        goalsA: Number(formData.get('goalsA')),
        goalsB: Number(formData.get('goalsB')),
        status: formData.get('status'),
      }),
    });

    location.reload();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-2 items-center">
        <input
          name="goalsA"
          defaultValue={match.homeScore ?? 0}
          className="border px-2 py-1 w-16 text-center rounded"
        />

        <span>-</span>

        <input
          name="goalsB"
          defaultValue={match.awayScore ?? 0}
          className="border px-2 py-1 w-16 text-center rounded"
        />

        <select
          name="status"
          defaultValue={match.status}
          className="border px-2 py-1 rounded"
        >
          <option value="scheduled">Scheduled</option>
          <option value="live">Live</option>
          <option value="finished">Finished</option>
        </select>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
