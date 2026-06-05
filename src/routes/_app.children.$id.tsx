import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { children, initials, formatCHF } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/children/$id")({
  loader: ({ params }) => {
    const child = children.find((c) => c.id === params.id);
    if (!child) throw notFound();
    return { child };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.child.firstName} ${loaderData?.child.lastName} · Profil` }],
  }),
  component: ChildProfile,
});

type Tab = "profil" | "contrat" | "presences" | "autorises";

function ChildProfile() {
  const { child } = Route.useLoaderData();
  const [tab, setTab] = useState<Tab>("profil");
  const tabs: { id: Tab; label: string }[] = [
    { id: "profil", label: "Profil" },
    { id: "contrat", label: "Contrat" },
    { id: "presences", label: "Présences" },
    { id: "autorises", label: "Autorisés" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="text-sm" style={{ color: "var(--ink-muted)" }}>
        <Link to="/children" className="hover:underline">Enfants</Link>
        <span className="mx-2">›</span>
        <span>{child.firstName} {child.lastName}</span>
      </div>

      <section className="card-warm p-6 flex items-center gap-5">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center font-semibold text-white text-xl"
          style={{ background: "var(--sage)" }}
        >
          {initials(child.firstName, child.lastName)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="eyebrow mb-1">{child.ageLabel} · née le {child.birth}</div>
          <h1 className="font-display text-[28px] leading-tight">{child.firstName} {child.lastName}</h1>
          <div className="text-sm mt-1" style={{ color: "var(--ink-muted)" }}>
            Responsable : {child.guardian} · {child.guardianEmail}
          </div>
        </div>
        <Link to="/children/$id/edit" params={{ id: child.id }} className="btn-secondary">
          <Pencil size={14} /> Modifier
        </Link>
      </section>

      <div className="inline-flex p-1 rounded-full self-start" style={{ background: "var(--canvas-2)" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-5 py-2 rounded-full text-sm font-semibold"
            style={{
              background: tab === t.id ? "var(--sage)" : "transparent",
              color: tab === t.id ? "#fff" : "var(--ink-soft)",
              minHeight: 44,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profil" && <ProfilTab child={child} />}
      {tab === "contrat" && <ContratTab />}
      {tab === "presences" && <PresencesTab />}
      {tab === "autorises" && <AutorisesTab />}
    </div>
  );
}

function ProfilTab({ child }: { child: typeof children[number] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <section className="card-warm p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="section-label">Profil alimentaire</div>
          <button className="btn-secondary" style={{ padding: "6px 12px", minHeight: 36 }}><Pencil size={12} /> Modifier</button>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <Row label="Type de repas"><span className="chip chip-info">{child.mealType}</span></Row>
          <Row label="Allergies">{child.allergies ? <span className="chip chip-warn">{child.allergies}</span> : <span style={{ color: "var(--ink-faint)" }}>—</span>}</Row>
          <Row label="Notes">{child.notes || <span style={{ color: "var(--ink-faint)" }}>—</span>}</Row>
        </div>
      </section>
      <section className="card-warm p-6 flex flex-col gap-4">
        <div className="section-label">Contact</div>
        <div className="flex flex-col gap-3 text-sm">
          <Row label="Téléphone">{child.guardianPhone}</Row>
          <Row label="E-mail">{child.guardianEmail}</Row>
        </div>
      </section>
    </div>
  );
}

function ContratTab() {
  return (
    <section className="card-warm p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="section-label">Contrat actuel</div>
        <span className="chip chip-ok">Actif</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <Row label="Tarif horaire" inline>{formatCHF(25)}/h</Row>
        <Row label="Arrondi" inline>15 minutes</Row>
        <Row label="Délai de grâce" inline>10 minutes</Row>
        <Row label="Minimum journalier" inline>—</Row>
        <Row label="Maximum journalier" inline>—</Row>
        <Row label="Repas inclus" inline>Non · CHF 5.– par repas</Row>
        <Row label="Date de début" inline>01.01.2026</Row>
        <Row label="Devise" inline>CHF</Row>
      </div>
      <div className="flex gap-3 pt-2 border-t" style={{ borderColor: "var(--hairline-2)" }}>
        <button className="btn-secondary" style={{ color: "var(--warn)", borderColor: "var(--warn)" }}>Suspendre le contrat</button>
        <button className="btn-danger">Résilier</button>
      </div>
    </section>
  );
}

function PresencesTab() {
  const rows = [
    { d: "lun. 4 mai", a: "07:45", dep: "16:00", dur: "8h 15min", m: 206.25, by: "Marie Dupont", manual: false },
    { d: "mar. 5 mai", a: "07:50", dep: "15:35", dur: "7h 45min", m: 193.75, by: "Marie Dupont", manual: false },
    { d: "mer. 6 mai", a: "08:00", dep: "16:00", dur: "8h 00min", m: 200.0, by: "Jean Dupont", manual: true },
    { d: "jeu. 7 mai", a: "08:15", dep: "15:45", dur: "7h 30min", m: 187.5, by: "Marie Dupont", manual: false },
    { d: "ven. 8 mai", a: "07:30", dep: "16:00", dur: "8h 30min", m: 212.5, by: "Marie Dupont", manual: false },
  ];
  return (
    <section className="card-warm p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="section-label">Historique de présence</div>
        <select className="input-warm" style={{ width: "auto", minHeight: 40 }}>
          <option>Mai 2026</option><option>Avril 2026</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: "var(--ink-muted)" }} className="text-left">
              {["Date","Arrivée","Départ","Durée","Montant","Déposé par","Type",""].map((h) => (
                <th key={h} className="py-3 px-2 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t" style={{ borderColor: "var(--hairline-2)" }}>
                <td className="py-3 px-2">{r.d}</td>
                <td className="py-3 px-2 num">{r.a}</td>
                <td className="py-3 px-2 num">{r.dep}</td>
                <td className="py-3 px-2 num">{r.dur}</td>
                <td className="py-3 px-2 num font-semibold">{formatCHF(r.m)}</td>
                <td className="py-3 px-2">{r.by}</td>
                <td className="py-3 px-2">{r.manual && <span className="chip chip-muted">Manuel</span>}</td>
                <td className="py-3 px-2 text-right">
                  <button className="p-2 rounded-md" style={{ color: "var(--ink-muted)" }}><Pencil size={14} /></button>
                </td>
              </tr>
            ))}
            <tr className="border-t-2" style={{ borderColor: "var(--hairline)" }}>
              <td colSpan={3} className="py-4 px-2 font-semibold">Total mai 2026</td>
              <td className="py-4 px-2 font-display font-semibold num">28h 45min</td>
              <td className="py-4 px-2 font-display font-semibold num">{formatCHF(718)}</td>
              <td colSpan={3}></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AutorisesTab() {
  return (
    <section className="card-warm p-6 flex flex-col gap-3">
      <div className="section-label mb-2">Personnes autorisées</div>
      <PickupRow name="Marie Dupont" role="Responsable principale" phone="+41 79 123 45 67" primary />
      <PickupRow name="Jean Dupont" role="Grand-père" phone="+41 79 987 65 43" />
      <button
        className="flex items-center justify-center gap-2 py-4 rounded-[12px] border-dashed border-2 mt-2"
        style={{ borderColor: "var(--hairline)", color: "var(--ink-muted)" }}
      >
        <Plus size={16} /> Ajouter une personne autorisée
      </button>
    </section>
  );
}

function PickupRow({ name, role, phone, primary }: { name: string; role: string; phone: string; primary?: boolean }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-[12px]" style={{ background: "var(--canvas)" }}>
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white"
        style={{ background: primary ? "var(--sage)" : "var(--sage-400)" }}
      >
        {initials(name.split(" ")[0], name.split(" ")[1])}
      </div>
      <div className="flex-1">
        <div className="font-semibold">{name}</div>
        <div className="text-sm" style={{ color: "var(--ink-muted)" }}>{role} · {phone}</div>
      </div>
      {primary ? (
        <span className="chip chip-info">Responsable principale</span>
      ) : (
        <button className="btn-secondary" style={{ color: "var(--danger)", padding: "8px 12px", minHeight: 36 }}>
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

function Row({ label, children, inline }: { label: string; children: React.ReactNode; inline?: boolean }) {
  if (inline) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-wider" style={{ color: "var(--ink-muted)" }}>{label}</span>
        <span className="font-medium" style={{ color: "var(--ink)" }}>{children}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between gap-3">
      <span style={{ color: "var(--ink-muted)" }}>{label}</span>
      <span className="text-right">{children}</span>
    </div>
  );
}
