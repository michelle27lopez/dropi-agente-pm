"use client";

type Step = { label: string; value: number; color: string };

export function FunnelSummary({ steps }: { steps: Step[] }) {
  const max = Math.max(...steps.map((s) => s.value), 1);

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-6">
      <div className="space-y-4">
        {steps.map((step, i) => {
          const width = Math.round((step.value / max) * 100);
          const conv = i > 0 ? `${Math.round((step.value / steps[i - 1].value) * 100)}% del anterior` : null;
          return (
            <div key={step.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ backgroundColor: step.color }}>{i + 1}</span>
                  <span className="font-medium text-[var(--foreground)]">{step.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  {conv && <span className="text-xs text-[var(--muted-foreground)]">{conv}</span>}
                  <span className="font-bold text-[var(--foreground)]">{step.value.toLocaleString("es-CO")}</span>
                </div>
              </div>
              <div className="h-3 bg-[var(--muted)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${width}%`, backgroundColor: step.color, opacity: 0.85 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
