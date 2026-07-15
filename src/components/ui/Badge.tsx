const tones = {
  blue: "bg-stf-blue-light text-stf-blue",
  orange: "bg-stf-orange-light text-stf-orange",
  green: "bg-stf-green-light text-stf-green",
  red: "bg-stf-red-light text-stf-red",
  neutral: "bg-slate-100 text-slate-600",
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
