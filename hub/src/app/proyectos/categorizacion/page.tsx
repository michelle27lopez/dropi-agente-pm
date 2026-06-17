"use client";

import { useEffect, useState, useRef, MouseEvent, WheelEvent } from "react";

interface CategoryInfo {
  n: string; // name
  p: string | null; // parent_id
}

interface CategoryMap {
  [id: string]: CategoryInfo;
}

interface Coord {
  x: number;
  y: number;
}

// Cubic Bezier curve paths for flow lines
const getCurvePath = (x1: number, y1: number, x2: number, y2: number) => {
  const dx = Math.abs(x2 - x1) * 0.45;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
};

// Hierarchy Layout calculator
const computeLayout = (
  categories: CategoryMap,
  roots: string[],
  childrenMap: Record<string, string[]>,
  expandedNodes: Set<string>
) => {
  const coords: Record<string, Coord> = {};
  const columns: string[][] = [];

  // Column 0: Roots
  columns[0] = [...roots];

  // Trace down column by column
  let currentCol = 0;
  while (true) {
    const parentNodes = columns[currentCol] || [];
    if (parentNodes.length === 0) break;

    const nextCol: string[] = [];
    parentNodes.forEach((parentId) => {
      if (expandedNodes.has(parentId)) {
        const children = childrenMap[parentId] || [];
        nextCol.push(...children);
      }
    });

    if (nextCol.length === 0) break;
    columns[currentCol + 1] = nextCol;
    currentCol++;
  }

  const COLUMN_WIDTH = 360;
  const Y_SPACING = 140;

  // Base Y positioning for roots
  columns[0].forEach((id, index) => {
    coords[id] = {
      x: 150,
      y: index * Y_SPACING + 100,
    };
  });

  // Position children grouped and centered relative to their parents
  for (let c = 1; c < columns.length; c++) {
    const prevColNodes = columns[c - 1];

    prevColNodes.forEach((parentId) => {
      const parentCoord = coords[parentId];
      if (!parentCoord) return;

      const children = expandedNodes.has(parentId) ? (childrenMap[parentId] || []) : [];
      if (children.length === 0) return;

      const n = children.length;
      const groupHeight = (n - 1) * Y_SPACING;
      const startY = parentCoord.y - groupHeight / 2;

      children.forEach((childId, i) => {
        coords[childId] = {
          x: 150 + c * COLUMN_WIDTH,
          y: startY + i * Y_SPACING,
        };
      });
    });

    // Resolve vertical overlaps in column c
    const colNodes = columns[c];
    if (colNodes.length > 1) {
      colNodes.sort((a, b) => coords[a].y - coords[b].y);
      for (let iter = 0; iter < 15; iter++) {
        let changed = false;
        for (let i = 0; i < colNodes.length - 1; i++) {
          const n1 = colNodes[i];
          const n2 = colNodes[i + 1];
          const y1 = coords[n1].y;
          const y2 = coords[n2].y;
          const minDistance = 140; // card height is 100px + margins
          if (y2 - y1 < minDistance) {
            const overlap = minDistance - (y2 - y1);
            coords[n1].y -= overlap / 2;
            coords[n2].y += overlap / 2;
            changed = true;
          }
        }
        if (!changed) break;
      }
    }
  }

  return { coords, columns };
};

export default function CategorizacionPage() {
  const [docsOpen, setDocsOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryMap>({});
  const [roots, setRoots] = useState<string[]>([]);
  const [childrenMap, setChildrenMap] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Navigation States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [activePath, setActivePath] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"columns" | "graph">("graph");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Graph Viewer States
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [transform, setTransform] = useState({ x: 50, y: 50, scale: 0.65 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Graph filter / layers
  const [activeFilter, setActiveFilter] = useState<"all" | "roots" | "leaves">("all");

  const columnsContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Load category data
  useEffect(() => {
    fetch("/data/meli_categories_mco.json")
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el archivo de categorías");
        return res.json();
      })
      .then((data: CategoryMap) => {
        setCategories(data);

        const tempRoots: string[] = [];
        const tempChildren: Record<string, string[]> = {};

        Object.entries(data).forEach(([id, info]) => {
          const parentId = info.p;
          if (!parentId || !data[parentId]) {
            tempRoots.push(id);
          } else {
            if (!tempChildren[parentId]) {
              tempChildren[parentId] = [];
            }
            tempChildren[parentId].push(id);
          }
        });

        // Sort alphabetically
        tempRoots.sort((a, b) => data[a].n.localeCompare(data[b].n));
        Object.keys(tempChildren).forEach((parentId) => {
          tempChildren[parentId].sort((a, b) => data[a].n.localeCompare(data[b].n));
        });

        setRoots(tempRoots);
        setChildrenMap(tempChildren);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Error al cargar las categorías");
        setLoading(false);
      });
  }, []);

  // Handle live search suggestions
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const queryClean = searchQuery
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const matches: string[] = [];
    Object.entries(categories).forEach(([id, info]) => {
      const nameClean = info.n
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      if (nameClean.includes(queryClean)) {
        matches.push(id);
      }
    });

    matches.sort((a, b) => categories[a].n.localeCompare(categories[b].n));
    setSearchResults(matches.slice(0, 100));
  }, [searchQuery, categories]);

  // Scroll columns view to the right
  useEffect(() => {
    if (columnsContainerRef.current) {
      columnsContainerRef.current.scrollTo({
        left: columnsContainerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [activePath]);

  // Trace hierarchical path
  const getBreadcrumbPath = (id: string): { id: string; name: string }[] => {
    const path: { id: string; name: string }[] = [];
    let currentId: string | null = id;
    while (currentId && categories[currentId]) {
      path.unshift({ id: currentId, name: categories[currentId].n });
      currentId = categories[currentId].p;
    }
    return path;
  };

  // Select node and center camera
  const handleSelectNode = (id: string) => {
    setSelectedCategory(id);
    const pathObj = getBreadcrumbPath(id);
    const pathIds = pathObj.map((p) => p.id);
    setActivePath(pathIds);

    // Expand all parent nodes in the path to ensure the selected node is visible
    const newExpanded = new Set(expandedNodes);
    for (let i = 0; i < pathIds.length - 1; i++) {
      newExpanded.add(pathIds[i]);
    }
    setExpandedNodes(newExpanded);

    // Recalculate coordinates immediately to center camera
    const { coords } = computeLayout(categories, roots, childrenMap, newExpanded);
    const targetCoord = coords[id];
    if (targetCoord) {
      const scale = 0.7;
      setTransform({
        x: 380 - targetCoord.x * scale, // Off-center slightly to leave room for sidebar
        y: 280 - targetCoord.y * scale,
        scale,
      });
    }
  };

  const handleSelectFromSearch = (id: string) => {
    handleSelectNode(id);
    setSearchQuery("");
    setSearchResults([]);
  };

  const selectCategoryInPath = (id: string, colIndex: number) => {
    const newPath = activePath.slice(0, colIndex);
    newPath.push(id);
    setActivePath(newPath);
    setSelectedCategory(id);
  };

  const toggleExpandNode = (id: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
  };

  // Zoom helpers
  const handleZoom = (factor: number) => {
    setTransform((prev) => {
      const nextScale = Math.max(0.15, Math.min(3, prev.scale * factor));
      return {
        ...prev,
        x: prev.x + (400 - prev.x) * (1 - nextScale / prev.scale),
        y: prev.y + (280 - prev.y) * (1 - nextScale / prev.scale),
        scale: nextScale,
      };
    });
  };

  const handleCenter = () => {
    if (selectedCategory && coords[selectedCategory]) {
      const targetCoord = coords[selectedCategory];
      const scale = 0.75;
      setTransform({
        x: 380 - targetCoord.x * scale,
        y: 280 - targetCoord.y * scale,
        scale,
      });
    } else {
      setTransform({ x: 50, y: 100, scale: 0.65 });
    }
  };

  // Pan & drag event handlers
  const handleMouseDown = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.id === "graph-svg" || target.id === "graph-background" || target.tagName === "svg") {
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setTransform((prev) => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 1.08;
    let nextScale = transform.scale;
    if (e.deltaY < 0) {
      nextScale *= zoomFactor;
    } else {
      nextScale /= zoomFactor;
    }
    nextScale = Math.max(0.15, Math.min(3, nextScale));

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const nextX = mouseX - (mouseX - transform.x) * (nextScale / transform.scale);
    const nextY = mouseY - (mouseY - transform.y) * (nextScale / transform.scale);

    setTransform({
      x: nextX,
      y: nextY,
      scale: nextScale,
    });
  };

  // Generate current layout coords
  const { coords } = (loading || error) ? { coords: {} as Record<string, Coord> } : computeLayout(categories, roots, childrenMap, expandedNodes);

  // Total visible count calculation
  const totalVisibleNodes = Object.keys(coords).length;

  return (
    <main id="categorizacion-project-page" className="min-h-screen pb-16" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header id="project-header" className="bg-white border-b flex items-center justify-between px-8 py-4" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-4">
          <a href="/" id="back-to-home-link" className="text-sm font-medium hover:underline" style={{ color: "var(--muted)" }}>
            ← Dropi PM Tools
          </a>
          <span style={{ color: "var(--border)" }}>/</span>
          <span id="breadcrumb-current" className="text-sm font-semibold" style={{ color: "var(--fg)" }}>
            Categorización y Enriquecimiento
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 pt-10">
        {/* Title / Status badges */}
        <div id="project-title-container" className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span id="project-code-badge" className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "#F5F3FF", color: "#7C3AED" }}>
              CAT-001
            </span>
            <span id="project-status-badge" className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "#FFFBEB", color: "#D97706" }}>
              Discovery & Visual Graph
            </span>
          </div>
          <h1 id="project-main-title" className="text-3xl font-extrabold tracking-tight mb-2" style={{ color: "var(--fg)" }}>
            Categorización y Enriquecimiento Inteligente del Catálogo
          </h1>
          <p id="project-description-text" className="text-sm leading-relaxed max-w-3xl" style={{ color: "var(--muted)" }}>
            Explorador visual del árbol taxonómico completo de Mercado Libre Colombia (MCO) integrado en la interfaz corporativa.
          </p>
        </div>

        {/* Accordion resources */}
        <div id="project-resources-accordion" className="bg-white border rounded-2xl mb-8 overflow-hidden shadow-2xs" style={{ borderColor: "var(--border)" }}>
          <button
            id="toggle-resources-btn"
            onClick={() => setDocsOpen(!docsOpen)}
            className="w-full bg-none border-none cursor-pointer px-6 py-4 flex items-center gap-3 text-left focus:outline-none"
          >
            <span className="text-lg">📂</span>
            <span id="accordion-title" className="text-sm font-bold flex-1" style={{ color: "var(--fg)" }}>
              Recursos y Documentación
            </span>
            <span id="accordion-project-reference" className="text-xs mr-4" style={{ color: "var(--muted)" }}>
              CAT-001 · Documentación Base
            </span>
            <span
              id="accordion-arrow-indicator"
              className="text-xs transition-transform duration-200"
              style={{
                color: "var(--muted)",
                transform: docsOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              ▼
            </span>
          </button>

          {docsOpen && (
            <div id="accordion-content-panel" className="border-t p-6 bg-slate-50 grid grid-cols-1 md:grid-cols-3 gap-4" style={{ borderColor: "var(--border)" }}>
              <div id="resource-card-taxonomy" className="bg-white border rounded-xl p-4 flex items-start gap-3 shadow-2xs" style={{ borderColor: "var(--border)" }}>
                <span className="text-2xl">📖</span>
                <div>
                  <div className="text-sm font-bold mb-1" style={{ color: "var(--fg)" }}>
                    Taxonomía Estándar
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                    Propuesta de unificación del catálogo en 18 categorías principales para Dropi.
                  </div>
                </div>
              </div>
              <div id="resource-card-ai-pilot" className="bg-white border rounded-xl p-4 flex items-start gap-3 shadow-2xs" style={{ borderColor: "var(--border)" }}>
                <span className="text-2xl">🤖</span>
                <div>
                  <div className="text-sm font-bold mb-1" style={{ color: "var(--fg)" }}>
                    Piloto IA & Reglas
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                    Especificación de algoritmos de corrección por similitud semántica y Levenshtein.
                  </div>
                </div>
              </div>
              <div id="resource-card-backlog" className="bg-white border rounded-xl p-4 flex items-start gap-3 shadow-2xs" style={{ borderColor: "var(--border)" }}>
                <span className="text-2xl">📋</span>
                <div>
                  <div className="text-sm font-bold mb-1" style={{ color: "var(--fg)" }}>
                    Backlog de Categorías
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                    Matriz de priorización Dropy Score para categorías con mayor volumen de venta.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* View Mode Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit border mb-6 shadow-2xs" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={() => setActiveTab("graph")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "graph"
                ? "bg-white text-orange-600 shadow-2xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            🕸️ Grafo Interactivo (Árbol)
          </button>
          <button
            onClick={() => setActiveTab("columns")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "columns"
                ? "bg-white text-orange-600 shadow-2xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            📁 Visor de Columnas (Miller Columns)
          </button>
        </div>

        {/* --- VIEW: MILLER COLUMNS --- */}
        {activeTab === "columns" && (
          <div className="bg-white border rounded-2xl p-6 shadow-2xs flex flex-col min-h-[550px]" style={{ borderColor: "var(--border)" }}>
            {/* Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 mb-5" style={{ borderColor: "var(--border)" }}>
              <h2 className="text-sm font-bold text-gray-800">Selector en Cascada</h2>
              <div className="relative w-full md:max-w-md">
                <div className="flex items-center border rounded-xl px-3 py-2 bg-slate-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-500 transition-all" style={{ borderColor: "var(--border)" }}>
                  <span className="text-gray-400 mr-2 text-sm">🔍</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar categorías (ej. belleza, herramientas)..."
                    className="w-full bg-transparent border-none text-sm outline-none text-gray-900 focus:ring-0"
                  />
                </div>
                {searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto" style={{ borderColor: "var(--border)" }}>
                    {searchResults.map((id) => (
                      <button
                        key={id}
                        onClick={() => handleSelectFromSearch(id)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b flex flex-col"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <span className="text-xs font-bold text-gray-900">{categories[id].n}</span>
                        <span className="text-[10px] text-gray-400 mt-0.5">{getBreadcrumbPath(id).map(p=>p.name).join(" > ")}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {loading && <div className="text-center py-20 text-gray-500">Cargando taxonomía...</div>}

            {/* Breadcrumb Path */}
            {!loading && (
              <div className="bg-slate-50 border rounded-xl p-4 mb-4 flex items-center flex-wrap gap-2 text-xs font-bold" style={{ borderColor: "var(--border)" }}>
                <span className="text-gray-400 uppercase text-[9px] tracking-wider">Ruta:</span>
                {activePath.length === 0 ? (
                  <span className="text-gray-400 font-normal italic">Ninguna categoría seleccionada</span>
                ) : (
                  activePath.map((id, index) => (
                    <span key={id} className="flex items-center gap-2">
                      {index > 0 && <span className="text-gray-300">/</span>}
                      <button
                        onClick={() => {
                          setActivePath(activePath.slice(0, index + 1));
                          setSelectedCategory(id);
                        }}
                        className={selectedCategory === id ? "text-orange-600 font-bold" : "text-gray-600 hover:text-orange-600"}
                      >
                        {categories[id]?.n}
                      </button>
                    </span>
                  ))
                )}
              </div>
            )}

            {/* Horizontal Columns Container */}
            {!loading && (
              <div ref={columnsContainerRef} className="flex-1 flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                <div className="w-64 flex-none bg-slate-50 border rounded-xl flex flex-col" style={{ borderColor: "var(--border)" }}>
                  <div className="bg-slate-100/80 px-4 py-2.5 border-b text-[9px] font-bold text-gray-400 uppercase" style={{ borderColor: "var(--border)" }}>
                    Categorías Principales
                  </div>
                  <div className="flex-1 overflow-y-auto p-1.5 space-y-1 max-h-96">
                    {roots.map((id) => (
                      <button
                        key={id}
                        onClick={() => selectCategoryInPath(id, 0)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                          activePath[0] === id ? "bg-orange-500 text-white" : "text-gray-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>{categories[id].n}</span>
                        <span>{(childrenMap[id] || []).length > 0 ? "❯" : ""}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {activePath.map((parentId, colIndex) => {
                  const children = childrenMap[parentId] || [];
                  if (children.length === 0) return null;
                  return (
                    <div key={parentId} className="w-64 flex-none bg-slate-50 border rounded-xl flex flex-col" style={{ borderColor: "var(--border)" }}>
                      <div className="bg-slate-100/80 px-4 py-2.5 border-b text-[9px] font-bold text-gray-400 uppercase flex justify-between" style={{ borderColor: "var(--border)" }}>
                        <span>Subcategorías</span>
                        <span className="bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-full text-[8px]">{children.length}</span>
                      </div>
                      <div className="flex-1 overflow-y-auto p-1.5 space-y-1 max-h-96">
                        {children.map((id) => (
                          <button
                            key={id}
                            onClick={() => selectCategoryInPath(id, colIndex + 1)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                              activePath[colIndex + 1] === id ? "bg-orange-500 text-white" : "text-gray-700 hover:bg-slate-100"
                            }`}
                          >
                            <span>{categories[id].n}</span>
                            <span>{(childrenMap[id] || []).length > 0 ? "❯" : ""}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- VIEW: INTERACTIVE NODE GRAPH --- */}
        {activeTab === "graph" && (
          <div
            className={`border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 flex flex-col ${
              isFullscreen ? "fixed inset-0 z-50 w-screen h-screen bg-white border-none" : "bg-white min-h-[680px]"
            }`}
            style={{ borderColor: "var(--border)" }}
          >
            {/* Graph Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b z-10" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-orange-500 animate-pulse"></span>
                <div>
                  <h2 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    Meli Categories Graph <span className="text-[10px] font-bold bg-orange-50 border border-orange-200 text-orange-600 px-2 py-0.5 rounded-md">v1.2 · Colombia</span>
                  </h2>
                  <p className="text-[10px] text-gray-500">Total: 12,172 categorías | {totalVisibleNodes} nodos cargados</p>
                </div>
              </div>

              {/* Top Graph Search input & Controls */}
              <div className="flex items-center gap-4">
                {/* Embedded Mini Search */}
                <div className="relative hidden md:block">
                  <div className="flex items-center border rounded-lg px-2.5 py-1.5 bg-white w-64 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500/30 transition-all" style={{ borderColor: "var(--border)" }}>
                    <span className="text-xs text-gray-400 mr-2">🔍</span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar nodo..."
                      className="bg-transparent border-none text-xs outline-none text-gray-900 w-full focus:ring-0 placeholder-gray-400"
                    />
                  </div>
                  {searchResults.length > 0 && (
                    <div className="absolute right-0 mt-2 w-72 bg-white border rounded-xl shadow-lg z-50 max-h-72 overflow-y-auto" style={{ borderColor: "var(--border)" }}>
                      {searchResults.map((id) => (
                        <button
                          key={id}
                          onClick={() => handleSelectNode(id)}
                          className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 border-b flex flex-col text-xs transition-colors"
                          style={{ borderColor: "var(--border)" }}
                        >
                          <span className="font-bold text-gray-900">{categories[id].n}</span>
                          <span className="text-[9px] text-gray-400 mt-0.5 truncate">{getBreadcrumbPath(id).map(p=>p.name).join(" > ")}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Filter / Category Layer selection */}
                <div className="flex bg-slate-100 border p-0.5 rounded-lg text-[10px] font-bold" style={{ borderColor: "var(--border)" }}>
                  <button
                    onClick={() => setActiveFilter("all")}
                    className={`px-3 py-1 rounded-md transition-all ${
                      activeFilter === "all" ? "bg-white text-orange-600 shadow-2xs border" : "text-gray-500 hover:text-gray-900"
                    }`}
                    style={{ borderColor: activeFilter === "all" ? "var(--border)" : "transparent" }}
                  >
                    Todo
                  </button>
                  <button
                    onClick={() => setActiveFilter("roots")}
                    className={`px-3 py-1 rounded-md transition-all ${
                      activeFilter === "roots" ? "bg-white text-orange-600 shadow-2xs border" : "text-gray-500 hover:text-gray-900"
                    }`}
                    style={{ borderColor: activeFilter === "roots" ? "var(--border)" : "transparent" }}
                  >
                    Principales
                  </button>
                </div>

                {/* Fullscreen Toggle */}
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="bg-white border hover:bg-slate-50 text-gray-700 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                  style={{ borderColor: "var(--border)" }}
                >
                  {isFullscreen ? "🗗 Salir" : "🗖 Pantalla Completa"}
                </button>
              </div>
            </div>

            {/* Main Graph Content Panel */}
            <div className="flex-1 flex min-h-0 relative bg-slate-50/30">
              {/* Left Details Panel */}
              <div className="w-80 border-r bg-white flex flex-col z-10 overflow-hidden shadow-xs" style={{ borderColor: "var(--border)" }}>
                <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Información del Nodo</span>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
                  {selectedCategory && categories[selectedCategory] ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-base font-bold text-gray-900 leading-tight">
                          {categories[selectedCategory].n}
                        </h3>
                        <span className="inline-block mt-2 text-[9px] font-mono bg-slate-50 text-slate-500 px-2 py-0.5 rounded border" style={{ borderColor: "var(--border)" }}>
                          {selectedCategory}
                        </span>
                      </div>

                      <div className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
                        <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2">Estado del Nodo</span>
                        {(childrenMap[selectedCategory] || []).length > 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            Nodo Rama ({(childrenMap[selectedCategory] || []).length} hijos)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Hoja Final (Leaf Node)
                          </span>
                        )}
                      </div>

                      <div className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
                        <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2">Camino desde la Raíz</span>
                        <div className="space-y-2">
                          {getBreadcrumbPath(selectedCategory).map((p, idx) => (
                            <div key={p.id} className="flex items-center gap-2 text-xs">
                              <span className="text-[10px] font-mono text-slate-400">L{idx+1}</span>
                              <span className={p.id === selectedCategory ? "text-orange-600 font-bold" : "text-gray-600 hover:text-orange-600"}>
                                {p.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Subnodes list inside panel */}
                      {(childrenMap[selectedCategory] || []).length > 0 && (
                        <div className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
                          <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2">Explorar Ramas Hijas</span>
                          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                            {(childrenMap[selectedCategory] || []).map((childId) => (
                              <div
                                key={childId}
                                onClick={() => handleSelectNode(childId)}
                                className="text-[11px] p-2 bg-slate-50 hover:bg-orange-50 border hover:border-orange-200 rounded-lg cursor-pointer text-gray-700 font-semibold transition-all flex items-center justify-between"
                                style={{ borderColor: "var(--border)" }}
                              >
                                <span>{categories[childId].n}</span>
                                <span className="text-[8px] font-mono text-gray-400">{(childrenMap[childId] || []).length} sub</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-20 text-gray-400 text-xs">
                      Selecciona cualquier tarjeta en el grafo para ver sus conexiones y subramas aquí.
                    </div>
                  )}
                </div>

                <div className="p-4 border-t bg-slate-50 flex justify-between items-center text-[10px] text-gray-400 font-semibold" style={{ borderColor: "var(--border)" }}>
                  <span>Meli API v1.2</span>
                  <span>MCO Dataset</span>
                </div>
              </div>

              {/* Viewport Canvas (SVG graph) */}
              <div
                className="flex-1 h-full relative outline-none select-none overflow-hidden"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
              >
                {/* SVG canvas */}
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs">
                    Cargando lienzo...
                  </div>
                ) : (
                  <svg
                    id="graph-svg"
                    ref={svgRef}
                    className="w-full h-full cursor-grab active:cursor-grabbing"
                    style={{ background: "#f8fafc" }}
                  >
                    {/* Grid Background pattern */}
                    <defs>
                      <pattern id="dot-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <circle cx="1.5" cy="1.5" r="1.2" fill="#cbd5e1" opacity="0.75" />
                      </pattern>
                    </defs>
                    <rect id="graph-background" width="100%" height="100%" fill="url(#dot-grid)" />

                    {/* Transformable Graph Viewport */}
                    <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
                      {/* Connection links */}
                      {Object.entries(coords).map(([id, coord]) => {
                        const parentId = categories[id]?.p;
                        if (!parentId || !coords[parentId]) return null;

                        const parentCoord = coords[parentId];
                        const isLinkSelected = selectedCategory === id || selectedCategory === parentId;

                        return (
                          <path
                            key={`link-${id}`}
                            d={getCurvePath(parentCoord.x + 140, parentCoord.y, coord.x - 140, coord.y)}
                            fill="none"
                            stroke={isLinkSelected ? "var(--dropi)" : "#cbd5e1"}
                            strokeWidth={isLinkSelected ? 2.5 : 1.5}
                            opacity={isLinkSelected ? 0.95 : 0.55}
                            className="transition-all duration-300"
                          />
                        );
                      })}

                      {/* Category node cards */}
                      {Object.entries(coords).map(([id, coord]) => {
                        const info = categories[id];
                        if (!info) return null;

                        // Filtering rules
                        if (activeFilter === "roots" && info.p !== null) return null;

                        const children = childrenMap[id] || [];
                        const hasChildren = children.length > 0;
                        const isNodeSelected = selectedCategory === id;
                        const isExpanded = expandedNodes.has(id);

                        return (
                          <foreignObject
                            key={`node-${id}`}
                            x={coord.x - 140}
                            y={coord.y - 50}
                            width="280"
                            height="110"
                          >
                            <div
                              onClick={() => handleSelectNode(id)}
                              className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-300 select-none flex flex-col justify-between ${
                                isNodeSelected
                                  ? "bg-white border-orange-500 shadow-[0_4px_12px_rgba(247,127,0,0.15)] scale-[1.03]"
                                  : "bg-white border-slate-200/80 hover:border-slate-300"
                              }`}
                              style={{ height: "100px" }}
                            >
                              <div className="flex items-start justify-between">
                                <span className={`text-[8px] font-bold uppercase tracking-wider ${hasChildren ? "text-blue-600" : "text-emerald-600"}`}>
                                  {hasChildren ? "Categoría Rama" : "Hoja Final"}
                                </span>
                                <span className="text-[9px] font-mono text-slate-400 font-medium">
                                  {id}
                                </span>
                              </div>
                              
                              <h4 className="text-xs font-bold text-gray-800 mt-1 truncate">
                                {info.n}
                              </h4>
                              
                              <div className="flex items-center justify-between mt-2.5">
                                {hasChildren ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleExpandNode(id);
                                    }}
                                    className={`px-3 py-1 rounded-md text-[9px] font-extrabold flex items-center gap-1 transition-all border ${
                                      isExpanded
                                        ? "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
                                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                    }`}
                                  >
                                    {isExpanded ? "Colapsar ➖" : `Expandir ➕ (${children.length})`}
                                  </button>
                                ) : (
                                  <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    Listo
                                  </span>
                                )}
                              </div>
                            </div>
                          </foreignObject>
                        );
                      })}
                    </g>
                  </svg>
                )}

                {/* Floating HUD Controls in Canvas */}
                <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-white/95 backdrop-blur-md border p-1.5 rounded-xl shadow-lg z-10" style={{ borderColor: "var(--border)" }}>
                  <button
                    onClick={() => handleZoom(1.25)}
                    title="Zoom In"
                    className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-extrabold border text-xs flex items-center justify-center"
                    style={{ borderColor: "var(--border)" }}
                  >
                    ＋
                  </button>
                  <button
                    onClick={() => handleZoom(0.75)}
                    title="Zoom Out"
                    className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-extrabold border text-xs flex items-center justify-center"
                    style={{ borderColor: "var(--border)" }}
                  >
                    －
                  </button>
                  <button
                    onClick={handleCenter}
                    title="Center view"
                    className="bg-slate-50 hover:bg-slate-100 border text-slate-700 font-bold rounded-lg px-3 py-1.5 text-[10px] flex items-center justify-center"
                    style={{ borderColor: "var(--border)" }}
                  >
                    🎯 Centrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
