"use client";

import { InputHTMLAttributes, useState } from "react";

export function PasswordInput({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`${className} pr-11`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 fill-none stroke-current"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {visible ? (
            <>
              <path d="M3 3l18 18" />
              <path d="M9.9 9.9a2.5 2.5 0 0 0 3.5 3.5" />
              <path d="M9.6 5.2A10.4 10.4 0 0 1 12 5c5 0 9 4 10 7-.4 1.1-1.2 2.4-2.3 3.5M6.2 6.2C4 7.6 2.5 9.6 2 12c1 3 5 7 10 7 1.2 0 2.3-.2 3.3-.6" />
            </>
          ) : (
            <>
              <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}
