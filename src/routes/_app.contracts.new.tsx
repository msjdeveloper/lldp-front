import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { children } from "@/lib/mock-data";
import { SignaturePad } from "@/components/SignaturePad";
import { FileText, Upload, CheckCircle2, Eye } from "lucide-react";

export const Route = createFileRoute("/_app/contracts/new")({
  head: () => ({ meta: [{ title: "Nouveau contrat" }] }),
  component: NewContract,
});

type ContractTemplate = {
  name: string;
  size: number; // bytes
  url: string; // object URL or default
  uploadedAt: string;
};

const DEFAULT_TEMPLATE: ContractTemplate = {
  name: "Modèle_contrat_accueil_2026.pdf",
  size: 184_320,
  url: "/contract-template.pdf",
  uploadedAt: "10.06.2026",
};

function NewContract() {
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [template, setTemplate] = useState<ContractTemplate>(DEFAULT_TEMPLATE);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [parentSig, setParentSig] = useState<string | null>(null);
  const [providerSig, setProviderSig] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [signerName, setSignerName] = useState("");
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

  const stepOneValid = !!(form.childId && form.start && form.rate > 0);
  const stepTwoValid = !!template.url;
  const stepThreeValid = !!(accepted && parentSig && providerSig && signerName.trim());

  const child = children.find((c) => c.id === form.childId);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setTemplate({
      name: file.name,
      size: file.size,
      url,
      uploadedAt: new Date().toLocaleDateString("fr-CH"),
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="text-sm" style={{ color: "var(--ink-muted)" }}>
        <Link to="/contracts" className="hover:underline">Contrats</Link>
        <span className="mx-2">›</span>
        <span>Nouveau contrat</span>
      </div>
      <h1 className="font-display text-[32px]">Nouveau contrat</h1>

      {/* Stepper */}
      <div className="flex items-center gap-2 text-sm">
        {[
          { n: 1, label: "Conditions" },
          { n: 2, label: "Document" },
          { n: 3, label: "Signatures" },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2">
            <button
              onClick={() => setStep(s.n as 1 | 2 | 3)}
              className="flex items-center gap-2"
            >
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
                style={{
                  background: step >= s.n ? "var(--accent)" : "var(--canvas-2)",
                  color: step >= s.n ? "white" : "var(--ink-muted)",
                }}
              >
                {step > s.n ? "✓" : s.n}
              </span>
              <span style={{ color: step === s.n ? "var(--ink)" : "var(--ink-muted)" }}>
                {s.label}
              </span>
            </button>
            {i < 2 && <span style={{ color: "var(--ink-muted)" }}>—</span>}
          </div>
        ))}
      </div>

      {step === 1 && (
        <>
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
        </>
      )}

      {step === 2 && (
        <section className="card-warm p-6 flex flex-col gap-5">
          <div className="section-label">Document contractuel</div>
          <p className="text-sm" style={{ color: "var(--ink-muted)" }}>
            Le modèle PDF par défaut est utilisé. Vous pouvez le remplacer par une version
            personnalisée pour ce contrat.
          </p>

          <div
            className="rounded-xl p-5 flex items-center gap-4 border"
            style={{ borderColor: "var(--line)", background: "var(--canvas-2)" }}
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
            >
              <FileText size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{template.name}</div>
              <div className="text-xs" style={{ color: "var(--ink-muted)" }}>
                {(template.size / 1024).toFixed(1)} KB · Ajouté le {template.uploadedAt}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <Eye size={16} /> Aperçu
            </button>
          </div>

          <div className="flex items-center gap-3">
            <input
              ref={fileInput}
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="btn-secondary flex items-center gap-2"
            >
              <Upload size={16} /> Remplacer le PDF
            </button>
            {template.url !== DEFAULT_TEMPLATE.url && (
              <button
                type="button"
                onClick={() => setTemplate(DEFAULT_TEMPLATE)}
                className="text-sm underline"
                style={{ color: "var(--ink-muted)" }}
              >
                Réinitialiser
              </button>
            )}
          </div>

          {previewOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: "rgba(0,0,0,0.5)" }}
              onClick={() => setPreviewOpen(false)}
            >
              <div
                className="card-warm w-full max-w-4xl h-[85vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--line)" }}>
                  <div className="font-medium">{template.name}</div>
                  <button onClick={() => setPreviewOpen(false)} className="btn-secondary">Fermer</button>
                </div>
                <iframe
                  src={template.url}
                  title="Aperçu contrat"
                  className="flex-1 w-full rounded-b-xl"
                />
              </div>
            </div>
          )}
        </section>
      )}

      {step === 3 && (
        <>
          <section className="card-warm p-6 flex flex-col gap-4">
            <div className="section-label">Récapitulatif</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <Info label="Enfant" value={child ? `${child.firstName} ${child.lastName}` : "—"} />
              <Info label="Période" value={`${form.start || "—"} → ${form.end || "indéterminée"}`} />
              <Info label="Tarif horaire" value={`${form.rate} ${form.currency}`} />
              <Info label="Arrondi" value={form.rounding} />
              <Info label="Repas" value={form.mealsIncluded ? "Inclus" : `${form.mealFee} CHF / repas`} />
              <Info label="Document" value={template.name} />
            </div>
          </section>

          <section className="card-warm p-6 flex flex-col gap-5">
            <div className="section-label">Signature du parent / responsable légal</div>
            <Field label="Nom complet du signataire">
              <input
                className="input-warm"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder={child?.guardian ?? "Prénom Nom"}
              />
            </Field>
            <SignaturePad label="Signature manuscrite" onChange={setParentSig} />
          </section>

          <section className="card-warm p-6 flex flex-col gap-5">
            <div className="section-label">Signature de l'accueillante</div>
            <SignaturePad label="Votre signature" onChange={setProviderSig} />
          </section>

          <section className="card-warm p-6">
            <label className="flex items-start gap-3 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-1"
              />
              <span>
                Je confirme avoir lu et accepté l'intégralité du document{" "}
                <button type="button" onClick={() => setPreviewOpen(true)} className="underline">
                  {template.name}
                </button>{" "}
                et j'autorise l'enregistrement électronique des signatures ci-dessus avec
                horodatage.
              </span>
            </label>
          </section>

          {previewOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: "rgba(0,0,0,0.5)" }}
              onClick={() => setPreviewOpen(false)}
            >
              <div
                className="card-warm w-full max-w-4xl h-[85vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--line)" }}>
                  <div className="font-medium">{template.name}</div>
                  <button onClick={() => setPreviewOpen(false)} className="btn-secondary">Fermer</button>
                </div>
                <iframe src={template.url} title="Aperçu contrat" className="flex-1 w-full rounded-b-xl" />
              </div>
            </div>
          )}
        </>
      )}

      {/* Footer actions */}
      <div className="flex justify-between gap-3 sticky bottom-4 card-warm p-4">
        <Link to="/contracts" className="btn-secondary">Annuler</Link>
        <div className="flex gap-3">
          {step > 1 && (
            <button onClick={() => setStep((step - 1) as 1 | 2 | 3)} className="btn-secondary">
              Précédent
            </button>
          )}
          {step < 3 && (
            <button
              onClick={() => setStep((step + 1) as 1 | 2 | 3)}
              className="btn-primary"
              style={{
                opacity: (step === 1 ? stepOneValid : stepTwoValid) ? 1 : 0.5,
                pointerEvents: (step === 1 ? stepOneValid : stepTwoValid) ? "auto" : "none",
              }}
            >
              Suivant
            </button>
          )}
          {step === 3 && (
            <button
              onClick={() => stepThreeValid && navigate({ to: "/contracts" })}
              className="btn-primary flex items-center gap-2"
              style={{
                opacity: stepThreeValid ? 1 : 0.5,
                pointerEvents: stepThreeValid ? "auto" : "none",
              }}
            >
              <CheckCircle2 size={16} /> Signer et créer le contrat
            </button>
          )}
        </div>
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wide" style={{ color: "var(--ink-muted)" }}>
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
