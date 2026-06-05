import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, X, Trash2, AlertTriangle } from "lucide-react";
import { children, initials } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/children/$id/edit")({
  loader: ({ params }) => {
    const child = children.find((c) => c.id === params.id);
    if (!child) throw notFound();
    return { child };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `Modifier ${loaderData?.child.firstName}` }] }),
  component: EditChild,
});

function EditChild() {
  const { child } = Route.useLoaderData();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [form, setForm] = useState({
    firstName: child.firstName,
    lastName: child.lastName,
    birth: child.birth,
    guardianEmail: child.guardianEmail,
    guardianPhone: child.guardianPhone,
    mealType: child.mealType,
    notes: child.notes ?? "",
  });

  const [tags, setTags] = useState<string[]>(child.allergies ? [child.allergies] : []);
  const [tagInput, setTagInput] = useState("");

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="text-sm" style={{ color: "var(--ink-muted)" }}>
        <Link to="/children" className="hover:underline">Enfants</Link>
        <span className="mx-2">›</span>
        <Link to="/children/$id" params={{ id: child.id }} className="hover:underline">
          {child.firstName} {child.lastName}
        </Link>
        <span className="mx-2">›</span>
        <span>Modifier</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center font-semibold text-white text-lg"
          style={{ background: "var(--sage)" }}>
          {initials(form.firstName, form.lastName)}
        </div>
        <h1 className="font-display text-[28px]">Modifier {child.firstName} {child.lastName}</h1>
      </div>

      <section className="card-warm p-6 flex flex-col gap-5">
        <div className="section-label">Informations personnelles</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Prénom">
            <input className="input-warm" value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </Field>
          <Field label="Nom">
            <input className="input-warm" value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </Field>
        </div>
        <Field label="Date de naissance">
          <input className="input-warm" value={form.birth}
            onChange={(e) => setForm({ ...form, birth: e.target.value })} />
        </Field>
        <Field label="Photo">
          <div className="flex items-center justify-center gap-3 rounded-[12px] py-6 border-dashed border-2"
            style={{ borderColor: "var(--hairline)", color: "var(--ink-muted)" }}>
            <Upload size={18} />
            <span className="text-sm">Remplacer la photo (optionnel)</span>
          </div>
        </Field>
      </section>

      <section className="card-warm p-6 flex flex-col gap-5">
        <div className="section-label">Responsable</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="E-mail">
            <input type="email" className="input-warm" value={form.guardianEmail}
              onChange={(e) => setForm({ ...form, guardianEmail: e.target.value })} />
          </Field>
          <Field label="Téléphone">
            <input className="input-warm" value={form.guardianPhone}
              onChange={(e) => setForm({ ...form, guardianPhone: e.target.value })} />
          </Field>
        </div>
      </section>

      <section className="card-warm p-6 flex flex-col gap-5">
        <div className="section-label">Profil alimentaire</div>
        <Field label="Type de repas">
          <div className="inline-flex p-1 rounded-full" style={{ background: "var(--canvas-2)" }}>
            {(["Repas de groupe", "Repas individuel"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setForm({ ...form, mealType: t })}
                className="px-5 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: form.mealType === t ? "var(--sage)" : "transparent",
                  color: form.mealType === t ? "#fff" : "var(--ink-muted)",
                }}>
                {t}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Allergies et restrictions">
          <div className="input-warm flex items-center flex-wrap gap-2" style={{ minHeight: 48 }}>
            {tags.map((t) => (
              <span key={t} className="chip chip-warn">
                {t}
                <button onClick={() => setTags(tags.filter((x) => x !== t))} className="ml-1"><X size={12} /></button>
              </span>
            ))}
            <input className="flex-1 outline-none bg-transparent min-w-[120px]"
              placeholder="Tapez puis Entrée…"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && tagInput.trim()) {
                  e.preventDefault();
                  setTags([...tags, tagInput.trim()]);
                  setTagInput("");
                }
              }} />
          </div>
        </Field>
        <Field label="Notes alimentaires">
          <textarea className="input-warm" rows={3} value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </Field>
      </section>

      <section className="card-warm p-6 flex flex-col gap-3">
        <div className="section-label">Zone sensible</div>
        <p className="text-sm" style={{ color: "var(--ink-muted)" }}>
          La suppression d'un enfant retire l'accès au profil. Les contrats et factures sont conservés à des fins d'archivage.
        </p>
        <button onClick={() => setConfirmDelete(true)} className="btn-danger self-start">
          <Trash2 size={14} /> Supprimer cet enfant
        </button>
      </section>

      <div className="flex justify-end gap-3 sticky bottom-4 card-warm p-4">
        <Link to="/children/$id" params={{ id: child.id }} className="btn-secondary">Annuler</Link>
        <button onClick={() => navigate({ to: "/children/$id", params: { id: child.id } })}
          className="btn-primary">Enregistrer les modifications</button>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(57,54,52,.28)", backdropFilter: "blur(4px)" }}>
          <div className="card-warm p-6 w-full max-w-[440px]" style={{ boxShadow: "var(--shadow-lg)" }}>
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle size={22} style={{ color: "var(--danger)" }} />
              <div className="flex-1">
                <h2 className="font-display text-xl">Supprimer cet enfant ?</h2>
                <p className="text-sm mt-2" style={{ color: "var(--ink-soft)" }}>
                  Cette action retire {child.firstName} de la liste active. Les contrats et factures archivés sont préservés.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDelete(false)} className="btn-secondary">Annuler</button>
              <button onClick={() => navigate({ to: "/children" })} className="btn-danger">Confirmer la suppression</button>
            </div>
          </div>
        </div>
      )}
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
