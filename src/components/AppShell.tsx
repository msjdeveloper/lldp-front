import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Users,
  FileText,
  Receipt,
  UtensilsCrossed,
  UserPlus,
  Settings,
  LogOut,
} from "lucide-react";
import type { ReactNode } from "react";

type Item = { to: string; icon: typeof Home; label: string };

const nav: Item[] = [
  { to: "/", icon: Home, label: "Aujourd'hui" },
  { to: "/children", icon: Users, label: "Enfants" },
  { to: "/contracts", icon: FileText, label: "Contrats" },
  { to: "/invoices", icon: Receipt, label: "Factures" },
  { to: "/menu", icon: UtensilsCrossed, label: "Menu" },
  { to: "/leads", icon: UserPlus, label: "Leads" },
];

function LogoMark({ className = "", color = "var(--sage)" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ color }} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 14 L16 5 L26 14 V25 a2 2 0 0 1 -2 2 H8 a2 2 0 0 1 -2 -2 Z" />
      <path d="M16 27 V18" />
      <path d="M22 9 V5 M20 7 H24" opacity=".7" />
    </svg>
  );
}

function NavItem({ to, icon: Icon, label, active }: Item & { active: boolean }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-3 mx-2 rounded-[12px] transition-colors relative"
      style={{
        background: active ? "var(--sage-50)" : "transparent",
        color: active ? "var(--sage)" : "var(--ink-muted)",
        borderLeft: active ? "3px solid var(--sage)" : "3px solid transparent",
        minHeight: 44,
      }}
    >
      <Icon size={20} strokeWidth={1.5} />
      <span className="hidden lg:inline text-sm font-medium">{label}</span>
    </Link>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const { location } = useRouterState();
  const path = location.pathname;
  const isActive = (to: string) =>
    to === "/" ? path === "/" : path.startsWith(to);

  return (
    <div className="min-h-screen flex" style={{ background: "var(--canvas)" }}>
      <aside
        className="hidden md:flex flex-col shrink-0 border-r"
        style={{
          width: 220,
          background: "var(--surface)",
          borderColor: "var(--hairline)",
        }}
      >
        <div className="px-5 py-6 hidden lg:block">
          <div className="flex items-center gap-3 mb-1">
            <LogoMark className="w-8 h-8" />
          </div>
          <div className="eyebrow mt-3">Accueil familial</div>
          <div className="font-display text-[18px] leading-tight" style={{ color: "var(--ink)" }}>
            Le Lac des Petits
          </div>
        </div>
        <div className="px-2 py-2 lg:hidden flex justify-center">
          <LogoMark className="w-8 h-8" />
        </div>

        <nav className="flex-1 flex flex-col gap-1 mt-2">
          {nav.map((n) => (
            <NavItem key={n.to} {...n} active={isActive(n.to)} />
          ))}
        </nav>

        <div className="flex flex-col gap-1 pb-4">
          <NavItem to="/settings" icon={Settings} label="Paramètres" active={isActive("/settings")} />
          <Link
            to="/login"
            className="flex items-center gap-3 px-3 py-3 mx-2 rounded-[12px]"
            style={{ color: "var(--ink-muted)", minHeight: 44, borderLeft: "3px solid transparent" }}
          >
            <LogOut size={20} strokeWidth={1.5} />
            <span className="hidden lg:inline text-sm font-medium">Se déconnecter</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="max-w-[1400px] mx-auto p-6 md:p-10">{children}</div>
      </main>
    </div>
  );
}

export { LogoMark };
