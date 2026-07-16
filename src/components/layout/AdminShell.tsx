"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { TranslateFn } from "@/lib/i18n/LanguageProvider";

const navGroups: { titleKey: string; items: { href: string; labelKey: string; icon: string }[] }[] = [
  {
    titleKey: "overview",
    items: [{ href: "/", labelKey: "dashboard", icon: "📊" }],
  },
  {
    titleKey: "mentorat",
    items: [
      { href: "/utilisatrices", labelKey: "utilisatrices", icon: "👤" },
      { href: "/programmes", labelKey: "programmes", icon: "🎯" },
      { href: "/matching", labelKey: "matching", icon: "🔗" },
      { href: "/binomes", labelKey: "binomes", icon: "🤝" },
      { href: "/groupes", labelKey: "groupes", icon: "👥" },
    ],
  },
  {
    titleKey: "contenu",
    items: [
      { href: "/cms", labelKey: "cms", icon: "📝" },
      { href: "/reporting", labelKey: "reporting", icon: "📈" },
    ],
  },
  {
    titleKey: "securite",
    items: [
      { href: "/signalements", labelKey: "signalements", icon: "🚩" },
      { href: "/audit-logs", labelKey: "auditLogs", icon: "🛡️" },
      { href: "/parametres", labelKey: "parametres", icon: "⚙️" },
    ],
  },
];

const allItems = navGroups.flatMap((g) => g.items);

function pageTitleKey(pathname: string) {
  if (pathname === "/profil") return "profil";
  return allItems.find((i) => i.href === pathname)?.labelKey ?? "dashboard";
}

function NavList({
  pathname,
  t,
  onNavigate,
}: {
  pathname: string;
  t: TranslateFn;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-1 flex-col gap-6 px-3">
      {navGroups.map((group) => (
        <div key={group.titleKey}>
          <p className="px-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
            {t(`nav.${group.titleKey}`)}
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
                      : "text-slate-500 hover:bg-slate-100 hover:text-stf-navy dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {t(`nav.${item.labelKey}`)}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({
  children,
  userName,
  userEmail,
  userInitials,
  userAccess,
}: {
  children: ReactNode;
  userName: string;
  userEmail: string;
  userInitials: string;
  userAccess: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white py-6 dark:border-border-default dark:bg-surface lg:flex">
        <Link href="/" className="flex items-center gap-2 px-6 pb-6">
          <span className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-black/5">
            <Image src="/brand/logo.jpg" alt="STF" fill sizes="36px" className="object-cover" />
          </span>
          <span className="text-sm font-semibold text-stf-navy dark:text-white">{t("nav.backoffice")}</span>
        </Link>
        <NavList pathname={pathname} t={t} />
        <div className="mx-3 mt-6">
          <UserMenu
            panelClassName="bottom-full left-0 mb-2"
            userName={userName}
            userEmail={userEmail}
            trigger={
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stf-orange-light text-sm font-bold text-stf-orange">
                  {userInitials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-stf-navy dark:text-white">{userName}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{userAccess}</p>
                </div>
              </div>
            }
          />
        </div>
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label={t("nav.fermerMenu")} className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col overflow-y-auto bg-white py-6 shadow-xl dark:bg-surface">
            <div className="flex items-center justify-between px-6 pb-6">
              <span className="text-sm font-semibold text-stf-navy dark:text-white">{t("nav.backofficeStf")}</span>
              <button onClick={() => setOpen(false)} aria-label={t("nav.fermer")} className="text-xl text-slate-500 dark:text-slate-300">
                ✕
              </button>
            </div>
            <NavList pathname={pathname} t={t} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur dark:border-border-default dark:bg-surface/95 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              aria-label={t("nav.ouvrirMenu")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 dark:border-border-default lg:hidden"
            >
              ☰
            </button>
            <h1 className="truncate text-lg font-semibold text-stf-navy dark:text-white">{t(`nav.${pageTitleKey(pathname)}`)}</h1>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <input
              type="search"
              placeholder={t("topbar.rechercher")}
              className="hidden w-56 rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-stf-blue dark:border-border-default dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 md:block"
            />
            <LanguageToggle />
            <ThemeToggle />
            <button
              disabled
              aria-label={t("topbar.notifications")}
              title="Notifications à venir"
              className="flex h-10 w-10 shrink-0 cursor-not-allowed items-center justify-center rounded-full border border-slate-200 text-slate-300 dark:border-border-default dark:text-slate-600"
            >
              🔔
            </button>
            <div className="lg:hidden">
              <UserMenu
                panelClassName="right-0 top-full mt-2"
                userName={userName}
                userEmail={userEmail}
                trigger={
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stf-orange-light text-sm font-bold text-stf-orange">
                    {userInitials}
                  </span>
                }
              />
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
