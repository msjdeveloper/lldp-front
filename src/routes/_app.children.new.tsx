import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, X, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/children/new")({
  head: () => ({ meta: [{ title: "Nouvel enfant" }] }),
  component: NewChild,
});

function NewChild() {
  const [tags, setTags] = useState<string[]>(["Sans lactose"]);
  const [tagInput, setTagInput] = useState("");
  const [mealType, setMealType] = useState<"groupe" | "individuel">("groupe");

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="text-sm" style={{ color: "var(--ink-muted)" }}>
        <Link to="/children" className="hover:underline">Enfants</Link>
        <span className="mx-2">›</span>
        <span>Nouvel enfant</span>
      </div>
      <h1 className="font-display text-[32px]">Nouvel enfant</h1>

      <section className="card-warm p-6 flex flex-col gap-5">
        <div className="section-label">Informations personnelles</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Prénom"><input className="input-warm" placeholder="Emma" /></Field>
          <Field label="Nom"><input className="input-warm" placeholder="Dupont" /></Field>
        </div>
        <Field label="Date de naissance"><input type="date" className="input-warm" /></Field>
        <Field label="Photo (optionnel)">
          <div
            className="flex items-center justify-center gap-3 rounded-[12px] py-8 border-dashed border-2"
            style={{ borderColor: "var(--hairline)", color: "var(--ink-muted)" }}
          >
            <Upload size={20} />
            <span className="text-sm">Ajouter une photo (optionnel)</span>
          </div>
        </Field>
      </section>

      <section className="card-warm p-6 flex flex-col gap-5">
        <div className="section-label">Responsable</div>
        <Field label="E-mail du responsable" hint="Un compte sera créé automatiquement pour ce responsable.">
          <input type="email" className="input-warm" placeholder="marie.dupont@email.com" />
        </Field>
      </section>

      <section className="card-warm p-6 flex flex-col gap-5">
        <div className="section-label">Profil alimentaire</div>
        <Field label="Type de repas">
          <div className="inline-flex p-1 rounded-full" style={{ background: "var(--canvas-2)" }}>
            {(["groupe", "individuel"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setMealType(t)}
                className="px-5 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: mealType === t ? "var(--sage)" : "transparent",
                  color: mealType === t ? "#fff" : "var(--ink-muted)",
                }}
              >
                {t === "groupe" ? "Repas de groupe" : "Repas individuel"}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Allergies et restrictions">
          <div className="input-warm flex items-center flex-wrap gap-2" style={{ minHeight: 48 }}>
            {tags.map((t) => (
              <span key={t} className="chip chip-warn">
                {t}
                <button onClick={() => setTags(tags.filter((x) => x !== t))} className="ml-1">
                  <X size={12} />
                </button>
              </span>
            ))}
            <input
              className="flex-1 outline-none bg-transparent min-w-[120px]"
              placeholder="Tapez puis Entrée…"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && tagInput.trim()) {
                  e.preventDefault();
                  setTags([...tags, tagInput.trim()]);
                  setTagInput("");
                }
              }}
            />
          </div>
        </Field>
        <Field label="Notes alimentaires (optionnel)">
          <textarea className="input-warm" rows={3} placeholder="Éviter tout produit laitier…" />
        </Field>
      </section>

      <div className="flex justify-end gap-3 sticky bottom-4 card-warm p-4">
        <Link to="/children" className="btn-secondary">Annuler</Link>
        <button className="btn-primary"><Plus size={16} /> Enregistrer l'enfant</button>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium" style={{ color: "var(--ink)" }}>{label}</label>
      {children}
      {hint && <span className="text-xs" style={{ color: "var(--ink-muted)" }}>{hint}</span>}
    </div>
  );
}
