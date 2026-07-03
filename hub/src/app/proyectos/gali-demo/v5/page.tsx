"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { ArrowLeft, Building, Sliders, ArrowRight } from "lucide-react";
import { GALI_PRODUCTS_400 } from "./gali-products-400.mock";
import { SPY_WINNING_ADS, SpyWinningAd } from "./spy-winning-ads.mock";
import "./styles.scss";

// Interfaces
interface ChatMessage {
  sender: 'agent' | 'user';
  text: string;
  options?: string[];
  products?: ProductSuggestion[];
  showSpyRadar?: boolean;
  notFoundAd?: { ad: SpyWinningAd; etaDays: number };
}

interface ProductSuggestion {
  id: string;
  name: string;
  category: string;
  adaScore: number;
  margin: string;
  stock: string;
  provider: string;
  trendLabel: string;
  providerTier: 'Premium Exclusivo' | 'Premium' | 'Verificado';
}

interface Angulo {
  id: string;
  titulo: string;
  hook: string;
  guion: string;
}

interface GaliProject {
  id: string;
  nombre: string;
  estado: string;
  step_actual: string;
  producto_id?: string;
  producto_nombre?: string;
  costo_base?: number;
  precio_venta?: number;
  presupuesto_diario?: number;
  landing_titulo?: string;
  landing_subtitulo?: string;
  creative_script?: string;
  agentes?: {
    roax?: boolean;
    vigilante?: boolean;
    ada?: boolean;
    chatea?: boolean;
  };
}

const SIMULATED_PRODUCTS_BASES = GALI_PRODUCTS_400.map(p => ({
  name: p.nombre,
  category: p.categoria,
  cost: p.costo_base,
  flete: p.flete_base,
  price: p.precio_sugerido,
  description: p.descripcion,
  stock_qty: p.stock_qty,
  supplier_delivery_rate: p.supplier_delivery_rate,
  content_completeness_score: p.content_completeness_score,
  saturacion_pauta: p.saturacion_pauta,
  viral_score: p.viral_score,
  proveedor: p.proveedor,
  ada_score: p.ada_score
}));

const TRENDING_CATEGORIES = [
  { id: 'salud', label: 'Salud & Bienestar', emoji: '🌿' },
  { id: 'mascotas', label: 'Mascotas', emoji: '🐾' },
  { id: 'belleza', label: 'Belleza', emoji: '💄' },
  { id: 'tecnologia', label: 'Tecnología', emoji: '⚡' },
  { id: 'hogar', label: 'Hogar & Deco', emoji: '🏡' },
  { id: 'fitness', label: 'Fitness', emoji: '💪' },
  { id: 'ninos', label: 'Niños', emoji: '🧸' },
  { id: 'moda', label: 'Moda', emoji: '👗' },
];

export default function GaliV5PrototypePage() {
  // --- Estados de Navegación y Flujo ---
  const [step, setStep] = useState<'goal' | 'discovery' | 'select' | 'estrategia' | 'landing' | 'campana' | 'launch'>('goal');
  const [projectId, setProjectId] = useState<string>('');
  
  // --- Estados de Onboarding (Discovery) ---
  const [userInput, setUserInput] = useState<string>('');
  const [chatState, setChatState] = useState<number>(0); // 0: metodología, 1: detalle, 2: presupuesto, 3: fin
  const [chatMetodo, setChatMetodo] = useState<string>('');
  const [chatNicho, setChatNicho] = useState<string>('');
  const [chatQuery, setChatQuery] = useState<string>('');
  const [chatPresupuesto, setChatPresupuesto] = useState<string>('');
  const [chatPlataforma, setChatPlataforma] = useState<string>('');
  const [chatEstrategia, setChatEstrategia] = useState<string>('');
  const [isGeneratingAgent, setIsGeneratingAgent] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: 'agent',
      text: '¡Hola! Soy tu Gali (Community Lead y Mentor de Dropi). Estoy aquí para guiarte a cazar tu primer producto ganador sin quemar presupuesto en pauta. He analizado las campañas de los mejores dropshippers de la comunidad (como Juan Felipe, Cesar Ortegón y Nicolás Londoño). Para sugerirte las mejores opciones de nuestro catálogo de 1,000,000 de productos, cuéntame: ¿Qué enfoque o técnica prefieres utilizar hoy?',
      options: [
        'Buscar por Dolor/Problema (Método Juan Felipe) 🔍',
        'Buscar por Ganador Viral/Espionaje (Método Cesar Ortegón) 🏆',
        'Buscar por Nicho/Categoría (Método Nicolás Londoño) 🎯'
      ]
    }
  ]);

  // --- Estados del Catálogo (Elegir) ---
  const [products, setProducts] = useState<ProductSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<ProductSuggestion | null>(null);
  const [simulatedSearchStats, setSimulatedSearchStats] = useState<any>(null);

  // --- Estados del Radar de Anuncios Ganadores (método Espionaje) ---
  const [spyRadarCategoryFilter, setSpyRadarCategoryFilter] = useState<string>('');
  const [selectedWinningAd, setSelectedWinningAd] = useState<SpyWinningAd | null>(null);
  const [showNotifyToast, setShowNotifyToast] = useState<boolean>(false);

  // --- Estados del Analista IA ---
  const [analystInput, setAnalystInput] = useState<string>('');
  const [isGeneratingAnalyst, setIsGeneratingAnalyst] = useState<boolean>(false);
  const [analystMessages, setAnalystMessages] = useState<ChatMessage[]>([
    {
      sender: 'agent',
      text: '¡Hola! Como tu analista del catálogo de Dropi Colombia, estoy listo para comparar precios, fletes y ver qué proveedor despacha más rápido. ¿Qué te gustaría que analicemos de esta lista de productos?'
    }
  ]);

  // --- Modal Comparación ---
  const [comparisonModalOpen, setComparisonModalOpen] = useState<boolean>(false);
  const [comparisonProduct, setComparisonProduct] = useState<ProductSuggestion | null>(null);
  const [comparisonVariants, setComparisonVariants] = useState<any[]>([]);

  // --- Page Pilot MCP (Landing) ---
  const [pagePilotState, setPagePilotState] = useState<'idle' | 'generating' | 'deploying' | 'live'>('idle');
  const [pagePilotUrl, setPagePilotUrl] = useState<string>('');
  const [landingCvr, setLandingCvr] = useState<number>(0);
  const [selectedAngulo, setSelectedAngulo] = useState<Angulo | null>(null);

  // --- Campaña y Lanzamiento ---
  const [cogs, setCogs] = useState<number>(18000);
  const [fleteUnit, setFleteUnit] = useState<number>(7000);
  const [precioVenta, setPrecioVenta] = useState<number>(59000);
  const [budget, setBudget] = useState<number>(40000);
  const [pedidosTarget, setPedidosTarget] = useState<number>(15);
  const [projectName, setProjectName] = useState<string>('');
  const [agentesProyecto, setAgentesProyecto] = useState<Record<string, boolean>>({
    roax: true,
    vigilante: true,
    chatea: true,
    ada: true,
    kronos: false
  });
  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const [showConfirmLaunch, setShowConfirmLaunch] = useState<boolean>(false);
  const [showLaunchModal, setShowLaunchModal] = useState<boolean>(false);
  const [launchSuccess, setLaunchSuccess] = useState<boolean>(false);
  const [launchedProjectId, setLaunchedProjectId] = useState<string>('');
  const [showDraftToast, setShowDraftToast] = useState<boolean>(false);

  // Refs
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const analystChatBoxRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chats
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatMessages, isGeneratingAgent]);

  useEffect(() => {
    if (analystChatBoxRef.current) {
      analystChatBoxRef.current.scrollTop = analystChatBoxRef.current.scrollHeight;
    }
  }, [analystMessages, isGeneratingAnalyst]);

  // Cargar productos por defecto en el constructor
  useEffect(() => {
    const defaultProds = searchVirtualMillionCatalog({ limit: 12 });
    setProducts(defaultProds);
  }, []);

  // OpenAI live status check
  const isLiveOpenAi = () => {
    const key = localStorage.getItem('gali_openai_api_key');
    const live = localStorage.getItem('gali_openai_live_mode');
    return live === 'true' && !!key && key.startsWith('sk-');
  };

  // --- Lógica de Búsqueda Virtual de 1M de Productos ---
  const calculateMinStock = (dailyBudget: number): number => {
    const cpa = 15000;
    const tReabastecimiento = 15;
    const fEscala = 3;
    const calculated = (dailyBudget / cpa) * tReabastecimiento * fEscala;
    return Math.max(100, Math.round(calculated));
  };

  const searchVirtualMillionCatalog = (options: {
    query?: string;
    category?: string;
    dailyBudget?: number;
    limit?: number;
    plataforma?: string;
    estrategia?: string;
  }): ProductSuggestion[] => {
    const start = performance.now();
    const limit = options.limit || 20;
    const query = options.query?.trim().toLowerCase() || '';
    let category = options.category?.trim().toLowerCase() || '';

    // Normalización de categoría
    if (category === 'tecnologia') category = 'tecnología';
    if (category === 'ninos') category = 'niños';
    if (category === 'salud') category = 'salud';
    if (category === 'fitness') category = 'fitness';
    if (category === 'hogar') category = 'hogar';
    if (category === 'moda') category = 'moda';
    if (category === 'belleza') category = 'belleza';
    if (category === 'mascotas') category = 'mascotas';

    const budgetValue = options.dailyBudget || budget;
    const minStock = calculateMinStock(budgetValue);

    let totalCategoryMatch = 0;
    let totalStockMatch = 0;
    let totalSupplierMatch = 0;
    let totalQueryMatch = 0;

    const premiumMatches: ProductSuggestion[] = [];
    const verificadoMatches: ProductSuggestion[] = [];

    const TOTAL_PRODUCTS = 1000000;

    for (let i = 0; i < TOTAL_PRODUCTS; i++) {
      const baseIndex = i % SIMULATED_PRODUCTS_BASES.length;
      const baseProd = SIMULATED_PRODUCTS_BASES[baseIndex];

      let name = baseProd.name;
      if (i % 3 === 1) {
        name = name.replace(' (', ' Pro (');
      } else if (i % 3 === 2) {
        name = name.replace(' (', ' Premium (');
      }

      const lowerName = name.toLowerCase();
      const lowerDesc = baseProd.description.toLowerCase();
      const prodCategory = baseProd.category.toLowerCase();
      const provider = baseProd.proveedor;

      // 1. Filtrar por categoría
      if (category) {
        let isCatMatch = prodCategory.includes(category) || 
                          (category.includes('belleza') && prodCategory.includes('salud')) ||
                          (category.includes('salud') && prodCategory.includes('belleza')) ||
                          (category.includes('hogar') && prodCategory.includes('hogar')) ||
                          (prodCategory.includes(category.slice(0, 4)));

        // Bypass de categoría si coincide con el término de búsqueda
        if (query) {
          const words = query.split(/\s+/).filter(w => w.length > 2 && !['para', 'con', 'del', 'las', 'los', 'una', 'uno', 'por', 'los', 'les'].includes(w));
          let matchesQuery = false;
          if (words.length > 0) {
            matchesQuery = words.some(w => lowerName.includes(w) || lowerDesc.includes(w));
          }
          if (matchesQuery) {
            isCatMatch = true;
          }
        }

        if (!isCatMatch) continue;
      }
      totalCategoryMatch++;

      // 2. Filtrar por stock
      const stock = Math.max(0, baseProd.stock_qty + (i * 7) % 51 - 25);
      if (stock < minStock) continue;
      totalStockMatch++;

      // 3. Nivel del proveedor
      let tier: 'Premium Exclusivo' | 'Premium' | 'Verificado' | 'Estándar' = 'Verificado';
      const provLower = provider.toLowerCase();
      if (provLower.includes('aroma') || provLower.includes('techpet') || provLower.includes('meditech')) {
        tier = 'Premium Exclusivo';
      } else if (provLower.includes('beauty') || provLower.includes('mundo') || provLower.includes('kitchen')) {
        tier = 'Premium';
      } else if (provLower.includes('novedades') || provLower.includes('mayorista')) {
        tier = 'Estándar';
      }

      if (tier === 'Estándar') continue;

      if (options.estrategia === 'joyas_ocultas' && baseProd.saturacion_pauta === 'Alto') {
        continue;
      }
      totalSupplierMatch++;

      // 4. Filtrar por consulta de búsqueda (query)
      if (query) {
        const words = query.split(/\s+/).filter(w => w.length > 2 && !['para', 'con', 'del', 'las', 'los', 'una', 'uno', 'por', 'los', 'les'].includes(w));
        let matchesQuery = false;
        if (words.length > 0) {
          matchesQuery = words.some(w => lowerName.includes(w) || lowerDesc.includes(w) || provider.toLowerCase().includes(w));
        } else {
          matchesQuery = lowerName.includes(query) || lowerDesc.includes(query);
        }

        // Mapeo semántico fallback
        if (!matchesQuery) {
          if ((query.includes('espalda') || query.includes('postura') || query.includes('lumbar') || query.includes('dolor')) && 
              (lowerName.includes('corrector') || lowerName.includes('postura') || lowerName.includes('masajeador') || lowerName.includes('percusión'))) {
            matchesQuery = true;
          } else if ((query.includes('ejercicio') || query.includes('pelota') || query.includes('fit') || query.includes('yoga') || query.includes('entrenar') || query.includes('pelora')) && 
                     (lowerName.includes('yoga') || lowerName.includes('tapete') || lowerName.includes('bandas') || lowerName.includes('resistencia') || lowerName.includes('abdominal') || lowerName.includes('lazo') || lowerName.includes('deportivo'))) {
            matchesQuery = true;
          }
        }

        if (!matchesQuery) continue;
      }
      totalQueryMatch++;

      let adaScore = baseProd.ada_score;
      if (options.estrategia === 'joyas_ocultas') {
        if (baseProd.saturacion_pauta === 'Bajo') adaScore += 8;
        if (baseProd.supplier_delivery_rate >= 95) adaScore += 5;
      } else if (options.estrategia === 'ganadores_validados') {
        if (baseProd.saturacion_pauta === 'Alto' || baseProd.saturacion_pauta === 'Medio') adaScore += 10;
        if (baseProd.content_completeness_score < 70) adaScore -= 20;
      } else if (options.estrategia === 'tendencias_virales') {
        if (baseProd.viral_score >= 80) adaScore += 15;
        if (baseProd.viral_score < 50) adaScore -= 20;
      }

      if (options.plataforma === 'TikTok') {
        if (baseProd.viral_score >= 70) adaScore += 8;
        const cat = baseProd.category.toLowerCase();
        if (cat.includes('belleza') || cat.includes('mascota') || cat.includes('niño') || cat.includes('moda')) {
          adaScore += 5;
        }
      } else if (options.plataforma === 'Meta') {
        const cat = baseProd.category.toLowerCase();
        if (cat.includes('salud') || cat.includes('hogar') || cat.includes('fit') || cat.includes('tecnolo')) {
          adaScore += 5;
        }
      }

      adaScore = Math.min(99, Math.max(40, adaScore));
      const margenEst = Math.round(((baseProd.price - baseProd.cost - baseProd.flete) / baseProd.price) * 100) + '%';

      const suggestion: ProductSuggestion = {
        id: `virtual-${i}`,
        name: name,
        category: baseProd.category,
        adaScore: adaScore,
        margin: margenEst,
        stock: `${stock} uds`,
        provider: provider,
        trendLabel: adaScore > 85 ? '↑ Alta Tendencia' : 'Estable',
        providerTier: tier
      };

      if (tier === 'Premium Exclusivo' || tier === 'Premium') {
        premiumMatches.push(suggestion);
      } else {
        verificadoMatches.push(suggestion);
      }

      if (premiumMatches.length >= limit && verificadoMatches.length >= limit) {
        break;
      }
    }

    premiumMatches.sort((a, b) => b.adaScore - a.adaScore);
    verificadoMatches.sort((a, b) => b.adaScore - a.adaScore);

    const finalResults: ProductSuggestion[] = [];
    let pIdx = 0;
    let vIdx = 0;

    while (finalResults.length < limit && (pIdx < premiumMatches.length || vIdx < verificadoMatches.length)) {
      if (pIdx < premiumMatches.length && (finalResults.length % 3 !== 2 || vIdx >= verificadoMatches.length)) {
        finalResults.push(premiumMatches[pIdx++]);
      } else if (vIdx < verificadoMatches.length) {
        finalResults.push(verificadoMatches[vIdx++]);
      } else {
        break;
      }
    }

    const end = performance.now();
    setSimulatedSearchStats({
      totalScanned: TOTAL_PRODUCTS,
      totalCategoryMatch: category ? totalCategoryMatch : TOTAL_PRODUCTS,
      totalStockMatch: totalStockMatch,
      totalSupplierMatch: totalSupplierMatch,
      totalQueryMatch: query ? totalQueryMatch : totalStockMatch,
      executionTimeMs: Math.round(end - start)
    });

    return finalResults;
  };

  // --- OpenAI Client-Side Call Helper ---
  const callChatGpt = async (systemPrompt: string, userPrompt: string) => {
    let key = localStorage.getItem('gali_openai_api_key');
    if (!key || !key.startsWith('sk-')) {
      key = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
      if (key) {
        localStorage.setItem('gali_openai_api_key', key);
        localStorage.setItem('gali_openai_live_mode', 'true');
      }
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const message = errData?.error?.message || `Error del servidor (${response.status})`;
        return { success: false, content: '', error: message };
      }

      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content || '';
      return { success: true, content: text.trim() };
    } catch (e: any) {
      return { success: false, content: '', error: e.message || 'Error de conexión.' };
    }
  };

  // --- Procesamiento de Onboarding Gali Mentora ---
  const extractQueryFromInput = (opt: string): string => {
    const low = opt.toLowerCase();
    if (low.includes('espalda') || low.includes('postura')) return 'corrector';
    if (low.includes('ejercicio') || low.includes('pelota') || low.includes('fit') || low.includes('yoga') || low.includes('pelora')) return 'yoga';
    if (low.includes('cuello') || low.includes('masaje')) return 'masajeador';
    if (low.includes('mascota') || low.includes('perro') || low.includes('gato')) return 'gps';
    if (low.includes('facial') || low.includes('piel') || low.includes('aroma') || low.includes('difusor')) return 'difusor';
    return '';
  };

  const CATEGORY_LABELS: Record<string, string> = {
    mascotas: 'Mascotas 🐾',
    belleza: 'Belleza 💄',
    hogar: 'Hogar 🏡',
    'tecnología': 'Tecnología ⚡',
    tecnologia: 'Tecnología ⚡',
    salud: 'Salud & Bienestar 🧘',
    fitness: 'Fitness 🏃',
    'niños': 'Niños 👶',
    ninos: 'Niños 👶',
    moda: 'Moda 👑',
  };

  const promptPlatformAndBudget = (categoryId: string) => {
    setChatState(2);
    const catText = CATEGORY_LABELS[categoryId] || 'tu nicho';

    setChatMessages(prev => [...prev, {
      sender: 'agent',
      text: `¡Excelente elección! La categoría de ${catText} tiene una rotación brutal en Colombia. Ahora, para dimensionar tu campaña y el stock de seguridad, ¿en qué red social planeas pautar y cuál es tu presupuesto diario estimado?`,
      options: [
        'Meta (Facebook) Ads - $40K/día 👥',
        'TikTok Ads - $50K/día ⚡',
        'Meta (Facebook) Ads - $100K+/día 🔥',
        'TikTok Ads - $100K+/día 🚀'
      ]
    }]);
    setIsGeneratingAgent(false);
  };

  const selectWinningAd = (ad: SpyWinningAd) => {
    setSelectedWinningAd(ad);
    setChatMessages(prev => [...prev, { sender: 'user', text: `Elijo: ${ad.productName}` }]);
    setIsGeneratingAgent(true);

    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        sender: 'agent',
        text: `Buen ojo. "${ad.productName}" lleva ${ad.daysActive} días activo en ${ad.platform} (fuente: ${ad.sourceTool}) con ${ad.ctrPct}% de CTR y ${ad.hookRatePct}% de Hook Rate. Está funcionando por su ángulo "${ad.anguloVenta}", con el gancho ${ad.hookText} y una oferta de ${ad.offerType}.`
      }]);
      setIsGeneratingAgent(false);
      setIsSearching(true);

      setTimeout(() => {
        const results = searchVirtualMillionCatalog({
          category: ad.category,
          query: ad.matchedQuery,
          estrategia: 'tendencias_virales',
          plataforma: ad.platform,
          dailyBudget: budget,
          limit: 100
        });
        setIsSearching(false);

        if (results.length > 0) {
          setChatNicho(ad.category);
          setSelectedCategory(ad.category);
          setChatQuery(ad.matchedQuery);
          setChatEstrategia('tendencias_virales');
          setProducts(results);
          setStep('select');
        } else {
          const etaDays = 5 + Math.floor(Math.random() * 6); // 5-10 días
          setChatMessages(prev => [...prev, {
            sender: 'agent',
            text: `Busqué "${ad.productName}" en nuestro catálogo y todavía no lo tenemos disponible en Dropi.`,
            notFoundAd: { ad, etaDays }
          }]);
        }
      }, 600);
    }, 700);
  };

  const viewSimilarInCategory = (ad: SpyWinningAd) => {
    setIsSearching(true);
    setTimeout(() => {
      const results = searchVirtualMillionCatalog({ category: ad.category, dailyBudget: budget, limit: 100 });
      setIsSearching(false);
      setChatNicho(ad.category);
      setSelectedCategory(ad.category);
      setProducts(results);
      setStep('select');
    }, 600);
  };

  const notifyWhenAvailable = () => {
    setShowNotifyToast(true);
    setTimeout(() => setShowNotifyToast(false), 3000);
  };

  const selectChatOption = async (optionText: string) => {
    setUserInput('');
    setChatMessages(prev => [...prev, { sender: 'user', text: optionText }]);
    setIsGeneratingAgent(true);

    const history = [...chatMessages, { sender: 'user', text: optionText }]
      .map(m => `${m.sender === 'agent' ? 'Gali' : 'Usuario'}: ${m.text}`)
      .join('\n');

    let parsedResponse: any = null;

    if (isLiveOpenAi()) {
      const systemPrompt = `Eres Gali, el mentor y Community Lead de Dropi Colombia. Tu objetivo es guiar al usuario en un proceso de mentoría interactivo, conversacional y paso a paso para seleccionar su producto ganador. Hablas con jerga dropshipper colombiana (testeo, pauta, escala, contraentrega, fletes, combos, LTV, adsets, hook).

LLEVA AL USUARIO POR ESTE CAMINO PASO A PASO (NO te saltes fases):

Fase 1: Enfoque de Selección (Método)
- El usuario debe elegir su enfoque: "Dolor" (Método Juan Felipe), "Viral" (Método Cesar Ortegón) o "Nicho" (Método Nicolás Londoño).
- Si no está definido, pídele que elija uno de los tres y explícale brevemente la diferencia.

Fase 2: Exploración e Interacción Profunda del Dolor / Tendencia / Vertical
- Si eligió "Dolor/Problema" (Juan Felipe): Pregúntale qué dolor o problema específico ha notado (ej: estrés en mascotas por ruido, dolor de espalda, desorden en casa).
  * CUANDO EL USUARIO RESPONDA O ELIJA UN DOLOR: ¡No avances de inmediato al presupuesto! Interactúa sobre ese dolor. Explícale por qué es un dolor ganador. Proponle 2-3 tipos de productos solucionadores (ej: difusores de aromaterapia, fajas de compresión, cepillos quitapelos, correctores de postura, tapete de yoga, bandas de resistencia) y pregúntale cuál le interesa más testear o si tiene otra idea.
- Si eligió "Ganador Viral" (Cesar Ortegón): Pregúntale qué tipo de tendencia vio en redes. Discutan sobre cómo pautarla, qué ganchos (hooks) visuales de video se pueden usar y cómo destacar de la competencia.
- Si eligió "Nicho" (Nicolás Londoño): Discutan qué categoría vertical le interesa (Mascotas, Belleza, etc.) y cómo se podrían agrupar combos de productos para maximizar el margen de venta.
* REGLA: Mantén la conversación en esta fase para validar, debatir e interactuar de forma pedagógica y cercana sobre el concepto. Solo avanza cuando definan la categoría/nicho del producto.

Fase 3: Canal y Presupuesto de Pauta
- Una vez validada la idea de producto/dolor, pregúntale por su canal de pauta preferido (Meta Ads o TikTok Ads) y el presupuesto diario planeado para su testeo inicial (ej: $40K/día, $50K/día, $100K+/día).

Fase 4: Cierre del Chat (Recomendaciones)
- Solo cuando hayas pasado por las fases anteriores (tengas definido el método, nicho/categoría, plataforma y presupuesto), establece "completado" como true. Esto le mostrará los 3 productos específicos del catálogo de 1M en el chat.

Estado de variables registradas:
- Método: "${chatMetodo || 'no definido'}"
- Nicho/Categoría: "${chatNicho || 'no definido'}"
- Plataforma: "${chatPlataforma || 'no definido'}"
- Presupuesto: "${budget || 'no definido'}"

DEBES RESPONDER EXCLUSIVAMENTE CON UN OBJETO JSON con el siguiente formato, no agregues explicaciones fuera de este bloque:
{
  "response": "Tu respuesta corta (máx 3 frases), enérgica y conversacional de mentoría.",
  "options": ["Opción de botón 1", "Opción de botón 2", "..."],
  "nicho": "mascotas" | "belleza" | "hogar" | "tecnología" | "salud" | "fitness" | "moda" | "niños" | null,
  "metodo": "Dolor" | "Viral" | "Nicho" | null,
  "plataforma": "Meta" | "TikTok" | null,
  "presupuesto": número_o_null,
  "query": "palabras clave específicas del producto solución (ej: 'corrector', 'yoga', 'bandas', 'masajeador', 'gps', 'quitapelos') o null",
  "completado": boolean
}`;

      const userPrompt = `Historial de conversación:\n${history}\n\nÚltimo mensaje del usuario: "${optionText}"\n\nResponde en formato JSON:`;
      const res = await callChatGpt(systemPrompt, userPrompt);
      if (res.success) {
        try {
          const clean = res.content.trim();
          const start = clean.indexOf('{');
          const end = clean.lastIndexOf('}');
          if (start !== -1 && end !== -1) {
            parsedResponse = JSON.parse(clean.substring(start, end + 1));
          }
        } catch (e) {
          console.error("Error parsing Gali's JSON:", e);
        }
      }
    }

    if (parsedResponse) {
      let currentNicho = chatNicho;
      let currentMetodo = chatMetodo;
      let currentPlataforma = chatPlataforma;
      let currentBudget = budget;
      let currentQuery = chatQuery;

      if (parsedResponse.nicho) {
        let mappedNicho = parsedResponse.nicho.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (mappedNicho === 'nino' || mappedNicho === 'ninos') mappedNicho = 'ninos';
        currentNicho = mappedNicho;
        setChatNicho(mappedNicho);
        setSelectedCategory(mappedNicho);
      }
      if (parsedResponse.metodo) {
        currentMetodo = parsedResponse.metodo;
        setChatMetodo(parsedResponse.metodo);
      }
      if (parsedResponse.plataforma) {
        currentPlataforma = parsedResponse.plataforma;
        setChatPlataforma(parsedResponse.plataforma);
      }
      if (parsedResponse.presupuesto) {
        currentBudget = parsedResponse.presupuesto;
        setBudget(parsedResponse.presupuesto);
        setChatPresupuesto(`$${parsedResponse.presupuesto.toLocaleString('es-CO')} COP`);
      }
      if (parsedResponse.query) {
        currentQuery = parsedResponse.query;
        setChatQuery(parsedResponse.query);
      } else {
        const fallbackQuery = extractQueryFromInput(optionText);
        currentQuery = fallbackQuery;
        setChatQuery(fallbackQuery);
      }

      if (parsedResponse.completado) {
        const platform = currentPlataforma || 'Meta';
        const budgetVal = currentBudget || 40000;
        const method = currentMetodo || 'Dolor';
        let est = 'ganadores_validados';
        if (method.includes('Dolor')) est = 'joyas_ocultas';
        else if (method.includes('Viral') || method.includes('Espionaje')) est = 'tendencias_virales';

        setChatEstrategia(est);
        setChatState(3);

        const results = searchVirtualMillionCatalog({
          category: currentNicho || 'belleza',
          dailyBudget: budgetVal,
          plataforma: platform,
          estrategia: est,
          query: currentQuery,
          limit: 100
        });

        setProducts(results);
        const recommendations = results.slice(0, 3);

        const tips: string[] = [];
        recommendations.forEach(r => {
          const rName = r.name.toLowerCase();
          if (rName.includes('difusor')) {
            tips.push(`ZenAroma tiene material de video en HD. Ángulo recomendado: "Reducir estrés al llegar a casa". Haz pauta abierta en Meta y vende a $79.000 en combo.`);
          } else if (rName.includes('collar') || rName.includes('gps')) {
            tips.push(`TechPet tiene stock asegurado de 500+ unidades. Ángulo recomendado: "Evita que tu mascota se pierda". Pauta en TikTok con video UGC de mapa de localización y vende a $120.000.`);
          } else if (rName.includes('rodillo') || rName.includes('jade')) {
            tips.push(`BeautyStore ofrece despacho en menos de 24h. Ángulo recomendado: "Rutina skin care express". Usa IA para fondos naturales de spa y vende a $39.000.`);
          } else if (rName.includes('corrector') || rName.includes('postura')) {
            tips.push(`MediTech SAS ofrece entrega inmediata. Ángulo de venta: "Dile adiós al dolor lumbar trabajando". Vende en Meta a $59.000 en combo con faja térmica.`);
          } else if (rName.includes('yoga') || rName.includes('tapete') || rName.includes('mat')) {
            tips.push(`FitGear Co tiene stock de importación directa. Ángulo de venta: "Tu gimnasio en casa sin resbalones". Ideal para pautar en TikTok y vender a $119.000.`);
          } else {
            tips.push(`Estrategia de escala: Margen estimado del ${r.margin} con stock de ${r.stock}. Ideal para pautar en ${platform} con el ángulo de solución de dolor diario.`);
          }
        });

        const finalRecs = recommendations.map((r, idx) => ({
          ...r,
          trendLabel: tips[idx] || r.trendLabel
        }));

        setChatMessages(prev => [...prev, {
          sender: 'agent',
          text: parsedResponse.response,
          products: finalRecs
        }]);
      } else {
        setChatMessages(prev => [...prev, {
          sender: 'agent',
          text: parsedResponse.response,
          options: parsedResponse.options || []
        }]);
      }
      setIsGeneratingAgent(false);
      return;
    }

    // --- FALLBACK LOCAL (En caso de no tener API Key o fallar) ---
    const currentState = chatState;
    if (currentState === 0) {
      setChatMetodo(optionText);
      setChatState(1);

      let optionsList: string[] = [];
      let defaultText = '';

      if (optionText.includes('Dolor')) {
        optionsList = [
          'Extravío de mascotas o desorden en casa 🐾',
          'Falta de tiempo en cuidado personal/facial 💄',
          'Cables molestos o carga lenta ⚡',
          'Dolor de espalda o mala postura al sentarse 🧘'
        ];
        defaultText = `¡Brutal! El enfoque en dolores es el método de Juan Felipe para encontrar productos con alta rentabilidad y salir de la guerra de precios. Para encontrar un solucionador real, ¿qué dolor o molestia en el mercado quieres solucionar hoy? Selecciona una opción o escribe tu idea en el chat:`;
      } else if (optionText.includes('Viral')) {
        setChatMessages(prev => [...prev, {
          sender: 'agent',
          text: `¡Al grano! El método de volumen y espionaje de Cesar Ortegón. Escaneé AdSpy, Minea, Foreplay, Kalodata, Ecomhunt, Dropkiller y la Biblioteca de Anuncios buscando ganadores activos ahora mismo. Elige el que más te llame — te explico exactamente por qué está funcionando antes de buscarte el producto equivalente en catálogo:`,
          showSpyRadar: true
        }]);
        setIsGeneratingAgent(false);
        return;
      } else {
        optionsList = [
          'Mascotas y Cuidado Animal 🐾',
          'Belleza, Skin Care y Cuidado Personal 💄',
          'Hogar, Decoración y Cocina Inteligente 🏡',
          'Tecnología y Accesorios Funcionales ⚡'
        ];
        defaultText = `¡Excelente decisión! Especializarse en un nicho te ayuda a construir una marca sólida a largo plazo, garantizando recompra de tus clientes como hace Nicolás Londoño. ¿En qué nicho vertical de mercado te vas a enfocar? Selecciona una opción o escribe tu propuesta:`;
      }

      setChatMessages(prev => [...prev, {
        sender: 'agent',
        text: defaultText,
        options: optionsList
      }]);
      setIsGeneratingAgent(false);

    } else if (currentState === 1) {
      const lowOption = optionText.toLowerCase();
      let mappedCategory = 'belleza';
      if (lowOption.includes('mascota') || lowOption.includes('perro') || lowOption.includes('gato') || lowOption.includes('animal')) {
        mappedCategory = 'mascotas';
      } else if (lowOption.includes('belleza') || lowOption.includes('cosm') || lowOption.includes('facial') || lowOption.includes('piel') || lowOption.includes('cuidado personal')) {
        mappedCategory = 'belleza';
      } else if (lowOption.includes('hogar') || lowOption.includes('cocina') || lowOption.includes('organiza') || lowOption.includes('limp')) {
        mappedCategory = 'hogar';
      } else if (lowOption.includes('tecnolo') || lowOption.includes('gadget') || lowOption.includes('cable') || lowOption.includes('carga')) {
        mappedCategory = 'tecnología';
      } else if (lowOption.includes('espalda') || lowOption.includes('postura') || lowOption.includes('salud') || lowOption.includes('bienestar') || lowOption.includes('dolor')) {
        mappedCategory = 'salud';
      } else if (lowOption.includes('ejercicio') || lowOption.includes('fit') || lowOption.includes('deport') || lowOption.includes('yoga') || lowOption.includes('pelota') || lowOption.includes('pelora')) {
        mappedCategory = 'fitness';
      } else if (lowOption.includes('niño') || lowOption.includes('bebé') || lowOption.includes('juguete')) {
        mappedCategory = 'niños';
      } else if (lowOption.includes('moda') || lowOption.includes('ropa') || lowOption.includes('vestir')) {
        mappedCategory = 'moda';
      }

      setChatNicho(mappedCategory);
      setSelectedCategory(mappedCategory);
      const computedQuery = extractQueryFromInput(optionText);
      setChatQuery(computedQuery);
      promptPlatformAndBudget(mappedCategory);

    } else if (currentState === 2) {
      let platform = 'Meta';
      if (optionText.includes('TikTok')) {
        platform = 'TikTok';
      }
      setChatPlataforma(platform);

      let budgetVal = 40000;
      const digits = optionText.replace(/\D/g, '');
      if (digits) {
        const parsed = parseInt(digits, 10);
        if (parsed < 1000) {
          budgetVal = parsed * 1000;
        } else {
          budgetVal = parsed;
        }
      } else {
        if (optionText.includes('100K')) budgetVal = 100000;
        else if (optionText.includes('50K')) budgetVal = 50000;
      }

      setChatPresupuesto(`$${budgetVal.toLocaleString('es-CO')} COP`);
      setBudget(budgetVal);

      let est = 'ganadores_validados';
      if (chatMetodo.includes('Dolor')) {
        est = 'joyas_ocultas';
      } else if (chatMetodo.includes('Viral') || chatMetodo.includes('Espionaje')) {
        est = 'tendencias_virales';
      }
      setChatEstrategia(est);
      setChatState(3);

      const results = searchVirtualMillionCatalog({
        category: chatNicho,
        dailyBudget: budgetVal,
        plataforma: platform,
        estrategia: est,
        query: chatQuery,
        limit: 100
      });
      setProducts(results);
      const recommendations = results.slice(0, 3);

      const tips: string[] = [];
      recommendations.forEach(r => {
        const rName = r.name.toLowerCase();
        if (rName.includes('difusor')) {
          tips.push(`ZenAroma tiene material de video en HD. Ángulo recomendado: "Reducir estrés al llegar a casa". Haz pauta abierta en Meta y vende a $79.000 en combo.`);
        } else if (rName.includes('collar') || rName.includes('gps')) {
          tips.push(`TechPet tiene stock asegurado de 500+ unidades. Ángulo recomendado: "Evita que tu mascota se pierda". Pauta en TikTok con video UGC de mapa de localización y vende a $120.000.`);
        } else if (rName.includes('rodillo') || rName.includes('jade')) {
          tips.push(`BeautyStore ofrece despacho en menos de 24h. Ángulo recomendado: "Rutina skin care express". Usa IA para fondos naturales de spa y vende a $39.000.`);
        } else if (rName.includes('corrector') || rName.includes('postura')) {
          tips.push(`MediTech SAS ofrece entrega inmediata. Ángulo de venta: "Dile adiós al dolor lumbar trabajando". Vende en Meta a $59.000 en combo con faja térmica.`);
        } else if (rName.includes('yoga') || rName.includes('tapete') || rName.includes('mat')) {
          tips.push(`FitGear Co tiene stock de importación directa. Ángulo de venta: "Tu gimnasio en casa sin resbalones". Ideal para pautar en TikTok y vender a $119.000.`);
        } else {
          tips.push(`Estrategia de escala: Margen estimado del ${r.margin} con stock de ${r.stock}. Ideal para pautar en ${platform} con el ángulo de solución de dolor diario.`);
        }
      });

      const finalRecs = recommendations.map((r, idx) => ({
        ...r,
        trendLabel: tips[idx] || r.trendLabel
      }));

      setChatMessages(prev => [...prev, {
        sender: 'agent',
        text: `¡Listo! Escaneé nuestro catálogo de 1,000,000 de productos aplicando load-balancing y filtros de stock seguro (mínimo ${calculateMinStock(budgetVal)} uds) alineados a tu presupuesto. Encontré estas 3 mejores opciones que encajan perfecto con tu enfoque de "${chatMetodo}". Puedes elegir una directamente o hacer clic abajo para ver la lista completa en el catálogo:`,
        products: finalRecs
      }]);
      setIsGeneratingAgent(false);
    }
  };

  const sendChatTextInput = () => {
    const text = userInput.trim();
    if (!text) return;
    selectChatOption(text);
  };

  // --- Lógica del Analista de Catálogo IA ---
  const askAnalystGali = async (quickQuestion?: string) => {
    const text = quickQuestion || analystInput.trim();
    if (!text) return;

    setAnalystInput('');
    setAnalystMessages(prev => [...prev, { sender: 'user', text }]);
    setIsGeneratingAnalyst(true);

    const visibleProds = products.slice(0, 15);
    const prodListText = visibleProds.map(p => {
      const isVirtual = p.id.startsWith('virtual-');
      const vId = isVirtual ? parseInt(p.id.replace('virtual-', ''), 10) : 0;
      const baseProd = isVirtual ? SIMULATED_PRODUCTS_BASES[vId % SIMULATED_PRODUCTS_BASES.length] : null;
      const delivery = baseProd ? baseProd.supplier_delivery_rate : 90;
      const cost = baseProd ? baseProd.cost : 18000;
      const flete = baseProd ? baseProd.flete : 7000;
      const sat = baseProd ? baseProd.saturacion_pauta : 'Medio';
      return `- ${p.name}: ADA Score ${p.adaScore}, Margen ${p.margin}, Stock ${p.stock}, Proveedor: ${p.provider} (${p.providerTier}, Despacho: ${delivery}%), Costo: $${cost}, Flete: $${flete}, Sat. Pauta: ${sat}`;
    }).join('\n');

    const prompt = `El usuario tiene una lista de hasta 100 productos del catálogo de Dropi Colombia filtrados por su nicho "${chatNicho}", presupuesto diario "${chatPresupuesto}" y estrategia "${chatEstrategia}".
Pregunta del usuario: "${text}"

Detalle de productos en pantalla:
${prodListText}

Responde como Gali (el mentor dropshipper experto de la comunidad). Analiza los datos de costo, flete, reputación del proveedor y saturación para darle un consejo directo y valioso en español latino, usando jerga colombiana.
Mantén tu respuesta corta y al grano (máx 3-4 frases).`;

    let agentText = '';
    if (isLiveOpenAi()) {
      const systemPrompt = `Eres Gali, el mentor y analista de pauta del catálogo Dropi Colombia. Responde de forma muy concisa (máximo 4 frases), usa jerga de pauta (márgenes, ROAS, novedades, contraentrega). Responde con datos matemáticos basados únicamente en el catálogo provisto.`;
      const res = await callChatGpt(systemPrompt, prompt);
      if (res.success) agentText = res.content;
    }

    if (!agentText) {
      agentText = `¡Qué buena pregunta! Analizando los productos de tu lista, te sugiero mirar el que tenga mayor tasa de entrega del proveedor (idealmente >90%) y un margen de al menos 3x. En Facebook Ads, los productos solucionadores de dolor diario con stock alto son ganadores seguros. ¿Tienes alguna duda sobre alguno de los proveedores específicos?`;
    }

    setAnalystMessages(prev => [...prev, { sender: 'agent', text: agentText }]);
    setIsGeneratingAnalyst(false);
  };

  // --- Comparador de Proveedores ---
  const extractBaseName = (n: string) => {
    return n.split(' (')[0].replace(' Pro', '').replace(' Premium', '').replace(' Mini', '').replace(' Recargable', '').replace(' Inteligente', '').replace(' Eco', '').replace(' Ultra', '').replace(' Max', '').replace(' Plus', '');
  };

  const getSupplierVariants = (product: ProductSuggestion): any[] => {
    const baseName = extractBaseName(product.name).toLowerCase();
    const matches: any[] = [];

    GALI_PRODUCTS_400.forEach(p => {
      const pBaseName = extractBaseName(p.nombre).toLowerCase();
      if (pBaseName === baseName || pBaseName.includes(baseName) || baseName.includes(pBaseName)) {
        let tier: 'Premium Exclusivo' | 'Premium' | 'Verificado' = 'Verificado';
        const prov = p.proveedor.toLowerCase();
        if (prov.includes('aroma') || prov.includes('techpet') || prov.includes('meditech')) {
          tier = 'Premium Exclusivo';
        } else if (prov.includes('beauty') || prov.includes('mundo') || prov.includes('kitchen')) {
          tier = 'Premium';
        }

        matches.push({
          id: p.id,
          nombre: p.nombre,
          proveedor: p.proveedor,
          providerTier: tier,
          deliveryRate: p.supplier_delivery_rate || 90,
          cost: p.costo_base,
          flete: p.flete_base,
          cogs: p.costo_base + p.flete_base,
          price: p.precio_sugerido,
          margin: p.margen_est,
          stock: p.stock_qty || 100,
          contentScore: p.content_completeness_score || 80,
          saturacion: p.saturacion_pauta || 'Bajo'
        });
      }
    });

    return matches.sort((a, b) => b.deliveryRate - a.deliveryRate || a.cogs - b.cogs);
  };

  const openComparisonModal = (product: ProductSuggestion, e: React.MouseEvent) => {
    e.stopPropagation();
    setComparisonProduct(product);
    const variants = getSupplierVariants(product);
    setComparisonVariants(variants);
    setComparisonModalOpen(true);
  };

  const closeComparisonModal = () => {
    setComparisonModalOpen(false);
    setComparisonProduct(null);
  };

  const selectVariant = (v: any) => {
    if (!selectedProduct) return;
    const updated = {
      ...selectedProduct,
      provider: v.proveedor,
      providerTier: v.providerTier,
      margin: v.margin,
      stock: `${v.stock} uds`
    };
    setSelectedProduct(updated);
    setCogs(v.cost);
    setFleteUnit(v.flete);
    setPrecioVenta(v.price);
    closeComparisonModal();
  };

  // --- Métodos de Selección de Producto y Transición ---
  const selectProduct = (p: ProductSuggestion) => {
    setSelectedProduct(p);
    if (!projectName) {
      setProjectName(p.name);
    }

    if (p.id.startsWith('virtual-')) {
      const vId = parseInt(p.id.replace('virtual-', ''), 10);
      if (!isNaN(vId)) {
        const baseIndex = vId % SIMULATED_PRODUCTS_BASES.length;
        const baseProd = SIMULATED_PRODUCTS_BASES[baseIndex];
        setCogs(baseProd.cost);
        setFleteUnit(baseProd.flete);
        setPrecioVenta(baseProd.price);
      }
    } else {
      const realProd = GALI_PRODUCTS_400.find(prod => prod.id === p.id);
      if (realProd) {
        setCogs(realProd.costo_base || 18000);
        setFleteUnit(realProd.flete_base || 7000);
        setPrecioVenta(realProd.precio_sugerido || 59000);
      }
    }
  };

  const selectCategory = async (catId: string) => {
    setSelectedCategory(catId);
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      const cat = TRENDING_CATEGORIES.find(c => c.id === catId);
      const catLabel = cat ? cat.label.split('&')[0].trim() : '';
      const results = searchVirtualMillionCatalog({
        category: catLabel,
        dailyBudget: budget,
        limit: 100
      });
      setProducts(results);
      setStep('select');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuerySearch = async (q: string) => {
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const results = searchVirtualMillionCatalog({
        query: q,
        dailyBudget: budget,
        limit: 100
      });
      setProducts(results);
      setStep('select');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  // --- Ángulos Creativos ---
  const angulos = useMemo<Angulo[]>(() => {
    if (!selectedProduct) return [];
    return [
      {
        id: 'dolor',
        titulo: 'Ángulo del dolor',
        hook: `¿Cansado de ${selectedProduct.category === 'Mascotas' ? 'perder a tu mascota de vista' : 'los problemas que ya conoces'}?`,
        guion: `Hook (3s): Pregunta que genera identificación. | Problema (5s): La situación real del cliente. | Solución (10s): Cómo ${selectedProduct.name} lo resuelve. | CTA (5s): "Ordena hoy y recíbelo en 24h."`,
      },
      {
        id: 'aspiracional',
        titulo: 'Ángulo aspiracional',
        hook: `Las personas exitosas ya usan esto para ${selectedProduct.category === 'Mascotas' ? 'proteger a sus mascotas' : 'mejorar su vida'}.`,
        guion: `Hook (3s): Mostrar el resultado deseado. | Prueba (5s): Testimonios visuales. | Producto (10s): Presentación clara. | CTA (5s): "Únete a las miles de personas que ya lo usan."`,
      },
      {
        id: 'escasez',
        titulo: 'Ángulo de urgencia',
        hook: `Solo quedan ${selectedProduct.stock === 'Alto' ? '50' : '12'} unidades. Precio especial termina hoy.`,
        guion: `Hook (3s): Número de unidades disponibles. | Valor (5s): Por qué vale la pena ahora. | Producto (7s): Beneficio principal. | Countdown (8s): "Oferta termina en 2 horas." | CTA (3s): "Haz tu pedido."`,
      },
    ];
  }, [selectedProduct]);

  // --- Computed Properties ---
  const breakEvenRoas = useMemo(() => {
    const costTotal = cogs + fleteUnit;
    const diff = precioVenta - costTotal;
    if (diff <= 0) return 99;
    return Math.round((precioVenta / diff) * 10) / 10;
  }, [cogs, fleteUnit, precioVenta]);

  const roasCalculated = useMemo(() => {
    if (budget < 100000) return '2.2x';
    if (budget < 300000) return '2.5x';
    if (budget < 600000) return '2.8x';
    return '3.1x';
  }, [budget]);

  const budgetFormatted = useMemo(() => {
    return `$${budget.toLocaleString('es-CO')}`;
  }, [budget]);

  const galiPresupuestoRec = useMemo(() => {
    const daily = Math.round((pedidosTarget * 20000) / 7 / 1000) * 1000;
    return `$${daily.toLocaleString('es-CO')}/día`;
  }, [pedidosTarget]);

  const margenProyectado = useMemo(() => {
    if (precioVenta <= 0) return 0;
    const costo = cogs + fleteUnit;
    return Math.round(((precioVenta - costo) / precioVenta) * 100);
  }, [cogs, fleteUnit, precioVenta]);

  // --- Transiciones ---
  const goToEstrategia = () => {
    if (!selectedProduct) return;
    setStep('estrategia');
  };

  const goToLanding = () => {
    if (!selectedAngulo && angulos.length) {
      setSelectedAngulo(angulos[0]);
    }
    setStep('landing');
  };

  const goToCampana = () => {
    setStep('campana');
  };

  const toggleAgente = (key: string) => {
    setAgentesProyecto(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // --- Despliegue de Landing (Page Pilot MCP) ---
  const publishLanding = () => {
    if (pagePilotState !== 'idle') return;
    setPagePilotState('generating');
    setTimeout(() => {
      setPagePilotState('deploying');
      setTimeout(() => {
        const slug = selectedProduct?.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') ?? 'producto';
        setPagePilotUrl(`https://dropi.co/lp/${slug}`);
        setLandingCvr(Math.floor(Math.random() * 3) + 2); // 2-4%
        setPagePilotState('live');
      }, 1400);
    }, 1200);
  };

  // --- Lanzar y Borrador (Persistencia Local) ---
  const launchProject = () => {
    if (step === 'launch') {
      setShowConfirmLaunch(true);
      return;
    }
    setIsLaunching(true);
    setTimeout(() => {
      setIsLaunching(false);
      setStep('launch');
    }, 1800);
  };

  const confirmLaunch = () => {
    setShowConfirmLaunch(false);
    const slug = (projectName || selectedProduct?.name || 'proyecto')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const finalId = `${slug}-${Date.now().toString(36)}`;
    setLaunchedProjectId(finalId);
    
    setStep('launch');
    setShowLaunchModal(true);
    setLaunchSuccess(false);

    setTimeout(() => {
      // Persistir localmente en localStorage
      const local = localStorage.getItem('gali_local_projects');
      let projects: GaliProject[] = [];
      if (local) {
        try { projects = JSON.parse(local); } catch {}
      }

      const updates: GaliProject = {
        id: finalId,
        nombre: projectName || selectedProduct?.name || 'Mi Proyecto Gali',
        estado: 'activo',
        step_actual: 'launch',
        producto_id: selectedProduct?.id,
        producto_nombre: selectedProduct?.name,
        costo_base: cogs,
        precio_venta: precioVenta,
        presupuesto_diario: budget,
        landing_titulo: projectName,
        landing_subtitulo: selectedAngulo?.hook || '',
        creative_script: selectedAngulo?.guion || '',
        agentes: {
          roax: !!agentesProyecto['roax'],
          vigilante: !!agentesProyecto['vigilante'],
          ada: !!agentesProyecto['ada'],
          chatea: !!agentesProyecto['chatea']
        }
      };

      projects.unshift(updates);
      localStorage.setItem('gali_local_projects', JSON.stringify(projects));
      setProjectId(finalId);
      setLaunchSuccess(true);
    }, 2200);
  };

  const closeLaunchModal = () => {
    setShowLaunchModal(false);
    // Navegar al dashboard principal o alertas
    window.location.href = "/proyectos/gali-demo";
  };

  const saveDraft = () => {
    const slug = (projectName || selectedProduct?.name || 'proyecto')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const finalId = projectId || `${slug}-${Date.now().toString(36)}`;

    const local = localStorage.getItem('gali_local_projects');
    let projects: GaliProject[] = [];
    if (local) {
      try { projects = JSON.parse(local); } catch {}
    }

    const index = projects.findIndex(p => p.id === finalId);
    const updates: GaliProject = {
      id: finalId,
      nombre: projectName || selectedProduct?.name || 'Borrador Gali',
      estado: 'borrador',
      step_actual: step,
      producto_id: selectedProduct?.id,
      producto_nombre: selectedProduct?.name,
      costo_base: cogs,
      precio_venta: precioVenta,
      presupuesto_diario: budget,
      landing_titulo: projectName,
      landing_subtitulo: selectedAngulo?.hook || '',
      creative_script: selectedAngulo?.guion || '',
      agentes: {
        roax: !!agentesProyecto['roax'],
        vigilante: !!agentesProyecto['vigilante'],
        ada: !!agentesProyecto['ada'],
        chatea: !!agentesProyecto['chatea']
      }
    };

    if (index !== -1) {
      projects[index] = updates;
    } else {
      projects.unshift(updates);
    }

    localStorage.setItem('gali_local_projects', JSON.stringify(projects));
    setProjectId(finalId);
    setShowDraftToast(true);
    setTimeout(() => setShowDraftToast(false), 3000);
  };

  // Helper de estilos de score
  const getScoreClass = (score: number): string => {
    if (score >= 80) return 'hot';
    if (score >= 65) return 'warm';
    return 'cool';
  };

  return (
    <div className="np-page">
      {/* Header con progreso */}
      <div className="np-header">
        <button type="button" className="np-header__back" onClick={() => window.history.back()}>
          <ArrowLeft size={16} />
        </button>
        <div className="np-header__title-group">
          <h1 className="np-header__title">Nuevo proyecto</h1>
          <span className="np-header__subtitle">
            {step === 'goal' ? 'Elige tu objetivo para comenzar' : 'Gali + ADA Spy te guían en cada paso'}
          </span>
        </div>
        {step !== 'goal' && (
          <div className="np-steps np-steps--6">
            <span className={`np-step ${step === 'discovery' ? 'np-step--active' : ''} ${['select','estrategia','landing','campana','launch'].includes(step) ? 'np-step--done' : ''}`}>
              1 · Descubrir
            </span>
            <span className="np-step-line"></span>
            <span className={`np-step ${step === 'select' ? 'np-step--active' : ''} ${['estrategia','landing','campana','launch'].includes(step) ? 'np-step--done' : ''}`}>
              2 · Elegir
            </span>
            <span className="np-step-line"></span>
            <span className={`np-step ${step === 'estrategia' ? 'np-step--active' : ''} ${['landing','campana','launch'].includes(step) ? 'np-step--done' : ''}`}>
              3 · Estrategia
            </span>
            <span className="np-step-line"></span>
            <span className={`np-step ${step === 'landing' ? 'np-step--active' : ''} ${['campana','launch'].includes(step) ? 'np-step--done' : ''}`}>
              4 · Landing
            </span>
            <span className="np-step-line"></span>
            <span className={`np-step ${step === 'campana' ? 'np-step--active' : ''} ${step === 'launch' ? 'np-step--done' : ''}`}>
              5 · Campaña
            </span>
            <span className="np-step-line"></span>
            <span className={`np-step ${step === 'launch' ? 'np-step--active' : ''}`}>
              6 · Lanzar
            </span>
          </div>
        )}
      </div>

      {/* ── ETAPA 0: OBJETIVO ── */}
      {step === 'goal' && (
        <div className="np-goals">
          <div className="np-section-header">
            <div className="np-gali-label">
              <span className="np-gali-label__dot" style={{ background: '#818cf8' }}></span>
              <strong>Gali</strong> · elige el objetivo de este proyecto
            </div>
            <h2 className="np-section-header__title">¿Cuál es tu objetivo?</h2>
            <p className="np-section-header__sub">Gali adapta todo el proceso — desde la búsqueda de producto hasta la campaña — según la meta que elijas.</p>
          </div>

          <div className="np-goals__grid">
            <button type="button" className="np-goal-card np-goal-card--active" onClick={() => setStep('discovery')}>
              <span className="np-goal-card__icon">🎯</span>
              <div className="np-goal-card__content">
                <strong className="np-goal-card__title">Mi primer producto</strong>
                <p className="np-goal-card__desc">Encuentra tu producto ganador y consigue tu primera venta, paso a paso con Gali.</p>
              </div>
              <ArrowRight size={18} className="np-goal-card__arrow" />
            </button>

            <div className="np-goal-card np-goal-card--locked" aria-disabled="true">
              <span className="np-goal-card__icon">📈</span>
              <div className="np-goal-card__content">
                <strong className="np-goal-card__title">Escalar a varios productos</strong>
                <p className="np-goal-card__desc">Diversifica tu catálogo activo y multiplica tus canales de venta.</p>
              </div>
              <span className="np-goal-card__badge">Próximamente</span>
            </div>

            <div className="np-goal-card np-goal-card--locked" aria-disabled="true">
              <span className="np-goal-card__icon">🚀</span>
              <div className="np-goal-card__content">
                <strong className="np-goal-card__title">Vender 2,000 unidades</strong>
                <p className="np-goal-card__desc">Plan de escalamiento agresivo para un producto ya validado.</p>
              </div>
              <span className="np-goal-card__badge">Próximamente</span>
            </div>
          </div>
        </div>
      )}

      {/* ── ETAPA 1: DESCUBRIMIENTO ── */}
      {step === 'discovery' && (
        <div className="np-discovery">
          {/* Chat de Descubrimiento */}
          <div className="np-discovery__chat-container">
            <div className="np-discovery__ada-label">
              <span className="np-discovery__ada-dot"></span>
              <strong>Gali + ADA Spy</strong> · Mentor de Comunidad en vivo
            </div>
            
            <div className="np-discovery__chat-box" ref={chatBoxRef}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`np-chat-bubble ${msg.sender === 'agent' ? 'np-chat-bubble--agent' : 'np-chat-bubble--user'}`}>
                  <div className="np-chat-bubble__avatar">
                    {msg.sender === 'agent' ? '🎯' : '👤'}
                  </div>
                  <div className="np-chat-bubble__content">
                    <p className="np-chat-bubble__text">{msg.text}</p>
                    
                    {msg.options && msg.options.length > 0 && (
                      <div className="np-chat-bubble__options">
                        {msg.options.map(opt => (
                          <button key={opt} type="button" className="np-chat-opt-btn" onClick={() => selectChatOption(opt)}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.showSpyRadar && (
                      selectedWinningAd ? (
                        <div className="np-spy-radar__selected">
                          ✓ Usando el ángulo de <strong>{selectedWinningAd.productName}</strong> ({selectedWinningAd.sourceTool})
                        </div>
                      ) : (
                        <div className="np-spy-radar">
                          <div className="np-spy-radar__filters">
                            <button
                              type="button"
                              className={`np-spy-category-chip ${spyRadarCategoryFilter === '' ? 'np-spy-category-chip--active' : ''}`}
                              onClick={() => setSpyRadarCategoryFilter('')}>
                              Todas
                            </button>
                            {TRENDING_CATEGORIES.map(cat => (
                              <button
                                key={cat.id}
                                type="button"
                                className={`np-spy-category-chip ${spyRadarCategoryFilter === cat.id ? 'np-spy-category-chip--active' : ''}`}
                                onClick={() => setSpyRadarCategoryFilter(cat.id)}>
                                {cat.emoji} {cat.label}
                              </button>
                            ))}
                          </div>

                          <div className="np-spy-radar__grid">
                            {SPY_WINNING_ADS
                              .filter(ad => !spyRadarCategoryFilter || ad.category === spyRadarCategoryFilter)
                              .map(ad => (
                                <div key={ad.id} className="np-spy-ad-card">
                                  <div className="np-spy-ad-card__header">
                                    <span className="np-spy-source-badge">{ad.sourceTool}</span>
                                    <span className="np-spy-ad-card__platform">{ad.platform === 'Meta' ? '📘 Meta' : '🎵 TikTok'}</span>
                                  </div>
                                  <strong className="np-spy-ad-card__name">{ad.productName}</strong>
                                  <p className="np-spy-ad-card__hook">{ad.hookText}</p>
                                  <div className="np-spy-ad-card__metrics">
                                    <span><strong>{ad.ctrPct}%</strong> CTR</span>
                                    <span><strong>{ad.hookRatePct}%</strong> Hook Rate</span>
                                    <span><strong>${ad.cpmCop.toLocaleString('es-CO')}</strong> CPM</span>
                                    <span><strong>{ad.daysActive}</strong> días activo</span>
                                  </div>
                                  <button type="button" className="np-spy-ad-card__select-btn" onClick={() => selectWinningAd(ad)}>
                                    Usar este ángulo →
                                  </button>
                                </div>
                              ))}
                          </div>
                        </div>
                      )
                    )}

                    {msg.notFoundAd && (
                      <div className="np-pulso-fallback">
                        <div className="np-pulso-fallback__header">
                          <span className="np-pulso-fallback__icon">🔮</span>
                          <strong>Dropi Pulso</strong> ya está gestionando proveedores para este producto
                        </div>
                        <p className="np-pulso-fallback__eta">
                          Disponible en un estimado de <strong>{msg.notFoundAd.etaDays} días</strong>.
                        </p>
                        <div className="np-pulso-fallback__actions">
                          <button type="button" className="np-pulso-fallback__notify-btn" onClick={notifyWhenAvailable}>
                            Notificarme cuando esté disponible
                          </button>
                          <button type="button" className="np-pulso-fallback__similar-btn" onClick={() => viewSimilarInCategory(msg.notFoundAd!.ad)}>
                            Ver productos similares ya disponibles →
                          </button>
                        </div>
                        <a className="np-pulso-fallback__link" href="/proyectos/pulso-demo" target="_blank" rel="noopener noreferrer">
                          Ver cómo funciona Dropi Pulso →
                        </a>
                      </div>
                    )}

                    {msg.products && msg.products.length > 0 && (
                      <div className="np-chat-bubble__products">
                        {msg.products.map(p => (
                          <div key={p.id} className="np-chat-product-card">
                            <div className="np-chat-product-card__header">
                              <div className="np-chat-product-card__score" data-level={getScoreClass(p.adaScore)}>
                                {p.adaScore}
                              </div>
                              <div className="np-chat-product-card__title-group">
                                <strong className="np-chat-product-card__name">{p.name}</strong>
                                <span className="np-chat-product-card__meta">
                                  {p.category} · Margen: {p.margin} · Prov: {p.provider}
                                  <span className="np-badge np-badge--tier" data-tier={p.providerTier}>{p.providerTier}</span>
                                </span>
                              </div>
                            </div>
                            <div className="np-chat-product-card__body">
                              <p className="np-chat-product-card__tip">
                                <strong>💡 Secreto de Escala:</strong> {p.trendLabel}
                              </p>
                              {p.providerTier === 'Verificado' && (
                                <div className="np-chat-product-card__warning">
                                  ⚠️ <strong>Proveedor Verificado:</strong> Mayor riesgo de devoluciones por demoras. Te sugiero activar <strong>Chatea Pro</strong> para confirmación activa de WhatsApp.
                                </div>
                              )}
                            </div>
                            <button type="button" className="np-chat-product-card__select-btn" onClick={() => { selectProduct(p); setStep('select'); }}>
                              Seleccionar Producto y Continuar →
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.products && msg.products.length > 0 && (
                      <div className="np-chat-bubble__escape-row">
                        <button type="button" className="np-discovery__browse-catalog-btn" onClick={() => setStep('select')}>
                          Explorar catálogo completo con este enfoque (100+ opciones) →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isGeneratingAgent && (
                <div className="np-chat-bubble np-chat-bubble--agent">
                  <div className="np-chat-bubble__avatar">🎯</div>
                  <div className="np-chat-bubble__content">
                    <div className="np-chat-loading-dots">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="np-discovery__chat-input-row">
              <input
                type="text"
                className="np-discovery__chat-input"
                placeholder="Escribe tu respuesta aquí o selecciona una opción..."
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChatTextInput()}
                disabled={isGeneratingAgent || chatState === 3} />
              <button type="button" className="np-discovery__chat-send-btn" onClick={sendChatTextInput} disabled={!userInput.trim() || isGeneratingAgent || chatState === 3}>
                Enviar
              </button>
            </div>
          </div>

          <div className="np-discovery__ada-recs">
            <div className="np-discovery__ada-recs-header">
              <span className="np-discovery__ada-dot"></span>
              <strong>Recomendados para tu primera venta</strong>
              <span className="np-discovery__ada-meta">Preselección de nuestro equipo de proveedores con alta tendencia de ventas y stock asegurado</span>
            </div>
            <div className="np-discovery__ada-cards">
              {products.slice(0, 3).map(p => (
                <button key={p.id} type="button" className="np-ada-rec-card" onClick={() => { selectProduct(p); setStep('select'); }}>
                  <div className="np-ada-rec-card__score" data-level={getScoreClass(p.adaScore)}>{p.adaScore}</div>
                  <div className="np-ada-rec-card__content">
                    <strong>{p.name}</strong>
                    <span>
                      {p.margin} margen · {p.trendLabel}
                      <span className="np-badge np-badge--tier" data-tier={p.providerTier}>{p.providerTier}</span>
                    </span>
                  </div>
                  <ArrowRight size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ETAPA 2: SELECCIONAR PRODUCTO (Split-Screen) ── */}
      {step === 'select' && (
        <div className="np-select">
          {isSearching ? (
            <div className="np-loading">
              <span className="np-loading__dot"></span>
              <span>ADA Spy analizando...</span>
            </div>
          ) : (
            <>
              <div className="np-select__header">
                <div>
                  <h2 className="np-select__title">ADA encontró {products.length} opciones</h2>
                  <p className="np-select__subtitle">Ordenados por score ADA — mayor puntaje = mejor oportunidad</p>
                </div>
                {simulatedSearchStats && (
                  <div className="np-simulator-badge">
                    ⚡ Catálogo 1M: {simulatedSearchStats.executionTimeMs}ms
                  </div>
                )}
                <button type="button" className="np-select__back-btn" onClick={() => setStep('discovery')}>
                  ← Nueva búsqueda
                </button>
              </div>

              {simulatedSearchStats && (
                <div className="np-simulator-stats">
                  <strong>Búsqueda en Catálogo de 1,000,000 productos:</strong>
                  <span>📂 Nicho: {simulatedSearchStats.totalCategoryMatch?.toLocaleString()}</span> ·
                  <span>📦 Stock Seguro (mín. {calculateMinStock(budget)} uds): {simulatedSearchStats.totalStockMatch?.toLocaleString()}</span> ·
                  <span>🏷️ Proveedores Premium/Verificados: {simulatedSearchStats.totalSupplierMatch?.toLocaleString()}</span> ·
                  <span>🔍 Coincidentes: {simulatedSearchStats.totalQueryMatch?.toLocaleString()}</span>
                </div>
              )}

              <div className="np-select-split">
                {/* Panel Izquierdo: Analista */}
                <div className="np-analyst-panel">
                  <div className="np-analyst-panel__header">
                    <span className="np-analyst-panel__status-dot"></span>
                    <strong>Gali Analista IA</strong>
                  </div>
                  
                  <div className="np-analyst-chat__box" ref={analystChatBoxRef}>
                    {analystMessages.map((msg, idx) => (
                      <div key={idx} className={`np-analyst-bubble ${msg.sender === 'agent' ? 'np-analyst-bubble--agent' : 'np-analyst-bubble--user'}`}>
                        <div className="np-analyst-bubble__avatar">
                          {msg.sender === 'agent' ? '🎯' : '👤'}
                        </div>
                        <div className="np-analyst-bubble__content">
                          <p className="np-analyst-bubble__text">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                    {isGeneratingAnalyst && (
                      <div className="np-analyst-bubble np-analyst-bubble--agent">
                        <div className="np-analyst-bubble__avatar">🎯</div>
                        <div className="np-analyst-bubble__content">
                          <div className="np-chat-loading-dots">
                            <span></span><span></span><span></span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="np-analyst-chat__quick-questions">
                    <button type="button" className="np-analyst-quick-btn" onClick={() => askAnalystGali('¿Cuál de estos tiene mayor margen estimado?')}>
                      📈 Mayor Margen
                    </button>
                    <button type="button" className="np-analyst-quick-btn" onClick={() => askAnalystGali('¿Qué proveedor tiene la mejor tasa de entrega?')}>
                      🚀 Proveedor más Confiable
                    </button>
                    <button type="button" className="np-analyst-quick-btn" onClick={() => askAnalystGali('¿Cuál tiene stock más seguro para escalar?')}>
                      📦 Mayor Stock
                    </button>
                  </div>

                  <div className="np-analyst-chat__input-row">
                    <input
                      type="text"
                      className="np-analyst-chat__input"
                      placeholder="Pregúntale a Gali sobre los productos..."
                      value={analystInput}
                      onChange={e => setAnalystInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && askAnalystGali()}
                      disabled={isGeneratingAnalyst} />
                    <button type="button" className="np-analyst-chat__send-btn" onClick={() => askAnalystGali()} disabled={!analystInput.trim() || isGeneratingAnalyst}>
                      Preguntar
                    </button>
                  </div>
                </div>

                {/* Panel Derecho: Catálogo Grid */}
                <div className="np-catalog-panel">
                  <div className="np-products-grid">
                    {products.map(product => (
                      <div
                        key={product.id}
                        className={`np-product-card ${selectedProduct?.id === product.id ? 'np-product-card--selected' : ''}`}
                        onClick={() => selectProduct(product)}>

                        <div className="np-product-card__score" data-level={getScoreClass(product.adaScore)}>
                          <span className="np-product-card__score-num">{product.adaScore}</span>
                          <span className="np-product-card__score-label">ADA</span>
                        </div>

                        <div className="np-product-card__main">
                          <strong className="np-product-card__name">{product.name}</strong>
                          <span className="np-product-card__cat">{product.category}</span>
                        </div>

                        <div className="np-product-card__stats">
                          <div className="np-product-stat">
                            <span className="np-product-stat__label">Margen</span>
                            <strong className="np-product-stat__val">{product.margin}</strong>
                          </div>
                          <div className="np-product-stat">
                            <span className="np-product-stat__label">Stock</span>
                            <strong className="np-product-stat__val">{product.stock}</strong>
                          </div>
                          <div className="np-product-stat">
                            <span className="np-product-stat__label">Tendencia</span>
                            <strong className="np-product-stat__val">{product.trendLabel}</strong>
                          </div>
                        </div>

                        <div className="np-product-card__provider">
                          <Building size={12} style={{ marginRight: 4, display: 'inline-block', verticalAlign: 'middle' }} />
                          {product.provider}
                          <span className="np-badge np-badge--tier" data-tier={product.providerTier}>{product.providerTier}</span>
                        </div>

                        {product.providerTier === 'Verificado' && (
                          <div className="np-product-card__warning-badge">⚠️ Riesgo Medio</div>
                        )}

                        <div className="np-product-card__actions">
                          <button type="button" className="np-product-card__compare-btn" onClick={(e) => openComparisonModal(product, e)}>
                            <Sliders size={12} style={{ marginRight: 4, display: 'inline-block', verticalAlign: 'middle' }} /> Comparar proveedores
                          </button>
                        </div>

                        {selectedProduct?.id === product.id && (
                          <div className="np-product-card__selected-badge">✓ Seleccionado</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="np-select__footer">
                <button
                  type="button"
                  className="np-select__cta"
                  disabled={!selectedProduct}
                  onClick={goToEstrategia}>
                  Continuar con {selectedProduct?.name ?? 'un producto'} →
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* MODAL DE COMPARACIÓN DE PROVEEDORES */}
      {comparisonModalOpen && (
        <div className="np-modal-overlay" onClick={closeComparisonModal}>
          <div className="np-modal-content" onClick={e => e.stopPropagation()}>
            <div className="np-modal-header">
              <h3>Comparador de Proveedores</h3>
              <button type="button" className="np-modal-close" onClick={closeComparisonModal}>×</button>
            </div>
            <div className="np-modal-body">
              <p className="np-modal-subtitle">
                Mostrando todos los proveedores que tienen inventario para: 
                <strong> {comparisonProduct?.name}</strong>
              </p>

              <div className="np-compare-table-wrapper">
                <table className="np-compare-table">
                  <thead>
                    <tr>
                      <th>Proveedor</th>
                      <th>Reputación (Despacho)</th>
                      <th>Costo Base</th>
                      <th>Flete Base</th>
                      <th>Costo Total (COGS)</th>
                      <th>Precio Venta</th>
                      <th>Margen Est.</th>
                      <th>Stock</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonVariants.map(v => (
                      <tr key={v.id} className={selectedProduct?.provider === v.proveedor ? 'np-compare-row--selected' : ''}>
                        <td>
                          <strong>{v.proveedor}</strong>
                          <span className="np-badge np-badge--tier" data-tier={v.providerTier}>{v.providerTier}</span>
                        </td>
                        <td>
                          <span className={`np-delivery-rating ${v.deliveryRate >= 92 ? 'np-delivery-rating--high' : v.deliveryRate >= 85 ? 'np-delivery-rating--med' : 'np-delivery-rating--low'}`}>
                            {v.deliveryRate}%
                          </span>
                        </td>
                        <td>${v.cost?.toLocaleString('es-CO')} COP</td>
                        <td>${v.flete?.toLocaleString('es-CO')} COP</td>
                        <td><strong>${v.cogs?.toLocaleString('es-CO')} COP</strong></td>
                        <td>${v.price?.toLocaleString('es-CO')} COP</td>
                        <td className="np-compare-margin">{v.margin}</td>
                        <td>
                          <span className={`np-compare-stock ${v.stock < 50 ? 'np-compare-stock--low' : ''}`}>
                            {v.stock} uds
                          </span>
                        </td>
                        <td>
                          <button type="button" className="np-compare-select-btn" onClick={() => selectVariant(v)}>
                            Elegir este
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ETAPA 3: ESTRATEGIA CREATIVA ── */}
      {step === 'estrategia' && (
        <div className="np-estrategia">
          <div className="np-section-header">
            <div className="np-gali-label">
              <span className="np-gali-label__dot" style={{ background: '#818cf8' }}></span>
              <strong>Gali</strong> · generando ángulos de venta para {selectedProduct?.name}
            </div>
            <h2 className="np-section-header__title">Elige tu estrategia de venta</h2>
            <p className="np-section-header__sub">Cada ángulo apunta a un estado emocional distinto del cliente. Elige el que más conecta con tu audiencia.</p>
          </div>

          <div className="np-angulos">
            {angulos.map(a => (
              <div key={a.id} className={`np-angulo ${selectedAngulo?.id === a.id ? 'np-angulo--selected' : ''}`}
                   onClick={() => setSelectedAngulo(a)} role="button" tabIndex={0}>
                <div className="np-angulo__header">
                  <strong className="np-angulo__titulo">{a.titulo}</strong>
                  {selectedAngulo?.id === a.id && <span className="np-angulo__check">✓</span>}
                </div>
                <p className="np-angulo__hook">"{a.hook}"</p>
                <div className="np-angulo__guion">
                  <span className="np-angulo__guion-label">Estructura del guión</span>
                  <p className="np-angulo__guion-text">{a.guion}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="np-section-footer">
            <button type="button" className="np-btn np-btn--secondary" onClick={() => setStep('select')}>← Atrás</button>
            <button type="button" className="np-btn np-btn--primary" disabled={!selectedAngulo} onClick={goToLanding}>
              {selectedAngulo ? `Continuar: "${selectedAngulo.titulo}" →` : 'Selecciona un ángulo →'}
            </button>
          </div>
        </div>
      )}

      {/* ── ETAPA 4: LANDING PAGE ── */}
      {step === 'landing' && (
        <div className="np-landing">
          <div className="np-section-header">
            <div className="np-gali-label">
              <span className="np-gali-label__dot" style={{ background: '#f97316' }}></span>
              <strong>Roax</strong> · generando estructura de landing page
            </div>
            <h2 className="np-section-header__title">Vista previa de tu landing page</h2>
            <p className="np-section-header__sub">Gali estructuró esta página con base en el ángulo "{selectedAngulo?.titulo}".</p>
          </div>

          <div className="np-landing-preview">
            <div className="np-landing-preview__frame">
              <div className="np-lp-hero">
                <div className="np-lp-hero__emoji">{selectedProduct?.category === 'Mascotas' ? '🐾' : selectedProduct?.category === 'Salud & Bienestar' ? '🌿' : '✨'}</div>
                <h3 className="np-lp-hero__headline">{selectedAngulo?.hook}</h3>
                <p className="np-lp-hero__sub">{selectedProduct?.name} — envío en 24h a todo Colombia</p>
                <div className="np-lp-hero__cta">¡Lo quiero ahora!</div>
              </div>
              <div className="np-lp-benefits">
                <div className="np-lp-benefit"><span>✓</span> Envío gratis en Bogotá, Medellín y Cali</div>
                <div className="np-lp-benefit"><span>✓</span> Pago contra entrega</div>
                <div className="np-lp-benefit"><span>✓</span> Garantía de satisfacción</div>
              </div>
              <div className="np-lp-badge">Estructura generada por Gali</div>
            </div>

            {/* Page Pilot Deploy */}
            <div className="np-page-pilot">
              <div className="np-page-pilot__header">
                <span className="np-page-pilot__badge">Page Pilot MCP</span>
                <span className="np-page-pilot__sub">Publica esta landing en vivo en segundos — sin salir de Dropi</span>
              </div>

              {pagePilotState === 'idle' && (
                <button type="button" className="np-page-pilot__deploy-btn" onClick={publishLanding}>
                  🚀 Publicar landing en vivo →
                </button>
              )}

              {pagePilotState === 'generating' && (
                <div className="np-page-pilot__progress">
                  <div className="np-page-pilot__spinner"></div>
                  <span>Gali está generando HTML/CSS desde el ángulo seleccionado…</span>
                </div>
              )}

              {pagePilotState === 'deploying' && (
                <div className="np-page-pilot__progress">
                  <div className="np-page-pilot__spinner np-page-pilot__spinner--deploy"></div>
                  <span>Desplegando en servidor Dropi… asignando dominio…</span>
                </div>
              )}

              {pagePilotState === 'live' && (
                <div className="np-page-pilot__live">
                  <div className="np-page-pilot__live-header">
                    <span className="np-page-pilot__live-dot"></span>
                    <strong>Landing en vivo</strong>
                    <span className="np-page-pilot__live-cvr">CVR estimado: {landingCvr}%</span>
                  </div>
                  <div className="np-page-pilot__live-url">
                    <span className="np-page-pilot__url-icon">🌐</span>
                    <span className="np-page-pilot__url-text">{pagePilotUrl}</span>
                    <button type="button" className="np-page-pilot__copy-btn" onClick={() => navigator.clipboard.writeText(pagePilotUrl)}>Copiar link</button>
                  </div>
                  <p className="np-page-pilot__live-note">Roax usará este URL en la campaña de Meta Ads. El pixel de Dropi ya está instalado — cada conversión quedará atribuida automáticamente.</p>
                </div>
              )}

              <div className="np-landing-options">
                <button type="button" className="np-landing-opt">
                  <span className="np-landing-opt__icon">📁</span>
                  <div>
                    <strong>Subir mis propias imágenes</strong>
                    <span>Personaliza con creativos desde Google Drive</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="np-section-footer">
            <button type="button" className="np-btn np-btn--secondary" onClick={() => setStep('estrategia')}>← Atrás</button>
            <button type="button" className="np-btn np-btn--primary" onClick={goToCampana}>
              Continuar a campaña →
            </button>
          </div>
        </div>
      )}

      {/* ── ETAPA 5: CONFIGURACIÓN DE CAMPAÑA ── */}
      {step === 'campana' && (
        <div className="np-campana">
          <div className="np-section-header">
            <div className="np-gali-label">
              <span className="np-gali-label__dot" style={{ background: '#f97316' }}></span>
              <strong>Roax</strong> · pre-configurando campaña en Meta Ads
            </div>
            <h2 className="np-section-header__title">Configura tu campaña</h2>
            <p className="np-section-header__sub">Roax usará estos parámetros para lanzar y optimizar automáticamente.</p>
          </div>

          <div className="np-campana-form">
            {/* Calculadora */}
            <div className="np-precio-calc">
              <h3 className="np-precio-calc__title">Calculadora de precio de venta</h3>
              <p className="np-precio-calc__sub">Ingresa costos y Gali calcula el precio mínimo para que sea rentable.</p>
              <div className="np-precio-calc__grid">
                <label className="np-breakeven__field">
                  <span>Costo del producto (COGS)</span>
                  <input type="number" value={cogs} onChange={e => setCogs(Number(e.target.value))} />
                </label>
                <label className="np-breakeven__field">
                  <span>Costo flete promedio</span>
                  <input type="number" value={fleteUnit} onChange={e => setFleteUnit(Number(e.target.value))} />
                </label>
              </div>
              <div className="np-precio-calc__result-row">
                <div className="np-precio-calc__sugerido">
                  <span className="np-precio-calc__label">Precio sugerido</span>
                  <strong className="np-precio-calc__val">${((cogs + fleteUnit) * 2.5).toLocaleString('es-CO')}</strong>
                  <span className="np-precio-calc__hint">= (costo total) × 2.5</span>
                </div>
                <div className="np-precio-calc__divider"></div>
                <label className="np-breakeven__field">
                  <span>Tu precio de venta</span>
                  <input type="number" value={precioVenta} onChange={e => setPrecioVenta(Number(e.target.value))} />
                </label>
                <div className={`np-precio-calc__margen ${margenProyectado >= 25 ? 'np-precio-calc__margen--ok' : margenProyectado > 0 ? 'np-precio-calc__margen--warn' : ''}`}>
                  <span>Margen proyectado</span>
                  <strong>{margenProyectado}%</strong>
                  {margenProyectado >= 25 ? (
                    <span className="np-precio-calc__margen-tip">✓ Buen margen</span>
                  ) : margenProyectado > 0 ? (
                    <span className="np-precio-calc__margen-tip">↑ Sube el precio</span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="np-campana-field">
              <label className="np-campana-label">Presupuesto diario inicial</label>
              <div className="np-gali-rec-badge">
                <span className="np-gali-rec-badge__dot"></span>
                <span>Gali recomienda: <strong>{galiPresupuestoRec}</strong></span>
                <span className="np-gali-rec-badge__sub">para alcanzar {pedidosTarget} pedidos esta semana</span>
              </div>
              <div className="np-budget-row">
                <input type="range" min="50000" max="500000" step="25000"
                  value={budget} onChange={e => setBudget(Number(e.target.value))}
                  className="np-budget-slider" />
                <span className="np-budget-val">{budgetFormatted}</span>
              </div>
              <p className="np-campana-hint">ROAS estimado con este presupuesto: <strong>{roasCalculated}</strong></p>
            </div>

            <div className="np-breakeven">
              <h3 className="np-breakeven__title">Brújula: break-even ROAS</h3>
              <p className="np-breakeven__sub">Si tu ROAS en Meta cae por debajo de este número, pierdes plata en cada venta.</p>
              <p className="np-breakeven__result">
                Tu ROAS mínimo para no perder: <strong>{breakEvenRoas}x</strong>
                <span className="np-breakeven__hint">— Roax pausará si el ROAS real cae bajo {(breakEvenRoas - 0.2).toFixed(1)}x (margen de seguridad).</span>
              </p>
            </div>

            <div className="np-campana-field">
              <label className="np-campana-label">Objetivo de pedidos por semana</label>
              <div className="np-pedidos-row">
                <input type="range" min="5" max="100" step="5"
                  value={pedidosTarget} onChange={e => setPedidosTarget(Number(e.target.value))}
                  className="np-budget-slider" />
                <span className="np-budget-val">{pedidosTarget} pedidos/sem</span>
              </div>
            </div>

            <div className="np-campana-agentes">
              <h3 className="np-campana-agentes__title">Agentes que trabajarán en este proyecto</h3>
              <p className="np-campana-agentes__sub">Activa los agentes que quieres asignar. Cada uno actúa en su área de forma autónoma.</p>

              {[
                {key:'roax', nombre:'Roax', color:'#f97316', desc:'Gestiona y optimiza tu campaña Meta Ads en tiempo real'},
                {key:'vigilante', nombre:'Vigilante', color:'#fbbf24', desc:'Monitorea novedades logísticas y protege cada pedido'},
                {key:'chatea', nombre:'Chatea Pro', color:'#34d399', desc:'Responde confirmaciones de WhatsApp automáticamente'},
                {key:'ada', nombre:'ADA Spy', color:'#818cf8', desc:'Alerta si aparece competencia directa en el mercado'},
                {key:'kronos', nombre:'Kronos', color:'#60a5fa', desc:'Gestiona facturación y cobros del proyecto'}
              ].map(ag => (
                <div key={ag.key} className={`np-agente-card ${agentesProyecto[ag.key] ? 'np-agente-card--active' : ''}`}>
                  <div className="np-agente-card__header">
                    <div className="np-agente-card__info">
                      <span className="np-agente-card__dot" style={{ background: ag.color }}></span>
                      <strong className="np-agente-card__name">{ag.nombre}</strong>
                    </div>
                    <label className="np-toggle">
                      <input type="checkbox" checked={agentesProyecto[ag.key]} onChange={() => toggleAgente(ag.key)} />
                      <span className="np-toggle__knob"></span>
                    </label>
                  </div>
                  <p className="np-agente-card__desc">{ag.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="np-section-footer">
            <button type="button" className="np-btn np-btn--secondary" onClick={() => setStep('landing')}>← Atrás</button>
            <button type="button" className="np-btn np-btn--launch" onClick={launchProject}>
              {isLaunching ? (
                <>
                  <span className="np-loading-dots"><span></span><span></span><span></span></span>
                  Gali está activando tu proyecto...
                </>
              ) : (
                '🚀 Activar proyecto'
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── ETAPA 6: LANZADO ── */}
      {step === 'launch' && (
        <div className="np-launch">
          <div className="np-launch__config">
            <h2 className="np-launch__title">Configura tu proyecto</h2>

            <div className="np-launch__field">
              <label className="np-launch__label">Nombre del proyecto</label>
              <input
                type="text"
                className="np-launch__input"
                value={projectName}
                onChange={e => setProjectName(e.target.value)} />
            </div>

            <div className="np-launch__field">
              <label className="np-launch__label">Presupuesto inicial de pauta</label>
              <div className="np-launch__budget-row">
                <input
                  type="range"
                  className="np-launch__range"
                  min="50000"
                  max="2000000"
                  step="50000"
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))} />
                <span className="np-launch__budget-val">{budgetFormatted}</span>
              </div>
            </div>

            <div className="np-launch__field">
              <label className="np-launch__label">Objetivo</label>
              <div className="np-launch__options">
                <button type="button" className="np-launch__option np-launch__option--active">🎯 Probar rápido</button>
                <button type="button" className="np-launch__option">📈 Escalar</button>
                <button type="button" className="np-launch__option">🔬 Investigar</button>
              </div>
            </div>

            <button type="button" className="np-launch__back" onClick={() => setStep('select')}>
              ← Cambiar producto
            </button>
          </div>

          <div className="np-launch__gali-panel">
            <div className="np-launch__gali-header">
              <span className="np-launch__gali-dot"></span>
              <strong className="np-launch__gali-title">✦ Gali · Tu estrategia</strong>
            </div>

            <div className="np-launch__gali-body">
              <p className="np-launch__gali-intro">
                Para <strong>{selectedProduct?.name}</strong> con {budgetFormatted} de presupuesto:
              </p>

              <ul className="np-launch__gali-points">
                <li>
                  <span className="np-launch__gali-check">●</span>
                  Target ROAS: <strong>{roasCalculated}</strong> (basado en tu histórico y el margen del {selectedProduct?.margin})
                </li>
                <li>
                  <span className="np-launch__gali-check">●</span>
                  Roax lanzará <strong>3 creativos en A/B</strong> para encontrar el mejor ángulo
                </li>
                <li>
                  <span className="np-launch__gali-check">●</span>
                  Vigilante monitoreará novedades en tiempo real en todas las ciudades
                </li>
                <li>
                  <span className="np-launch__gali-check">●</span>
                  ADA Spy te alertará si aparece competencia directa en el mercado
                </li>
                <li>
                  <span className="np-launch__gali-check">●</span>
                  Chatea Pro gestionará confirmaciones de WhatsApp automáticamente
                </li>
              </ul>
            </div>

            <div className="np-launch__gali-actions">
              <button type="button" className="np-launch__btn-primary" onClick={() => setShowConfirmLaunch(true)}>
                🚀 Lanzar proyecto
              </button>
              <button type="button" className="np-launch__btn-secondary" onClick={saveDraft}>
                Guardar como borrador
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diálogo de confirmación previo */}
      {showConfirmLaunch && (
        <div className="np-launch-modal-backdrop" onClick={() => setShowConfirmLaunch(false)}>
          <div className="np-launch-modal np-launch-modal--confirm" onClick={e => e.stopPropagation()}>
            <h2 className="np-launch-modal__title">¿Lanzar este proyecto?</h2>
            <div className="np-launch-modal__summary">
              <div className="np-launch-modal__summary-row">
                <span>Proyecto</span>
                <strong>{projectName || selectedProduct?.name || 'Sin nombre'}</strong>
              </div>
              <div className="np-launch-modal__summary-row">
                <span>Producto</span>
                <strong>{selectedProduct?.name ?? '—'}</strong>
              </div>
              <div className="np-launch-modal__summary-row">
                <span>Presupuesto diario</span>
                <strong>{budgetFormatted}</strong>
              </div>
            </div>
            <div className="np-launch-modal__confirm-actions">
              <button type="button" className="np-launch-modal__cta" onClick={confirmLaunch}>Confirmar y lanzar →</button>
              <button type="button" className="np-launch-modal__cancel" onClick={() => setShowConfirmLaunch(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de lanzamiento */}
      {showLaunchModal && (
        <div className="np-launch-modal-backdrop" onClick={() => launchSuccess && closeLaunchModal()}>
          <div className="np-launch-modal" onClick={e => e.stopPropagation()}>
            {!launchSuccess ? (
              <div className="np-launch-modal__loading">
                <div className="np-launch-modal__spinner"></div>
                <p className="np-launch-modal__msg">Gali está configurando tu proyecto...</p>
                <p className="np-launch-modal__sub">Activando agentes · conectando campañas · preparando tracking</p>
              </div>
            ) : (
              <div className="np-launch-modal__success">
                <div className="np-launch-modal__icon">🚀</div>
                <h2 className="np-launch-modal__title">¡Proyecto lanzado!</h2>
                <p className="np-launch-modal__desc">
                  <strong>{selectedProduct?.name ?? 'Tu proyecto'}</strong> está activo.
                  Los agentes ya están trabajando — te avisaremos cuando haya novedades.
                </p>
                <button type="button" className="np-launch-modal__cta" onClick={closeLaunchModal}>
                  Ver mi proyecto →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast de borrador guardado */}
      {showDraftToast && (
        <div className="np-draft-toast">
          <span className="np-draft-toast__icon">✓</span>
          Proyecto guardado como borrador. Puedes retomarlo desde Proyectos.
        </div>
      )}

      {/* Toast de notificación Dropi Pulso */}
      {showNotifyToast && (
        <div className="np-draft-toast">
          <span className="np-draft-toast__icon">✓</span>
          Te avisaremos por WhatsApp y correo cuando el producto esté disponible.
        </div>
      )}
    </div>
  );
}
