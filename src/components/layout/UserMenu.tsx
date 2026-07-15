"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { currentUser } from "@/lib/mock-data";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function UserMenu({
  trigger,
  panelClassName = "right-0 top-full mt-2",
}: {
  trigger: ReactNode;
  panelClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!open) return;

    function onClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("userMenu.menuProfil")}
        className="w-full text-left"
      >
        {trigger}
      </button>

      {open ? (
        <div
          role="menu"
          className={`absolute z-40 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-border-default dark:bg-surface ${panelClassName}`}
        >
          <div className="border-b border-slate-100 px-3 py-2 dark:border-border-subtle">
            <p className="truncate text-sm font-semibold text-stf-navy dark:text-white">{currentUser.name}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{currentUser.email}</p>
          </div>
          <div className="mt-1 flex flex-col gap-0.5">
            <Link
              href="/profil"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-stf-navy dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <span className="text-base">👤</span>
              {t("userMenu.monProfil")}
            </Link>
            <Link
              href="/parametres"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-stf-navy dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <span className="text-base">⚙️</span>
              {t("userMenu.parametres")}
            </Link>
            <Link
              href="/connexion"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-stf-red hover:bg-stf-red-light dark:hover:bg-stf-red/15"
            >
              <span className="text-base">🚪</span>
              {t("userMenu.deconnexion")}
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
