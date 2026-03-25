import { getMatches } from "@/lib/api";
import MatchForm from "@/components/MatchForm";

export default async function AdminPage() {
  const matches = await getMatches();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Panel Admin</h1>

      {matches.length === 0 && (
        <p className="text-gray-500">No hay partidos registrados</p>
      )}

      <div className="space-y-4">
        {matches.map((m) => (
          <div key={m.id} className="border p-4 rounded shadow-sm">
            <p className="font-semibold mb-2">
              {m.homeTeamId} vs {m.awayTeamId}
            </p>

            <p className="text-sm mb-3">
              Estado: <span className="font-medium">{m.status}</span>
            </p>

            <MatchForm match={m} />
          </div>
        ))}
      </div>
    </main>
  );
}