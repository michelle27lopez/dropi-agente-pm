"use client";

import { useState } from "react";
import { Sparkles, Loader2, CheckCircle2, RefreshCw, ArrowLeft, Info, PackagePlus, Search, SendHorizonal } from "lucide-react";

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

export default function PrototipoCategorizacionIA() {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [precioSugerido, setPrecioSugerido] = useState("");
  const [sku, setSku] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // IA
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [gap, setGap] = useState<{ gap: boolean; note: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Selección final (de IA o de búsqueda manual)
  const [selected, setSelected] = useState<Suggestion | null>(null);

  // Búsqueda manual
  const [manualMode, setManualMode] = useState(false);
  const [manualQuery, setManualQuery] = useState("");
  const [manualPath, setManualPath] = useState<string[]>([]); // [level_1, level_2, level_3] seleccionados en el explorador
  const [manualHighlightL4, setManualHighlightL4] = useState<string | null>(null);
  const [taxonomy, setTaxonomy] = useState<DropiCategoryRow[] | null>(null);
  const [taxonomyLoading, setTaxonomyLoading] = useState(false);

  // Texto libre → solicitud a soporte
  const [showFreeText, setShowFreeText] = useState(false);
  const [freeTextValue, setFreeTextValue] = useState("");
  const [freeTextSubmitting, setFreeTextSubmitting] = useState(false);
  const [freeTextError, setFreeTextError] = useState<string | null>(null);
  const [pendingReview, setPendingReview] = useState<{ requestedText: string } | null>(null);

  const [showErrors, setShowErrors] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSugerir() {
    if (!nombre.trim()) return;
    setLoading(true);
    setError(null);
    setSuggestions(null);
    setSelected(null);
    setPendingReview(null);
    setManualMode(false);
    setManualPath([]);
    setManualHighlightL4(null);
    setShowFreeText(false);
    try {
      const res = await fetch("/api/categorizacion/classify-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_name: nombre.trim() }),
      });
      const data: ClassifyResponse = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "No se pudo obtener la sugerencia de categoría.");
        return;
      }
      setSuggestions(data.results);
      setGap({ gap: data.gap, note: data.gap_note });
    } catch {
      setError("Error de conexión al generar la sugerencia.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAbrirBusquedaManual() {
    setManualMode(true);
    setShowFreeText(false);
    setManualPath([]);
    setManualHighlightL4(null);
    setManualQuery("");
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
    setSelected({
      l1: row.level_1,
      l2: row.level_2,
      l3: row.level_3,
      l4: row.level_4,
      score: 100,
      reasoning: "Seleccionada manualmente del árbol",
    });
    setManualMode(false);
    setShowFreeText(false);
  }

  // Click en un resultado del buscador rápido: posiciona las columnas en esa ruta sin confirmar la selección
  function handleJumpToSearchResult(row: DropiCategoryRow) {
    setManualPath([row.level_1, row.level_2, row.level_3]);
    setManualHighlightL4(row.level_4);
    setManualQuery("");
  }

  function handleSelectPathLevel(levelIndex: number, value: string) {
    setManualPath((prev) => [...prev.slice(0, levelIndex), value]);
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
          product_name: nombre.trim(),
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
      setPendingReview({ requestedText: freeTextValue.trim() });
      setManualMode(false);
      setShowFreeText(false);
    } catch {
      setFreeTextError("Error de conexión al enviar la solicitud.");
    } finally {
      setFreeTextSubmitting(false);
    }
  }

  function handleGuardar() {
    setShowErrors(true);
    if (!nombre.trim() || (!selected && !pendingReview)) return;
    setSaved(true);
  }

  function handleNuevoProducto() {
    setNombre("");
    setPrecio("");
    setPrecioSugerido("");
    setSku("");
    setDescripcion("");
    setSuggestions(null);
    setGap(null);
    setError(null);
    setSelected(null);
    setManualMode(false);
    setManualQuery("");
    setManualPath([]);
    setManualHighlightL4(null);
    setShowFreeText(false);
    setFreeTextValue("");
    setFreeTextError(null);
    setPendingReview(null);
    setShowErrors(false);
    setSaved(false);
  }

  const categoriaSeleccionadaTexto = selected
    ? `${selected.l1} > ${selected.l2} > ${selected.l3} > ${selected.l4}`
    : pendingReview
    ? `Sin Categorizar > Registros por Reclasificar  ·  Pendiente de revisión: "${pendingReview.requestedText}"`
    : "";

  // Buscador rápido: solo para saltar directo a una ruta, no confirma la selección
  const manualSearchMatches =
    taxonomy && manualQuery.trim().length >= 2
      ? taxonomy
          .filter((c) => c.dropi_category_path.toLowerCase().includes(manualQuery.trim().toLowerCase()))
          .slice(0, 15)
      : [];

  function uniqueValues(rows: DropiCategoryRow[], key: keyof DropiCategoryRow): string[] {
    return Array.from(new Set(rows.map((r) => r[key])));
  }

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

  if (saved) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-10 max-w-md w-full text-center space-y-4">
          <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
          <h1 className="text-lg font-bold text-zinc-800">Producto guardado</h1>
          <p className="text-sm text-zinc-500">
            "{nombre}" quedó registrado en la categoría:
          </p>
          <p className="text-sm font-semibold text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-md px-3 py-2">
            {categoriaSeleccionadaTexto}
          </p>
          {pendingReview && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-md px-3 py-2">
              Tu propuesta fue enviada a soporte para revisión. Cuando la agreguen al árbol, este producto se reclasificará.
            </p>
          )}
          <button
            onClick={handleNuevoProducto}
            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-semibold transition-colors"
          >
            <PackagePlus className="w-4 h-4" />
            Agregar otro producto
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <a
          href="/proyectos/categorizacion"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-600 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver a Categorización
        </a>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-orange-600 bg-orange-50 border border-orange-100 rounded-full px-2.5 py-1 mb-2">
            <Sparkles className="w-3 h-3" />
            Piloto CAT-001 · Categorización con IA
          </div>
          <h1 className="text-xl font-bold text-zinc-800">Nuevo producto</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Completa la ficha como lo harías en Dropi. En el campo Categoría, la IA te va a sugerir las opciones más probables según el nombre del producto.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 lg:p-8 space-y-8">
          {/* Nombre */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Nombre del producto</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Cafetera eléctrica de goteo 12 tazas"
              className="w-full px-4 py-2 border border-zinc-200 rounded-md focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 text-sm"
            />
            {showErrors && !nombre.trim() && (
              <p className="text-xs text-rose-500">El nombre del producto es obligatorio.</p>
            )}
          </div>

          {/* Precios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700">Precio</label>
              <input
                type="text"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-orange-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700">Precio sugerido</label>
              <input
                type="text"
                value={precioSugerido}
                onChange={(e) => setPrecioSugerido(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-orange-400"
              />
            </div>
          </div>

          {/* Categoría IA */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-zinc-700 flex items-center gap-1">
                Categoría
                <span className="w-3.5 h-3.5 rounded-full border border-zinc-300 flex items-center justify-center text-[9px] text-zinc-400">?</span>
              </label>
              {!selected && !pendingReview && (
                <button
                  type="button"
                  onClick={handleSugerir}
                  disabled={!nombre.trim() || loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-orange-200 text-orange-600 bg-orange-50 hover:bg-orange-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  {suggestions ? "Volver a sugerir" : "Sugerir categoría con IA"}
                </button>
              )}
            </div>

            {!nombre.trim() && !selected && !pendingReview && (
              <p className="text-xs text-zinc-400">Escribe el nombre del producto para poder pedir sugerencias.</p>
            )}

            {error && <p className="text-xs text-rose-500">{error}</p>}

            {/* Categoría ya resuelta (IA, manual o pendiente de revisión) */}
            {(selected || pendingReview) && (
              <div className={`flex items-start gap-2 rounded-md p-3 border ${
                pendingReview ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"
              }`}>
                <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${pendingReview ? "text-amber-600" : "text-emerald-600"}`} />
                <div className="flex-1">
                  <p className={`text-xs font-semibold ${pendingReview ? "text-amber-800" : "text-emerald-800"}`}>
                    {categoriaSeleccionadaTexto}
                  </p>
                  <p className={`text-[11px] mt-0.5 ${pendingReview ? "text-amber-700" : "text-emerald-700"}`}>
                    {pendingReview ? "Categoría temporal — tu propuesta fue enviada a soporte" : "Categoría seleccionada"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelected(null); setPendingReview(null); }}
                  className={`text-[11px] font-medium flex items-center gap-1 ${pendingReview ? "text-amber-700 hover:text-amber-900" : "text-emerald-700 hover:text-emerald-900"}`}
                >
                  <RefreshCw className="w-3 h-3" />
                  Cambiar
                </button>
              </div>
            )}

            {/* Resultados de IA */}
            {suggestions && !selected && !pendingReview && !manualMode && (
              <div className="space-y-2">
                {suggestions.map((s, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setSelected(s)}
                    className="w-full text-left border border-zinc-200 rounded-md p-3 hover:border-orange-400 hover:bg-orange-50/30 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-zinc-700">
                        {s.l1} <span className="text-zinc-300">›</span> {s.l2} <span className="text-zinc-300">›</span> {s.l3} <span className="text-zinc-300">›</span> {s.l4}
                      </span>
                      <span className={`text-[10px] font-bold border rounded-full px-2 py-0.5 shrink-0 ${scoreStyle(s.score)}`}>
                        {s.score}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1">{s.reasoning}</p>
                  </button>
                ))}

                {gap?.gap && (
                  <div className="flex gap-2 bg-sky-50 border border-sky-100 rounded-md p-3 text-sky-800">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="text-xs">
                      Ninguna encaja perfecto: <span className="font-medium">{gap.note}</span>
                    </p>
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

            {/* Explorador de columnas (búsqueda manual) */}
            {manualMode && !selected && !pendingReview && (
              <div className="space-y-3 border border-zinc-200 rounded-md p-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-600">Explorar árbol de categorías</label>
                  {suggestions && (
                    <button
                      type="button"
                      onClick={() => setManualMode(false)}
                      className="text-[11px] text-zinc-400 hover:text-zinc-600"
                    >
                      ← Volver a sugerencias IA
                    </button>
                  )}
                </div>

                {taxonomyLoading && (
                  <p className="text-xs text-zinc-400 flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin" /> Cargando árbol de categorías...</p>
                )}

                {!taxonomyLoading && (
                  <>
                    {/* Buscador rápido: salta a la ruta, no confirma la selección */}
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

                    {/* Breadcrumb */}
                    <div className="flex items-center flex-wrap gap-1.5 text-[11px] font-semibold text-zinc-500 bg-zinc-50 border border-zinc-100 rounded-md px-2.5 py-1.5">
                      {manualPath.length === 0 ? (
                        <span className="text-zinc-400 font-normal italic">Ninguna categoría seleccionada · explora las columnas</span>
                      ) : (
                        manualPath.map((v, i) => (
                          <span key={v} className="flex items-center gap-1.5">
                            {i > 0 && <span className="text-zinc-300">›</span>}
                            <button type="button" onClick={() => setManualPath(manualPath.slice(0, i + 1))} className="hover:text-orange-600">
                              {v}
                            </button>
                          </span>
                        ))
                      )}
                    </div>

                    {/* Columnas */}
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {/* Columna L1 */}
                      <div className="w-44 flex-none border border-zinc-200 rounded-md">
                        <div className="bg-zinc-50 px-2.5 py-1.5 border-b border-zinc-100 text-[9px] font-bold text-zinc-400 uppercase">Categoría</div>
                        <div className="max-h-56 overflow-y-auto p-1">
                          {l1Options.map((v) => (
                            <button
                              type="button"
                              key={v}
                              onClick={() => handleSelectPathLevel(0, v)}
                              className={`w-full text-left px-2 py-1.5 rounded text-[11px] font-medium transition-colors ${
                                manualPath[0] === v ? "bg-orange-500 text-white" : "text-zinc-600 hover:bg-zinc-50"
                              }`}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Columna L2 */}
                      {manualPath[0] && (
                        <div className="w-44 flex-none border border-zinc-200 rounded-md">
                          <div className="bg-zinc-50 px-2.5 py-1.5 border-b border-zinc-100 text-[9px] font-bold text-zinc-400 uppercase">Subcategoría</div>
                          <div className="max-h-56 overflow-y-auto p-1">
                            {l2Options.map((v) => (
                              <button
                                type="button"
                                key={v}
                                onClick={() => handleSelectPathLevel(1, v)}
                                className={`w-full text-left px-2 py-1.5 rounded text-[11px] font-medium transition-colors ${
                                  manualPath[1] === v ? "bg-orange-500 text-white" : "text-zinc-600 hover:bg-zinc-50"
                                }`}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Columna L3 */}
                      {manualPath[0] && manualPath[1] && (
                        <div className="w-44 flex-none border border-zinc-200 rounded-md">
                          <div className="bg-zinc-50 px-2.5 py-1.5 border-b border-zinc-100 text-[9px] font-bold text-zinc-400 uppercase">Grupo</div>
                          <div className="max-h-56 overflow-y-auto p-1">
                            {l3Options.map((v) => (
                              <button
                                type="button"
                                key={v}
                                onClick={() => handleSelectPathLevel(2, v)}
                                className={`w-full text-left px-2 py-1.5 rounded text-[11px] font-medium transition-colors ${
                                  manualPath[2] === v ? "bg-orange-500 text-white" : "text-zinc-600 hover:bg-zinc-50"
                                }`}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Columna L4 (hojas, clic confirma la selección) */}
                      {manualPath[0] && manualPath[1] && manualPath[2] && (
                        <div className="w-52 flex-none border border-orange-200 rounded-md">
                          <div className="bg-orange-50 px-2.5 py-1.5 border-b border-orange-100 text-[9px] font-bold text-orange-500 uppercase">Categoría final · clic para elegir</div>
                          <div className="max-h-56 overflow-y-auto p-1">
                            {l4Rows.map((row) => (
                              <button
                                type="button"
                                key={row.dropi_category_id}
                                onClick={() => handleSelectManual(row)}
                                className={`w-full text-left px-2 py-1.5 rounded text-[11px] font-medium transition-colors ${
                                  manualHighlightL4 === row.level_4 ? "bg-orange-100 text-orange-800" : "text-zinc-600 hover:bg-orange-50 hover:text-orange-700"
                                }`}
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
                    <p className="text-[11px] text-zinc-400">
                      Se enviará a soporte para que la revise y, si aplica, la agregue al árbol de categorías.
                    </p>
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

            {showErrors && !categoriaSeleccionadaTexto && (
              <p className="text-xs text-rose-500">Debes seleccionar una categoría (con IA, manual o enviando tu propuesta a soporte).</p>
            )}
          </div>

          {/* SKU */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700 flex items-center gap-1">
              SKU <span className="font-normal text-zinc-400">(Opcional)</span>
            </label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-orange-400"
            />
          </div>

          {/* Descripción */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700">Descripción</label>
            <textarea
              rows={4}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Indica qué es el producto, cómo funciona y cuáles son sus principales características."
              className="w-full p-3 border border-zinc-200 rounded-md resize-none focus:outline-none focus:border-orange-400 text-sm"
            />
          </div>

          <div className="flex justify-end pt-2 border-t border-zinc-100">
            <button
              onClick={handleGuardar}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm font-semibold shadow-sm transition-colors"
            >
              Guardar producto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
