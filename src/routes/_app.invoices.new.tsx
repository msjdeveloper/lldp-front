import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { children, formatCHF } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/invoices/new")({
  head: () => ({ meta: [{ title: "Nouvelle facture" }] }),
  component: NewInvoice,
});

type Line = { id: string; date: string; description: string; duration: string; amount: number };

const initial: Line[] = [
  { id: "l1", date: "lun. 4 mai", description: "Présence", duration: "8h 15min", amount: 206.25 },
  { id: "l2", date: "mar. 5 mai", description: "Présence", duration: "7h 45min", amount: 193.75 },
];

function NewInvoice() {
  const navigate = useNavigate();
  const [childId, setChildId] = useState("");
  const [period, setPeriod] = useState("Mai 2026");
  const [due, setDue] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<Line[]>(initial);

  const total = lines.reduce((s, l) => s + l.amount, 0);

  const update = (id: string, patch: Partial<Line>) =>
    setLines(lines.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const remove = (id: string) => setLines(lines.filter((l) => l.id !== id));
  const add = () =>
    setLines([...lines, { id: crypto.randomUUID(), date: "", description: "Présence", duration: "", amount: 0 }]);

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="text-sm" style={{ color: "var(--ink-muted)" }}>
        <Link to="/invoices" className="hover:underline">Factures</Link>
        <span className="mx-2">›</span>
        <span>Nouvelle facture</span>
      </div>
      <h1 className="font-display text-[32px]">Nouvelle facture</h1>

      <section className="card-warm p-6 flex flex-col gap-5">
        <div className="section-label">Informations</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Enfant">
            <select className="input-warm" value={childId} onChange={(e) => setChildId(e.target.value)}>
              <option value="">Sélectionner…</option>
              {children.map((c) => (
                <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
              ))}
            </select>
          </Field>
          <Field label="Période">
            <input className="input-warm" value={period} onChange={(e) => setPeriod(e.target.value)} />
          </Field>
          <Field label="Échéance (optionnel)">
            <input type="date" className="input-warm" value={due} onChange={(e) => setDue(e.target.value)} />
          </Field>
        </div>
      </section>

      <section className="card-warm p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="section-label">Détail des prestations</div>
          <button onClick={add} className="btn-secondary" style={{ padding: "8px 14px", minHeight: 38 }}>
            <Plus size={14} /> Ajouter une ligne
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: "var(--ink-muted)" }} className="text-left">
                <th className="py-3 px-2 font-medium">Date</th>
                <th className="py-3 px-2 font-medium">Description</th>
                <th className="py-3 px-2 font-medium">Durée</th>
                <th className="py-3 px-2 font-medium">Montant</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => (
                <tr key={l.id} className="border-t" style={{ borderColor: "var(--hairline-2)" }}>
                  <td className="py-2 px-2"><input className="input-warm" value={l.date}
                    onChange={(e) => update(l.id, { date: e.target.value })} placeholder="lun. 4 mai" /></td>
                  <td className="py-2 px-2"><input className="input-warm" value={l.description}
                    onChange={(e) => update(l.id, { description: e.target.value })} /></td>
                  <td className="py-2 px-2"><input className="input-warm" value={l.duration}
                    onChange={(e) => update(l.id, { duration: e.target.value })} placeholder="8h 00min" /></td>
                  <td className="py-2 px-2"><input type="number" className="input-warm num" value={l.amount}
                    onChange={(e) => update(l.id, { amount: Number(e.target.value) })} /></td>
                  <td className="py-2 px-2">
                    <button onClick={() => remove(l.id)} className="p-2 rounded-md" style={{ color: "var(--danger)" }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="border-t-2" style={{ borderColor: "var(--ink-muted)" }}>
                <td colSpan={3} className="py-4 px-2 font-display font-semibold text-lg">Total</td>
                <td className="py-4 px-2 font-display font-semibold num text-lg">{formatCHF(total)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="card-warm p-6 flex flex-col gap-3">
        <div className="section-label">Notes</div>
        <textarea className="input-warm" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Informations supplémentaires affichées sur la facture…" />
      </section>

      <div className="flex justify-end gap-3 sticky bottom-4 card-warm p-4">
        <Link to="/invoices" className="btn-secondary">Annuler</Link>
        <button onClick={() => navigate({ to: "/invoices" })} className="btn-secondary">
          Enregistrer comme brouillon
        </button>
        <button onClick={() => navigate({ to: "/invoices" })} className="btn-primary">
          Créer et envoyer
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
