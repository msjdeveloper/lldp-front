import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil } from "lucide-react";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Paramètres · Le Lac des Petits" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [editing, setEditing] = useState(false);
  const [changePw, setChangePw] = useState(false);

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <h1 className="font-display text-[32px]">Paramètres</h1>

      <section className="card-warm p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="section-label">Mon profil</div>
          <button onClick={() => setEditing(!editing)} className="btn-secondary" style={{ padding: "8px 14px", minHeight: 38 }}>
            <Pencil size={14} /> {editing ? "Annuler" : "Modifier"}
          </button>
        </div>
        <div className="flex items-center gap-5">
          <div
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center font-display text-2xl text-white"
            style={{ background: "var(--sage)" }}
          >
            AD
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Prénom" value="Anaïs" editing={editing} />
            <Field label="Nom" value="Dupré" editing={editing} />
            <Field label="E-mail" value="anais@lelacdespetits.ch" readOnly />
            <Field label="Téléphone" value="+41 79 333 22 11" editing={editing} />
          </div>
        </div>
        {editing && (
          <div className="flex justify-end gap-3">
            <button onClick={() => setEditing(false)} className="btn-secondary">Annuler</button>
            <button onClick={() => setEditing(false)} className="btn-primary">Enregistrer</button>
          </div>
        )}
      </section>

      <section className="card-warm p-6 flex flex-col gap-4">
        <div className="section-label">Préférences</div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Langue de l'interface</span>
          <div className="inline-flex p-1 rounded-full" style={{ background: "var(--canvas-2)" }}>
            {(["fr", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className="px-5 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: lang === l ? "var(--sage)" : "transparent",
                  color: lang === l ? "#fff" : "var(--ink-muted)",
                }}
              >
                {l === "fr" ? "Français" : "English"}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="card-warm p-6 flex flex-col gap-4">
        <div className="section-label">Sécurité</div>
        <button onClick={() => setChangePw(!changePw)} className="btn-secondary self-start">
          Changer le mot de passe
        </button>
        {changePw && (
          <div className="flex flex-col gap-3 mt-2">
            <input type="password" className="input-warm" placeholder="Mot de passe actuel" />
            <input type="password" className="input-warm" placeholder="Nouveau mot de passe" />
            <input type="password" className="input-warm" placeholder="Confirmer le nouveau mot de passe" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setChangePw(false)} className="btn-secondary">Annuler</button>
              <button onClick={() => setChangePw(false)} className="btn-primary">Enregistrer</button>
            </div>
          </div>
        )}
      </section>

      <section className="card-warm p-6 flex flex-col gap-3">
        <div className="section-label">Compte</div>
        <Link to="/login" className="btn-danger w-full justify-center">
          Se déconnecter de tous les appareils
        </Link>
      </section>
    </div>
  );
}

function Field({ label, value, editing, readOnly }: { label: string; value: string; editing?: boolean; readOnly?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs uppercase tracking-wider" style={{ color: "var(--ink-muted)" }}>{label}</label>
      {editing && !readOnly ? (
        <input className="input-warm" defaultValue={value} />
      ) : (
        <span className="font-medium" style={{ color: "var(--ink)" }}>{value}{readOnly && <span className="text-xs ml-2" style={{ color: "var(--ink-faint)" }}>(non modifiable)</span>}</span>
      )}
    </div>
  );
}
