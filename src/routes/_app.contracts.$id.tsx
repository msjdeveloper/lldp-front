import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, ArrowLeft, AlertTriangle, X } from "lucide-react";
import { contracts } from "./_app.contracts";
import { formatCHF, children, initials } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/contracts/$id")({
  loader: ({ params }) => {
    const contract = contracts.find((c) => c.id === params.id);
    if (!contract) throw notFound();
    return { contract };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `Contrat · ${loaderData?.contract.childName}` }] }),
  component: ContractDetail,
});

const chip = (s: string) =>
  s === "Actif" ? "chip chip-ok"
  : s === "Suspendu" ? "chip chip-warn"
  : s === "Brouillon" ? "chip chip-info"
  : "chip chip-danger";

function ContractDetail() {
  const { contract } = Route.useLoaderData();
  const navigate = useNavigate();
  const child = children.find((c) => c.id === contract.childId);
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState<null | { kind: "suspend" | "terminate"; label: string }>(null);

  const [form, setForm] = useState({
    rate: contract.rate,
    rounding: contract.rounding,
    grace: "10 min",
    min: "",
    max: "",
    mealsIncluded: false,
    mealFee: 5,
    start: contract.start,
    end: contract.end ?? "",
    currency: "CHF",
    notes: "",
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="text-sm" style={{ color: "var(--ink-muted)" }}>
        <Link to="/contracts" className="hover:underline">Contrats</Link>
        <span className="mx-2">›</span>
        <span>{contract.childName}</span>
      </div>

      <section className="card-warm p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-full flex items-center justify-center font-semibold text-white shrink-0" style={{ background: "var(--sage)" }}>
            {child ? initials(child.firstName, child.lastName) : "?"}
          </div>
          <div className="min-w-0">
            <div className="eyebrow mb-1">Contrat {contract.id}</div>
            <h1 className="font-display text-[26px]">{contract.childName}</h1>
            {child && (
              <div className="text-sm mt-1" style={{ color: "var(--ink-muted)" }}>
                {child.ageLabel} · Responsable {child.guardian}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={chip(contract.status)}>{contract.status}</span>
          <button onClick={() => setEditing(!editing)} className="btn-secondary">
            <Pencil size={14} /> {editing ? "Annuler" : "Modifier"}
          </button>
        </div>
      </section>

      <section className="card-warm p-6 flex flex-col gap-5">
        <div className="section-label">Conditions financières</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Tarif horaire" editing={editing}
            display={`${formatCHF(form.rate)}/h`}>
            <div className="flex items-center gap-2">
              <input type="number" className="input-warm" value={form.rate}
                onChange={(e) => setForm({ ...form, rate: Number(e.target.value) })} />
              <span className="text-sm" style={{ color: "var(--ink-muted)" }}>CHF/h</span>
            </div>
          </Field>
          <Field label="Arrondi" editing={editing} display={form.rounding}>
            <select className="input-warm" value={form.rounding}
              onChange={(e) => setForm({ ...form, rounding: e.target.value })}>
              <option>5 min</option><option>15 min</option><option>30 min</option><option>60 min</option>
            </select>
          </Field>
          <Field label="Délai de grâce" editing={editing} display={form.grace}>
            <select className="input-warm" value={form.grace}
              onChange={(e) => setForm({ ...form, grace: e.target.value })}>
              <option>0 min</option><option>5 min</option><option>10 min</option><option>15 min</option>
            </select>
          </Field>
          <Field label="Devise" editing={editing} display={form.currency}>
            <select className="input-warm" value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}>
              <option>CHF</option><option>EUR</option>
            </select>
          </Field>
          <Field label="Minimum journalier" editing={editing} display={form.min || "—"}>
            <input className="input-warm" placeholder="ex : 4h" value={form.min}
              onChange={(e) => setForm({ ...form, min: e.target.value })} />
          </Field>
          <Field label="Maximum journalier" editing={editing} display={form.max || "—"}>
            <input className="input-warm" placeholder="ex : 10h" value={form.max}
              onChange={(e) => setForm({ ...form, max: e.target.value })} />
          </Field>
          <Field label="Repas inclus" editing={editing}
            display={form.mealsIncluded ? "Oui" : `Non · ${formatCHF(form.mealFee)} par repas`}>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.mealsIncluded}
                  onChange={(e) => setForm({ ...form, mealsIncluded: e.target.checked })} /> Inclus
              </label>
              {!form.mealsIncluded && (
                <input type="number" className="input-warm" value={form.mealFee}
                  onChange={(e) => setForm({ ...form, mealFee: Number(e.target.value) })}
                  style={{ width: 120 }} />
              )}
            </div>
          </Field>
          <Field label="Date de début" editing={editing} display={form.start}>
            <input className="input-warm" value={form.start}
              onChange={(e) => setForm({ ...form, start: e.target.value })} />
          </Field>
          <Field label="Date de fin" editing={editing} display={form.end || "—"}>
            <input className="input-warm" value={form.end}
              onChange={(e) => setForm({ ...form, end: e.target.value })} />
          </Field>
        </div>

        <Field label="Notes" editing={editing} display={form.notes || "—"} full>
          <textarea className="input-warm" rows={3} value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Précisions sur le contrat, horaires habituels…" />
        </Field>

        {editing && (
          <div className="flex justify-end gap-3 pt-3 border-t" style={{ borderColor: "var(--hairline-2)" }}>
            <button onClick={() => setEditing(false)} className="btn-secondary">Annuler</button>
            <button onClick={() => setEditing(false)} className="btn-primary">Enregistrer les modifications</button>
          </div>
        )}
      </section>

      <section className="card-warm p-6 flex flex-col gap-3">
        <div className="section-label">Actions sur le contrat</div>
        <div className="flex flex-wrap gap-3">
          {contract.status === "Actif" && (
            <>
              <button onClick={() => setConfirm({ kind: "suspend", label: "suspendre" })}
                className="btn-secondary" style={{ color: "var(--warn)", borderColor: "var(--warn)" }}>
                Suspendre le contrat
              </button>
              <button onClick={() => setConfirm({ kind: "terminate", label: "résilier" })}
                className="btn-danger">
                Résilier le contrat
              </button>
            </>
          )}
          {contract.status === "Suspendu" && (
            <button className="btn-primary">Réactiver le contrat</button>
          )}
          {(contract.status === "Résilié" || contract.status === "Brouillon") && (
            <Link to="/contracts/new" className="btn-secondary">
              <ArrowLeft size={14} /> Créer un nouveau contrat
            </Link>
          )}
        </div>
      </section>

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(57,54,52,.28)", backdropFilter: "blur(4px)" }}>
          <div className="card-warm p-6 w-full max-w-[440px]" style={{ boxShadow: "var(--shadow-lg)" }}>
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle size={22} style={{ color: "var(--warn)" }} />
              <div className="flex-1">
                <h2 className="font-display text-xl">Confirmer l'action</h2>
                <p className="text-sm mt-2" style={{ color: "var(--ink-soft)" }}>
                  Voulez-vous vraiment {confirm.label} le contrat de {contract.childName} ?
                  Cette action peut être réversible plus tard.
                </p>
              </div>
              <button onClick={() => setConfirm(null)} className="p-2" style={{ color: "var(--ink-muted)" }}>
                <X size={16} />
              </button>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirm(null)} className="btn-secondary">Annuler</button>
              <button onClick={() => { setConfirm(null); navigate({ to: "/contracts" }); }}
                className="btn-danger">Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label, editing, display, children, full,
}: { label: string; editing: boolean; display: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={`flex flex-col gap-2 ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-xs uppercase tracking-wider" style={{ color: "var(--ink-muted)" }}>{label}</span>
      {editing ? children : <span className="font-medium" style={{ color: "var(--ink)" }}>{display}</span>}
    </div>
  );
}
