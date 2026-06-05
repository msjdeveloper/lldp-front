import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Calendar, X } from "lucide-react";

export const Route = createFileRoute("/_app/leads")({
  head: () => ({ meta: [{ title: "Prospects · Le Lac des Petits" }] }),
  component: LeadsPage,
});

type Lead = {
  name: string;
  phone?: string;
  child?: string;
  meta?: string;
  visit?: string;
  reason?: string;
};

type ColKey = "NOUVEAU" | "VISITE PRÉVUE" | "VISITE EFFECTUÉE" | "NÉGOCIATION" | "INSCRIT" | "PERDU";

const cols: { key: ColKey; color: string; leads: Lead[] }[] = [
  { key: "NOUVEAU", color: "var(--sage)", leads: [
    { name: "Famille Chen", phone: "+41 79 100 20 30", child: "Luna, 18 mois", meta: "Reçu lun. 2 juin" },
    { name: "Sophie Garnier", phone: "+41 79 200 30 40", child: "Mathieu, 2 ans", meta: "Reçu mar. 3 juin" },
  ]},
  { key: "VISITE PRÉVUE", color: "var(--info)", leads: [
    { name: "Famille Moreau", phone: "+41 79 300 40 50", child: "Inès, 14 mois", visit: "jeu. 11 juin à 14:30" },
  ]},
  { key: "VISITE EFFECTUÉE", color: "var(--ink)", leads: [
    { name: "Famille Petit", phone: "+41 79 400 50 60", child: "Hugo, 2 ans", meta: "Visite lun. 1 juin" },
  ]},
  { key: "NÉGOCIATION", color: "var(--warn)", leads: [
    { name: "Famille André", phone: "+41 79 500 60 70", child: "Zoé, 3 ans", meta: "Devis envoyé mer. 3 juin" },
  ]},
  { key: "INSCRIT", color: "var(--ok)", leads: [
    { name: "Famille Blanc", phone: "+41 79 600 70 80", child: "Tom, 2 ans", meta: "Inscrit lun. 26 mai" },
  ]},
  { key: "PERDU", color: "var(--danger)", leads: [
    { name: "Famille Simon", phone: "+41 79 700 80 90", child: "Eliott, 1 an", reason: "Places insuffisantes" },
  ]},
];

function LeadsPage() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [modal, setModal] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-[32px]">Prospects</h1>
        <div className="flex items-center gap-3">
          <div className="inline-flex p-1 rounded-full" style={{ background: "var(--canvas-2)" }}>
            {(["kanban", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: view === v ? "var(--sage)" : "transparent",
                  color: view === v ? "#fff" : "var(--ink-muted)",
                }}
              >
                {v === "kanban" ? "Kanban" : "Liste"}
              </button>
            ))}
          </div>
          <button onClick={() => setModal(true)} className="btn-primary"><Plus size={16} /> Nouveau prospect</button>
        </div>
      </div>

      {view === "kanban" ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4" style={{ minWidth: "max-content" }}>
            {cols.map((col) => (
              <div key={col.key} className="flex flex-col gap-3" style={{ width: 260 }}>
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-semibold tracking-wider" style={{ color: col.color }}>{col.key}</span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "var(--canvas-2)", color: col.color, minWidth: 24, textAlign: "center" }}
                  >
                    {col.leads.length}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {col.leads.map((l) => (
                    <div
                      key={l.name}
                      className="card-warm p-4 cursor-grab hover:shadow-[var(--shadow-lg)] transition-shadow"
                      style={{ opacity: col.key === "PERDU" ? 0.7 : 1 }}
                    >
                      <div className="font-semibold text-sm">{l.name}</div>
                      <div className="text-xs mt-1" style={{ color: "var(--ink-muted)" }}>{l.phone}</div>
                      {l.child && <div className="text-xs mt-2" style={{ color: "var(--ink-soft)" }}>{l.child}</div>}
                      {l.visit && (
                        <div className="flex items-center gap-1.5 text-xs mt-3" style={{ color: "var(--info)" }}>
                          <Calendar size={12} /> Visite : {l.visit}
                        </div>
                      )}
                      {l.meta && <div className="text-xs mt-2" style={{ color: "var(--ink-faint)" }}>{l.meta}</div>}
                      {l.reason && <div className="text-xs mt-2 italic" style={{ color: "var(--danger)" }}>{l.reason}</div>}
                      {col.key === "INSCRIT" && <div className="mt-3"><span className="chip chip-ok">Inscrit</span></div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card-warm p-6 text-sm" style={{ color: "var(--ink-muted)" }}>
          Vue liste à venir.
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(57,54,52,.28)", backdropFilter: "blur(4px)" }}>
          <div className="card-warm p-6 w-full max-w-[480px]" style={{ boxShadow: "var(--shadow-lg)" }}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-display text-2xl">Nouveau prospect</h2>
              <button onClick={() => setModal(false)} className="p-2" style={{ color: "var(--ink-muted)" }}><X size={18} /></button>
            </div>
            <div className="flex flex-col gap-3">
              <input className="input-warm" placeholder="Nom du responsable" />
              <input className="input-warm" placeholder="Téléphone" />
              <input className="input-warm" placeholder="E-mail (optionnel)" />
              <input className="input-warm" placeholder="Prénom de l'enfant (optionnel)" />
              <input className="input-warm" placeholder="Âge approximatif (optionnel)" />
              <textarea className="input-warm" rows={3} placeholder="Observations (optionnel)" />
              <div className="flex justify-end gap-3 mt-2">
                <button onClick={() => setModal(false)} className="btn-secondary">Annuler</button>
                <button className="btn-primary">Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
