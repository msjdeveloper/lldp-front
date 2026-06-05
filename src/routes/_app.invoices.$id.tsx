import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Download, X } from "lucide-react";
import { invoices, formatCHF, type InvoiceStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/invoices/$id")({
  loader: ({ params }) => {
    const inv = invoices.find((i) => i.id === params.id);
    if (!inv) throw notFound();
    return { inv };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `Facture · ${loaderData?.inv.childName}` }] }),
  component: InvoiceDetail,
});

const lines = [
  { d: "lun. 4 mai", desc: "Présence", dur: "8h 15min", m: 206.25 },
  { d: "mar. 5 mai", desc: "Présence", dur: "7h 45min", m: 193.75 },
  { d: "mer. 6 mai", desc: "Présence", dur: "8h 00min", m: 200.0 },
  { d: "jeu. 7 mai", desc: "Présence", dur: "7h 30min", m: 187.5 },
  { d: "ven. 8 mai", desc: "Présence", dur: "8h 30min", m: 212.5 },
];

const statusChip = (s: InvoiceStatus) => {
  if (s === "Payée") return "chip chip-ok";
  if (s === "Envoyée" || s === "Brouillon") return "chip chip-warn";
  if (s === "En retard") return "chip chip-danger";
  return "chip chip-muted";
};

function InvoiceDetail() {
  const { inv } = Route.useLoaderData();
  const [showPay, setShowPay] = useState(inv.status === "Envoyée");
  const total = lines.reduce((a, b) => a + b.m, 0) + (inv.amount - lines.reduce((a, b) => a + b.m, 0));

  return (
    <div className="flex flex-col gap-6">
      <div className="text-sm" style={{ color: "var(--ink-muted)" }}>
        <Link to="/invoices" className="hover:underline">Factures</Link>
        <span className="mx-2">›</span>
        <span>{inv.childName} · {inv.period}</span>
      </div>

      <section className="card-warm p-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px]">{inv.childName}</h1>
          <div className="text-sm mt-1" style={{ color: "var(--ink-muted)" }}>{inv.period}</div>
          <div className="mt-3"><span className={statusChip(inv.status)}>{inv.status}</span></div>
          <div className="text-xs mt-4" style={{ color: "var(--ink-muted)" }}>
            Contrat du 01.01.2026 · Généré le 01.06.2026
          </div>
        </div>
        <div className="text-right">
          <div className="section-label mb-2">Total</div>
          <div className="font-display num" style={{ fontSize: 36, color: "var(--sage)" }}>
            {formatCHF(inv.amount)}
          </div>
        </div>
      </section>

      <section className="card-warm p-6 flex flex-col gap-4">
        <div className="section-label">Détail des prestations</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: "var(--ink-muted)" }} className="text-left">
                {["Date","Description","Durée","Montant"].map((h) => (
                  <th key={h} className="py-3 px-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lines.map((r, i) => (
                <tr
                  key={i}
                  className="border-t"
                  style={{ borderColor: "var(--hairline-2)", background: i % 2 ? "var(--canvas)" : "var(--surface)" }}
                >
                  <td className="py-4 px-4">{r.d}</td>
                  <td className="py-4 px-4">{r.desc}</td>
                  <td className="py-4 px-4 num">{r.dur}</td>
                  <td className="py-4 px-4 num text-right">{formatCHF(r.m)}</td>
                </tr>
              ))}
              <tr className="border-t-2" style={{ borderColor: "var(--ink-muted)" }}>
                <td colSpan={2} className="py-5 px-4 font-display font-semibold text-lg">Total</td>
                <td className="py-5 px-4 font-display font-semibold num">47h 45min</td>
                <td className="py-5 px-4 font-display font-semibold num text-right text-lg">{formatCHF(total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="card-warm p-4 flex justify-end gap-3">
        {inv.status === "Brouillon" && (
          <>
            <button className="btn-secondary" style={{ color: "var(--danger)" }}>Annuler la facture</button>
            <button className="btn-primary">Envoyer à {inv.childName.split(" ")[0]} Dupont</button>
          </>
        )}
        {inv.status === "Envoyée" && (
          <>
            <button className="btn-secondary">Annuler</button>
            <button className="btn-primary" onClick={() => setShowPay(true)}>Marquer comme payée</button>
          </>
        )}
        {inv.status === "Payée" && (
          <button className="btn-secondary"><Download size={14} /> Télécharger le PDF</button>
        )}
      </div>

      {showPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(57,54,52,.28)", backdropFilter: "blur(4px)" }}>
          <div className="card-warm p-6 w-full max-w-[420px]" style={{ boxShadow: "var(--shadow-lg)" }}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-display text-2xl">Enregistrer un paiement</h2>
              <button onClick={() => setShowPay(false)} className="p-2" style={{ color: "var(--ink-muted)" }}><X size={18} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="section-label block mb-2">Date de paiement</label>
                <input type="date" defaultValue="2026-06-05" className="input-warm" />
              </div>
              <div>
                <label className="section-label block mb-2">Mode de paiement</label>
                <select className="input-warm">
                  <option>Virement bancaire</option>
                  <option>Espèces</option>
                  <option>Carte</option>
                  <option>Pix</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <button onClick={() => setShowPay(false)} className="btn-secondary">Annuler</button>
                <button className="btn-primary">Confirmer le paiement</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
