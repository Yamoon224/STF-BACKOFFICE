import { ReactNode } from "react";

export function Card({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      {title ? (
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-semibold text-stf-navy">{title}</h2>
          {action}
        </div>
      ) : null}
      {children}
    </div>
  );
}
