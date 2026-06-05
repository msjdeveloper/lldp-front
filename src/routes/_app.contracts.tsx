import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, ChevronRight } from "lucide-react";
import { children, initials, formatCHF } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/contracts")({
  head: () => ({ meta: [{ title: "Contrats · Le Lac des Petits" }] }),
  component: ContractsPage,
});

export type ContractRow = {
  id: string;
  childId: string;
  childName: string;
  status: "Actif" | "Suspendu" | "Résilié" | "Brouillon";
  rate: number;
  start: string;
  end?: string;
  rounding: string;
};

export const contracts: ContractRow[] = [
  { id: "C-2026-001", childId: "emma-dupont", childName: "Emma Dupont", status: "Actif", rate: 25, start: "01.01.2026", rounding: "15 min" },
  { id: "C-2026-002", childId: "lucas-martin", childName: "Lucas Martin", status: "Actif", rate: 25, start: "01.02.2026", rounding: "15 min" },
  { id: "C-2026-003", childId: "sophie-bernard", childName: "Sophie Bernard", status: "Actif", rate: 28, start: "15.03.2026", rounding: "30 min" },
  { id: "C-2026-004", childId: "antoine-lefevre", childName: "Antoine Lefèvre", status: "Suspendu", rate: 25, start: "01.01.2026", rounding: "15 min" },
  { id: "C-2025-019", childId: "lea-rousseau", childName: "Léa Rousseau", status: "Résilié", rate: 24, start: "01.09.2025", end: "31.03.2026", rounding: "15 min" },
];

const chip = (s: ContractRow["status"]) =>
  s === "Actif" ? "chip chip-ok"
  : s === "Suspendu" ? "chip chip-warn"
  : s === "Brouillon" ? "chip chip-info"
  : "chip chip-danger";

const filters: ("Tout" | ContractRow["status"])[] = ["Tout", "Actif", "Suspendu", "Brouillon", "Résilié"];

function ContractsPage() {
  const [q, setQ] = useState("");
  const [f, setF] = useState<(typeof filters)[number]>("Tout");

  const list = contracts
    .filter((c) => f === "Tout" || c.status === f)
    .filter((c) => c.childName.toLowerCase().includes(q.toLowerCase()));

  const activeCount = contracts.filter((c) => c.status === "Actif").length;
  const monthly = contracts
    .filter((c) => c.status === "Actif")
    .reduce((acc, c) => acc + c.rate * 40 * 4, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-[32px]">Contrats</h1>
        <Link to="/contracts/new" className="btn-primary"><Plus size={16} /> Nouveau contrat</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Contrats actifs" value={`${activeCount}`} color="var(--sage)" />
        <Stat label="Tarif moyen" value={`${formatCHF(26)}/h`} />
        <Stat label="Volume mensuel estimé" value={formatCHF(monthly)} color="var(--ok)" />
        <Stat label="À renouveler" value="0" color="var(--ink-muted)" />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[260px]">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-faint)" }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un contrat…" className="input-warm pl-11" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((s) => (
            <button
              key={s}
              onClick={() => setF(s)}
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                background: f === s ? "var(--sage)" : "var(--surface)",
                color: f === s ? "#fff" : "var(--ink-soft)",
                border: f === s ? "1px solid var(--sage)" : "1px solid var(--hairline)",
                minHeight: 40,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {list.map((c) => {
          const child = children.find((x) => x.id === c.childId);
          const muted = c.status === "Résilié";
          return (
            <Link
              key={c.id}
              to="/contracts/$id"
              params={{ id: c.id }}
              className="card-warm p-5 flex items-center gap-4 hover:shadow-[var(--shadow-lg)] transition-shadow"
              style={{ opacity: muted ? 0.65 : 1 }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white shrink-0" style={{ background: "var(--sage)" }}>
                {child ? initials(child.firstName, child.lastName) : "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{c.childName}</div>
                <div className="text-sm mt-1" style={{ color: "var(--ink-muted)" }}>
                  {c.id} · Début {c.start}{c.end ? ` · Fin ${c.end}` : ""}
                </div>
              </div>
              <div className="hidden md:flex flex-col items-end mr-4">
                <span className="text-xs uppercase tracking-wider" style={{ color: "var(--ink-muted)" }}>Tarif</span>
                <span className="num font-semibold">{formatCHF(c.rate)}/h</span>
              </div>
              <div className="hidden lg:flex flex-col items-end mr-4">
                <span className="text-xs uppercase tracking-wider" style={{ color: "var(--ink-muted)" }}>Arrondi</span>
                <span className="text-sm">{c.rounding}</span>
              </div>
              <span className={chip(c.status)}>{c.status}</span>
              <ChevronRight size={18} className="ml-2" style={{ color: "var(--ink-faint)" }} />
            </Link>
          );
        })}
        {list.length === 0 && (
          <div className="card-warm p-10 text-center text-sm" style={{ color: "var(--ink-muted)" }}>
            Aucun contrat ne correspond à cette recherche.
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="card-warm p-5">
      <div className="section-label mb-3">{label}</div>
      <div className="font-display num" style={{ fontSize: 28, color: color ?? "var(--ink)" }}>{value}</div>
    </div>
  );
}
