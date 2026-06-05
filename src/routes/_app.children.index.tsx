import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ChevronRight, Plus } from "lucide-react";
import { children, initials } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/children/")({
  head: () => ({ meta: [{ title: "Enfants · Le Lac des Petits" }] }),
  component: ChildrenList,
});

function ChildrenList() {
  const [q, setQ] = useState("");
  const filtered = children.filter((c) =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(q.toLowerCase())
  );

  const chipFor = (s: string) =>
    s === "Actif" ? "chip chip-ok" : s === "Suspendu" ? "chip chip-warn" : "chip chip-danger";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-[32px]">Enfants</h1>
        <Link to="/children/new" className="btn-primary">
          <Plus size={16} /> Nouvel enfant
        </Link>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-faint)" }} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un enfant…"
          className="input-warm pl-11"
        />
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((c) => {
          const muted = c.contract === "Résilié";
          return (
            <Link
              key={c.id}
              to="/children/$id"
              params={{ id: c.id }}
              className="card-warm p-5 flex items-center gap-4 hover:shadow-[var(--shadow-lg)] transition-shadow"
              style={{ opacity: muted ? 0.6 : 1 }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white shrink-0"
                style={{ background: "var(--sage)" }}
              >
                {initials(c.firstName, c.lastName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold" style={{ color: "var(--ink)" }}>
                  {c.firstName} {c.lastName}
                </div>
                <div className="text-sm mt-1" style={{ color: "var(--ink-muted)" }}>
                  {c.ageLabel} · {c.guardian}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {c.allergies && <span className="chip chip-warn">{c.allergies}</span>}
                <span className={chipFor(c.contract)}>{c.contract}</span>
                <ChevronRight size={18} style={{ color: "var(--ink-faint)" }} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
