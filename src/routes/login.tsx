import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { LogoMark } from "@/components/AppShell";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Connexion · Le Lac des Petits" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [show, setShow] = useState(false);
  const [err, setErr] = useState(false);
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const email = fd.get("email") as string;
    const pw = fd.get("pw") as string;
    if (email && pw) navigate({ to: "/" });
    else setErr(true);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: "var(--canvas)" }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.04 }}>
        <LogoMark className="w-[700px] h-[700px]" />
      </div>

      <div className="relative w-full max-w-[400px] flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3">
          <LogoMark className="w-12 h-12" />
          <h1 className="font-display text-[28px]" style={{ color: "var(--ink)" }}>Le Lac des Petits</h1>
          <div className="eyebrow text-center">Accueil familial de jour · Versoix</div>
        </div>

        <form
          onSubmit={submit}
          className="card-warm p-7 w-full flex flex-col gap-5"
          style={{ boxShadow: "var(--shadow-lg)" }}
        >
          <h2 className="font-display text-2xl text-center">Connexion</h2>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Adresse e-mail</label>
            <input name="email" type="email" className="input-warm" placeholder="vous@exemple.ch" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Mot de passe</label>
            <div className="relative">
              <input name="pw" type={show ? "text" : "password"} className="input-warm pr-12" />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                style={{ color: "var(--ink-muted)" }}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">Se connecter</button>

          {err && (
            <div
              className="p-3 rounded-[12px] text-sm"
              style={{ background: "var(--danger-bg)", color: "var(--danger)", border: "1px solid var(--danger)" }}
            >
              Identifiants incorrects. Veuillez réessayer.
            </div>
          )}

          <a href="#" className="text-sm text-center" style={{ color: "var(--ink-muted)" }}>
            Mot de passe oublié ?
          </a>

          <div className="flex justify-center gap-3 pt-3 border-t" style={{ borderColor: "var(--hairline-2)" }}>
            {(["fr", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className="text-sm font-semibold"
                style={{ color: lang === l ? "var(--sage)" : "var(--ink-muted)" }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}
