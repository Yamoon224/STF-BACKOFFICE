"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

const navGroups: { title: string; items: { href: string; label: string; icon: string }[] }[] = [
  {
    title: "Vue d'ensemble",
    items: [{ href: "/", label: "Tableau de bord", icon: "📊" }],
  },
  {
    title: "Mentorat",
    items: [
      { href: "/utilisatrices", label: "Utilisatrices", icon: "👤" },
      { href: "/programmes", label: "Programmes & cohortes", icon: "🎯" },
      { href: "/matching", label: "Matching", icon: "🔗" },
      { href: "/binomes", label: "Binômes & sessions", icon: "🤝" },
      { href: "/groupes", label: "Groupes", icon: "👥" },
    ],
  },
  {
    title: "Contenu & données",
    items: [
      { href: "/cms", label: "CMS", icon: "📝" },
      { href: "/reporting", label: "Reporting & exports", icon: "📈" },
    ],
  },
  {
    title: "Sécurité",
    items: [
      { href: "/signalements", label: "Signalements", icon: "🚩" },
      { href: "/audit-logs", label: "Journaux d'audit", icon: "🛡️" },
      { href: "/parametres", label: "Paramètres", icon: "⚙️" },
    ],
  },
];

const allItems = navGroups.flatMap((g) => g.items);

function pageTitle(pathname: string) {
  return allItems.find((i) => i.href === pathname)?.label ?? "Tableau de bord";
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavList = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-1 flex-col gap-6 px-3">
      {navGroups.map((group) => (
        <div key={group.title}>
          <p className="px-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
            {group.title}
          </p>
          <div className="mt-2 flex flex-col gap-1">
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-stf-blue text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-stf-navy"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white py-6 lg:flex">
        <Link href="/" className="flex items-center gap-2 px-6 pb-6">
          <span className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-black/5">
            <Image src="/brand/logo.jpg" alt="STF" fill sizes="36px" className="object-cover" />
          </span>
          <span className="text-sm font-semibold text-stf-navy">Back-office</span>
        </Link>
        <NavList />
        <div className="mx-3 mt-6 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-stf-orange-light text-sm font-bold text-stf-orange">
            AS
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-stf-navy">Administratrice STF</p>
            <p className="truncate text-xs text-slate-500">Accès global · MFA activé</p>
          </div>
        </div>
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Fermer le menu" className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col overflow-y-auto bg-white py-6 shadow-xl">
            <div className="flex items-center justify-between px-6 pb-6">
              <span className="text-sm font-semibold text-stf-navy">Back-office STF</span>
              <button onClick={() => setOpen(false)} aria-label="Fermer" className="text-xl">
                ✕
              </button>
            </div>
            <NavList onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              aria-label="Ouvrir le menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 lg:hidden"
            >
              ☰
            </button>
            <h1 className="text-lg font-semibold text-stf-navy">{pageTitle(pathname)}</h1>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="search"
              placeholder="Rechercher…"
              className="hidden w-56 rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-stf-blue md:block"
            />
            <button
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500"
            >
              🔔
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-stf-orange" />
            </button>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-stf-orange-light text-sm font-bold text-stf-orange lg:hidden">
              AS
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
