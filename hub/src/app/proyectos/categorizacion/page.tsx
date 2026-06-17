"use client";

import { useEffect, useState, useRef, MouseEvent, WheelEvent } from "react";

// Types
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

interface DropiCategoryRaw {
  name: string;
  orders: number;
}

// Homologation unified taxonomy targets
interface TargetCategory {
  l1: string;
  l2: string;
  alert?: "typo" | "campaign" | "trash" | null;
  suggestedFix?: string;
}

// Define the mapping dictionary from chaotic raw names to clean unifications
const DROPI_MAPPING_DICT: Record<string, TargetCategory> = {
  // Hogar / Cocina / Jardin
  "HOGAR": { l1: "Hogar y Decoración", l2: "Hogar General" },
  "NATURAL HOME": { l1: "Hogar y Decoración", l2: "Hogar General" },
  "HOGAR Y DECORACION": { l1: "Hogar y Decoración", l2: "Decoración" },
  "HOGAT": { l1: "Hogar y Decoración", l2: "Hogar General", alert: "typo", suggestedFix: "HOGAR" },
  "MUEBLES": { l1: "Hogar y Decoración", l2: "Muebles" },
  "JARDIN": { l1: "Hogar y Decoración", l2: "Jardín y Exteriores" },
  "JARDINERIA": { l1: "Hogar y Decoración", l2: "Jardín y Exteriores" },
  "ACCESORIOS HOGAR": { l1: "Hogar y Decoración", l2: "Hogar General" },
  "DECORACION PARA EL HOGAR": { l1: "Hogar y Decoración", l2: "Decoración" },
  "DECORACION": { l1: "Hogar y Decoración", l2: "Decoración" },
  "ESCRITORIOS": { l1: "Hogar y Decoración", l2: "Muebles" },
  "ESCRITORIOS Y MUEBLES": { l1: "Hogar y Decoración", l2: "Muebles" },
  "COCINA": { l1: "Hogar y Decoración", l2: "Cocina y Utensilios" },
  "COCINA Y ELECTRODOMESTICOS": { l1: "Hogar y Decoración", l2: "Cocina y Utensilios" },
  "UTENSLIOS DE COOKINA": { l1: "Hogar y Decoración", l2: "Cocina y Utensilios", alert: "typo", suggestedFix: "UTENSILOS DE COCINA" },
  "UTENSILIOS DE COCINA": { l1: "Hogar y Decoración", l2: "Cocina y Utensilios" },
  "LIMPIEZA": { l1: "Hogar y Decoración", l2: "Limpieza y Aseo" },
  "HIGIENE Y LIMPIEZA": { l1: "Hogar y Decoración", l2: "Limpieza y Aseo" },
  "ASEO": { l1: "Hogar y Decoración", l2: "Limpieza y Aseo" },
  "ASEO Y BIENESTAR": { l1: "Hogar y Decoración", l2: "Limpieza y Aseo" },
  "HIGIENE": { l1: "Hogar y Decoración", l2: "Limpieza y Aseo" },
  "HIGIENE LIMPIEZA": { l1: "Hogar y Decoración", l2: "Limpieza y Aseo" },
  "LIMPIADOR MAGNETICO": { l1: "Hogar y Decoración", l2: "Limpieza y Aseo" },

  // Mascotas
  "MASCOTAS": { l1: "Mascotas", l2: "Mascotas General" },

  // Tecnología
  "TECNOLOGIA": { l1: "Tecnología y Electrónica", l2: "Tecnología General" },
  "TEGNOLOGIA": { l1: "Tecnología y Electrónica", l2: "Tecnología General", alert: "typo", suggestedFix: "TECNOLOGIA" },
  "TECNOLOGIA Y ELECTRONICA": { l1: "Tecnología y Electrónica", l2: "Tecnología General" },
  "ELECTRONICA Y TECNOLOGIA": { l1: "Tecnología y Electrónica", l2: "Tecnología General" },
  "ELECTRONICA": { l1: "Tecnología y Electrónica", l2: "Electrónica General" },
  "ELECTRONICOS": { l1: "Tecnología y Electrónica", l2: "Electrónica General" },
  "GADGETS": { l1: "Tecnología y Electrónica", l2: "Gadgets y Novedades" },
  "GATGETS": { l1: "Tecnología y Electrónica", l2: "Gadgets y Novedades", alert: "typo", suggestedFix: "GADGETS" },
  "VIDEOJUEGOS": { l1: "Tecnología y Electrónica", l2: "Videojuegos y Consolas" },

  // Belleza / Cuidado
  "BELLEZA": { l1: "Belleza y Cuidado Personal", l2: "Belleza General" },
  "BELLEZA Y CUIDADO PERSONAL": { l1: "Belleza y Cuidado Personal", l2: "Belleza General" },
  "BELLEZA COSMETICA": { l1: "Belleza y Cuidado Personal", l2: "Maquillaje y Cosméticos" },
  "MAQUILLAJE Y BELLEZA": { l1: "Belleza y Cuidado Personal", l2: "Maquillaje y Cosméticos" },
  "COSMETICOS": { l1: "Belleza y Cuidado Personal", l2: "Maquillaje y Cosméticos" },
  "MAQUILLAJE": { l1: "Belleza y Cuidado Personal", l2: "Maquillaje y Cosméticos" },
  "COSMETICOS Y PERFUMERIA": { l1: "Belleza y Cuidado Personal", l2: "Maquillaje y Cosméticos" },
  "PERFUMERIA": { l1: "Belleza y Cuidado Personal", l2: "Perfumería" },
  "PERFUMES": { l1: "Belleza y Cuidado Personal", l2: "Perfumería" },
  "CUIDADO PERSONAL": { l1: "Belleza y Cuidado Personal", l2: "Higiene y Cuidado" },
  "CUIDADO": { l1: "Belleza y Cuidado Personal", l2: "Higiene y Cuidado" },
  "CAPILAR": { l1: "Belleza y Cuidado Personal", l2: "Cuidado Capilar" },
  "CORPORAL": { l1: "Belleza y Cuidado Personal", l2: "Cuidado Corporal" },
  "FAJAS": { l1: "Belleza y Cuidado Personal", l2: "Fajas y Ropa Control" },

  // Salud / Bienestar
  "SALUD": { l1: "Salud y Bienestar", l2: "Salud General" },
  "BIENESTAR": { l1: "Salud y Bienestar", l2: "Salud General" },
  "BIENESTAR Y SALUD": { l1: "Salud y Bienestar", l2: "Salud General" },
  "SALUD Y BIENESTAR": { l1: "Salud y Bienestar", l2: "Salud General" },
  "SALUD BIENESTAR NATURAL": { l1: "Salud y Bienestar", l2: "Salud General" },
  "SALUD Y CUIDADO PERSONAL": { l1: "Salud y Bienestar", l2: "Salud General" },
  "SALUD BIENESTAR NATURAL ": { l1: "Salud y Bienestar", l2: "Salud General" },
  "SALUD NUTRICION": { l1: "Salud y Bienestar", l2: "Suplementos y Nutrición" },
  "NUTRICION": { l1: "Salud y Bienestar", l2: "Suplementos y Nutrición" },
  "SUPLEMENTO": { l1: "Salud y Bienestar", l2: "Suplementos y Nutrición" },
  "SUPLEMENTOS": { l1: "Salud y Bienestar", l2: "Suplementos y Nutrición" },
  "ENCAPSULADOS": { l1: "Salud y Bienestar", l2: "Suplementos y Nutrición" },
  "VAPORIZADORES": { l1: "Salud y Bienestar", l2: "Bienestar General" },
  "PODS": { l1: "Salud y Bienestar", l2: "Bienestar General" },

  // Adultos
  "SEX SHOP": { l1: "Productos para Adultos", l2: "Bienestar Sexual" },
  "SEXSHOP": { l1: "Productos para Adultos", l2: "Bienestar Sexual" },
  "SALUD SEXUAL": { l1: "Productos para Adultos", l2: "Bienestar Sexual" },
  "BIENESTAR SEXUAL": { l1: "Productos para Adultos", l2: "Bienestar Sexual" },
  "COSMETOLOGIA EROTICA": { l1: "Productos para Adultos", l2: "Bienestar Sexual" },
  "LUBRICANTES": { l1: "Productos para Adultos", l2: "Bienestar Sexual" },
  "ACEITES PARA MASAJES": { l1: "Productos para Adultos", l2: "Bienestar Sexual" },
  "ADULTO": { l1: "Productos para Adultos", l2: "Bienestar Sexual" },
  "ADULTOS": { l1: "Productos para Adultos", l2: "Bienestar Sexual" },

  // Moda / Calzado
  "MODA": { l1: "Moda y Calzado", l2: "Moda General" },
  "MODA Y ACCESORIOS": { l1: "Moda y Calzado", l2: "Bolsos y Accesorios" },
  "ROPA": { l1: "Moda y Calzado", l2: "Prendas de Vestir" },
  "CALZADO": { l1: "Moda y Calzado", l2: "Calzado y Zapatos" },
  "ZAPATOS": { l1: "Moda y Calzado", l2: "Calzado y Zapatos" },
  "TENIS": { l1: "Moda y Calzado", l2: "Calzado y Zapatos" },
  "TENIS NACIONALES": { l1: "Moda y Calzado", l2: "Calzado y Zapatos" },
  "SANDALIAS": { l1: "Moda y Calzado", l2: "Calzado y Zapatos" },
  "MOCASINES": { l1: "Moda y Calzado", l2: "Calzado y Zapatos" },
  "BOTINES": { l1: "Moda y Calzado", l2: "Calzado y Zapatos" },
  "ZAPATOS CASUALES MUJER": { l1: "Moda y Calzado", l2: "Calzado y Zapatos" },
  "CASUAL": { l1: "Moda y Calzado", l2: "Prendas de Vestir" },
  "MUJER": { l1: "Moda y Calzado", l2: "Ropa Femenina" },
  "ACCESORIOS DAMA": { l1: "Moda y Calzado", l2: "Bolsos y Accesorios" },
  "DAMA": { l1: "Moda y Calzado", l2: "Ropa Femenina" },
  "CABALLERO": { l1: "Moda y Calzado", l2: "Ropa Masculina" },
  "BOLSOS": { l1: "Moda y Calzado", l2: "Bolsos y Accesorios" },
  "BOLSOS MORRALES": { l1: "Moda y Calzado", l2: "Bolsos y Accesorios" },
  "BISUTERIA": { l1: "Moda y Calzado", l2: "Bisutería y Joyería" },
  "BISTURERIA": { l1: "Moda y Calzado", l2: "Bisutería y Joyería", alert: "typo", suggestedFix: "BISUTERIA" },
  "BISUTERIA Y JOYERIA": { l1: "Moda y Calzado", l2: "Bisutería y Joyería" },
  "JOYERIA": { l1: "Moda y Calzado", l2: "Bisutería y Joyería" },

  // Bebes / Niños / Juguetes
  "BEBES": { l1: "Juguetes y Bebés", l2: "Accesorios y Cuidado Infantil" },
  "BEBE": { l1: "Juguetes y Bebés", l2: "Accesorios y Cuidado Infantil" },
  "BEBES Y NINOS": { l1: "Juguetes y Bebés", l2: "Accesorios y Cuidado Infantil" },
  "NINOS": { l1: "Juguetes y Bebés", l2: "Accesorios y Cuidado Infantil" },
  "MUNDO INFANTIL": { l1: "Juguetes y Bebés", l2: "Accesorios y Cuidado Infantil" },
  "INFANTIL": { l1: "Juguetes y Bebés", l2: "Accesorios y Cuidado Infantil" },
  "INFANTIL Y BEBES": { l1: "Juguetes y Bebés", l2: "Accesorios y Cuidado Infantil" },
  "INFANTILES": { l1: "Juguetes y Bebés", l2: "Accesorios y Cuidado Infantil" },
  "JUGUETES": { l1: "Juguetes y Bebés", l2: "Juguetes y Juegos" },
  "JUGUETERIA": { l1: "Juguetes y Bebés", l2: "Juguetes y Juegos" },
  "JUGUETES NINOS": { l1: "Juguetes y Bebés", l2: "Juguetes y Juegos" },
  "JUGUETE": { l1: "Juguetes y Bebés", l2: "Juguetes y Juegos" },
  "JUGUETES Y ENTRETENIMIENTO": { l1: "Juguetes y Bebés", l2: "Juguetes y Juegos" },
  "JUEGOS": { l1: "Juguetes y Bebés", l2: "Juguetes y Juegos" },

  // Deportes / Outdoor
  "DEPORTES": { l1: "Deportes y Outdoor", l2: "Deportes General" },
  "DEPORTE": { l1: "Deportes y Outdoor", l2: "Deportes General" },
  "DEPORTE Y FITNESS": { l1: "Deportes y Outdoor", l2: "Equipos Fitness" },
  "FITNESS": { l1: "Deportes y Outdoor", l2: "Equipos Fitness" },
  "FITENSS": { l1: "Deportes y Outdoor", l2: "Equipos Fitness", alert: "typo", suggestedFix: "FITNESS" },
  "DEPORTIVO": { l1: "Deportes y Outdoor", l2: "Deportes General" },
  "CAMPING": { l1: "Deportes y Outdoor", l2: "Camping y Pesca" },
  "PESCA": { l1: "Deportes y Outdoor", l2: "Camping y Pesca" },

  // Automotriz
  "VEHICULOS": { l1: "Ferretería y Herramientas", l2: "Automotriz y Accesorios" },
  "VEHICULO": { l1: "Ferretería y Herramientas", l2: "Automotriz y Accesorios" },
  "AUTOMOVIL": { l1: "Ferretería y Herramientas", l2: "Automotriz y Accesorios" },
  "AUTOMOVILES": { l1: "Ferretería y Herramientas", l2: "Automotriz y Accesorios" },
  "AUTOMOTRIZ": { l1: "Ferretería y Herramientas", l2: "Automotriz y Accesorios" },
  "ACCESORIOS PARA AUTOS": { l1: "Ferretería y Herramientas", l2: "Automotriz y Accesorios" },
  "ACCESORIOS DE CARROS": { l1: "Ferretería y Herramientas", l2: "Automotriz y Accesorios" },
  "ACCESORIOS PARA VEHICULOS": { l1: "Ferretería y Herramientas", l2: "Automotriz y Accesorios" },
  "ACCESORIOS PARA VEHICULOS CARRO MOTO BICICLETA": { l1: "Ferretería y Herramientas", l2: "Automotriz y Accesorios" },
  "MOTOS": { l1: "Ferretería y Herramientas", l2: "Automotriz y Accesorios" },

  // Ferreteria / Herramientas
  "FERRETERIA": { l1: "Ferretería y Herramientas", l2: "Ferretería General" },
  "FERRETERIA Y CACHARRO": { l1: "Ferretería y Herramientas", l2: "Ferretería General" },
  "HERRAMIENTAS": { l1: "Ferretería y Herramientas", l2: "Herramientas Manuales/Eléctricas" },
  "BRICOLAJE Y HERRAMIENTAS": { l1: "Ferretería y Herramientas", l2: "Herramientas Manuales/Eléctricas" },

  // Otros / Oficina
  "PAPELERIA Y OFICINA": { l1: "Otras Categorías", l2: "Papelería y Oficina" },
  "PAPELERIA": { l1: "Otras Categorías", l2: "Papelería y Oficina" },
  "OFICINA Y PAPELERIA": { l1: "Otras Categorías", l2: "Papelería y Oficina" },
  "LIBROS": { l1: "Otras Categorías", l2: "Libros" },
  "ARTE": { l1: "Otras Categorías", l2: "Arte y Artesanías" },
  "ARTE Y ARTESANIA": { l1: "Otras Categorías", l2: "Arte y Artesanías" },
  "ARTESANIAS": { l1: "Otras Categorías", l2: "Arte y Artesanías" },

  // Basura / Sin Categoria / General
  "Sin Categoria": { l1: "Otras Categorías", l2: "Sin Categorizar", alert: "trash" },
  "OTRO": { l1: "Otras Categorías", l2: "Sin Categorizar", alert: "trash" },
  "OTROS": { l1: "Otras Categorías", l2: "Sin Categorizar", alert: "trash" },
  "OTRA": { l1: "Otras Categorías", l2: "Sin Categorizar", alert: "trash" },
  "GENERAL": { l1: "Otras Categorías", l2: "Sin Categorizar", alert: "trash" },
  "NOVEDADES": { l1: "Otras Categorías", l2: "Sin Categorizar", alert: "trash" },
  "MARIKADITAS": { l1: "Otras Categorías", l2: "Sin Categorizar", alert: "trash" },

  // Campañas / Temporales
  "BLACK SALES": { l1: "Otras Categorías", l2: "Campaña Temporal", alert: "campaign" },
  "DROPI LOVE": { l1: "Otras Categorías", l2: "Campaña Temporal", alert: "campaign" },
  "TELEVENTAS": { l1: "Otras Categorías", l2: "Campaña Temporal", alert: "campaign" },
  "IMPORTADOS": { l1: "Otras Categorías", l2: "Campaña Temporal", alert: "campaign" },
  "BLACK FRIDAY": { l1: "Otras Categorías", l2: "Campaña Temporal", alert: "campaign" },
  "COINNECTA": { l1: "Otras Categorías", l2: "Campaña Temporal", alert: "campaign" },
  "DROPI IMPULSA": { l1: "Otras Categorías", l2: "Campaña Temporal", alert: "campaign" },
  "REMATE DE SALDOS": { l1: "Otras Categorías", l2: "Campaña Temporal", alert: "campaign" },
  "REYES MAGOS": { l1: "Otras Categorías", l2: "Campaña Temporal", alert: "campaign" },
  "TIENDA DEL NINJA": { l1: "Otras Categorías", l2: "Campaña Temporal", alert: "campaign" },
};

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
): { coords: Record<string, Coord>; columns: string[][] } => {
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
  const [activeResourceTab, setActiveResourceTab] = useState<"diagnostico" | "meli" | "docs">("diagnostico");

  // Dropi Data States
  const [dropiRawCategories, setDropiRawCategories] = useState<DropiCategoryRaw[]>([]);
  const [selectedDropiCat, setSelectedDropiCat] = useState<string | null>(null);

  // Meli Data States
  const [categories, setCategories] = useState<CategoryMap>({});
  const [roots, setRoots] = useState<string[]>([]);
  const [childrenMap, setChildrenMap] = useState<Record<string, string[]>>({});
  const [meliLoading, setMeliLoading] = useState(true);

  // Meli Navigation States
  const [activeMeliTab, setActiveMeliTab] = useState<"columns" | "graph">("graph");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [activePath, setActivePath] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Graph Viewer States
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [transform, setTransform] = useState({ x: 50, y: 50, scale: 0.65 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "roots">("all");

  const columnsContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Load Dropi Categories
  useEffect(() => {
    fetch("/data/dropi_categories.json")
      .then((res) => res.json())
      .then((data: DropiCategoryRaw[]) => {
        setDropiRawCategories(data);
        if (data.length > 0) {
          setSelectedDropiCat(data[0].name);
        }
      })
      .catch((err) => console.error("Error loading Dropi categories", err));
  }, []);

  // Load Meli Categories
  useEffect(() => {
    fetch("/data/meli_categories_mco.json")
      .then((res) => res.json())
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

        tempRoots.sort((a, b) => data[a].n.localeCompare(data[b].n));
        Object.keys(tempChildren).forEach((parentId) => {
          tempChildren[parentId].sort((a, b) => data[a].n.localeCompare(data[b].n));
        });

        setRoots(tempRoots);
        setChildrenMap(tempChildren);
        setMeliLoading(false);
      })
      .catch((err) => {
        console.error("Error loading Meli categories", err);
        setMeliLoading(false);
      });
  }, []);

  // Meli Live Search Suggestions
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

  // Miller columns scroll
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

  const handleSelectNode = (id: string) => {
    setSelectedCategory(id);
    const pathObj = getBreadcrumbPath(id);
    const pathIds = pathObj.map((p) => p.id);
    setActivePath(pathIds);

    const newExpanded = new Set(expandedNodes);
    for (let i = 0; i < pathIds.length - 1; i++) {
      newExpanded.add(pathIds[i]);
    }
    setExpandedNodes(newExpanded);

    const { coords } = computeLayout(categories, roots, childrenMap, newExpanded);
    const targetCoord = coords[id];
    if (targetCoord) {
      const scale = 0.7;
      setTransform({
        x: 380 - targetCoord.x * scale,
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

  // Zoom / Pan helpers
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

  const { coords } = meliLoading ? { coords: {} as Record<string, Coord> } : computeLayout(categories, roots, childrenMap, expandedNodes);
  const totalVisibleNodes = Object.keys(coords).length;

  // --- STATS CALCULATIONS FOR DROPI ---
  const totalOrders = dropiRawCategories.reduce((sum, c) => sum + c.orders, 0);
  const totalRawCount = dropiRawCategories.length;

  // 1. Typos Calculations
  const typoCategories = dropiRawCategories.filter((c) => {
    const map = DROPI_MAPPING_DICT[c.name];
    return map?.alert === "typo";
  });
  const totalTypoOrders = typoCategories.reduce((sum, c) => sum + c.orders, 0);

  // 2. Campaign Pollution
  const campaignCategories = dropiRawCategories.filter((c) => {
    const map = DROPI_MAPPING_DICT[c.name];
    return map?.alert === "campaign";
  });
  const totalCampaignOrders = campaignCategories.reduce((sum, c) => sum + c.orders, 0);

  // 3. Trash Categories
  const trashCategories = dropiRawCategories.filter((c) => {
    const map = DROPI_MAPPING_DICT[c.name];
    return map?.alert === "trash";
  });
  const totalTrashOrders = trashCategories.reduce((sum, c) => sum + c.orders, 0);

  // Grouped Redundancies list
  const redundancyGroups = [
    {
      title: "Salud, Bienestar y Nutrición",
      items: ["SALUD", "BIENESTAR", "BIENESTAR Y SALUD", "SALUD Y BIENESTAR", "SALUD BIENESTAR NATURAL", "CUIDADO PERSONAL", "SALUD Y CUIDADO PERSONAL", "SALUD NUTRICION", "NUTRICION", "SUPLEMENTO", "SUPLEMENTOS", "ENCAPSULADOS"],
    },
    {
      title: "Productos para Adultos (Sexshop)",
      items: ["SEX SHOP", "SEXSHOP", "SALUD SEXUAL", "BIENESTAR SEXUAL", "COSMETOLOGIA EROTICA", "LUBRICANTES", "ACEITES PARA MASAJES", "ADULTO", "ADULTOS"],
    },
    {
      title: "Tecnología y Electrónica",
      items: ["TECNOLOGIA", "TEGNOLOGIA", "TECNOLOGIA Y ELECTRONICA", "ELECTRONICA Y TECNOLOGIA", "ELECTRONICA", "ELECTRONICOS", "GADGETS", "GATGETS", "VIDEOJUEGOS"],
    },
    {
      title: "Moda, Calzado y Vestir",
      items: ["MODA", "MODA Y ACCESORIOS", "ROPA", "CALZADO", "ZAPATOS", "TENIS", "TENIS NACIONALES", "SANDALIAS", "MOCASINES", "BOTINES", "ZAPATOS CASUALES MUJER", "CASUAL", "MUJER", "ACCESORIOS DAMA", "DAMA", "CABALLERO", "BOLSOS", "BOLSOS MORRALES", "BISUTERIA", "BISTURERIA", "BISUTERIA Y JOYERIA", "JOYERIA"],
    },
    {
      title: "Bebés, Niños y Juguetería",
      items: ["BEBES", "BEBE", "BEBES Y NINOS", "NINOS", "MUNDO INFANTIL", "INFANTIL", "INFANTIL Y BEBES", "INFANTILES", "JUGUETES", "JUGUETERIA", "JUGUETES NINOS", "JUGUETE", "JUGUETES Y ENTRETENIMIENTO", "JUEGOS"],
    },
  ];


  // --- RENDERING HELPERS FOR SECTIONS ---
  const renderDiagnostico = () => {
    return (
          <div className="space-y-8 animate-fade-in">
            {/* Metric Grid cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-2xl border shadow-2xs" style={{ borderColor: "var(--border)" }}>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Órdenes Auditadas</span>
                <span className="text-2xl font-extrabold text-gray-950">{(105373281).toLocaleString()}</span>
                <p className="text-[10px] text-gray-500 mt-2">Suma total de órdenes efectivas registradas.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border shadow-2xs" style={{ borderColor: "var(--border)" }}>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Etiquetas Creadas (Planos)</span>
                <span className="text-2xl font-extrabold text-gray-950">{totalRawCount}</span>
                <span className="ml-2 px-2 py-0.5 rounded text-[10px] bg-red-50 text-red-600 font-bold border border-red-100">Sin Jerarquía</span>
                <p className="text-[10px] text-gray-500 mt-2">Categorías planas en la base de datos.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border shadow-2xs" style={{ borderColor: "var(--border)" }}>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Órdenes en Categorías "Basura"</span>
                <span className="text-2xl font-extrabold text-red-600">{totalTrashOrders.toLocaleString()}</span>
                <span className="text-[11px] text-gray-400 block mt-1">({((totalTrashOrders / totalOrders) * 100).toFixed(1)}% del volumen total)</span>
                <p className="text-[10px] text-gray-500 mt-1">Órdenes atascadas en `Sin Categoria`, `OTRO`, etc.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border shadow-2xs" style={{ borderColor: "var(--border)" }}>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Órdenes Afectadas por Errores</span>
                <span className="text-2xl font-extrabold text-amber-600">{totalTypoOrders.toLocaleString()}</span>
                <span className="text-[11px] text-gray-400 block mt-1">({((totalTypoOrders / totalOrders) * 100).toFixed(2)}% del volumen total)</span>
                <p className="text-[10px] text-gray-500 mt-1">Órdenes en categorías mal escritas (ej. `TEGNOLOGIA`).</p>
              </div>
            </div>

            {/* In-depth Audit sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Box A: Redundancia y Duplicación de Categorías */}
              <div className="bg-white border rounded-2xl p-6 shadow-2xs flex flex-col" style={{ borderColor: "var(--border)" }}>
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-gray-900">
                    Spaghetti Categorization: Grupos Redundantes
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Al no existir jerarquías, los suppliers crean variantes para el mismo concepto. Expande los grupos para ver cómo se divide el volumen de órdenes de venta:
                  </p>
                </div>

                <div className="flex-1 space-y-3">
                  {redundancyGroups.map((group, gIdx) => {
                    // Calculate total orders in group
                    const groupItemsData = dropiRawCategories.filter((c) => group.items.includes(c.name));
                    const groupOrdersSum = groupItemsData.reduce((sum, c) => sum + c.orders, 0);

                    return (
                      <details key={gIdx} className="group border rounded-xl overflow-hidden transition-all" style={{ borderColor: "var(--border)" }}>
                        <summary className="w-full bg-slate-50 px-4 py-3 flex items-center justify-between cursor-pointer focus:outline-none select-none">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-900">{group.title}</span>
                            <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full text-[8px] font-bold">
                              {group.items.length} tags
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-950">{groupOrdersSum.toLocaleString()} órdenes</span>
                            <span className="text-xs text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                          </div>
                        </summary>
                        <div className="p-3 border-t bg-white space-y-1" style={{ borderColor: "var(--border)" }}>
                          {groupItemsData.sort((a,b)=>b.orders-a.orders).map((item) => (
                            <div key={item.name} className="flex justify-between items-center text-xs py-1 px-2 hover:bg-slate-50 rounded">
                              <span className="font-mono text-gray-700">{item.name}</span>
                              <span className="text-gray-500 font-semibold">{item.orders.toLocaleString()} órdenes ({((item.orders/groupOrdersSum)*100).toFixed(1)}%)</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    );
                  })}
                </div>
              </div>

              {/* Box B: Errores de Escritura (Typos) y Categorías Basura */}
              <div className="space-y-6">
                
                {/* 1. Errores Ortográficos (Typos) */}
                <div className="bg-white border rounded-2xl p-6 shadow-2xs" style={{ borderColor: "var(--border)" }}>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">
                    Errores de Escritura Críticos
                  </h3>
                  <div className="space-y-2">
                    {typoCategories.map((c) => {
                      const fix = DROPI_MAPPING_DICT[c.name]?.suggestedFix;
                      return (
                        <div key={c.name} className="border border-slate-100 bg-amber-50/20 rounded-xl p-3 flex justify-between items-center text-xs" style={{ borderColor: "var(--border)" }}>
                          <div>
                            <span className="font-mono text-red-600 font-bold line-through mr-2">{c.name}</span>
                            <span className="text-gray-400 mr-2">➔</span>
                            <span className="font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{fix}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-slate-800">{c.orders.toLocaleString()} órdenes</span>
                            <span className="text-[10px] text-gray-400 block">comprometidas</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Contaminación por Campañas Temporales */}
                <div className="bg-white border rounded-2xl p-6 shadow-2xs" style={{ borderColor: "var(--border)" }}>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-gray-900">
                      Contaminación por Campañas
                    </h3>
                    <span className="bg-slate-100 text-slate-500 border text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ borderColor: "var(--border)" }}>
                      Total: {totalCampaignOrders.toLocaleString()} órdenes
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                    Etiquetas de eventos comerciales temporales creadas como categorías principales que se quedan permanentemente, fragmentando el catálogo:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {campaignCategories.map((c) => (
                      <span key={c.name} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-100">
                        📁 {c.name} ({c.orders.toLocaleString()} ord)
                      </span>
                    ))}
                  </div>
                </div>

                {/* 3. Categorías Basura / Sin Clasificar */}
                <div className="bg-white border rounded-2xl p-6 shadow-2xs" style={{ borderColor: "var(--border)" }}>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-gray-900">
                      Falta de Foco: El Agujero Negro "Basura"
                    </h3>
                    <span className="bg-red-50 text-red-600 border border-red-100 text-[9px] font-bold px-2 py-0.5 rounded-full">
                      Total: {totalTrashOrders.toLocaleString()} órdenes
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                    Órdenes efectivas que se van a categorías genéricas sin semántica, destruyendo la posibilidad de búsqueda y recomendaciones:
                  </p>
                  <div className="space-y-2">
                    {trashCategories.map((c) => (
                      <div key={c.name} className="flex justify-between items-center text-xs px-2 py-1.5 bg-slate-50 rounded">
                        <span className="font-mono text-gray-600 font-bold">{c.name}</span>
                        <span className="text-gray-500 font-semibold">{c.orders.toLocaleString()} órdenes</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* List Table of all Raw Categories */}
            <div className="bg-white border rounded-2xl p-6 shadow-2xs" style={{ borderColor: "var(--border)" }}>
              <h3 className="text-sm font-bold text-gray-900 mb-4">
                Listado Completo de Categorías Planas Registradas
              </h3>
              <div className="max-h-80 overflow-y-auto pr-1 scrollbar-thin border rounded-xl" style={{ borderColor: "var(--border)" }}>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b font-bold text-gray-500" style={{ borderColor: "var(--border)" }}>
                      <th className="p-3">Categoría Raw</th>
                      <th className="p-3">Órdenes Efectivas</th>
                      <th className="p-3">Clasificación / Diagnóstico</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dropiRawCategories.map((c) => {
                      const mapping = DROPI_MAPPING_DICT[c.name];
                      return (
                        <tr key={c.name} className="border-b hover:bg-slate-50" style={{ borderColor: "var(--border)" }}>
                          <td className="p-3 font-mono font-bold text-gray-800">{c.name}</td>
                          <td className="p-3 font-semibold text-gray-900">{c.orders.toLocaleString()}</td>
                          <td className="p-3">
                            {mapping?.alert === "typo" && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                Typo (Corrección: {mapping.suggestedFix})
                              </span>
                            )}
                            {mapping?.alert === "campaign" && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                Campaña Temporal
                              </span>
                            )}
                            {mapping?.alert === "trash" && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                                Sin Foco / Basura
                              </span>
                            )}
                            {!mapping?.alert && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Correcta
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

    );
  };

  const renderHomologacion = () => {
    return (
          <div className="space-y-6 animate-fade-in">
            {/* Header info */}
            <div className="bg-white border rounded-2xl p-6 shadow-2xs" style={{ borderColor: "var(--border)" }}>
              <h2 className="text-base font-bold text-gray-900 mb-2">Simulador de Mapeo a Taxonomía Unificada</h2>
              <p className="text-xs text-gray-500 leading-relaxed max-w-4xl">
                Esta herramienta muestra cómo se corrigen, unifican y estructuran jerárquicamente las categorías planas de Dropi. Selecciona cualquier categoría fragmentada de la lista para ver su destino en la nueva arquitectura.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Left Column: Dropi Raw List Selector */}
              <div className="bg-white border rounded-2xl p-6 shadow-2xs flex flex-col max-h-[500px]" style={{ borderColor: "var(--border)" }}>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Categorías en Base de Datos</h3>
                <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                  {dropiRawCategories.map((c) => {
                    const isSelected = selectedDropiCat === c.name;
                    const map = DROPI_MAPPING_DICT[c.name];

                    return (
                      <button
                        key={c.name}
                        onClick={() => setSelectedDropiCat(c.name)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between border transition-all ${
                          isSelected
                            ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                            : "hover:bg-slate-50 border-transparent text-gray-700"
                        }`}
                      >
                        <span className="font-mono">{c.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] ${isSelected ? "text-orange-100" : "text-gray-400"}`}>
                            {c.orders.toLocaleString()}
                          </span>
                          {map?.alert && (
                            <span className="text-[10px] font-bold">
                              {map.alert === "typo" && "⚠️"}
                              {map.alert === "campaign" && "📅"}
                              {map.alert === "trash" && "🗑️"}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Middle & Right Columns: Homologation detail comparison */}
              <div className="lg:col-span-2 space-y-6">
                {selectedDropiCat && DROPI_MAPPING_DICT[selectedDropiCat] ? (
                  <div className="bg-white border rounded-2xl p-6 shadow-2xs space-y-6" style={{ borderColor: "var(--border)" }}>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mapeo del Nodo</h3>

                    {/* Side-by-Side Comparison visual */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      {/* Raw Category */}
                      <div className="bg-slate-50 border rounded-2xl p-5 text-center flex flex-col justify-center min-h-[140px]" style={{ borderColor: "var(--border)" }}>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Estado Fragmentado Actual</span>
                        <span className="font-mono text-base font-extrabold text-red-600">{selectedDropiCat}</span>
                        <span className="text-xs text-gray-500 mt-2 font-semibold">
                          {(dropiRawCategories.find(c=>c.name===selectedDropiCat)?.orders || 0).toLocaleString()} órdenes efectivas
                        </span>
                      </div>

                      {/* Unified Target Category */}
                      <div className="bg-orange-500/5 border border-orange-500/25 rounded-2xl p-5 text-center flex flex-col justify-center min-h-[140px]">
                        <span className="text-[9px] font-bold text-orange-600 uppercase tracking-widest block mb-2">Propuesta de Taxonomía Limpia</span>
                        <div className="space-y-1.5">
                          <span className="block text-sm font-extrabold text-orange-700">
                            {DROPI_MAPPING_DICT[selectedDropiCat].l1}
                          </span>
                          <span className="text-xs text-gray-400 block">⬇</span>
                          <span className="inline-block bg-white text-orange-600 border border-orange-200 px-3 py-1 rounded-lg text-xs font-bold shadow-2xs">
                            {DROPI_MAPPING_DICT[selectedDropiCat].l2}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Alertas y Explicación PM */}
                    <div className="border-t pt-5 space-y-4" style={{ borderColor: "var(--border)" }}>
                      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Acción y Diagnóstico de Célula</h4>

                      {DROPI_MAPPING_DICT[selectedDropiCat].alert === "typo" && (
                        <div className="bg-amber-50 text-amber-800 border border-amber-200/60 p-4 rounded-xl text-xs space-y-2">
                          <span className="font-bold flex items-center gap-1.5">⚠️ Error Ortográfico (Typo) Detectado</span>
                          <p className="leading-relaxed text-amber-700">
                            La categoría <span className="font-bold font-mono">{selectedDropiCat}</span> fue creada con errores de ortografía. Al homologar a la taxonomía unificada, los productos se corrigen automáticamente a la categoría principal <span className="font-bold text-emerald-700">"{DROPI_MAPPING_DICT[selectedDropiCat].l1}"</span>.
                          </p>
                          <p className="font-bold">
                            Acción Recomendada: Redirigir y corregir mediante query Levenshtein en base de datos.
                          </p>
                        </div>
                      )}

                      {DROPI_MAPPING_DICT[selectedDropiCat].alert === "campaign" && (
                        <div className="bg-purple-50 text-purple-800 border border-purple-200/60 p-4 rounded-xl text-xs space-y-2">
                          <span className="font-bold flex items-center gap-1.5">📅 Categoría de Campaña Comercial Temporal</span>
                          <p className="leading-relaxed text-purple-700">
                            La categoría <span className="font-bold font-mono">{selectedDropiCat}</span> corresponde a una campaña promocional temporal (ej. ofertas especiales). No pertenece al catálogo permanente y debe reubicarse en <span className="font-bold text-orange-700">"{DROPI_MAPPING_DICT[selectedDropiCat].l1}"</span> bajo la etiqueta temporal correspondiente para evitar ruido estructural.
                          </p>
                          <p className="font-bold">
                            Acción Recomendada: Separar lógicas. Las campañas se operan mediante Tags/Showcases dinámicos, no creando registros en la tabla de categorías fijas.
                          </p>
                        </div>
                      )}

                      {DROPI_MAPPING_DICT[selectedDropiCat].alert === "trash" && (
                        <div className="bg-red-50 text-red-800 border border-red-200/60 p-4 rounded-xl text-xs space-y-2">
                          <span className="font-bold flex items-center gap-1.5">🗑️ Categoría "Basura" / Sin Semántica</span>
                          <p className="leading-relaxed text-red-700">
                            La categoría <span className="font-bold font-mono">{selectedDropiCat}</span> es un agujero negro de datos. Los productos asignados aquí pierden indexación semántica y no se pueden recomendar. Deben reclasificarse analizando sus títulos con LLMs para asignarlos a las categorías correctas.
                          </p>
                          <p className="font-bold">
                            Acción Recomendada: Pipeline de enriquecimiento de catálogo asistido por IA (CAT-001) para reasignar automáticamente los productos a las 9 categorías base.
                          </p>
                        </div>
                      )}

                      {!DROPI_MAPPING_DICT[selectedDropiCat].alert && (
                        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200/60 p-4 rounded-xl text-xs space-y-2">
                          <span className="font-bold flex items-center gap-1.5">✅ Categoría Correcta</span>
                          <p className="leading-relaxed text-emerald-700">
                            La categoría <span className="font-bold font-mono">{selectedDropiCat}</span> es válida. Su homologación asigna los productos al nodo estándar del árbol de Dropi para construir la estructura jerárquica permanente (Level 1 y Level 2).
                          </p>
                          <p className="font-bold">
                            Acción Recomendada: Estructurar como subcategoría del nodo "{DROPI_MAPPING_DICT[selectedDropiCat].l1}".
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white border border-dashed rounded-2xl text-gray-400 text-xs">
                    Selecciona una categoría plana de la izquierda para ver su simulación de homologación.
                  </div>
                )}
              </div>
            </div>
          </div>

    );
  };

  const renderMeli = () => {
    return (
          <div className="space-y-6 animate-fade-in">
            {/* Context Info */}
            <div className="bg-white border rounded-2xl p-6 shadow-2xs" style={{ borderColor: "var(--border)" }}>
              <h2 className="text-base font-bold text-gray-900 mb-2">Referencia de la Industria: Mercado Libre</h2>
              <p className="text-xs text-gray-500 leading-relaxed max-w-4xl">
                Esta sección es un espacio de investigación para analizar cómo Mercado Libre Colombia (MCO) estructura jerárquicamente su taxonomía de 12,172 categorías para evitar la fragmentación. Úsala como marco de referencia para diseñar las subcategorías de Dropi.
              </p>
            </div>

            {/* Selector Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-fit border shadow-2xs" style={{ borderColor: "var(--border)" }}>
              <button
                onClick={() => setActiveMeliTab("graph")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeMeliTab === "graph"
                    ? "bg-white text-orange-600 shadow-2xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                🕸️ Grafo Interactivo (Árbol)
              </button>
              <button
                onClick={() => setActiveMeliTab("columns")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeMeliTab === "columns"
                    ? "bg-white text-orange-600 shadow-2xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                📁 Visor de Columnas (Miller Columns)
              </button>
            </div>

            {/* MILLER COLUMNS VIEW */}
            {activeMeliTab === "columns" && (
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

                {meliLoading && <div className="text-center py-20 text-gray-500">Cargando taxonomía...</div>}

                {/* Breadcrumb Path */}
                {!meliLoading && (
                  <div className="bg-slate-50 border rounded-xl p-4 mb-4 flex items-center flex-wrap gap-2 text-xs font-bold" style={{ borderColor: "var(--border)" }}>
                    <span className="text-gray-400 uppercase text-[9px] tracking-wider">Ruta ML:</span>
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
                {!meliLoading && (
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

            {/* VISUAL NODE GRAPH VIEW */}
            {activeMeliTab === "graph" && (
              <div
                className={`border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 flex flex-col ${
                  isFullscreen ? "fixed inset-0 z-50 w-screen h-screen bg-white border-none" : "bg-white min-h-[680px]"
                }`}
                style={{ borderColor: "var(--border)" }}
              >
                {/* Graph Header Bar */}
                <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b z-10" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-3">
                    <span className="w-3.5 h-3.5 rounded-full bg-orange-50 animate-pulse border border-orange-200 text-orange-600 text-[10px] flex items-center justify-center font-bold">ML</span>
                    <div>
                      <h2 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        Meli Categories Graph <span className="text-[10px] font-bold bg-orange-50 border border-orange-200 text-orange-600 px-2 py-0.5 rounded-md">Colombia</span>
                      </h2>
                      <p className="text-[10px] text-gray-500">Benchmark ML: {totalVisibleNodes} nodos cargados</p>
                    </div>
                  </div>

                  {/* Top Graph Controls */}
                  <div className="flex items-center gap-4">
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
                              onClick={() => handleSelectFromSearch(id)}
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

                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="bg-white border hover:bg-slate-50 text-gray-700 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                      style={{ borderColor: "var(--border)" }}
                    >
                      {isFullscreen ? "🗗 Salir" : "🗖 Pantalla Completa"}
                    </button>
                  </div>
                </div>

                {/* Graph Viewport */}
                <div className="flex-1 flex min-h-0 relative bg-slate-50/30">
                  {/* Left panel details */}
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
                                Hoja Final
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
                  </div>

                  {/* SVG container */}
                  <div
                    className="flex-1 h-full relative outline-none select-none overflow-hidden"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                  >
                    {meliLoading ? (
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
                        <defs>
                          <pattern id="dot-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                            <circle cx="1.5" cy="1.5" r="1.2" fill="#cbd5e1" opacity="0.75" />
                          </pattern>
                        </defs>
                        <rect id="graph-background" width="100%" height="100%" fill="url(#dot-grid)" />

                        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
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

                          {Object.entries(coords).map(([id, coord]) => {
                            const info = categories[id];
                            if (!info) return null;

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

                    {/* HUD Controls */}
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

    );
  };
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
        {/* Title */}
        <div id="project-title-container" className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span id="project-code-badge" className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "#F5F3FF", color: "#7C3AED" }}>
              CAT-001
            </span>
            <span id="project-status-badge" className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "#FFFBEB", color: "#D97706" }}>
              Taxonomy Audit & Homologation Mapper
            </span>
          </div>
          <h1 id="project-main-title" className="text-3xl font-extrabold tracking-tight mb-2" style={{ color: "var(--fg)" }}>
            Taxonomía y Enriquecimiento de Categorías Dropi
          </h1>
          <p id="project-description-text" className="text-sm leading-relaxed max-w-3xl" style={{ color: "var(--muted)" }}>
            Auditoría de fragmentación de base de datos de Dropi (basada en {totalOrders.toLocaleString()} órdenes reales) y simulador de homologación a una jerarquía unificada.
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
              Recursos de Investigación y Documentación
            </span>
            <span id="accordion-project-reference" className="text-xs mr-4" style={{ color: "var(--muted)" }}>
              CAT-001 · Taxonomías e Histórico de Ventas
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
            <div id="accordion-content-panel" className="border-t bg-slate-50 flex flex-col" style={{ borderColor: "var(--border)" }}>
              {/* Inner Accordion Tab Navigation */}
              <div className="flex border-b border-slate-200 bg-white px-6 pt-3 gap-2" style={{ borderColor: "var(--border)" }}>
                <button
                  onClick={() => setActiveResourceTab("diagnostico")}
                  className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                    activeResourceTab === "diagnostico"
                      ? "border-orange-500 text-orange-600 font-extrabold"
                      : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <span>📊</span> Diagnóstico de Taxonomía Actual
                </button>
                <button
                  onClick={() => setActiveResourceTab("meli")}
                  className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                    activeResourceTab === "meli"
                      ? "border-orange-500 text-orange-600 font-extrabold"
                      : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <span>🕸️</span> Referencia: Mercado Libre
                </button>
                <button
                  onClick={() => setActiveResourceTab("docs")}
                  className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                    activeResourceTab === "docs"
                      ? "border-orange-500 text-orange-600 font-extrabold"
                      : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <span>📖</span> Documentos y Guías
                </button>
              </div>

              {/* Inner Tab Content */}
              <div className="p-6">
                {activeResourceTab === "docs" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div id="resource-card-taxonomy" className="bg-white border rounded-xl p-4 flex items-start gap-3 shadow-2xs" style={{ borderColor: "var(--border)" }}>
                      <span className="text-2xl">📖</span>
                      <div>
                        <div className="text-sm font-bold mb-1" style={{ color: "var(--fg)" }}>
                          Taxonomía Estándar
                        </div>
                        <div className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                          Propuesta para condensar más de 160 etiquetas planas de Dropi en 10 categorías jerárquicas limpias.
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
                          Algoritmos de detección automática de typos por similitud semántica y Levenshtein.
                        </div>
                      </div>
                    </div>
                    <div id="resource-card-backlog" className="bg-white border rounded-xl p-4 flex items-start gap-3 shadow-2xs" style={{ borderColor: "var(--border)" }}>
                      <span className="text-2xl">📋</span>
                      <div>
                        <div className="text-sm font-bold mb-1" style={{ color: "var(--fg)" }}>
                          Mercado Libre
                        </div>
                        <div className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                          Explorador completo de la taxonomía oficial de Mercado Libre Colombia (MCO) como benchmark de la industria.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeResourceTab === "diagnostico" && renderDiagnostico()}
                {activeResourceTab === "meli" && renderMeli()}
              </div>
            </div>
          )}
        </div>

        {/* Main Body content: Homologación Simulator directly */}
        <div className="mt-8">
          {renderHomologacion()}
        </div>
      </div>
    </main>
  );
}
