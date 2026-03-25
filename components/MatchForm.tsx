'use client';

import { FormEvent, useState } from 'react';

interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
}

export default function MatchForm({ match }: { match: Match }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    const goalsA = Number(formData.get('goalsA'));
    const goalsB = Number(formData.get('goalsB'));
    const status = formData.get('status');

    console.log('Enviando datos:', { goalsA, goalsB, status, matchId: match.id });

    try {
      const response = await fetch(`/api/matches/${match.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goalsA,
          goalsB,
          status: status === 'scheduled' ? 'PENDING' :
                  status === 'live' ? 'LIVE' :
                  status === 'finished' ? 'FINISHED' : 'PENDING',
        }),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log('Respuesta de la API:', result);

      setMessage('✅ Cambios guardados correctamente');
      setTimeout(() => {
        location.reload();
      }, 1500);

    } catch (error) {
      console.error('Error al guardar el partido:', error);
      setMessage('❌ Error al guardar los cambios');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <input
            name="goalsA"
            defaultValue={match.homeScore ?? 0}
            className="w-16 rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-center text-sm text-[var(--text)] focus:border-[var(--brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
          />

          <span className="text-[var(--text-muted)]">-</span>

          <input
            name="goalsB"
            defaultValue={match.awayScore ?? 0}
            className="w-16 rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-center text-sm text-[var(--text)] focus:border-[var(--brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
          />
        </div>

        <select
          name="status"
          defaultValue={match.status}
          className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
        >
          <option value="scheduled">Programado</option>
          <option value="live">En vivo</option>
          <option value="finished">Finalizado</option>
        </select>

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Guardando...' : 'Guardar'}
        </button>
      </form>

      {message && (
        <p className={`text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
