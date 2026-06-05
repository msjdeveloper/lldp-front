import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { children } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/contracts/new")({
  head: () => ({ meta: [{ title: "Nouveau contrat" }] }),
  component: NewContract,
});

function NewContract() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    childId: "",
    rate: 25,
    rounding: "15 min",
    grace: "10 min",
    min: "",
    max: "",
    mealsIncluded: false,
    mealFee: 5,
    start: "",
    end: "",
    currency: "CHF",
    notes: "",
  });

  const valid = form.childId && form.start && form.rate > 0;

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="text-sm" style={{ color: "var(--ink-muted)" }}>
        <Link to="/contracts" className="hover:underline">Contrats</Link>
        <span className="mx-2">›</span>
        <span>Nouveau contrat</span>
      </div>
      <h1 className="font-display text-[32px]">Nouveau contrat</h1>

      <section className="card-warm p-6 flex flex-col gap-5">
        <div className="section-label">Enfant concerné</div>
        <Field label="Enfant">
          <select className="input-warm" value={form.childId}
            onChange={(e) => setForm({ ...form, childId: e.target.value })}>
            <option value="">Sélectionner un enfant…</option>
            {children.map((c) => (
              <option key={c.id} value={c.id}>{c.firstName} {c.lastName} · {c.ageLabel}</option>
            ))}
          </select>
        </Field>
      </section>

      <section className="card-warm p-6 flex flex-col gap-5">
        <div className="section-label">Conditions financières</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Tarif horaire (CHF)">
            <input type="number" className="input-warm" value={form.rate}
              onChange={(e) => setForm({ ...form, rate: Number(e.target.value) })} />
          </Field>
          <Field label="Devise">
            <select className="input-warm" value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}>
              <option>CHF</option><option>EUR</option>
            </select>
          </Field>
          <Field label="Arrondi">
            <select className="input-warm" value={form.rounding}
              onChange={(e) => setForm({ ...form, rounding: e.target.value })}>
              <option>5 min</option><option>15 min</option><option>30 min</option><option>60 min</option>
            </select>
          </Field>
          <Field label="Délai de grâce">
            <select className="input-warm" value={form.grace}
              onChange={(e) => setForm({ ...form, grace: e.target.value })}>
              <option>0 min</option><option>5 min</option><option>10 min</option><option>15 min</option>
            </select>
          </Field>
          <Field label="Minimum journalier (optionnel)">
            <input className="input-warm" placeholder="ex : 4h" value={form.min}
              onChange={(e) => setForm({ ...form, min: e.target.value })} />
          </Field>
          <Field label="Maximum journalier (optionnel)">
            <input className="input-warm" placeholder="ex : 10h" value={form.max}
              onChange={(e) => setForm({ ...form, max: e.target.value })} />
          </Field>
        </div>
        <Field label="Repas">
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.mealsIncluded}
                onChange={(e) => setForm({ ...form, mealsIncluded: e.target.checked })} />
              Inclure les repas dans le tarif
            </label>
            {!form.mealsIncluded && (
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: "var(--ink-muted)" }}>Sinon, prix par repas :</span>
                <input type="number" className="input-warm" value={form.mealFee}
                  onChange={(e) => setForm({ ...form, mealFee: Number(e.target.value) })}
                  style={{ width: 120 }} />
                <span className="text-sm">CHF</span>
              </div>
            )}
          </div>
        </Field>
      </section>

      <section className="card-warm p-6 flex flex-col gap-5">
        <div className="section-label">Période</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Date de début">
            <input type="date" className="input-warm" value={form.start}
              onChange={(e) => setForm({ ...form, start: e.target.value })} />
          </Field>
          <Field label="Date de fin (optionnel)">
            <input type="date" className="input-warm" value={form.end}
              onChange={(e) => setForm({ ...form, end: e.target.value })} />
          </Field>
        </div>
        <Field label="Notes internes (optionnel)">
          <textarea className="input-warm" rows={3} value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Horaires habituels, particularités…" />
        </Field>
      </section>

      <div className="flex justify-end gap-3 sticky bottom-4 card-warm p-4">
        <Link to="/contracts" className="btn-secondary">Annuler</Link>
        <button onClick={() => valid && navigate({ to: "/contracts" })}
          className="btn-primary"
          style={{ opacity: valid ? 1 : 0.5, pointerEvents: valid ? "auto" : "none" }}>
          Créer le contrat
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
