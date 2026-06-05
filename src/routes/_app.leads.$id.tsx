import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, AlertTriangle, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_app/leads/$id")({
  loader: ({ params }) => {
    const lead = leads.find((l) => l.id === params.id);
    if (!lead) throw notFound();
    return { lead };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.lead.name} · Prospect` }] }),
  component: LeadDetail,
});

const stages = ["Nouveau", "Visite prévue", "Visite effectuée", "Négociation", "Inscrit", "Perdu"] as const;
type Stage = (typeof stages)[number];

type Lead = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  childName?: string;
  childAge?: string;
  stage: Stage;
  visit?: string;
  observations?: string;
  createdAt: string;
};

const leads: Lead[] = [
  { id: "L-001", name: "Famille Chen", phone: "+41 79 100 20 30", email: "chen@email.com", childName: "Luna", childAge: "18 mois", stage: "Nouveau", createdAt: "lun. 2 juin", observations: "Maman intéressée par une place en septembre." },
  { id: "L-002", name: "Famille Moreau", phone: "+41 79 300 40 50", childName: "Inès", childAge: "14 mois", stage: "Visite prévue", visit: "jeu. 11 juin à 14:30", createdAt: "ven. 30 mai" },
  { id: "L-003", name: "Famille André", phone: "+41 79 500 60 70", email: "andre@email.com", childName: "Zoé", childAge: "3 ans", stage: "Négociation", createdAt: "mer. 28 mai", observations: "Devis envoyé. Attente de retour." },
];

const stageColor: Record<Stage, string> = {
  "Nouveau": "var(--sage)",
  "Visite prévue": "var(--info)",
  "Visite effectuée": "var(--ink)",
  "Négociation": "var(--warn)",
  "Inscrit": "var(--ok)",
  "Perdu": "var(--danger)",
};

function LeadDetail() {
  const { lead } = Route.useLoaderData();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [form, setForm] = useState({
    name: lead.name,
    phone: lead.phone,
    email: lead.email ?? "",
    childName: lead.childName ?? "",
    childAge: lead.childAge ?? "",
    visit: lead.visit ?? "",
    observations: lead.observations ?? "",
    stage: lead.stage,
  });

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="text-sm" style={{ color: "var(--ink-muted)" }}>
        <Link to="/leads" className="hover:underline">Prospects</Link>
        <span className="mx-2">›</span>
        <span>{lead.name}</span>
      </div>

      <section className="card-warm p-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="eyebrow mb-1">{lead.id} · Créé {lead.createdAt}</div>
          <h1 className="font-display text-[28px]">{form.name}</h1>
          <div className="text-sm mt-1" style={{ color: "var(--ink-muted)" }}>{form.phone}</div>
        </div>
        <span className="chip" style={{ background: "var(--canvas-2)", color: stageColor[form.stage] }}>
          {form.stage}
        </span>
      </section>

      <section className="card-warm p-6 flex flex-col gap-4">
        <div className="section-label">Étape du pipeline</div>
        <div className="flex flex-wrap gap-2">
          {stages.map((s) => (
            <button
              key={s}
              onClick={() => setForm({ ...form, stage: s })}
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                background: form.stage === s ? stageColor[s] : "var(--surface)",
                color: form.stage === s ? "#fff" : "var(--ink-soft)",
                border: form.stage === s ? `1px solid ${stageColor[s]}` : "1px solid var(--hairline)",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      <section className="card-warm p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="section-label">Coordonnées</div>
          <button onClick={() => setEditing(!editing)} className="btn-secondary" style={{ padding: "8px 14px", minHeight: 38 }}>
            {editing ? "Annuler" : "Modifier"}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nom du responsable" editing={editing} value={form.name}
            onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Téléphone" editing={editing} value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })} />
          <Field label="E-mail" editing={editing} value={form.email}
            onChange={(v) => setForm({ ...form, email: v })} placeholder="Optionnel" />
          <Field label="Prénom de l'enfant" editing={editing} value={form.childName}
            onChange={(v) => setForm({ ...form, childName: v })} placeholder="Optionnel" />
          <Field label="Âge approximatif" editing={editing} value={form.childAge}
            onChange={(v) => setForm({ ...form, childAge: v })} placeholder="Optionnel" />
          <Field label="Date de visite" editing={editing} value={form.visit}
            onChange={(v) => setForm({ ...form, visit: v })} placeholder="ex : jeu. 11 juin à 14:30" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wider" style={{ color: "var(--ink-muted)" }}>Observations</label>
          {editing ? (
            <textarea className="input-warm" rows={4} value={form.observations}
              onChange={(e) => setForm({ ...form, observations: e.target.value })} />
          ) : (
            <p className="text-sm" style={{ color: "var(--ink-soft)" }}>{form.observations || "—"}</p>
          )}
        </div>
        {form.visit && !editing && (
          <div className="flex items-center gap-2 p-3 rounded-[12px]" style={{ background: "var(--info-bg)", color: "var(--info)" }}>
            <Calendar size={16} /> <span className="text-sm font-medium">Visite : {form.visit}</span>
          </div>
        )}
        {editing && (
          <div className="flex justify-end gap-3 pt-2 border-t" style={{ borderColor: "var(--hairline-2)" }}>
            <button onClick={() => setEditing(false)} className="btn-secondary">Annuler</button>
            <button onClick={() => setEditing(false)} className="btn-primary">Enregistrer</button>
          </div>
        )}
      </section>

      <section className="card-warm p-6 flex flex-col gap-3">
        <div className="section-label">Actions</div>
        <div className="flex flex-wrap gap-3">
          {form.stage === "Inscrit" && (
            <Link to="/children/new" className="btn-primary">Créer la fiche enfant</Link>
          )}
          <button onClick={() => setConfirmDelete(true)} className="btn-danger">
            <Trash2 size={14} /> Supprimer ce prospect
          </button>
        </div>
      </section>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(57,54,52,.28)", backdropFilter: "blur(4px)" }}>
          <div className="card-warm p-6 w-full max-w-[440px]" style={{ boxShadow: "var(--shadow-lg)" }}>
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle size={22} style={{ color: "var(--danger)" }} />
              <div className="flex-1">
                <h2 className="font-display text-xl">Supprimer ce prospect ?</h2>
                <p className="text-sm mt-2" style={{ color: "var(--ink-soft)" }}>
                  {form.name} sera retiré du pipeline. Cette action est définitive.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDelete(false)} className="btn-secondary">Annuler</button>
              <button onClick={() => navigate({ to: "/leads" })} className="btn-danger">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label, editing, value, onChange, placeholder,
}: { label: string; editing: boolean; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs uppercase tracking-wider" style={{ color: "var(--ink-muted)" }}>{label}</label>
      {editing ? (
        <input className="input-warm" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <span className="font-medium" style={{ color: value ? "var(--ink)" : "var(--ink-faint)" }}>{value || "—"}</span>
      )}
    </div>
  );
}
