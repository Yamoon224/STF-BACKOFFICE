"use client";

import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { logoutAction } from "@/lib/actions/auth";

export function UserMenu({
  trigger,
  panelClassName = "right-0 top-full mt-2",
  userName,
  userEmail,
}: {
  trigger: ReactNode;
  panelClassName?: string;
  userName: string;
  userEmail: string;
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
            <p className="truncate text-sm font-semibold text-stf-navy dark:text-white">{userName}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{userEmail}</p>
          </div>
          <div className="mt-1 flex flex-col gap-0.5">
            <Link
              href="/profil"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-stf-navy dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <User className="h-4 w-4" strokeWidth={1.8} />
              {t("userMenu.monProfil")}
            </Link>
            <Link
              href="/parametres"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-stf-navy dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <Settings className="h-4 w-4" strokeWidth={1.8} />
              {t("userMenu.parametres")}
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                role="menuitem"
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-stf-red hover:bg-stf-red-light dark:hover:bg-stf-red/15"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.8} />
                {t("userMenu.deconnexion")}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
