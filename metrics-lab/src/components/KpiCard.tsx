"use client";

type Props = {
  title: string;
  total: number;
  approved: number;
  approvalRate: string;
  approvalLabel?: string;
  color: string;
};

export function KpiCard({ title, total, approved, approvalRate, approvalLabel = "Aprobados", color }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-5 space-y-4">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-[var(--muted-foreground)] leading-snug max-w-[70%]">{title}</p>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${color}18`, color }}
        >
          {approvalRate}
        </span>
      </div>
      <div>
        <p className="text-3xl font-bold text-[var(--foreground)]">{total.toLocaleString("es-CO")}</p>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">total en pipeline</p>
      </div>
      <div className="flex items-center gap-2 pt-1 border-t border-[var(--border)]">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-xs text-[var(--muted-foreground)]">{approvalLabel}: <strong className="text-[var(--foreground)]">{approved}</strong></span>
      </div>
    </div>
  );
}
