const tones = {
  blue: "bg-stf-blue-light text-stf-blue dark:bg-stf-blue/15 dark:text-blue-300",
  orange: "bg-stf-orange-light text-stf-orange dark:bg-stf-orange/15 dark:text-orange-300",
  green: "bg-stf-green-light text-stf-green dark:bg-stf-green/15 dark:text-green-300",
  red: "bg-stf-red-light text-stf-red dark:bg-stf-red/15 dark:text-red-300",
  neutral: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300",
};

export function Badge({
  children,
  tone = "blue",
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
