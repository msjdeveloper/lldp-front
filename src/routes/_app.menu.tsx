import { createFileRoute } from "@tanstack/react-router";
import { Coffee, Utensils, Apple, ChevronLeft, ChevronRight, Pencil, Plus, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_app/menu")({
  head: () => ({ meta: [{ title: "Menu · Le Lac des Petits" }] }),
  component: MenuPage,
});

type Day = {
  label: string;
  breakfast?: string;
  lunch?: string;
  snack?: string;
  notes?: string;
};

const days: Day[] = [
  { label: "Lundi 2 juin", breakfast: "Pain complet, confiture, lait", lunch: "Gratin de courgettes, riz, salade", snack: "Compote pomme-poire, biscuits maison", notes: "Variante sans lactose pour Emma" },
  { label: "Mardi 3 juin", lunch: "Poulet rôti, purée, haricots verts" },
  { label: "Mercredi 4 juin" },
  { label: "Jeudi 5 juin", breakfast: "Yaourt, fruits frais", lunch: "Pâtes à la bolognaise, salade", snack: "Banane et amandes" },
  { label: "Vendredi 6 juin", breakfast: "Porridge avoine, miel", lunch: "Poisson en papillote, légumes", snack: "Pain et chocolat" },
];

function DayCard({ d }: { d: Day }) {
  const empty = !d.breakfast && !d.lunch && !d.snack;
  return (
    <div className="card-warm p-5 flex flex-col gap-4" style={{ minHeight: 280 }}>
      <div className="flex items-start justify-between">
        <div className="font-semibold" style={{ color: "var(--ink)" }}>{d.label}</div>
        <button className="p-1.5 rounded-md" style={{ color: "var(--ink-muted)" }}><Pencil size={14} /></button>
      </div>
      {empty ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm" style={{ color: "var(--ink-muted)" }}>Aucun menu publié</p>
          <button className="btn-secondary" style={{ padding: "8px 14px", minHeight: 38 }}><Plus size={14} /> Publier</button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 text-sm">
          <MealRow icon={Coffee} label="Petit-déjeuner" value={d.breakfast} />
          <MealRow icon={Utensils} label="Déjeuner" value={d.lunch} />
          <MealRow icon={Apple} label="Goûter" value={d.snack} />
          {d.notes && (
            <p className="italic text-xs mt-2 pt-3 border-t" style={{ color: "var(--ink-muted)", borderColor: "var(--hairline-2)" }}>
              {d.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function MealRow({ icon: Icon, label, value }: { icon: typeof Coffee; label: string; value?: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" style={{ color: "var(--sage)" }} />
      <div>
        <div className="text-xs uppercase tracking-wider" style={{ color: "var(--ink-muted)" }}>{label}</div>
        <div className="mt-0.5" style={{ color: "var(--ink-soft)" }}>{value ?? "—"}</div>
      </div>
    </div>
  );
}

function MenuPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-[32px]">Menu de la semaine</h1>
        <button className="btn-primary"><Plus size={16} /> Publier un menu</button>
      </div>

      <div className="flex items-center justify-center gap-4 card-warm p-4">
        <button className="p-2 rounded-md" style={{ color: "var(--ink-muted)" }}><ChevronLeft size={18} /></button>
        <span className="font-medium">lun. 1 juin – ven. 5 juin</span>
        <button className="p-2 rounded-md" style={{ color: "var(--ink-muted)" }}><ChevronRight size={18} /></button>
      </div>

      <div
        className="flex items-center gap-3 p-4 rounded-[12px]"
        style={{ background: "var(--warn-bg)", color: "var(--warn)" }}
      >
        <AlertTriangle size={18} strokeWidth={1.5} />
        <span className="text-sm flex-1">2 enfants ont des restrictions alimentaires ce mois-ci</span>
        <a className="text-sm font-semibold underline" href="#">Voir les profils</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {days.map((d) => <DayCard key={d.label} d={d} />)}
      </div>
    </div>
  );
}
