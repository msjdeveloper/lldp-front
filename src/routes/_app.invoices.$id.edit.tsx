import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { invoices, formatCHF } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/invoices/$id/edit")({
  loader: ({ params }) => {
    const inv = invoices.find((i) => i.id === params.id);
    if (!inv) throw notFound();
    return { inv };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `Modifier facture · ${loaderData?.inv.childName}` }] }),
  component: EditInvoice,
});

type Line = { id: string; date: string; description: string; duration: string; amount: number };

function EditInvoice() {
  const { inv } = Route.useLoaderData();
  const navigate = useNavigate();

  const [period, setPeriod] = useState(inv.period);
  const [due, setDue] = useState(inv.due ?? "");
  const [lines, setLines] = useState<Line[]>([
    { id: "l1", date: "lun. 4 mai", description: "Présence", duration: "8h 15min", amount: 206.25 },
    { id: "l2", date: "mar. 5 mai", description: "Présence", duration: "7h 45min", amount: 193.75 },
    { id: "l3", date: "mer. 6 mai", description: "Présence", duration: "8h 00min", amount: 200.0 },
  ]);

  const total = lines.reduce((s, l) => s + l.amount, 0);
  const update = (id: string, patch: Partial<Line>) => setLines(lines.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const remove = (id: string) => setLines(lines.filter((l) => l.id !== id));
  const add = () => setLines([...lines, { id: crypto.randomUUID(), date: "", description: "Présence", duration: "", amount: 0 }]);

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="text-sm" style={{ color: "var(--ink-muted)" }}>
        <Link to="/invoices" className="hover:underline">Factures</Link>
        <span className="mx-2">›</span>
        <Link to="/invoices/$id" params={{ id: inv.id }} className="hover:underline">
          {inv.childName} · {inv.period}
        </Link>
        <span className="mx-2">›</span>
        <span>Modifier</span>
      </div>

      <h1 className="font-display text-[28px]">Modifier la facture</h1>
      <div className="text-sm" style={{ color: "var(--ink-muted)" }}>
        {inv.childName} · {inv.id} · Statut actuel : <span className="font-medium">{inv.status}</span>
      </div>

      <section className="card-warm p-6 flex flex-col gap-5">
        <div className="section-label">Informations</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Enfant"><div className="input-warm" style={{ background: "var(--canvas-2)" }}>{inv.childName}</div></Field>
          <Field label="Période"><input className="input-warm" value={period} onChange={(e) => setPeriod(e.target.value)} /></Field>
          <Field label="Échéance"><input className="input-warm" value={due} onChange={(e) => setDue(e.target.value)} placeholder="jj.mm.aaaa" /></Field>
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
                  <td className="py-2 px-2"><input className="input-warm" value={l.date} onChange={(e) => update(l.id, { date: e.target.value })} /></td>
                  <td className="py-2 px-2"><input className="input-warm" value={l.description} onChange={(e) => update(l.id, { description: e.target.value })} /></td>
                  <td className="py-2 px-2"><input className="input-warm" value={l.duration} onChange={(e) => update(l.id, { duration: e.target.value })} /></td>
                  <td className="py-2 px-2"><input type="number" className="input-warm num" value={l.amount} onChange={(e) => update(l.id, { amount: Number(e.target.value) })} /></td>
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

      <div className="flex justify-end gap-3 sticky bottom-4 card-warm p-4">
        <Link to="/invoices/$id" params={{ id: inv.id }} className="btn-secondary">Annuler</Link>
        <button onClick={() => navigate({ to: "/invoices/$id", params: { id: inv.id } })} className="btn-primary">
          Enregistrer les modifications
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
