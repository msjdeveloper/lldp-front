import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Download, Eye } from "lucide-react";
import { invoices, formatCHF, type InvoiceStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/invoices/")({
  head: () => ({ meta: [{ title: "Factures · Le Lac des Petits" }] }),
  component: InvoicesPage,
});

const statusChip = (s: InvoiceStatus) => {
  if (s === "Payée") return "chip chip-ok";
  if (s === "Envoyée" || s === "Brouillon") return "chip chip-warn";
  if (s === "En retard") return "chip chip-danger";
  return "chip chip-muted";
};

const filters: ("Tout" | InvoiceStatus)[] = ["Tout", "Brouillon", "Envoyée", "Payée", "En retard", "Annulée"];

function InvoicesPage() {
  const [f, setF] = useState<(typeof filters)[number]>("Tout");
  const list = f === "Tout" ? invoices : invoices.filter((i) => i.status === f);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-[32px]">Factures</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Facturé ce mois" value={formatCHF(3480)} />
        <Stat label="Reçu ce mois" value={formatCHF(2340)} color="var(--ok)" />
        <Stat label="En attente" value={formatCHF(890)} color="var(--warn)" />
        <Stat label="En retard" value={formatCHF(250)} color="var(--danger)" bold />
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

      <div className="card-warm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: "var(--ink-muted)" }} className="text-left">
              {["Enfant","Période","Montant","Statut","Échéance","Actions"].map((h) => (
                <th key={h} className="py-4 px-5 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((inv) => (
              <tr
                key={inv.id}
                className="border-t"
                style={{
                  borderColor: "var(--hairline-2)",
                  background: inv.status === "En retard" ? "var(--danger-bg)" : undefined,
                }}
              >
                <td className="py-4 px-5 font-medium">{inv.childName}</td>
                <td className="py-4 px-5">{inv.period}</td>
                <td className="py-4 px-5 num font-semibold">{formatCHF(inv.amount)}</td>
                <td className="py-4 px-5"><span className={statusChip(inv.status)}>{inv.status}</span></td>
                <td className="py-4 px-5 num" style={{ color: "var(--ink-muted)" }}>{inv.due ?? "—"}</td>
                <td className="py-4 px-5">
                  <div className="flex items-center gap-2 justify-end">
                    {inv.status === "Brouillon" && <button className="btn-primary" style={{ padding: "6px 12px", minHeight: 36 }}>Envoyer</button>}
                    {inv.status === "Envoyée" && <button className="btn-primary" style={{ padding: "6px 12px", minHeight: 36 }}>Marquer payée</button>}
                    {inv.status === "En retard" && <button className="btn-danger" style={{ padding: "6px 12px", minHeight: 36 }}>Marquer payée</button>}
                    <Link to="/invoices/$id" params={{ id: inv.id }} className="p-2 rounded-md" style={{ color: "var(--ink-muted)" }}>
                      <Eye size={16} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button className="btn-secondary"><Download size={14} /> Exporter CSV</button>
      </div>
    </div>
  );
}

function Stat({ label, value, color, bold }: { label: string; value: string; color?: string; bold?: boolean }) {
  return (
    <div className="card-warm p-5">
      <div className="section-label mb-3">{label}</div>
      <div
        className={`font-display num ${bold ? "font-semibold" : ""}`}
        style={{ fontSize: 28, color: color ?? "var(--ink)" }}
      >
        {value}
      </div>
    </div>
  );
}
