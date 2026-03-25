"use client";

export default function CreateRoundForm() {
  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();

        const form = new FormData(e.currentTarget);

        await fetch("/api/rounds", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.get("name"),
            category: form.get("category"),
            date: form.get("date"),
          }),
        });

        location.reload();
      }}
    >
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-1">
            Nombre de la Jornada
          </label>
          <input
            name="name"
            placeholder="Ej: Jornada 1"
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-1">
            Categoría
          </label>
          <select
            name="category"
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
            required
          >
            <option value="master">Master</option>
            <option value="libre">Libre</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-1">
            Fecha
          </label>
          <input
            type="date"
            name="date"
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-2 transition-colors"
      >
        Crear Jornada
      </button>
    </form>
  );
}