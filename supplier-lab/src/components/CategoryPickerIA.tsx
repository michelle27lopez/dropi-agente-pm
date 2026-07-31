"use client";

import { useState } from "react";
import { Sparkles, Loader2, CheckCircle2, RefreshCw, Info, Search, SendHorizonal } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export interface CategoriaSeleccionada {
  l1: string;
  l2: string;
  l3: string;
  l4: string;
  pending?: boolean;
  pendingText?: string;
}

interface Suggestion {
  l1: string;
  l2: string;
  l3: string;
  l4: string;
  score: number;
  reasoning: string;
}

interface ClassifyResponse {
  results: Suggestion[];
  gap: boolean;
  gap_note: string;
  error?: string;
}

interface DropiCategoryRow {
  dropi_category_id: string;
  dropi_category_path: string;
  level_1: string;
  level_2: string;
  level_3: string;
  level_4: string;
}

function scoreStyle(score: number) {
  if (score >= 70) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (score >= 50) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}

function uniqueValues(rows: DropiCategoryRow[], key: keyof DropiCategoryRow): string[] {
  return Array.from(new Set(rows.map((r) => r[key])));
}

interface Props {
  productName: string;
  value: CategoriaSeleccionada | null;
  onChange: (value: CategoriaSeleccionada | null) => void;
}

export function CategoryPickerIA({ productName, value, onChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [gap, setGap] = useState<{ gap: boolean; note: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [manualMode, setManualMode] = useState(false);
  const [manualQuery, setManualQuery] = useState("");
  const [manualPath, setManualPath] = useState<string[]>([]);
  const [manualHighlightL4, setManualHighlightL4] = useState<string | null>(null);
  const [taxonomy, setTaxonomy] = useState<DropiCategoryRow[] | null>(null);
  const [taxonomyLoading, setTaxonomyLoading] = useState(false);

  const [showFreeText, setShowFreeText] = useState(false);
  const [freeTextValue, setFreeTextValue] = useState("");
  const [freeTextSubmitting, setFreeTextSubmitting] = useState(false);
  const [freeTextError, setFreeTextError] = useState<string | null>(null);

  async function handleSugerir() {
    if (!productName.trim()) return;
    setLoading(true);
    setError(null);
    setSuggestions(null);
    setManualMode(false);
    setShowFreeText(false);
    trackEvent("category_ai_requested", { product_name: productName.trim() });
    try {
      const res = await fetch("/api/categorizacion/classify-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_name: productName.trim() }),
      });
      const data: ClassifyResponse = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "No se pudo obtener la sugerencia de categoría.");
        return;
      }
      setSuggestions(data.results);
      setGap({ gap: data.gap, note: data.gap_note });
      trackEvent("category_ai_suggested", { product_name: productName.trim(), gap: data.gap });
    } catch {
      setError("Error de conexión al generar la sugerencia.");
    } finally {
      setLoading(false);
    }
  }

  function handleSelectSuggestion(s: Suggestion) {
    trackEvent("category_ai_selected", { l4: s.l4, score: s.score });
    onChange({ l1: s.l1, l2: s.l2, l3: s.l3, l4: s.l4 });
    setManualMode(false);
    setShowFreeText(false);
  }

  async function handleAbrirBusquedaManual() {
    setManualMode(true);
    setShowFreeText(false);
    setManualPath([]);
    setManualHighlightL4(null);
    setManualQuery("");
    trackEvent("category_manual_opened");
    if (taxonomy) return;
    setTaxonomyLoading(true);
    try {
      const res = await fetch("/api/categorizacion/dropi-categories");
      const data = await res.json();
      setTaxonomy(Array.isArray(data) ? data : []);
    } catch {
      setTaxonomy([]);
    } finally {
      setTaxonomyLoading(false);
    }
  }

  function handleSelectManual(row: DropiCategoryRow) {
    trackEvent("category_manual_selected", { l4: row.level_4 });
    onChange({ l1: row.level_1, l2: row.level_2, l3: row.level_3, l4: row.level_4 });
    setManualMode(false);
    setShowFreeText(false);
  }

  function handleJumpToSearchResult(row: DropiCategoryRow) {
    setManualPath([row.level_1, row.level_2, row.level_3]);
    setManualHighlightL4(row.level_4);
    setManualQuery("");
  }

  function handleSelectPathLevel(levelIndex: number, val: string) {
    setManualPath((prev) => [...prev.slice(0, levelIndex), val]);
    setManualHighlightL4(null);
  }

  async function handleEnviarSolicitud() {
    if (!freeTextValue.trim()) return;
    setFreeTextSubmitting(true);
    setFreeTextError(null);
    try {
      const res = await fetch("/api/categorizacion/gap-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: productName.trim(),
          requested_category: freeTextValue.trim(),
          source: suggestions ? "ai_no_match" : "manual_no_match",
          ai_top_suggestions: suggestions ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setFreeTextError(data.error || "No se pudo enviar la solicitud.");
        return;
      }
      trackEvent("category_gap_request_submitted", { product_name: productName.trim(), requested_category: freeTextValue.trim() });
      onChange({
        l1: "Sin Categorizar",
        l2: "Sin Clasificar",
        l3: "Sin Clasificar",
        l4: "Registros por Reclasificar",
        pending: true,
        pendingText: freeTextValue.trim(),
      });
      setManualMode(false);
      setShowFreeText(false);
    } catch {
      setFreeTextError("Error de conexión al enviar la solicitud.");
    } finally {
      setFreeTextSubmitting(false);
    }
  }

  function handleCambiar() {
    onChange(null);
    setSuggestions(null);
    setGap(null);
    setManualMode(false);
    setShowFreeText(false);
  }

  const categoriaTexto = value
    ? value.pending
      ? `Sin Categorizar > Pendiente de revisión  ·  "${value.pendingText}"`
      : `${value.l1} > ${value.l2} > ${value.l3} > ${value.l4}`
    : "";

  const manualSearchMatches =
    taxonomy && manualQuery.trim().length >= 2
      ? taxonomy
          .filter((c) => c.dropi_category_path.toLowerCase().includes(manualQuery.trim().toLowerCase()))
          .slice(0, 15)
      : [];

  const l1Options = taxonomy ? uniqueValues(taxonomy, "level_1") : [];
  const l2Options =
    taxonomy && manualPath[0]
      ? uniqueValues(taxonomy.filter((r) => r.level_1 === manualPath[0]), "level_2")
      : [];
  const l3Options =
    taxonomy && manualPath[0] && manualPath[1]
      ? uniqueValues(taxonomy.filter((r) => r.level_1 === manualPath[0] && r.level_2 === manualPath[1]), "level_3")
      : [];
  const l4Rows =
    taxonomy && manualPath[0] && manualPath[1] && manualPath[2]
      ? taxonomy.filter((r) => r.level_1 === manualPath[0] && r.level_2 === manualPath[1] && r.level_3 === manualPath[2])
      : [];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-zinc-700 flex items-center gap-1">
          Categoría <span className="w-3.5 h-3.5 rounded-full border border-zinc-300 flex items-center justify-center text-[9px] text-zinc-400">?</span>
        </label>
        {!value && (
          <button
            type="button"
            onClick={handleSugerir}
            disabled={!productName.trim() || loading}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md border border-orange-200 text-orange-600 bg-orange-50 hover:bg-orange-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {suggestions ? "Volver a sugerir" : "Sugerir con IA"}
          </button>
        )}
      </div>

      {!productName.trim() && !value && (
        <p className="text-xs text-zinc-400">Escribe el nombre del producto para pedir sugerencias.</p>
      )}

      {error && <p className="text-xs text-rose-500">{error}</p>}

      {value && (
        <div className={`flex items-start gap-2 rounded-md p-3 border ${value.pending ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${value.pending ? "text-amber-600" : "text-emerald-600"}`} />
          <div className="flex-1">
            <p className={`text-xs font-semibold ${value.pending ? "text-amber-800" : "text-emerald-800"}`}>{categoriaTexto}</p>
            <p className={`text-[11px] mt-0.5 ${value.pending ? "text-amber-700" : "text-emerald-700"}`}>
              {value.pending ? "Categoría temporal — tu propuesta fue enviada a soporte" : "Categoría seleccionada"}
            </p>
          </div>
          <button type="button" onClick={handleCambiar} className={`text-[11px] font-medium flex items-center gap-1 ${value.pending ? "text-amber-700 hover:text-amber-900" : "text-emerald-700 hover:text-emerald-900"}`}>
            <RefreshCw className="w-3 h-3" />
            Cambiar
          </button>
        </div>
      )}

      {suggestions && !value && !manualMode && (
        <div className="space-y-2">
          {suggestions.map((s, i) => (
            <button
              type="button"
              key={i}
              onClick={() => handleSelectSuggestion(s)}
              className="w-full text-left border border-zinc-200 rounded-md p-2.5 hover:border-orange-400 hover:bg-orange-50/30 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-zinc-700">
                  {s.l1} <span className="text-zinc-300">›</span> {s.l2} <span className="text-zinc-300">›</span> {s.l3} <span className="text-zinc-300">›</span> {s.l4}
                </span>
                <span className={`text-[10px] font-bold border rounded-full px-2 py-0.5 shrink-0 ${scoreStyle(s.score)}`}>{s.score}</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">{s.reasoning}</p>
            </button>
          ))}

          {gap?.gap && (
            <div className="flex gap-2 bg-sky-50 border border-sky-100 rounded-md p-2.5 text-sky-800">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-xs">Ninguna encaja perfecto: <span className="font-medium">{gap.note}</span></p>
            </div>
          )}

          <button
            type="button"
            onClick={handleAbrirBusquedaManual}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-700 py-2"
          >
            <Search className="w-3.5 h-3.5" />
            Ninguna me sirve, buscar manualmente en el árbol
          </button>
        </div>
      )}

      {!value && !suggestions && !manualMode && productName.trim() && (
        <button
          type="button"
          onClick={handleAbrirBusquedaManual}
          className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-600 py-1.5"
        >
          <Search className="w-3.5 h-3.5" />
          O buscar manualmente en el árbol
        </button>
      )}

      {manualMode && !value && (
        <div className="space-y-2 border border-zinc-200 rounded-md p-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-600">Explorar árbol de categorías</label>
            {suggestions && (
              <button type="button" onClick={() => setManualMode(false)} className="text-[11px] text-zinc-400 hover:text-zinc-600">
                ← Volver a sugerencias IA
              </button>
            )}
          </div>

          {taxonomyLoading && (
            <p className="text-xs text-zinc-400 flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin" /> Cargando árbol de categorías...</p>
          )}

          {!taxonomyLoading && (
            <>
              <div className="relative">
                <div className="flex items-center border border-zinc-200 rounded-md px-2.5 py-1.5 bg-zinc-50 focus-within:bg-white focus-within:border-orange-400">
                  <Search className="w-3.5 h-3.5 text-zinc-400 mr-1.5 shrink-0" />
                  <input
                    type="text"
                    value={manualQuery}
                    onChange={(e) => setManualQuery(e.target.value)}
                    placeholder="Búsqueda rápida: escribe para saltar a una categoría..."
                    className="w-full bg-transparent border-none text-xs outline-none text-zinc-700"
                  />
                </div>
                {manualSearchMatches.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-md shadow-lg z-20 max-h-56 overflow-y-auto">
                    {manualSearchMatches.map((row) => (
                      <button
                        type="button"
                        key={row.dropi_category_id}
                        onClick={() => handleJumpToSearchResult(row)}
                        className="w-full text-left text-xs px-3 py-2 hover:bg-orange-50 hover:text-orange-700 text-zinc-600 border-b border-zinc-50 last:border-0"
                      >
                        {row.level_1} <span className="text-zinc-300">›</span> {row.level_2} <span className="text-zinc-300">›</span> {row.level_3} <span className="text-zinc-300">›</span> {row.level_4}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center flex-wrap gap-1.5 text-[11px] font-semibold text-zinc-500 bg-zinc-50 border border-zinc-100 rounded-md px-2.5 py-1.5">
                {manualPath.length === 0 ? (
                  <span className="text-zinc-400 font-normal italic">Ninguna categoría seleccionada · explora las columnas</span>
                ) : (
                  manualPath.map((v, i) => (
                    <span key={v} className="flex items-center gap-1.5">
                      {i > 0 && <span className="text-zinc-300">›</span>}
                      <button type="button" onClick={() => setManualPath(manualPath.slice(0, i + 1))} className="hover:text-orange-600">{v}</button>
                    </span>
                  ))
                )}
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                <div className="w-44 flex-none border border-zinc-200 rounded-md">
                  <div className="bg-zinc-50 px-2.5 py-1.5 border-b border-zinc-100 text-[9px] font-bold text-zinc-400 uppercase">Categoría</div>
                  <div className="max-h-56 overflow-y-auto p-1">
                    {l1Options.map((v) => (
                      <button
                        type="button"
                        key={v}
                        onClick={() => handleSelectPathLevel(0, v)}
                        className={`w-full text-left px-2 py-1.5 rounded text-[11px] font-medium transition-colors ${manualPath[0] === v ? "bg-orange-500 text-white" : "text-zinc-600 hover:bg-zinc-50"}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {manualPath[0] && (
                  <div className="w-44 flex-none border border-zinc-200 rounded-md">
                    <div className="bg-zinc-50 px-2.5 py-1.5 border-b border-zinc-100 text-[9px] font-bold text-zinc-400 uppercase">Subcategoría</div>
                    <div className="max-h-56 overflow-y-auto p-1">
                      {l2Options.map((v) => (
                        <button
                          type="button"
                          key={v}
                          onClick={() => handleSelectPathLevel(1, v)}
                          className={`w-full text-left px-2 py-1.5 rounded text-[11px] font-medium transition-colors ${manualPath[1] === v ? "bg-orange-500 text-white" : "text-zinc-600 hover:bg-zinc-50"}`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {manualPath[0] && manualPath[1] && (
                  <div className="w-44 flex-none border border-zinc-200 rounded-md">
                    <div className="bg-zinc-50 px-2.5 py-1.5 border-b border-zinc-100 text-[9px] font-bold text-zinc-400 uppercase">Grupo</div>
                    <div className="max-h-56 overflow-y-auto p-1">
                      {l3Options.map((v) => (
                        <button
                          type="button"
                          key={v}
                          onClick={() => handleSelectPathLevel(2, v)}
                          className={`w-full text-left px-2 py-1.5 rounded text-[11px] font-medium transition-colors ${manualPath[2] === v ? "bg-orange-500 text-white" : "text-zinc-600 hover:bg-zinc-50"}`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {manualPath[0] && manualPath[1] && manualPath[2] && (
                  <div className="w-52 flex-none border border-orange-200 rounded-md">
                    <div className="bg-orange-50 px-2.5 py-1.5 border-b border-orange-100 text-[9px] font-bold text-orange-500 uppercase">Categoría final · clic para elegir</div>
                    <div className="max-h-56 overflow-y-auto p-1">
                      {l4Rows.map((row) => (
                        <button
                          type="button"
                          key={row.dropi_category_id}
                          onClick={() => handleSelectManual(row)}
                          className={`w-full text-left px-2 py-1.5 rounded text-[11px] font-medium transition-colors ${manualHighlightL4 === row.level_4 ? "bg-orange-100 text-orange-800" : "text-zinc-600 hover:bg-orange-50 hover:text-orange-700"}`}
                        >
                          {row.level_4}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {!showFreeText ? (
            <button
              type="button"
              onClick={() => setShowFreeText(true)}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-700 py-2 border-t border-zinc-100 mt-2 pt-2"
            >
              No encuentro mi categoría, quiero escribirla
            </button>
          ) : (
            <div className="space-y-2 border-t border-zinc-100 mt-2 pt-3">
              <label className="text-xs font-semibold text-zinc-600">Describe la categoría que necesitas</label>
              <p className="text-[11px] text-zinc-400">Se enviará a soporte para que la revise y, si aplica, la agregue al árbol de categorías.</p>
              <textarea
                rows={2}
                value={freeTextValue}
                onChange={(e) => setFreeTextValue(e.target.value)}
                placeholder="Ej: Timbres y videoporteros inteligentes"
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-xs focus:outline-none focus:border-orange-400 resize-none"
              />
              {freeTextError && <p className="text-xs text-rose-500">{freeTextError}</p>}
              <button
                type="button"
                onClick={handleEnviarSolicitud}
                disabled={!freeTextValue.trim() || freeTextSubmitting}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white rounded-md text-xs font-semibold transition-colors"
              >
                {freeTextSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <SendHorizonal className="w-3.5 h-3.5" />}
                Enviar a soporte y continuar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
