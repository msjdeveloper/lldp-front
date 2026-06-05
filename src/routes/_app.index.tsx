import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { QrCode, X } from "lucide-react";
import { initials } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/")({
  head: () => ({ meta: [{ title: "Aujourd'hui · Le Lac des Petits" }] }),
  component: TodayPage,
});

type Presence = {
  id: string;
  name: string;
  arrival?: string;
  by?: string;
  status: "present" | "overdue" | "absent";
  overdueMin?: number;
  allergyBadge?: string;
};

const presents: Presence[] = [
  { id: "emma-dupont", name: "Emma Dupont", arrival: "07:45", by: "Marie Dupont", status: "present", allergyBadge: "Sans lactose" },
  { id: "lucas-martin", name: "Lucas Martin", arrival: "08:10", by: "Pierre Martin", status: "present" },
  { id: "sophie-bernard", name: "Sophie Bernard", arrival: "07:30", by: "Claire Bernard", status: "present", allergyBadge: "Allergie : arachides" },
  { id: "tom-blanc", name: "Tom Blanc", arrival: "08:55", by: "Famille Blanc", status: "overdue", overdueMin: 45 },
];

const absents: Presence[] = [
  { id: "antoine-lefevre", name: "Antoine Lefèvre", status: "absent" },
];

function SummaryCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="card-warm p-5">
      <div className="section-label mb-3">{label}</div>
      <div className="font-display text-[40px] leading-none num" style={{ color: color ?? "var(--sage)" }}>
        {value}
      </div>
      {sub && <div className="text-sm mt-2" style={{ color: "var(--ink-muted)" }}>{sub}</div>}
    </div>
  );
}

function ChildRow({ p }: { p: Presence }) {
  const isAbsent = p.status === "absent";
  const isOverdue = p.status === "overdue";
  return (
    <div
      className="card-warm p-5 flex items-center gap-4"
      style={{
        opacity: isAbsent ? 0.6 : 1,
        borderLeft: isOverdue ? "3px solid var(--warn)" : undefined,
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white shrink-0"
        style={{ background: "var(--sage)" }}
      >
        {initials(p.name.split(" ")[0], p.name.split(" ")[1] ?? "")}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold" style={{ color: "var(--ink)" }}>{p.name}</span>
          {p.allergyBadge && <span className="chip chip-warn">{p.allergyBadge}</span>}
        </div>
        <div className="text-sm mt-1" style={{ color: "var(--ink-muted)" }}>
          {isAbsent ? "Aucune présence enregistrée aujourd'hui" :
            isOverdue ? `En attente · ${p.overdueMin} min de retard` :
            `Arrivé à ${p.arrival} · Déposé par ${p.by}`}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {isAbsent ? (
          <span className="chip chip-danger">Absent</span>
        ) : isOverdue ? (
          <span className="chip chip-warn">En attente de sortie</span>
        ) : (
          <span className="chip chip-ok">Présent</span>
        )}
        {!isAbsent && (
          <button className="btn-secondary" style={{ padding: "8px 14px", minHeight: 40 }}>
            Enregistrer manuellement
          </button>
        )}
      </div>
    </div>
  );
}

function ManualModal({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState<"arr" | "dep">("arr");
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(57,54,52,.28)", backdropFilter: "blur(4px)" }}
    >
      <div className="card-warm p-6 w-full max-w-[480px]" style={{ boxShadow: "var(--shadow-lg)" }}>
        <div className="flex items-start justify-between mb-4">
          <h2 className="font-display text-2xl">Enregistrer une présence</h2>
          <button onClick={onClose} className="p-2 rounded-md" style={{ color: "var(--ink-muted)" }}>
            <X size={18} />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="section-label block mb-2">Enfant</label>
            <div className="input-warm flex items-center" style={{ background: "var(--canvas-2)" }}>Emma Dupont</div>
          </div>
          <div>
            <label className="section-label block mb-2">Type</label>
            <div className="inline-flex p-1 rounded-full" style={{ background: "var(--canvas-2)" }}>
              {(["arr", "dep"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className="px-5 py-2 rounded-full text-sm font-semibold transition-colors"
                  style={{
                    background: type === t ? "var(--sage)" : "transparent",
                    color: type === t ? "#fff" : "var(--ink-muted)",
                  }}
                >
                  {t === "arr" ? "Arrivée" : "Départ"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="section-label block mb-2">Heure</label>
            <input type="time" defaultValue="07:30" className="input-warm" />
          </div>
          <div>
            <label className="section-label block mb-2">Motif (obligatoire)</label>
            <textarea
              className="input-warm"
              rows={3}
              placeholder="Ex : application indisponible, oubli de scan…"
            />
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <button onClick={onClose} className="btn-secondary">Annuler</button>
            <button className="btn-primary">Enregistrer</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TodayPage() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="eyebrow mb-2">Vendredi 5 juin 2026</div>
        <h1 className="font-display text-[32px]" style={{ color: "var(--ink)" }}>Aujourd'hui</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard label="Présents maintenant" value="4" sub="enfants à la crèche" />
        <SummaryCard label="Attente de sortie" value="1" sub="heure dépassée" color="var(--warn)" />
        <SummaryCard label="Reçu ce mois" value="CHF 2'340.–" color="var(--ok)" />
        <SummaryCard label="Factures en attente" value="2" color="var(--warn)" />
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="section-label">Enfants présents aujourd'hui</h2>
          <button onClick={() => setModalOpen(true)} className="btn-secondary">
            Saisie manuelle
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {presents.map((p) => <ChildRow key={p.id} p={p} />)}
          {absents.map((p) => <ChildRow key={p.id} p={p} />)}
        </div>
      </section>

      <section className="card-warm p-8 flex flex-col items-center text-center">
        <QrCode size={32} strokeWidth={1.5} style={{ color: "var(--ink-faint)" }} />
        <p className="mt-3 text-sm" style={{ color: "var(--ink-muted)" }}>
          Personne n'est encore arrivé. Scannez un QR pour pointer une arrivée.
        </p>
      </section>

      {modalOpen && <ManualModal onClose={() => setModalOpen(false)} />}

      <div className="flex gap-3">
        <Link to="/children" className="btn-secondary">Voir tous les enfants</Link>
        <Link to="/invoices" className="btn-secondary">Voir les factures</Link>
      </div>
    </div>
  );
}
