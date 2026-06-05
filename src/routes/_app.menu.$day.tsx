import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Coffee, Utensils, Apple, Trash2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_app/menu/$day")({
  head: ({ params }) => ({ meta: [{ title: `Menu · ${params.day}` }] }),
  component: EditMenuDay,
});

const labels: Record<string, string> = {
  lundi: "Lundi 2 juin",
  mardi: "Mardi 3 juin",
  mercredi: "Mercredi 4 juin",
  jeudi: "Jeudi 5 juin",
  vendredi: "Vendredi 6 juin",
};

const defaults: Record<string, { breakfast: string; lunch: string; snack: string; notes: string }> = {
  lundi: { breakfast: "Pain complet, confiture, lait", lunch: "Gratin de courgettes, riz, salade", snack: "Compote pomme-poire, biscuits maison", notes: "Variante sans lactose pour Emma" },
  mardi: { breakfast: "", lunch: "Poulet rôti, purée, haricots verts", snack: "", notes: "" },
  mercredi: { breakfast: "", lunch: "", snack: "", notes: "" },
  jeudi: { breakfast: "Yaourt, fruits frais", lunch: "Pâtes à la bolognaise, salade", snack: "Banane et amandes", notes: "" },
  vendredi: { breakfast: "Porridge avoine, miel", lunch: "Poisson en papillote, légumes", snack: "Pain et chocolat", notes: "" },
};

function EditMenuDay() {
  const { day } = Route.useParams();
  const navigate = useNavigate();
  const dayKey = day.toLowerCase();
  const init = defaults[dayKey] ?? { breakfast: "", lunch: "", snack: "", notes: "" };
  const label = labels[dayKey] ?? day;

  const [form, setForm] = useState(init);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const empty = !form.breakfast && !form.lunch && !form.snack;

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="text-sm" style={{ color: "var(--ink-muted)" }}>
        <Link to="/menu" className="hover:underline">Menu</Link>
        <span className="mx-2">›</span>
        <span>{label}</span>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="eyebrow mb-1">Menu du jour</div>
          <h1 className="font-display text-[32px]">{label}</h1>
        </div>
        {!empty && (
          <button onClick={() => setConfirmDelete(true)} className="btn-secondary" style={{ color: "var(--danger)" }}>
            <Trash2 size={14} /> Effacer ce menu
          </button>
        )}
      </div>

      <section className="card-warm p-6 flex flex-col gap-5">
        <MealField icon={Coffee} label="Petit-déjeuner" value={form.breakfast}
          onChange={(v) => setForm({ ...form, breakfast: v })}
          placeholder="Ex : Pain complet, confiture, lait" />
        <MealField icon={Utensils} label="Déjeuner" value={form.lunch}
          onChange={(v) => setForm({ ...form, lunch: v })}
          placeholder="Ex : Gratin de courgettes, riz, salade" />
        <MealField icon={Apple} label="Goûter" value={form.snack}
          onChange={(v) => setForm({ ...form, snack: v })}
          placeholder="Ex : Compote pomme-poire, biscuits maison" />
      </section>

      <section className="card-warm p-6 flex flex-col gap-3">
        <label className="section-label">Notes du jour</label>
        <textarea className="input-warm" rows={3} value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Variantes alimentaires, allergies, occasions spéciales…" />
      </section>

      <div className="flex justify-end gap-3 sticky bottom-4 card-warm p-4">
        <Link to="/menu" className="btn-secondary">Annuler</Link>
        <button onClick={() => navigate({ to: "/menu" })} className="btn-secondary">
          Enregistrer comme brouillon
        </button>
        <button onClick={() => navigate({ to: "/menu" })} className="btn-primary">
          Publier le menu
        </button>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(57,54,52,.28)", backdropFilter: "blur(4px)" }}>
          <div className="card-warm p-6 w-full max-w-[440px]" style={{ boxShadow: "var(--shadow-lg)" }}>
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle size={22} style={{ color: "var(--warn)" }} />
              <div className="flex-1">
                <h2 className="font-display text-xl">Effacer le menu ?</h2>
                <p className="text-sm mt-2" style={{ color: "var(--ink-soft)" }}>
                  Le menu de {label.toLowerCase()} sera retiré de l'affichage public.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDelete(false)} className="btn-secondary">Annuler</button>
              <button onClick={() => {
                setForm({ breakfast: "", lunch: "", snack: "", notes: "" });
                setConfirmDelete(false);
              }} className="btn-danger">Effacer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MealField({
  icon: Icon, label, value, onChange, placeholder,
}: { icon: typeof Coffee; label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 text-sm font-medium">
        <Icon size={16} strokeWidth={1.5} style={{ color: "var(--sage)" }} /> {label}
      </label>
      <input className="input-warm" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
