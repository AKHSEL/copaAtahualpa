import { getMatches } from "@/lib/api";

export default async function AdminPage() {
  const matches = await getMatches();

  console.log("ADMIN MATCHES:", matches);

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

            <form
              onSubmit={async (e) => {
                e.preventDefault();

                const formData = new FormData(e.currentTarget);

                await fetch(`/api/matches/${m.id}`, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    goalsA: Number(formData.get("goalsA")),
                    goalsB: Number(formData.get("goalsB")),
                    status: formData.get("status"),
                  }),
                });

                location.reload(); // simple por ahora
              }}
            >
              <div className="flex gap-2 items-center">
                <input
                  name="goalsA"
                  defaultValue={m.homeScore ?? 0}
                  className="border px-2 py-1 w-16 text-center rounded"
                />

                <span>-</span>

                <input
                  name="goalsB"
                  defaultValue={m.awayScore ?? 0}
                  className="border px-2 py-1 w-16 text-center rounded"
                />

                <select
                  name="status"
                  defaultValue={m.status}
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
          </div>
        ))}
      </div>
    </main>
  );
}