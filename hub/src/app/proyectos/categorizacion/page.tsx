"use client";

import React, { useEffect, useState, useRef, useCallback, MouseEvent, WheelEvent } from "react";

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

// Google taxonomy types
interface GoogleTaxonomyStats {
  count: number;
}

interface CategoryMapping {
  id: number;
  dropi_category_id: string;
  dropi_category_path: string;
  google_category_id: string;
  google_category_path: string;
  suggestion_rank: number;
  match_type: string;
  confidence_score: number;
  confidence_label: string;
  status: string;
  reviewed_by: string | null;
  notes: string | null;
}

interface SuggestResult {
  dropi_categories: number;
  google_categories: number;
  mapping_rows_saved: number;
  rank1_summary: { high: number; medium: number; low: number; needs_review: number };
}

// Homologation unified taxonomy targets
interface TargetCategory {
  l1: string;
  l2: string;
  l3: string;
  l4: string;
  alert?: "typo" | "campaign" | "trash" | null;
  suggestedFix?: string;
}

// Define the mapping dictionary from chaotic raw names to clean unifications
const DROPI_MAPPING_DICT: Record<string, TargetCategory> = {
  // Hogar / Cocina / Jardin
  "HOGAR": { l1: "Hogar y Decoración", l2: "Hogar General", l3: "Artículos Varios", l4: "Otros Productos de Hogar" },
  "NATURAL HOME": { l1: "Hogar y Decoración", l2: "Hogar General", l3: "Artículos Varios", l4: "Otros Productos de Hogar" },
  "HOGAR Y DECORACION": { l1: "Hogar y Decoración", l2: "Decoración y Diseño", l3: "Adornos de Hogar", l4: "Adornos de Mesa y Pared" },
  "HOGAT": { l1: "Hogar y Decoración", l2: "Hogar General", l3: "Artículos Varios", l4: "Otros Productos de Hogar", alert: "typo", suggestedFix: "HOGAR" },
  "MUEBLES": { l1: "Hogar y Decoración", l2: "Muebles y Mobiliario", l3: "Muebles de Interior", l4: "Muebles de Sala (Sofás, Mesas de Centro)" },
  "JARDIN": { l1: "Hogar y Decoración", l2: "Jardín y Exteriores", l3: "Cuidado de Jardín", l4: "Herramientas de Jardinería" },
  "JARDINERIA": { l1: "Hogar y Decoración", l2: "Jardín y Exteriores", l3: "Cuidado de Jardín", l4: "Herramientas de Jardinería" },
  "ACCESORIOS HOGAR": { l1: "Hogar y Decoración", l2: "Hogar General", l3: "Artículos Varios", l4: "Otros Productos de Hogar" },
  "DECORACION PARA EL HOGAR": { l1: "Hogar y Decoración", l2: "Decoración y Diseño", l3: "Adornos de Hogar", l4: "Adornos de Mesa y Pared" },
  "DECORACION": { l1: "Hogar y Decoración", l2: "Decoración y Diseño", l3: "Adornos de Hogar", l4: "Adornos de Mesa y Pared" },
  "ESCRITORIOS": { l1: "Hogar y Decoración", l2: "Muebles y Mobiliario", l3: "Muebles de Interior", l4: "Muebles de Oficina y Escritorios" },
  "ESCRITORIOS Y MUEBLES": { l1: "Hogar y Decoración", l2: "Muebles y Mobiliario", l3: "Muebles de Interior", l4: "Muebles de Oficina y Escritorios" },
  "COCINA": { l1: "Hogar y Decoración", l2: "Cocina y Utensilios", l3: "Vajilla y Servir", l4: "Platos y Vajillas Completas" },
  "COCINA Y ELECTRODOMESTICOS": { l1: "Hogar y Decoración", l2: "Cocina y Utensilios", l3: "Electrodomésticos de Cocina", l4: "Licuadoras y Batidoras" },
  "UTENSLIOS DE COOKINA": { l1: "Hogar y Decoración", l2: "Cocina y Utensilios", l3: "Cocción y Preparación", l4: "Utensilios de Cocina (Cucharas, Espátulas)", alert: "typo", suggestedFix: "UTENSILIOS DE COCINA" },
  "UTENSILIOS DE COCINA": { l1: "Hogar y Decoración", l2: "Cocina y Utensilios", l3: "Cocción y Preparación", l4: "Utensilios de Cocina (Cucharas, Espátulas)" },
  "LIMPIEZA": { l1: "Hogar y Decoración", l2: "Limpieza, Aseo y Cuidado", l3: "Utensilios de Limpieza", l4: "Escobas, Trapeadores y Mopas" },
  "HIGIENE Y LIMPIEZA": { l1: "Hogar y Decoración", l2: "Limpieza, Aseo y Cuidado", l3: "Utensilios de Limpieza", l4: "Escobas, Trapeadores y Mopas" },
  "ASEO": { l1: "Hogar y Decoración", l2: "Limpieza, Aseo y Cuidado", l3: "Utensilios de Limpieza", l4: "Escobas, Trapeadores y Mopas" },
  "ASEO Y BIENESTAR": { l1: "Hogar y Decoración", l2: "Limpieza, Aseo y Cuidado", l3: "Utensilios de Limpieza", l4: "Escobas, Trapeadores y Mopas" },
  "HIGIENE": { l1: "Hogar y Decoración", l2: "Limpieza, Aseo y Cuidado", l3: "Utensilios de Limpieza", l4: "Escobas, Trapeadores y Mopas" },
  "HIGIENE LIMPIEZA": { l1: "Hogar y Decoración", l2: "Limpieza, Aseo y Cuidado", l3: "Utensilios de Limpieza", l4: "Escobas, Trapeadores y Mopas" },
  "LIMPIADOR MAGNETICO": { l1: "Hogar y Decoración", l2: "Limpieza, Aseo y Cuidado", l3: "Utensilios de Limpieza", l4: "Limpiadores Magnéticos y de Vidrios" },

  // Mascotas
  "MASCOTAS": { l1: "Mascotas", l2: "Mascotas General", l3: "Accesorios de Mascota", l4: "Accesorios de Paseo y Arnés" },

  // Tecnología
  "TECNOLOGIA": { l1: "Tecnología y Electrónica", l2: "Tecnología General", l3: "Componentes y Accesorios", l4: "Cables y Adaptadores de Datos" },
  "TEGNOLOGIA": { l1: "Tecnología y Electrónica", l2: "Tecnología General", l3: "Componentes y Accesorios", l4: "Cables y Adaptadores de Datos", alert: "typo", suggestedFix: "TECNOLOGIA" },
  "TECNOLOGIA Y ELECTRONICA": { l1: "Tecnología y Electrónica", l2: "Tecnología General", l3: "Componentes y Accesorios", l4: "Cables y Adaptadores de Datos" },
  "ELECTRONICA Y TECNOLOGIA": { l1: "Tecnología y Electrónica", l2: "Tecnología General", l3: "Componentes y Accesorios", l4: "Cables y Adaptadores de Datos" },
  "ELECTRONICA": { l1: "Tecnología y Electrónica", l2: "Electrónica General", l3: "Otros Artículos", l4: "Otros Artículos Electrónicos" },
  "ELECTRONICOS": { l1: "Tecnología y Electrónica", l2: "Electrónica General", l3: "Otros Artículos", l4: "Otros Artículos Electrónicos" },
  "GADGETS": { l1: "Tecnología y Electrónica", l2: "Gadgets y Novedades", l3: "Dispositivos Inteligentes", l4: "Smartwatches y Pulseras Inteligentes" },
  "GATGETS": { l1: "Tecnología y Electrónica", l2: "Gadgets y Novedades", l3: "Dispositivos Inteligentes", l4: "Smartwatches y Pulseras Inteligentes", alert: "typo", suggestedFix: "GADGETS" },
  "VIDEOJUEGOS": { l1: "Tecnología y Electrónica", l2: "Videojuegos y Consolas", l3: "Accesorios de Consolas", l4: "Controles y Joysticks" },

  // Belleza / Cuidado
  "BELLEZA": { l1: "Belleza y Cuidado Personal", l2: "Belleza General", l3: "Almacenamiento de Belleza", l4: "Organizadores de Maquillaje" },
  "BELLEZA Y CUIDADO PERSONAL": { l1: "Belleza y Cuidado Personal", l2: "Belleza General", l3: "Almacenamiento de Belleza", l4: "Organizadores de Maquillaje" },
  "BELLEZA COSMETICA": { l1: "Belleza y Cuidado Personal", l2: "Maquillaje y Cosméticos", l3: "Maquillaje Rostro/Ojos", l4: "Maquillaje de Ojos y Rostro" },
  "MAQUILLAJE Y BELLEZA": { l1: "Belleza y Cuidado Personal", l2: "Maquillaje y Cosméticos", l3: "Maquillaje Rostro/Ojos", l4: "Maquillaje de Ojos y Rostro" },
  "COSMETICOS": { l1: "Belleza y Cuidado Personal", l2: "Maquillaje y Cosméticos", l3: "Maquillaje Rostro/Ojos", l4: "Maquillaje de Ojos y Rostro" },
  "MAQUILLAJE": { l1: "Belleza y Cuidado Personal", l2: "Maquillaje y Cosméticos", l3: "Maquillaje Rostro/Ojos", l4: "Maquillaje de Ojos y Rostro" },
  "COSMETICOS Y PERFUMERIA": { l1: "Belleza y Cuidado Personal", l2: "Maquillaje y Cosméticos", l3: "Maquillaje Rostro/Ojos", l4: "Maquillaje de Ojos y Rostro" },
  "PERFUMERIA": { l1: "Belleza y Cuidado Personal", l2: "Perfumería y Fragancias", l3: "Fragancias de Diseño", l4: "Perfumes de Dama" },
  "PERFUMES": { l1: "Belleza y Cuidado Personal", l2: "Perfumería y Fragancias", l3: "Fragancias de Diseño", l4: "Perfumes de Dama" },
  "CUIDADO PERSONAL": { l1: "Belleza y Cuidado Personal", l2: "Higiene y Cuidado Personal", l3: "Afeitado y Depilación", l4: "Rasuradoras y Cortadoras de Barba" },
  "CUIDADO": { l1: "Belleza y Cuidado Personal", l2: "Higiene y Cuidado Personal", l3: "Afeitado y Depilación", l4: "Rasuradoras y Cortadoras de Barba" },
  "CAPILAR": { l1: "Belleza y Cuidado Personal", l2: "Cuidado Capilar", l3: "Productos para el Cabello", l4: "Tratamientos y Aceites Capilares" },
  "CORPORAL": { l1: "Belleza y Cuidado Personal", l2: "Cuidado Corporal", l3: "Estética Corporal", l4: "Masajeadores Corporales" },
  "FAJAS": { l1: "Belleza y Cuidado Personal", l2: "Fajas y Ropa Control", l3: "Moldeadores", l4: "Fajas Reductoras Femeninas" },

  // Salud / Bienestar
  "SALUD": { l1: "Salud y Bienestar", l2: "Salud General", l3: "Ortopedia y Postura", l4: "Correctores de Postura" },
  "BIENESTAR": { l1: "Salud y Bienestar", l2: "Salud General", l3: "Ortopedia y Postura", l4: "Correctores de Postura" },
  "BIENESTAR Y SALUD": { l1: "Salud y Bienestar", l2: "Salud General", l3: "Ortopedia y Postura", l4: "Correctores de Postura" },
  "SALUD Y BIENESTAR": { l1: "Salud y Bienestar", l2: "Salud General", l3: "Ortopedia y Postura", l4: "Correctores de Postura" },
  "SALUD BIENESTAR NATURAL": { l1: "Salud y Bienestar", l2: "Salud General", l3: "Ortopedia y Postura", l4: "Correctores de Postura" },
  "SALUD Y CUIDADO PERSONAL": { l1: "Salud y Bienestar", l2: "Salud General", l3: "Ortopedia y Postura", l4: "Correctores de Postura" },
  "SALUD BIENESTAR NATURAL ": { l1: "Salud y Bienestar", l2: "Salud General", l3: "Ortopedia y Postura", l4: "Correctores de Postura" },
  "SALUD NUTRICION": { l1: "Salud y Bienestar", l2: "Suplementos y Nutrición", l3: "Suplementos Dietarios", l4: "Vitaminas y Minerales de Venta Libre" },
  "NUTRICION": { l1: "Salud y Bienestar", l2: "Suplementos y Nutrición", l3: "Suplementos Dietarios", l4: "Vitaminas y Minerales de Venta Libre" },
  "SUPLEMENTO": { l1: "Salud y Bienestar", l2: "Suplementos y Nutrición", l3: "Suplementos Dietarios", l4: "Vitaminas y Minerales de Venta Libre" },
  "SUPLEMENTOS": { l1: "Salud y Bienestar", l2: "Suplementos y Nutrición", l3: "Suplementos Dietarios", l4: "Vitaminas y Minerales de Venta Libre" },
  "ENCAPSULADOS": { l1: "Salud y Bienestar", l2: "Suplementos y Nutrición", l3: "Suplementos Dietarios", l4: "Vitaminas y Minerales de Venta Libre" },
  "VAPORIZADORES": { l1: "Salud y Bienestar", l2: "Bienestar General", l3: "Cuidado Alternativo", l4: "Vaporizadores Personales y Pods" },
  "PODS": { l1: "Salud y Bienestar", l2: "Bienestar General", l3: "Cuidado Alternativo", l4: "Vaporizadores Personales y Pods" },

  // Adultos
  "SEX SHOP": { l1: "Productos para Adultos", l2: "Bienestar Sexual", l3: "Lubricantes y Geles", l4: "Lubricantes y Geles Íntimos" },
  "SEXSHOP": { l1: "Productos para Adultos", l2: "Bienestar Sexual", l3: "Lubricantes y Geles", l4: "Lubricantes y Geles Íntimos" },
  "SALUD SEXUAL": { l1: "Productos para Adultos", l2: "Bienestar Sexual", l3: "Protección Sexual", l4: "Preservativos y Barreras de Protección" },
  "BIENESTAR SEXUAL": { l1: "Productos para Adultos", l2: "Bienestar Sexual", l3: "Protección Sexual", l4: "Preservativos y Barreras de Protección" },
  "COSMETOLOGIA EROTICA": { l1: "Productos para Adultos", l2: "Bienestar Sexual", l3: "Sensibilizantes", l4: "Estimuladores y Geles Sensibilizantes" },
  "LUBRICANTES": { l1: "Productos para Adultos", l2: "Bienestar Sexual", l3: "Lubricantes y Geles", l4: "Lubricantes y Geles Íntimos" },
  "ACEITES PARA MASAJES": { l1: "Productos para Adultos", l2: "Bienestar Sexual", l3: "Lubricantes y Geles", l4: "Lubricantes y Geles Íntimos" },
  "ADULTO": { l1: "Productos para Adultos", l2: "Bienestar Sexual", l3: "Lubricantes y Geles", l4: "Lubricantes y Geles Íntimos" },
  "ADULTOS": { l1: "Productos para Adultos", l2: "Bienestar Sexual", l3: "Lubricantes y Geles", l4: "Lubricantes y Geles Íntimos" },

  // Moda / Calzado
  "MODA": { l1: "Moda y Calzado", l2: "Moda General", l3: "Gafas de Sol", l4: "Gafas de Sol" },
  "MODA Y ACCESORIOS": { l1: "Moda y Calzado", l2: "Bolsos, Morrales y Accesorios", l3: "Carteras y Bolsos", l4: "Carteras de Dama y Crossbody" },
  "ROPA": { l1: "Moda y Calzado", l2: "Ropa Femenina (Dama)", l3: "Prendas Superiores", l4: "Blusas y Camisetas" },
  "CALZADO": { l1: "Moda y Calzado", l2: "Calzado y Zapatos", l3: "Calzado Deportivo", l4: "Tenis y Zapatillas Deportivas" },
  "ZAPATOS": { l1: "Moda y Calzado", l2: "Calzado y Zapatos", l3: "Calzado Deportivo", l4: "Tenis y Zapatillas Deportivas" },
  "TENIS": { l1: "Moda y Calzado", l2: "Calzado y Zapatos", l3: "Calzado Deportivo", l4: "Tenis y Zapatillas Deportivas" },
  "TENIS NACIONALES": { l1: "Moda y Calzado", l2: "Calzado y Zapatos", l3: "Calzado Deportivo", l4: "Tenis y Zapatillas Deportivas" },
  "SANDALIAS": { l1: "Moda y Calzado", l2: "Calzado y Zapatos", l3: "Sandalias y Chanclas", l4: "Sandalias y Chanclas" },
  "MOCASINES": { l1: "Moda y Calzado", l2: "Calzado y Zapatos", l3: "Calzado Casual", l4: "Zapatos Casuales y Mocasines" },
  "BOTINES": { l1: "Moda y Calzado", l2: "Calzado y Zapatos", l3: "Botas y Botines", l4: "Botas y Botines" },
  "ZAPATOS CASUALES MUJER": { l1: "Moda y Calzado", l2: "Calzado y Zapatos", l3: "Calzado Casual", l4: "Zapatos Casuales y Mocasines" },
  "CASUAL": { l1: "Moda y Calzado", l2: "Moda General", l3: "Gafas de Sol", l4: "Gafas de Sol" },
  "MUJER": { l1: "Moda y Calzado", l2: "Ropa Femenina (Dama)", l3: "Prendas Superiores", l4: "Blusas y Camisetas" },
  "ACCESORIOS DAMA": { l1: "Moda y Calzado", l2: "Bolsos, Morrales y Accesorios", l3: "Carteras y Bolsos", l4: "Carteras de Dama y Crossbody" },
  "DAMA": { l1: "Moda y Calzado", l2: "Ropa Femenina (Dama)", l3: "Prendas Superiores", l4: "Blusas y Camisetas" },
  "CABALLERO": { l1: "Moda y Calzado", l2: "Ropa Masculina (Caballero)", l3: "Prendas Superiores Masculinas", l4: "Camisas y Camisetas" },
  "BOLSOS": { l1: "Moda y Calzado", l2: "Bolsos, Morrales y Accesorios", l3: "Carteras y Bolsos", l4: "Carteras de Dama y Crossbody" },
  "BOLSOS MORRALES": { l1: "Moda y Calzado", l2: "Bolsos, Morrales y Accesorios", l3: "Morrales", l4: "Morrales Escolares y Universitarios" },
  "BISUTERIA": { l1: "Moda y Calzado", l2: "Bisutería, Joyas y Relojes", l3: "Bisutería", l4: "Bisutería de Acero y Fantasía" },
  "BISTURERIA": { l1: "Moda y Calzado", l2: "Bisutería, Joyas y Relojes", l3: "Bisutería", l4: "Bisutería de Acero y Fantasía", alert: "typo", suggestedFix: "BISUTERIA" },
  "BISUTERIA Y JOYERIA": { l1: "Moda y Calzado", l2: "Bisutería, Joyas y Relojes", l3: "Bisutería", l4: "Bisutería de Acero y Fantasía" },
  "JOYERIA": { l1: "Moda y Calzado", l2: "Bisutería, Joyas y Relojes", l3: "Bisutería", l4: "Cadenas, Pulseras y Aretes" },

  // Bebes / Niños / Juguetes
  "BEBES": { l1: "Juguetes y Bebés", l2: "Accesorios y Cuidado Infantil (Bebés)", l3: "Higiene y Cuidado", l4: "Higiene del Bebé y Baño" },
  "BEBE": { l1: "Juguetes y Bebés", l2: "Accesorios and Cuidado Infantil (Bebés)", l3: "Higiene y Cuidado", l4: "Higiene del Bebé y Baño" },
  "BEBES Y NINOS": { l1: "Juguetes y Bebés", l2: "Accesorios y Cuidado Infantil (Bebés)", l3: "Higiene y Cuidado", l4: "Higiene del Bebé y Baño" },
  "NINOS": { l1: "Juguetes y Bebés", l2: "Accesorios y Cuidado Infantil (Bebés)", l3: "Higiene y Cuidado", l4: "Higiene del Bebé y Baño" },
  "MUNDO INFANTIL": { l1: "Juguetes y Bebés", l2: "Accesorios y Cuidado Infantil (Bebés)", l3: "Higiene y Cuidado", l4: "Higiene del Bebé y Baño" },
  "INFANTIL": { l1: "Juguetes y Bebés", l2: "Accesorios y Cuidado Infantil (Bebés)", l3: "Higiene y Cuidado", l4: "Higiene del Bebé y Baño" },
  "INFANTIL Y BEBES": { l1: "Juguetes y Bebés", l2: "Accesorios y Cuidado Infantil (Bebés)", l3: "Higiene y Cuidado", l4: "Higiene del Bebé y Baño" },
  "INFANTILES": { l1: "Juguetes y Bebés", l2: "Accesorios y Cuidado Infantil (Bebés)", l3: "Higiene y Cuidado", l4: "Higiene del Bebé y Baño" },
  "JUGUETES": { l1: "Juguetes y Bebés", l2: "Juguetes y Juegos", l3: "Juguetes Didácticos", l4: "Juguetes Didácticos y de Madera" },
  "JUGUETERIA": { l1: "Juguetes y Bebés", l2: "Juguetes y Juegos", l3: "Juguetes Didácticos", l4: "Juguetes Didácticos y de Madera" },
  "JUGUETES NINOS": { l1: "Juguetes y Bebés", l2: "Juguetes y Juegos", l3: "Juguetes Didácticos", l4: "Juguetes Didácticos y de Madera" },
  "JUGUETE": { l1: "Juguetes y Bebés", l2: "Juguetes y Juegos", l3: "Juguetes Didácticos", l4: "Juguetes Didácticos y de Madera" },
  "JUGUETES Y ENTRETENIMIENTO": { l1: "Juguetes y Bebés", l2: "Juguetes y Juegos", l3: "Juguetes Didácticos", l4: "Juguetes Didácticos y de Madera" },
  "JUEGOS": { l1: "Juguetes y Bebés", l2: "Juguetes y Juegos", l3: "Juegos de Mesa", l4: "Juegos de Mesa y Rompecabezas" },

  // Deportes / Outdoor
  "DEPORTES": { l1: "Deportes y Outdoor", l2: "Deportes General", l3: "Protección Deportiva", l4: "Protecciones Deportivas (Rodilleras/Coderas)" },
  "DEPORTE": { l1: "Deportes y Outdoor", l2: "Deportes General", l3: "Protección Deportiva", l4: "Protecciones Deportivas (Rodilleras/Coderas)" },
  "DEPORTE Y FITNESS": { l1: "Deportes y Outdoor", l2: "Equipos Fitness y Gimnasio", l3: "Entrenamiento en Casa", l4: "Bandas de Resistencia" },
  "FITNESS": { l1: "Deportes y Outdoor", l2: "Equipos Fitness y Gimnasio", l3: "Entrenamiento en Casa", l4: "Bandas de Resistencia" },
  "FITENSS": { l1: "Deportes y Outdoor", l2: "Equipos Fitness y Gimnasio", l3: "Entrenamiento en Casa", l4: "Bandas de Resistencia", alert: "typo", suggestedFix: "FITNESS" },
  "DEPORTIVO": { l1: "Deportes y Outdoor", l2: "Deportes General", l3: "Protección Deportiva", l4: "Protecciones Deportivas (Rodilleras/Coderas)" },
  "CAMPING": { l1: "Deportes y Outdoor", l2: "Camping y Pesca", l3: "Equipamiento de Camping", l4: "Linternas de Cabeza y Camping" },
  "PESCA": { l1: "Deportes y Outdoor", l2: "Camping y Pesca", l3: "Insumos de Pesca", l4: "Artículos de Pesca" },

  // Automotriz
  "VEHICULOS": { l1: "Ferretería y Herramientas", l2: "Automotriz y Accesorios (Carros/Motos)", l3: "Accesorios para Carros", l4: "Accesorios de Lujo para Auto" },
  "VEHICULO": { l1: "Ferretería y Herramientas", l2: "Automotriz y Accesorios (Carros/Motos)", l3: "Accesorios para Carros", l4: "Accesorios de Lujo para Auto" },
  "AUTOMOVIL": { l1: "Ferretería y Herramientas", l2: "Automotriz y Accesorios (Carros/Motos)", l3: "Accesorios para Carros", l4: "Accesorios de Lujo para Auto" },
  "AUTOMOVILES": { l1: "Ferretería y Herramientas", l2: "Automotriz y Accesorios (Carros/Motos)", l3: "Accesorios para Carros", l4: "Accesorios de Lujo para Auto" },
  "AUTOMOTRIZ": { l1: "Ferretería y Herramientas", l2: "Automotriz y Accesorios (Carros/Motos)", l3: "Accesorios para Carros", l4: "Accesorios de Lujo para Auto" },
  "ACCESORIOS PARA AUTOS": { l1: "Ferretería y Herramientas", l2: "Automotriz y Accesorios (Carros/Motos)", l3: "Accesorios para Carros", l4: "Accesorios de Lujo para Auto" },
  "ACCESORIOS DE CARROS": { l1: "Ferretería y Herramientas", l2: "Automotriz y Accesorios (Carros/Motos)", l3: "Accesorios para Carros", l4: "Accesorios de Lujo para Auto" },
  "ACCESORIOS PARA VEHICULOS": { l1: "Ferretería y Herramientas", l2: "Automotriz y Accesorios (Carros/Motos)", l3: "Accesorios para Carros", l4: "Accesorios de Lujo para Auto" },
  "ACCESORIOS PARA VEHICULOS CARRO MOTO BICICLETA": { l1: "Ferretería y Herramientas", l2: "Automotriz y Accesorios (Carros/Motos)", l3: "Accesorios para Carros", l4: "Accesorios de Lujo para Auto" },
  "MOTOS": { l1: "Ferretería y Herramientas", l2: "Automotriz y Accesorios (Carros/Motos)", l3: "Accesorios para Motos", l4: "Cascos e Impermeables para Moto" },

  // Ferreteria / Herramientas
  "FERRETERIA": { l1: "Ferretería y Herramientas", l2: "Ferretería General", l3: "Cerrajería", l4: "Candados, Cerraduras y Cerrajería" },
  "FERRETERIA Y CACHARRO": { l1: "Ferretería y Herramientas", l2: "Ferretería General", l3: "Cerrajería", l4: "Candados, Cerraduras y Cerrajería" },
  "HERRAMIENTAS": { l1: "Ferretería y Herramientas", l2: "Herramientas Manuales/Eléctricas", l3: "Equipos Eléctricos", l4: "Taladros, Pulidoras y Soldadores" },
  "BRICOLAJE Y HERRAMIENTAS": { l1: "Ferretería y Herramientas", l2: "Herramientas Manuales/Eléctricas", l3: "Equipos Eléctricos", l4: "Taladros, Pulidoras y Soldadores" },

  // Otros / Oficina
  "PAPELERIA Y OFICINA": { l1: "Otras Categorías", l2: "Papelería y Oficina", l3: "Escritorio", l4: "Cuadernos, Agendas y Libretas" },
  "PAPELERIA": { l1: "Otras Categorías", l2: "Papelería y Oficina", l3: "Escritorio", l4: "Cuadernos, Agendas y Libretas" },
  "OFICINA Y PAPELERIA": { l1: "Otras Categorías", l2: "Papelería y Oficina", l3: "Escritorio", l4: "Cuadernos, Agendas y Libretas" },
  "LIBROS": { l1: "Otras Categorías", l2: "Libros y Material Educativo", l3: "Literatura", l4: "Libros Físicos de Interés General" },
  "ARTE": { l1: "Otras Categorías", l2: "Arte, Artesanías y Hobbies", l3: "Hobbies", l4: "Kits de Pintura por Números" },
  "ARTE Y ARTESANIA": { l1: "Otras Categorías", l2: "Arte, Artesanías y Hobbies", l3: "Hobbies", l4: "Kits de Pintura por Números" },
  "ARTESANIAS": { l1: "Otras Categorías", l2: "Arte, Artesanías y Hobbies", l3: "Hobbies", l4: "Kits de Pintura por Números" },

  // Basura / Sin Categoria / General
  "Sin Categoria": { l1: "Otras Categorías", l2: "Sin Categorizar", l3: "Sin Clasificar", l4: "Productos Sin Datos Clasificados", alert: "trash" },
  "OTRO": { l1: "Otras Categorías", l2: "Sin Categorizar", l3: "Sin Clasificar", l4: "Productos Sin Datos Clasificados", alert: "trash" },
  "OTROS": { l1: "Otras Categorías", l2: "Sin Categorizar", l3: "Sin Clasificar", l4: "Productos Sin Datos Clasificados", alert: "trash" },
  "OTRA": { l1: "Otras Categorías", l2: "Sin Categorizar", l3: "Sin Clasificar", l4: "Productos Sin Datos Clasificados", alert: "trash" },
  "GENERAL": { l1: "Otras Categorías", l2: "Sin Categorizar", l3: "Sin Clasificar", l4: "Productos Sin Datos Clasificados", alert: "trash" },
  "NOVEDADES": { l1: "Otras Categorías", l2: "Sin Categorizar", l3: "Sin Clasificar", l4: "Productos Sin Datos Clasificados", alert: "trash" },
  "MARIKADITAS": { l1: "Otras Categorías", l2: "Sin Categorizar", l3: "Sin Clasificar", l4: "Productos Sin Datos Clasificados", alert: "trash" },

  // Campañas / Temporales
  "BLACK SALES": { l1: "Otras Categorías", l2: "Campaña Temporal", l3: "Ventas Especiales", l4: "Ofertas de Temporada", alert: "campaign" },
  "DROPI LOVE": { l1: "Otras Categorías", l2: "Campaña Temporal", l3: "Ventas Especiales", l4: "Ofertas de Temporada", alert: "campaign" },
  "TELEVENTAS": { l1: "Otras Categorías", l2: "Campaña Temporal", l3: "Ventas Especiales", l4: "Ofertas de Temporada", alert: "campaign" },
  "IMPORTADOS": { l1: "Otras Categorías", l2: "Campaña Temporal", l3: "Ventas Especiales", l4: "Ofertas de Temporada", alert: "campaign" },
  "BLACK FRIDAY": { l1: "Otras Categorías", l2: "Campaña Temporal", l3: "Ventas Especiales", l4: "Ofertas de Temporada", alert: "campaign" },
  "COINNECTA": { l1: "Otras Categorías", l2: "Campaña Temporal", l3: "Ventas Especiales", l4: "Ofertas de Temporada", alert: "campaign" },
  "DROPI IMPULSA": { l1: "Otras Categorías", l2: "Campaña Temporal", l3: "Ventas Especiales", l4: "Ofertas de Temporada", alert: "campaign" },
  "REMATE DE SALDOS": { l1: "Otras Categorías", l2: "Campaña Temporal", l3: "Ventas Especiales", l4: "Ofertas de Temporada", alert: "campaign" },
  "REYES MAGOS": { l1: "Otras Categorías", l2: "Campaña Temporal", l3: "Ventas Especiales", l4: "Ofertas de Temporada", alert: "campaign" },
  "TIENDA DEL NINJA": { l1: "Otras Categorías", l2: "Campaña Temporal", l3: "Ventas Especiales", l4: "Ofertas de Temporada", alert: "campaign" },
};
const DROPI_COMPLETE_TAXONOMY: Record<string, Record<string, Record<string, string[]>>> = {
  "Hogar y Decoración": {
    "Cocina y Utensilios": {
      "Vajilla y Servir": [
        "Platos y Vajillas Completas",
        "Vasos, Copas y Jarras",
        "Tazas, Pocillos y Tazones",
        "Cubertería y Cubiertos"
      ],
      "Cocción y Preparación": [
        "Sartenes y Woks",
        "Ollas y Cacerolas",
        "Moldes y Repostería",
        "Utensilios de Cocina (Cucharas, Espátulas)"
      ],
      "Electrodomésticos de Cocina": [
        "Licuadoras y Batidoras",
        "Freidoras de Aire y Hornos",
        "Cafeteras y Hervidores",
        "Sanducheras y Tostadoras"
      ]
    },
    "Decoración y Diseño": {
      "Adornos de Hogar": [
        "Espejos Decorativos",
        "Cuadros, Marcos y Lienzos",
        "Floreros, Jarrones y Macetas de Interior",
        "Velas Aromáticas y Difusores",
        "Adornos de Mesa y Pared"
      ],
      "Textiles del Hogar": [
        "Alfombras y Tapetes",
        "Cortinas y Persianas",
        "Cojines y Mantas Decorativas"
      ]
    },
    "Muebles y Mobiliario": {
      "Muebles de Interior": [
        "Muebles de Sala (Sofás, Mesas de Centro)",
        "Muebles de Dormitorio (Camas, Mesitas)",
        "Muebles de Oficina y Escritorios"
      ],
      "Estantería y Almacenamiento": [
        "Estantes, Repisas y Libreros",
        "Armarios y Clósets"
      ]
    },
    "Jardín y Exteriores": {
      "Cuidado de Jardín": [
        "Herramientas de Jardinería",
        "Mangueras, Riego y Aspersores",
        "Macetas y Jardineras de Exterior"
      ],
      "Muebles de Exterior": [
        "Sillas y Mesas de Jardín",
        "Parasoles y Sombrillas"
      ]
    },
    "Limpieza, Aseo y Cuidado": {
      "Utensilios de Limpieza": [
        "Escobas, Trapeadores y Mopas",
        "Plumeros y Paños de Microfibra",
        "Limpiadores Magnéticos y de Vidrios"
      ],
      "Químicos y Consumibles": [
        "Detergentes y Suavizantes",
        "Desinfectantes y Jabones"
      ]
    },
    "Organización de Espacios": {
      "Almacenamiento Hogar": [
        "Cajas y Cestas Organizadoras",
        "Zapateras y Organizadores de Calzado",
        "Organizadores de Clóset y Cajones"
      ]
    },
    "Iluminación": {
      "Iluminación Interior": [
        "Lámparas de Techo y Colgantes",
        "Lámparas de Mesa y Escritorio",
        "Bombillos y Cintas LED"
      ],
      "Iluminación Exterior": [
        "Reflectores Solares y LED",
        "Luces para Jardín"
      ]
    },
    "Baño y Grifería": {
      "Accesorios de Baño": [
        "Cortinas y Tapetes de Baño",
        "Organizadores y Repisas de Baño",
        "Toallas y Batas de Baño"
      ],
      "Grifería": [
        "Grifos de Lavamanos/Cocina",
        "Cabezales de Ducha"
      ]
    },
    "Hogar General": {
      "Artículos Varios": [
        "Otros Productos de Hogar"
      ]
    }
  },
  "Mascotas": {
    "Mascotas General": {
      "Accesorios de Mascota": [
        "Accesorios de Paseo y Arnés",
        "Camas y Casas para Mascotas",
        "Ropa y Disfraces de Mascotas"
      ]
    },
    "Alimento para Mascotas": {
      "Comidas": [
        "Concentrados para Perros",
        "Concentrados para Gatos",
        "Premios, Snacks y Galletas"
      ]
    },
    "Juguetes y Accesorios": {
      "Diversión": [
        "Juguetes Mordedores y Pelotas",
        "Juguetes Interactivos y Rascadores",
        "Platos y Bebederos Automáticos"
      ]
    },
    "Higiene y Cuidado de Mascotas": {
      "Cuidado Animal": [
        "Champús y Acondicionadores",
        "Bandejas Sanitarias y Arenas",
        "Cepillos y Cortauñas"
      ]
    },
    "Acuarofilia y Aves": {
      "Otros Animales": [
        "Comida e Insumos para Peces",
        "Jaulas y Accesorios de Aves"
      ]
    }
  },
  "Tecnología y Electrónica": {
    "Tecnología General": {
      "Componentes y Accesorios": [
        "Cables y Adaptadores de Datos",
        "Soportes y Fundas Tecnológicas",
        "Baterías Portátiles y Cargadores"
      ]
    },
    "Computación y Tablets": {
      "Hardware y Periféricos": [
        "Tablets e iPads",
        "Teclados, Mouses y Diademas",
        "Monitores y Accesorios de PC"
      ]
    },
    "Celulares y Accesorios": {
      "Accesorios de Celular": [
        "Estuches y Vidrios Templados",
        "Audífonos Inalámbricos y Bluetooth",
        "Cargadores Inalámbricos y Soportes para Auto"
      ]
    },
    "Audio y Video": {
      "Equipos de Sonido e Imagen": [
        "Parlantes Portátiles y Bluetooth",
        "Cámaras de Seguridad y Vigilancia",
        "Proyectores y Pantallas"
      ]
    },
    "Gadgets y Novedades": {
      "Dispositivos Inteligentes": [
        "Smartwatches y Pulseras Inteligentes",
        "Lentes de Realidad Virtual",
        "Novedades Tecnológicas Varias"
      ]
    },
    "Videojuegos y Consolas": {
      "Accesorios de Consolas": [
        "Controles y Joysticks",
        "Accesorios para Consolas PS5/Switch",
        "Sillas y Teclados Gamers"
      ]
    },
    "Cámaras y Drones": {
      "Fotografía y Vuelo": [
        "Drones de Fotografía",
        "Cámaras Deportivas y de Acción",
        "Estabilizadores y Trípodes"
      ]
    },
    "Electrónica General": {
      "Otros Artículos": [
        "Otros Artículos Electrónicos"
      ]
    }
  },
  "Belleza y Cuidado Personal": {
    "Belleza General": {
      "Almacenamiento de Belleza": [
        "Espejos Cosméticos con Luz LED",
        "Organizadores de Maquillaje",
        "Bolsos Cosméticos y Neceser"
      ]
    },
    "Maquillaje y Cosméticos": {
      "Maquillaje Rostro/Ojos": [
        "Maquillaje de Ojos y Rostro",
        "Labiales y Brillos",
        "Brochas, Esponjas y Aplicadores"
      ]
    },
    "Perfumería y Fragancias": {
      "Fragancias de Diseño": [
        "Perfumes de Dama",
        "Perfumes de Caballero",
        "Fragancias Corporales y Splash"
      ]
    },
    "Cuidado Capilar": {
      "Productos para el Cabello": [
        "Planchas y Rizadores de Cabello",
        "Secadores de Cabello",
        "Tratamientos y Aceites Capilares",
        "Cepillos Eléctricos y Tradicionales"
      ]
    },
    "Cuidado Corporal": {
      "Estética Corporal": [
        "Depiladores Eléctricos y Ceras",
        "Cremas Hidratantes y Exfoliantes",
        "Masajeadores Corporales"
      ]
    },
    "Cuidado Facial y Skincare": {
      "Estética Facial": [
        "Limpiadores Faciales Ultrasónicos",
        "Sueros y Cremas Faciales",
        "Mascarillas e Hidratantes de Rostro"
      ]
    },
    "Fajas y Ropa Control": {
      "Moldeadores": [
        "Fajas Reductoras Femeninas",
        "Cinturillas Deportivas",
        "Fajas Postparto/Postquirúrgicas"
      ]
    },
    "Higiene y Cuidado Personal": {
      "Afeitado y Depilación": [
        "Cuidado Bucal e Irrigadores",
        "Rasuradoras y Cortadoras de Barba"
      ]
    }
  },
  "Salud y Bienestar": {
    "Salud General": {
      "Ortopedia y Postura": [
        "Termómetros y Tensiómetros",
        "Correctores de Postura",
        "Férulas, Rodilleras y Soportes"
      ]
    },
    "Suplementos y Nutrición": {
      "Suplementos Dietarios": [
        "Proteínas y Aminoácidos",
        "Colágeno Hidrolizado y Biotina",
        "Vitaminas y Minerales de Venta Libre",
        "Quemadores de Grasa y Adelgazantes"
      ]
    },
    "Equipos Médicos y Cuidado de la Salud": {
      "Aparatos Médicos": [
        "Nebulizadores y Concentradores",
        "Humidificadores y Vaporizadores",
        "Almohadillas Térmicas y Masajeadores de Terapia"
      ]
    },
    "Bienestar General": {
      "Cuidado Alternativo": [
        "Aceites Esenciales y Aromaterapia",
        "Vaporizadores Personales y Pods",
        "Parches de Alivio y Relajación"
      ]
    },
    "Óptica y Cuidado Ocular": {
      "Óptica": [
        "Gafas de Lectura",
        "Estuches y Accesorios de Gafas",
        "Limpiadores de Lentes"
      ]
    }
  },
  "Productos para Adultos": {
    "Bienestar Sexual": {
      "Lubricantes y Geles": [
        "Lubricantes y Geles Íntimos",
        "Estimuladores y Geles Sensibilizantes"
      ],
      "Protección Sexual": [
        "Preservativos y Barreras de Protección"
      ]
    },
    "Lencería y Ropa Erótica": {
      "Prendas Íntimas Eróticas": [
        "Lencería de Dama",
        "Disfraces y Ropa de Noche",
        "Accesorios Eróticos"
      ]
    },
    "Juguetes para Adultos": {
      "Entretenimiento Adulto": [
        "Vibradores y Succionadores",
        "Juguetes de Pareja",
        "Bolas Chinas y Ejercitadores"
      ]
    }
  },
  "Moda y Calzado": {
    "Moda General": {
      "Accesorios de Moda": [
        "Gafas de Sol",
        "Cinturones y Correas",
        "Sombreros, Gorras y Bufandas"
      ]
    },
    "Bolsos, Morrales y Accesorios": {
      "Carteras y Bolsos": [
        "Carteras de Dama y Crossbody",
        "Billeteras de Caballero y Tarjeteros"
      ],
      "Morrales": [
        "Morrales Escolares y Universitarios"
      ]
    },
    "Ropa Femenina (Dama)": {
      "Prendas Superiores": [
        "Blusas y Camisetas",
        "Chaquetas y Sacos"
      ],
      "Prendas Inferiores": [
        "Vestidos y Faldas",
        "Jeans, Pantalones y Leggings"
      ]
    },
    "Ropa Masculina (Caballero)": {
      "Prendas Superiores Masculinas": [
        "Camisas y Camisetas",
        "Chaquetas y Buzos"
      ],
      "Prendas Inferiores Masculinas": [
        "Pantalones y Bermudas"
      ]
    },
    "Calzado y Zapatos": {
      "Calzado Deportivo": [
        "Tenis y Zapatillas Deportivas"
      ],
      "Calzado Casual": [
        "Zapatos Casuales y Mocasines",
        "Sandalias y Chanclas",
        "Botas y Botines"
      ]
    },
    "Bisutería, Joyas y Relojes": {
      "Bisutería": [
        "Bisutería de Acero y Fantasía",
        "Cadenas, Pulseras y Aretes"
      ],
      "Relojería": [
        "Relojes de Pulso de Dama/Caballero"
      ]
    },
    "Ropa Interior y de Descanso": {
      "Ropa Interior": [
        "Ropa Interior Femenina",
        "Bóxers y Ropa Interior Masculina",
        "Pijamas de Dama/Caballero"
      ]
    },
    "Ropa Deportiva": {
      "Prendas Deportivas": [
        "Leggings Deportivos",
        "Camisetas de Secado Rápido",
        "Conjuntos Deportivos"
      ]
    }
  },
  "Juguetes y Bebés": {
    "Accesorios y Cuidado Infantil (Bebés)": {
      "Higiene y Cuidado": [
        "Pañaleras y Bolsos de Bebé",
        "Termómetros y Aspiradores Nasales",
        "Higiene del Bebé y Baño"
      ]
    },
    "Juguetes y Juegos": {
      "Juguetes Didácticos": [
        "Juguetes Didácticos y de Madera"
      ],
      "Juguetes de Acción": [
        "Muñecas y Figuras de Acción",
        "Carros a Control Remoto y Pistas"
      ],
      "Juegos de Mesa": [
        "Juegos de Mesa y Rompecabezas"
      ]
    },
    "Lactancia y Alimentación": {
      "Alimentación Bebé": [
        "Biberones y Teteros",
        "Extractores de Leche",
        "Baberos y Vajilla Infantil"
      ]
    },
    "Coches y Sillas para Auto": {
      "Transporte Bebé": [
        "Coches Paseadores",
        "Sillas de Seguridad para Carro",
        "Canguros y Portabebés"
      ]
    },
    "Cuarto del Bebé y Mobiliario": {
      "Dormitorio Bebé": [
        "Nidos y Almohadas de Lactancia",
        "Móviles y Luces de Noche",
        "Cunas y Corrales Portátiles"
      ]
    }
  },
  "Deportes y Outdoor": {
    "Deportes General": {
      "Protección Deportiva": [
        "Botatodo e Hidratación",
        "Relojes Deportivos e Instrumentos",
        "Protecciones Deportivas (Rodilleras/Coderas)"
      ]
    },
    "Equipos Fitness y Gimnasio": {
      "Entrenamiento en Casa": [
        "Lazos para Saltar",
        "Mancuernas y Pesas",
        "Bandas de Resistencia",
        "Colchonetas y Mats de Yoga"
      ]
    },
    "Camping y Pesca": {
      "Equipamiento de Camping": [
        "Linternas de Cabeza y Camping",
        "Navajas y Multiherramientas",
        "Carpas y Sacos de Dormir"
      ],
      "Insumos de Pesca": [
        "Artículos de Pesca"
      ]
    },
    "Ciclismo y Mobilidad": {
      "Accesorios Ciclismo": [
        "Accesorios para Bicicleta y Luces",
        "Cascos de Ciclismo",
        "Guantes Deportivos"
      ]
    },
    "Deportes de Aventura": {
      "Aventura": [
        "Otros Accesorios Outdoor"
      ]
    }
  },
  "Ferretería y Herramientas": {
    "Ferretería General": {
      "Cerrajería": [
        "Candados, Cerraduras y Cerrajería"
      ],
      "Suministros Ferreteros": [
        "Cintas Adhesivas y Pegantes",
        "Tornillería y Anclajes",
        "Material Eléctrico e Interruptores"
      ]
    },
    "Herramientas Manuales/Eléctricas": {
      "Equipos Eléctricos": [
        "Taladros, Pulidoras y Soldadores"
      ],
      "Herramientas Manuales": [
        "Destornilladores y Llaves",
        "Cajas de Herramientas y Organizadores",
        "Brocas y Accesorios de Corte"
      ]
    },
    "Seguridad y Cerramientos": {
      "Seguridad Personal y Hogar": [
        "Cámaras de Seguridad Falsas",
        "Alarmas de Puerta/Ventana",
        "Epp: Guantes y Gafas de Seguridad"
      ]
    },
    "Materiales de Construcción": {
      "Construcción": [
        "Iluminación Industrial",
        "Medidores de Distancia Láser"
      ]
    },
    "Pinturas y Acabados": {
      "Acabados": [
        "Pinceles, Rodillos y Brochas",
        "Pintura en Spray"
      ]
    },
    "Automotriz y Accesorios (Carros/Motos)": {
      "Accesorios para Carros": [
        "Accesorios de Lujo para Auto",
        "Cámaras de Reversa y Sensores",
        "Cuidado del Auto: Ceras y Champú",
        "Soportes de Celular para Rejilla"
      ],
      "Accesorios para Motos": [
        "Cascos e Impermeables para Moto"
      ]
    }
  },
  "Otras Categorías": {
    "Papelería y Oficina": {
      "Escritorio": [
        "Cuadernos, Agendas y Libretas",
        "Marcadores, Colores y Esferos",
        "Organizadores de Escritorio",
        "Calculadoras"
      ]
    },
    "Libros y Material Educativo": {
      "Literatura": [
        "Libros Físicos de Interés General",
        "Agendas de Planificación",
        "Material Didáctico Escolar"
      ]
    },
    "Arte, Artesanías y Hobbies": {
      "Hobbies": [
        "Kits de Pintura por Números",
        "Lanas, Hilos y Tejeduría",
        "Herramientas de Costura y Manualidades"
      ]
    },
    "Sin Categorizar": {
      "Sin Clasificar": [
        "Registros por Reclasificar",
        "Productos Sin Datos Clasificados"
      ]
    },
    "Campaña Temporal": {
      "Ventas Especiales": [
        "Eventos Comerciales",
        "Ofertas de Temporada"
      ]
    }
  }
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
  const [activeResourceTab, setActiveResourceTab] = useState<"diagnostico" | "meli" | "taxonomy" | "ai" | "google" | null>(null);
  const [mainTab, setMainTab] = useState<"simulator" | "google_mapping">("simulator");

  // Right panel view toggle: node mapping vs full taxonomy tree
  const [rightView, setRightView] = useState<"mapping" | "tree">("mapping");
  const [treeExpandedL1, setTreeExpandedL1] = useState<Set<string>>(new Set());
  const [treeExpandedL2, setTreeExpandedL2] = useState<Set<string>>(new Set());

  // Dropi Data States
  const [dropiRawCategories, setDropiRawCategories] = useState<DropiCategoryRaw[]>([]);
  const [selectedDropiCat, setSelectedDropiCat] = useState<string | null>(null);

  // Meli Data States
  const [categories, setCategories] = useState<CategoryMap>({});
  const [roots, setRoots] = useState<string[]>([]);
  const [childrenMap, setChildrenMap] = useState<Record<string, string[]>>({});
  const [meliLoading, setMeliLoading] = useState(true);

  // Meli Navigation States
  const [activeMeliTab, setActiveMeliTab] = useState<"columns" | "graph" | "conclusions">("conclusions");
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

  // ── Google taxonomy states ──────────────────────────────────────────────────
  const [googleCount, setGoogleCount] = useState<number>(0);
  const [googleImporting, setGoogleImporting] = useState(false);
  const [googleImportMsg, setGoogleImportMsg] = useState<string | null>(null);

  // ── Mapping / homologación states ───────────────────────────────────────────
  const [mappings, setMappings] = useState<CategoryMapping[]>([]);
  const [mappingLoading, setMappingLoading] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestResult, setSuggestResult] = useState<SuggestResult | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [confidenceFilter, setConfidenceFilter] = useState<string>("all");
  const [expandedMappingId, setExpandedMappingId] = useState<number | null>(null);

  // ── Product categorizer states ───────────────────────────────────────────────
  const [productQuery, setProductQuery] = useState("");
  const [productClassifying, setProductClassifying] = useState(false);
  const [productResult, setProductResult] = useState<{
    results: { l1: string; l2: string; l3: string; l4: string; score: number; reasoning: string }[];
    gap: boolean; gap_note: string;
  } | null>(null);
  const [productError, setProductError] = useState<string | null>(null);

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

  // Load Google taxonomy count on mount
  useEffect(() => {
    fetch("/api/categorizacion/import-google")
      .then(r => r.json())
      .then((d: GoogleTaxonomyStats) => setGoogleCount(d.count ?? 0))
      .catch(() => null);
  }, []);

  // Load mappings when tab is active
  const fetchMappings = useCallback(async () => {
    setMappingLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all")     params.set("status", statusFilter);
      if (confidenceFilter !== "all") params.set("confidence", confidenceFilter);
      params.set("limit", "500");
      const res = await fetch(`/api/categorizacion/mapping?${params}`);
      const data: CategoryMapping[] = await res.json();
      setMappings(Array.isArray(data) ? data : []);
    } catch {
      setMappings([]);
    } finally {
      setMappingLoading(false);
    }
  }, [statusFilter, confidenceFilter]);

  useEffect(() => {
    if (mainTab === "google_mapping") fetchMappings();
  }, [mainTab, fetchMappings]);

  // Google actions
  const handleImportGoogle = async () => {
    setGoogleImporting(true);
    setGoogleImportMsg(null);
    try {
      const res = await fetch("/api/categorizacion/import-google", { method: "POST" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setGoogleCount(data.imported ?? 0);
      setGoogleImportMsg(`${data.imported.toLocaleString()} categorías importadas correctamente.`);
    } catch (err) {
      setGoogleImportMsg(`Error: ${err instanceof Error ? err.message : "fallo desconocido"}`);
    } finally {
      setGoogleImporting(false);
    }
  };

  const handleGenerateSuggestions = async () => {
    setSuggesting(true);
    setSuggestResult(null);
    try {
      // 1. Seed Dropi categories — check response explicitly
      const seedRes = await fetch("/api/categorizacion/seed-dropi", { method: "POST" });
      const seedData: { seeded?: number; error?: string } = await seedRes.json();
      if (!seedRes.ok || seedData.error) {
        throw new Error(`Error en seed-dropi: ${seedData.error ?? seedRes.statusText}`);
      }

      // 2. Run matching engine
      const suggestRes = await fetch("/api/categorizacion/suggest", { method: "POST" });
      const data: SuggestResult & { error?: string } = await suggestRes.json();
      if (!suggestRes.ok || data.error) throw new Error(data.error ?? suggestRes.statusText);

      setSuggestResult(data);
      fetchMappings();
    } catch (err) {
      setSuggestResult(null);
      alert(`Error generando sugerencias: ${err instanceof Error ? err.message : "fallo desconocido"}`);
    } finally {
      setSuggesting(false);
    }
  };

  const handleUpdateMapping = async (id: number, status: string) => {
    try {
      await fetch("/api/categorizacion/mapping", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, reviewed_by: "jaime.guevara@dropi.co" }),
      });
      setMappings(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    } catch {
      alert("Error actualizando el mapping. Intenta de nuevo.");
    }
  };

  const handleExportCSV = () => {
    const approved = mappings.filter(m => m.status === "approved");
    const all = mappings;
    const rows = (approved.length > 0 ? approved : all);
    const header = "dropi_category_id,dropi_category_path,google_category_id,google_category_path,confidence_score,match_type,status";
    const csv = [header, ...rows.map(r =>
      `${r.dropi_category_id},"${r.dropi_category_path}",${r.google_category_id},"${r.google_category_path}",${r.confidence_score},${r.match_type},${r.status}`
    )].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dropi-google-mapping-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Product categorizer — calls Claude API ───────────────────────────────────
  const classifyProduct = async (query: string) => {
    if (!query.trim()) return;
    setProductClassifying(true);
    setProductResult(null);
    setProductError(null);
    try {
      const res = await fetch("/api/categorizacion/classify-product", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ product_name: query }),
      });
      const data = await res.json() as {
        results?: { l1: string; l2: string; l3: string; l4: string; score: number; reasoning: string }[];
        gap?: boolean; gap_note?: string; error?: string;
      };
      if (!res.ok || data.error) throw new Error(data.error ?? "Error desconocido");
      setProductResult({
        results: data.results ?? [],
        gap: data.gap ?? false,
        gap_note: data.gap_note ?? "",
      });
    } catch (err) {
      setProductError(err instanceof Error ? err.message : "Error llamando a la IA");
    } finally {
      setProductClassifying(false);
    }
  };

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

            {/* ── Product Categorizer (AI) ────────────────────────────────────── */}
            <div className="bg-white border rounded-2xl p-6 shadow-2xs" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Categorizador con IA</h3>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">GPT-4o mini</span>
              </div>
              <p className="text-xs text-gray-400 mb-4">Escribe el nombre de cualquier producto y la IA lo ubica en el árbol Dropi.</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={productQuery}
                  onChange={e => setProductQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") classifyProduct(productQuery); }}
                  placeholder="Ej: Timbre Puerta Inalámbrico Digital Blanco"
                  className="flex-1 border rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:ring-2 focus:ring-orange-400 bg-slate-50"
                  style={{ borderColor: "var(--border)" }}
                  disabled={productClassifying}
                />
                <button
                  onClick={() => classifyProduct(productQuery)}
                  disabled={productQuery.trim().length < 3 || productClassifying}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm min-w-[110px]"
                >
                  {productClassifying ? (
                    <span className="flex items-center gap-1.5 justify-center">
                      <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Pensando...
                    </span>
                  ) : "Categorizar"}
                </button>
                {(productResult || productError) && (
                  <button
                    onClick={() => { setProductQuery(""); setProductResult(null); setProductError(null); }}
                    className="px-3 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Error */}
              {productError && (
                <div className="mt-4 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  {productError}
                </div>
              )}

              {/* Results */}
              {productResult && (
                <div className="mt-5 space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Resultados para:</span>
                    <span className="text-xs font-bold text-orange-600 font-mono">"{productQuery}"</span>
                  </div>

                  {productResult.results.map((m, i) => {
                    const isTop = i === 0;
                    const scoreColor = m.score >= 70 ? "emerald" : m.score >= 50 ? "amber" : m.score >= 30 ? "orange" : "slate";
                    const scoreLabel = m.score >= 70 ? "Alta" : m.score >= 50 ? "Media" : m.score >= 30 ? "Baja" : "Muy baja";
                    return (
                      <div
                        key={i}
                        className={`border rounded-2xl p-4 transition-all ${isTop ? "border-orange-300 bg-orange-50/40" : "border-slate-200 bg-slate-50/30"}`}
                      >
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-2">
                            {isTop
                              ? <span className="text-[10px] font-bold bg-orange-500 text-white px-2 py-0.5 rounded-full">Mejor match</span>
                              : <span className="text-[10px] font-bold text-gray-400 bg-slate-100 px-2 py-0.5 rounded-full">#{i + 1}</span>
                            }
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Score bar */}
                            <div className="flex items-center gap-1.5">
                              <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full bg-${scoreColor}-400 transition-all`}
                                  style={{ width: `${m.score}%` }}
                                />
                              </div>
                              <span className={`text-[10px] font-bold text-${scoreColor}-600`}>{m.score}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-${scoreColor}-50 text-${scoreColor}-700 border border-${scoreColor}-200`}>
                              {scoreLabel}
                            </span>
                          </div>
                        </div>

                        {/* Path */}
                        <div className="flex flex-wrap items-center gap-1.5 text-xs mb-2">
                          <span className={`font-bold px-2.5 py-1 rounded-lg shadow-2xs border ${isTop ? "bg-white text-gray-800 border-orange-200" : "bg-white text-gray-700 border-slate-200"}`}>{m.l1}</span>
                          <span className="text-gray-400 text-[10px]">›</span>
                          <span className="text-gray-600 px-2 py-0.5 bg-white border border-slate-200 rounded-lg shadow-2xs">{m.l2}</span>
                          <span className="text-gray-400 text-[10px]">›</span>
                          <span className="text-gray-600 px-2 py-0.5 bg-white border border-slate-200 rounded-lg shadow-2xs">{m.l3}</span>
                          <span className="text-gray-400 text-[10px]">›</span>
                          <span className={`font-bold px-2.5 py-1 rounded-lg shadow-2xs border ${isTop ? "bg-orange-100 text-orange-700 border-orange-200" : "bg-slate-100 text-slate-700 border-slate-200"}`}>{m.l4}</span>
                        </div>

                        {/* Reasoning */}
                        {m.reasoning && (
                          <p className="text-[10px] text-gray-500 leading-relaxed">
                            <span className="font-bold">Por qué: </span>{m.reasoning}
                          </p>
                        )}
                      </div>
                    );
                  })}

                  {/* Gap alert */}
                  {productResult.gap && productResult.gap_note && (
                    <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2 mt-1">
                      <span className="text-base leading-none">⚠</span>
                      <div>
                        <span className="font-bold block mb-0.5">Gap de taxonomía detectado</span>
                        <span>{productResult.gap_note}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
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

                {/* ── View toggle ──────────────────────────────────────────── */}
                <div className="flex items-center gap-2 bg-white border rounded-xl p-1 shadow-2xs w-fit" style={{ borderColor: "var(--border)" }}>
                  <button
                    onClick={() => setRightView("mapping")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      rightView === "mapping"
                        ? "bg-orange-500 text-white shadow-sm"
                        : "text-gray-500 hover:bg-slate-50"
                    }`}
                  >
                    📍 Mapeo del nodo
                  </button>
                  <button
                    onClick={() => setRightView("tree")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      rightView === "tree"
                        ? "bg-orange-500 text-white shadow-sm"
                        : "text-gray-500 hover:bg-slate-50"
                    }`}
                  >
                    🌳 Árbol Dropi
                  </button>
                </div>

                {/* ── Árbol Dropi: full taxonomy cascade ───────────────────── */}
                {rightView === "tree" && (
                  <div className="bg-white border rounded-2xl p-6 shadow-2xs space-y-3" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Árbol de Taxonomía Propuesto · Dropi</h3>
                        <p className="text-[10px] text-gray-400 mt-0.5">{Object.keys(DROPI_COMPLETE_TAXONOMY).length} categorías L1 · {Object.values(DROPI_COMPLETE_TAXONOMY).reduce((a, l2) => a + Object.keys(l2).length, 0)} L2 totales</p>
                      </div>
                      <button
                        onClick={() => { setTreeExpandedL1(new Set()); setTreeExpandedL2(new Set()); }}
                        className="text-[10px] text-gray-400 hover:text-gray-600 px-2 py-1 rounded border hover:bg-slate-50 transition-all"
                        style={{ borderColor: "var(--border)" }}
                      >
                        Colapsar todo
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {Object.entries(DROPI_COMPLETE_TAXONOMY).map(([l1, l2Map]) => {
                        const l1Open = treeExpandedL1.has(l1);
                        const l2Count = Object.keys(l2Map).length;
                        const l3Count = Object.values(l2Map).reduce((a, l3) => a + Object.keys(l3).length, 0);
                        const l4Count = Object.values(l2Map).reduce((a, l3Map) =>
                          a + Object.values(l3Map).reduce((b, l4s) => b + l4s.length, 0), 0);

                        return (
                          <div key={l1} className="border rounded-xl overflow-hidden transition-all" style={{ borderColor: l1Open ? "#f97316" : "var(--border)" }}>
                            {/* L1 Row */}
                            <button
                              onClick={() => {
                                const next = new Set(treeExpandedL1);
                                if (next.has(l1)) next.delete(l1); else next.add(l1);
                                setTreeExpandedL1(next);
                              }}
                              className="w-full flex items-center justify-between px-4 py-3 text-left transition-all hover:bg-orange-50/30"
                              style={{ background: l1Open ? "#fff7ed" : "white" }}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-[10px] text-gray-400 w-3 text-center">{l1Open ? "▼" : "▶"}</span>
                                <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                                <span className="text-xs font-bold text-gray-900">{l1}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-gray-400 font-mono">{l2Count} L2 · {l3Count} L3 · {l4Count} L4</span>
                              </div>
                            </button>

                            {/* L2 rows */}
                            {l1Open && (
                              <div className="border-t divide-y bg-slate-50/50" style={{ borderColor: "var(--border)" }}>
                                {Object.entries(l2Map).map(([l2, l3Map]) => {
                                  const l2Key = `${l1}::${l2}`;
                                  const l2Open = treeExpandedL2.has(l2Key);
                                  const l4Total = Object.values(l3Map).reduce((a, l4s) => a + l4s.length, 0);

                                  return (
                                    <div key={l2} className="divide-y" style={{ borderColor: "var(--border)" }}>
                                      {/* L2 button */}
                                      <button
                                        onClick={() => {
                                          const next = new Set(treeExpandedL2);
                                          if (next.has(l2Key)) next.delete(l2Key); else next.add(l2Key);
                                          setTreeExpandedL2(next);
                                        }}
                                        className="w-full flex items-center justify-between px-5 py-2.5 text-left hover:bg-white transition-all"
                                      >
                                        <div className="flex items-center gap-2.5">
                                          <span className="text-[9px] text-gray-300 w-3 text-center">{l2Open ? "▼" : "▶"}</span>
                                          <span className="w-1.5 h-1.5 rounded-full bg-orange-300 flex-shrink-0" />
                                          <span className="text-[11px] font-semibold text-gray-700">{l2}</span>
                                        </div>
                                        <span className="text-[9px] text-gray-400 font-mono">{Object.keys(l3Map).length} L3 · {l4Total} L4</span>
                                      </button>

                                      {/* L3 + L4 block */}
                                      {l2Open && (
                                        <div className="px-8 py-3 bg-white space-y-3 border-t" style={{ borderColor: "var(--border)" }}>
                                          {Object.entries(l3Map).map(([l3, l4s]) => (
                                            <div key={l3} className="space-y-1.5">
                                              <div className="flex items-center gap-2">
                                                <span className="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />
                                                <span className="text-[10px] font-bold text-gray-600">{l3}</span>
                                              </div>
                                              <div className="pl-3 flex flex-wrap gap-1.5">
                                                {l4s.map((l4) => (
                                                  <span
                                                    key={l4}
                                                    className="inline-block text-[9px] font-medium text-gray-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md"
                                                  >
                                                    {l4}
                                                  </span>
                                                ))}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── Mapeo del nodo (existing view) ────────────────────────── */}
                {rightView === "mapping" && selectedDropiCat && DROPI_MAPPING_DICT[selectedDropiCat] ? (
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
                          <span className="text-xs text-gray-400 block">⬇</span>
                          <span className="inline-block bg-orange-100 text-orange-700 border border-orange-200 px-2 py-0.5 rounded text-[10px] font-bold">
                            {DROPI_MAPPING_DICT[selectedDropiCat].l3}
                          </span>
                          <span className="text-xs text-gray-400 block">⬇</span>
                          <span className="inline-block bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">
                            {DROPI_MAPPING_DICT[selectedDropiCat].l4}
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

                    {/* Proposed Hierarchical Tree for Level 1 */}
                    {(() => {
                      const selectedL1 = selectedDropiCat ? DROPI_MAPPING_DICT[selectedDropiCat]?.l1 : undefined;
                      if (!selectedL1) return null;

                      // Sibling categories mapping to Level 1
                      const siblingRawCats = dropiRawCategories.filter(
                        (c) => DROPI_MAPPING_DICT[c.name]?.l1 === selectedL1
                      );

                      // Get complete Level 2 list for this Level 1
                      const l2List = Object.keys(DROPI_COMPLETE_TAXONOMY[selectedL1] || {});

                      // Group raw categories that map to each Level 2
                      const l2Groups: Record<string, { rawCats: DropiCategoryRaw[]; totalOrders: number }> = {};
                      l2List.forEach((l2) => {
                        l2Groups[l2] = { rawCats: [], totalOrders: 0 };
                      });

                      // Also catch any unmapped L2
                      siblingRawCats.forEach((c) => {
                        const l2 = DROPI_MAPPING_DICT[c.name]?.l2 || "General";
                        if (!l2Groups[l2]) {
                          l2Groups[l2] = { rawCats: [], totalOrders: 0 };
                        }
                        l2Groups[l2].rawCats.push(c);
                        l2Groups[l2].totalOrders += c.orders;
                      });

                      // Sort groups by total orders descending (but keep the empty ones at the bottom)
                      const sortedL2Groups = Object.entries(l2Groups).sort((a, b) => {
                        if (b[1].totalOrders !== a[1].totalOrders) {
                          return b[1].totalOrders - a[1].totalOrders;
                        }
                        return a[0].localeCompare(b[0]);
                      });

                      const totalL1Orders = siblingRawCats.reduce((sum, c) => sum + c.orders, 0);

                      return (
                        <div className="border-t pt-5 space-y-4" style={{ borderColor: "var(--border)" }}>
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                              Estructura Jerárquica Completa de 4 Niveles para "{selectedL1}"
                            </h4>
                            <span className="text-[10px] text-gray-400 font-mono">
                              Nivel 1 &gt; Nivel 2 &gt; Nivel 3 &gt; Nivel 4 (Taxonomía Completa)
                            </span>
                          </div>
                          
                          <p className="text-xs text-gray-500 leading-relaxed">
                            Este árbol muestra el mapa de catalogación completo de 4 niveles. Se listan las categorías oficiales de Nivel 2, subcategorías de Nivel 3, y los tipos de producto específicos de Nivel 4 basados en la profundidad de Mercado Libre. Los tags de base de datos de Dropi se agrupan en su nodo hoja correspondiente en el Nivel 4:
                          </p>

                          {/* Tree Visual Container */}
                          <div className="bg-slate-50 border rounded-2xl p-6 flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-stretch justify-between relative overflow-hidden" style={{ borderColor: "var(--border)" }}>
                            {/* Left Part: Level 1 Card */}
                            <div className="w-full md:w-48 flex items-center justify-center flex-shrink-0">
                              <div className="bg-orange-500 text-white rounded-xl p-4 shadow-sm text-center w-full border border-orange-600 relative z-10 flex flex-col justify-center min-h-[140px]">
                                <span className="text-[8px] uppercase tracking-widest font-extrabold opacity-75 block mb-1">Nivel 1 (Familia)</span>
                                <h5 className="font-extrabold text-xs leading-snug">{selectedL1}</h5>
                                <span className="text-[9px] bg-orange-600 px-2 py-0.5 rounded-full inline-block mt-2 font-bold font-mono w-fit mx-auto">
                                  {totalL1Orders.toLocaleString()} ord.
                                </span>
                              </div>
                            </div>

                            {/* Center Part: Connector SVG lines (visible on desktop) */}
                            <div className="hidden md:block flex-shrink-0 w-20 relative">
                              <svg className="absolute inset-0 w-full h-full" style={{ stroke: "#cbd5e1", strokeWidth: 1.5, fill: "none" }}>
                                {sortedL2Groups.map((_, idx) => {
                                  const n = sortedL2Groups.length;
                                  const y1 = "50%";
                                  const y2 = `${((idx + 0.5) / n) * 100}%`;
                                  return (
                                    <path
                                      key={idx}
                                      d={`M 0,${y1} C 40,${y1} 40,${y2} 80,${y2}`}
                                    />
                                  );
                                })}
                              </svg>
                            </div>

                            {/* Right Part: Level 2 Cards Grid containing Level 3 & Level 4 nested elements */}
                            <div className="flex-1 space-y-4 relative z-10">
                               {sortedL2Groups.map(([l2Name, group]) => {
                                 const l3Map = (DROPI_COMPLETE_TAXONOMY[selectedL1] && DROPI_COMPLETE_TAXONOMY[selectedL1][l2Name]) || {};
                                 const l3Keys = Object.keys(l3Map);

                                 return (
                                   <div
                                     key={l2Name}
                                     className="bg-white border border-slate-200 hover:border-orange-200 rounded-xl p-4 shadow-2xs transition-all flex flex-col gap-3"
                                     style={{ borderColor: "var(--border)" }}
                                   >
                                     {/* Nivel 2 Header */}
                                     <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                       <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                         <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                         {l2Name}
                                       </span>
                                       <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                                         {group.totalOrders.toLocaleString()} ord.
                                       </span>
                                     </div>

                                     {/* Nivel 3 Subcategories List */}
                                     <div className="space-y-3">
                                       {l3Keys.map((l3Name) => {
                                         const l4List = l3Map[l3Name] || [];

                                         return (
                                           <div key={l3Name} className="bg-slate-50/50 border border-slate-100/60 rounded-lg p-2.5 flex flex-col gap-2">
                                             <span className="text-[10.5px] font-bold text-gray-700 flex items-center gap-1">
                                               📁 Nivel 3: {l3Name}
                                             </span>

                                             {/* Nivel 4 Items List */}
                                             <div className="pl-3 space-y-2 border-l border-slate-200">
                                               {l4List.map((l4Name) => {
                                                 // Find raw categories mapping to this L4
                                                 const rawCatsForL4 = group.rawCats.filter(raw => {
                                                   const map = DROPI_MAPPING_DICT[raw.name];
                                                   return map?.l4 === l4Name;
                                                 });

                                                 const hasL4Data = rawCatsForL4.length > 0;

                                                 return (
                                                   <div key={l4Name} className="flex flex-col gap-1">
                                                     <div className="flex justify-between items-center text-[10px]">
                                                       <span className="font-medium text-gray-600">
                                                         📄 {l4Name}
                                                       </span>
                                                       {!hasL4Data && (
                                                         <span className="text-[7.5px] bg-slate-100 text-slate-400 px-1 rounded font-bold">
                                                           Disponible
                                                         </span>
                                                       )}
                                                     </div>

                                                     {hasL4Data && (
                                                       <div className="flex flex-wrap gap-1 mt-0.5">
                                                         {rawCatsForL4.sort((a,b)=>b.orders-a.orders).map((raw) => {
                                                           const map = DROPI_MAPPING_DICT[raw.name];
                                                           const isTypo = map?.alert === "typo";
                                                           const isSelected = selectedDropiCat === raw.name;
                                                           return (
                                                             <span
                                                               key={raw.name}
                                                               className={`inline-flex items-center gap-1 px-1 py-0.5 rounded font-mono text-[8px] font-semibold border ${
                                                                 isSelected
                                                                   ? "bg-orange-500 text-white border-orange-500 shadow-2xs"
                                                                   : isTypo
                                                                   ? "bg-amber-50 text-amber-600 border-amber-200"
                                                                   : "bg-slate-100 text-gray-500 border-slate-200"
                                                               }`}
                                                             >
                                                               {raw.name} {isTypo && "⚠️"} ({raw.orders.toLocaleString()} ord.)
                                                             </span>
                                                           );
                                                         })}
                                                       </div>
                                                     )}
                                                   </div>
                                                 );
                                               })}
                                             </div>
                                           </div>
                                         );
                                       })}

                                       {/* Fallback for unmapped raw tags */}
                                       {(() => {
                                         // Gather all mapped L4 for this Nivel 2
                                         const mappedL4Names = new Set<string>();
                                         l3Keys.forEach((l3) => {
                                           (l3Map[l3] || []).forEach((l4) => mappedL4Names.add(l4));
                                         });

                                         const unmappedRawCats = group.rawCats.filter(raw => {
                                           const map = DROPI_MAPPING_DICT[raw.name];
                                           return !map?.l4 || !mappedL4Names.has(map.l4);
                                         });

                                         if (unmappedRawCats.length === 0) return null;

                                         return (
                                           <div className="bg-slate-50/50 border border-slate-100/60 rounded-lg p-2.5 flex flex-col gap-1.5">
                                             <span className="text-[10.5px] font-bold text-gray-400 italic">
                                               📁 Otros / Sin mapear a Nivel 4
                                             </span>
                                             <div className="flex flex-wrap gap-1">
                                               {unmappedRawCats.map((raw) => {
                                                 const map = DROPI_MAPPING_DICT[raw.name];
                                                 const isTypo = map?.alert === "typo";
                                                 const isSelected = selectedDropiCat === raw.name;
                                                 return (
                                                   <span
                                                     key={raw.name}
                                                     className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-[8.5px] font-semibold border ${
                                                       isSelected
                                                         ? "bg-orange-500 text-white border-orange-500 shadow-2xs"
                                                         : isTypo
                                                         ? "bg-amber-50 text-amber-600 border-amber-200"
                                                         : "bg-slate-100 text-gray-600 border-slate-200"
                                                     }`}
                                                   >
                                                     {raw.name} {isTypo && "⚠️"} ({raw.orders.toLocaleString()} ord.)
                                                   </span>
                                                 );
                                               })}
                                             </div>
                                           </div>
                                         );
                                       })()}
                                     </div>
                                   </div>
                                 );
                               })}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  rightView === "mapping" ? (
                    <div className="text-center py-20 bg-white border border-dashed rounded-2xl text-gray-400 text-xs">
                      Selecciona una categoría plana de la izquierda para ver su simulación de homologación.
                    </div>
                  ) : null
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
              <h2 className="text-base font-bold text-gray-900 mb-2">Referencias de Industria</h2>
              <p className="text-xs text-gray-500 leading-relaxed max-w-4xl">
                Análisis comparativo de taxonomías externas como base para construir la taxonomía propia de Dropi. Incluye explorador de MercadoLibre Colombia (12,172 categorías), homologación Google Product Taxonomy y conclusiones estratégicas sobre el modelo a adoptar.
              </p>
            </div>

            {/* Selector Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-fit border shadow-2xs" style={{ borderColor: "var(--border)" }}>
              <button
                onClick={() => setActiveMeliTab("conclusions")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeMeliTab === "conclusions"
                    ? "bg-white text-orange-600 shadow-2xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                📋 Análisis y Conclusiones
              </button>
              <button
                onClick={() => setActiveMeliTab("graph")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeMeliTab === "graph"
                    ? "bg-white text-orange-600 shadow-2xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                🕸️ Grafo MercadoLibre
              </button>
              <button
                onClick={() => setActiveMeliTab("columns")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeMeliTab === "columns"
                    ? "bg-white text-orange-600 shadow-2xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                📁 Visor de Columnas
              </button>
            </div>

            {/* MILLER COLUMNS VIEW */}
            {activeMeliTab === "conclusions" && (
              <div className="space-y-6 animate-fade-in">

                {/* Decision box */}
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider block mb-2">Decisión recomendada</span>
                  <p className="text-sm font-bold text-gray-900 leading-snug mb-3">
                    Construir una taxonomía propia de Dropi, tomando MercadoLibre Colombia como referencia principal de estructura, y complementarla con una capa de homologación Google Product Taxonomy.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {[
                      { icon: "🟢", label: "MercadoLibre Colombia", role: "Referencia principal", desc: "Estructura jerárquica, lógica marketplace, contexto LATAM/Colombia." },
                      { icon: "🔵", label: "Google Product Taxonomy", role: "Capa de homologación", desc: "Merchant Center, Shopping Ads, Performance Max, feeds externos." },
                      { icon: "🟡", label: "Amazon / HS / UNSPSC / GS1", role: "Referencias secundarias", desc: "Atributos técnicos, comercio exterior, supply chain. Fase posterior." },
                    ].map(({ icon, label, role, desc }) => (
                      <div key={label} className="bg-white border border-orange-100 rounded-xl p-4">
                        <span className="text-base block mb-1">{icon}</span>
                        <span className="font-bold text-gray-900 block">{label}</span>
                        <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block mb-1">{role}</span>
                        <span className="text-gray-500 leading-relaxed">{desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Why MercadoLibre */}
                <div className="bg-white border rounded-2xl p-6 shadow-2xs" style={{ borderColor: "var(--border)" }}>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Por qué MercadoLibre como referencia principal</h3>
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">Su estructura está más cerca del contexto de Dropi que cualquier otra alternativa.</p>
                  <div className="space-y-2">
                    {[
                      "Opera en Latinoamérica y Colombia — referente conocido para sellers, proveedores y equipos comerciales.",
                      "Lógica marketplace similar a la experiencia de navegación que necesitamos.",
                      "Categorización pensada para publicación, búsqueda y navegación de productos.",
                      "Estructura jerárquica que lleva al usuario desde categoría general hasta categoría final específica.",
                      "Fácil de explicar y validar internamente — no requiere traducción de contexto.",
                    ].map((point, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-gray-600">
                        <span className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 font-bold text-[9px] flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                        <span className="leading-relaxed">{point}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-slate-50 border rounded-xl text-xs font-mono text-gray-600" style={{ borderColor: "var(--border)" }}>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Ejemplo de ruta Dropi</span>
                    Hogar y Muebles → Cocina → Utensilios → Vajillas
                    <span className="block text-[10px] text-gray-400 mt-1">↳ Homologado contra categoría equivalente MercadoLibre + Google ID</span>
                  </div>
                </div>

                {/* Why Google */}
                <div className="bg-white border rounded-2xl p-6 shadow-2xs" style={{ borderColor: "var(--border)" }}>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Por qué incluir Google Product Taxonomy</h3>
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">Como capa de homologación — no como taxonomía principal visible.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {[
                      "Google Merchant Center","Google Shopping","Shopping Ads","Performance Max",
                      "Feeds de producto","Listados gratuitos","Organización de campañas por tipo","Integraciones externas futuras",
                    ].map(use => (
                      <div key={use} className="flex items-center gap-2 text-xs text-gray-600 bg-blue-50/40 border border-blue-100 rounded-lg px-3 py-2">
                        <span className="text-blue-500 font-bold">→</span> {use}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 border rounded-xl" style={{ borderColor: "var(--border)" }}>
                      <span className="font-bold text-gray-700 block mb-0.5">google_product_category</span>
                      <span className="text-gray-500">Categoría oficial de Google — capa de homologación.</span>
                    </div>
                    <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl">
                      <span className="font-bold text-orange-700 block mb-0.5">product_type</span>
                      <span className="text-orange-600">Taxonomía propia de Dropi — visible para usuarios y catálogo.</span>
                    </div>
                  </div>
                </div>

                {/* Why not Amazon */}
                <div className="bg-white border rounded-2xl p-6 shadow-2xs" style={{ borderColor: "var(--border)" }}>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Por qué Amazon no es la base principal</h3>
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">No se descarta — queda como referencia secundaria para atributos técnicos en fases posteriores.</p>
                  <div className="space-y-2">
                    {[
                      { title: "Estructura más compleja", desc: "Separa categorías de navegación, browse nodes, product types, atributos obligatorios y reglas por marketplace." },
                      { title: "Sin referencia directa para Colombia", desc: "Habría que elegir Amazon US, México o Brasil — cualquier opción sesga nombres y comportamiento de navegación." },
                      { title: "Orientado a publicación técnica Amazon", desc: "Su API de Product Type Definitions es útil para atributos, no para definir experiencia de navegación de Dropi." },
                      { title: "Complejidad innecesaria en Fase 1", desc: "El objetivo inicial es ordenar el catálogo y validar con usuarios internos. Amazon suma mejor en Fase 2 (atributos)." },
                    ].map(({ title, desc }) => (
                      <div key={title} className="flex items-start gap-3 text-xs border-b pb-2" style={{ borderColor: "var(--border)" }}>
                        <span className="text-amber-500 font-bold mt-0.5">⚠</span>
                        <div><span className="font-bold text-gray-800">{title}: </span><span className="text-gray-500">{desc}</span></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* International standards */}
                <div className="bg-white border rounded-2xl p-6 shadow-2xs" style={{ borderColor: "var(--border)" }}>
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Estándares internacionales revisados</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b text-[10px] font-bold text-gray-400 uppercase tracking-wider" style={{ borderColor: "var(--border)" }}>
                          <th className="p-3 text-left">Estándar</th>
                          <th className="p-3 text-left">Caso de uso principal</th>
                          <th className="p-3 text-left">Uso recomendado en Dropi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: "HS Code / Sistema Armonizado", use: "Comercio exterior, aduanas, aranceles", dropi: "Importación, proveedores internacionales, compliance" },
                          { name: "UNSPSC", use: "Compras corporativas, procurement, análisis de gasto", dropi: "Analítica corporativa, segmentación B2B, reportes estructurados" },
                          { name: "GS1 / GPC", use: "Retail, códigos de barras, GTIN, supply chain", dropi: "GTIN, trazabilidad, interoperabilidad con terceros (fase futura)" },
                        ].map((row, i) => (
                          <tr key={i} className="border-b hover:bg-slate-50 transition-colors" style={{ borderColor: "var(--border)" }}>
                            <td className="p-3 font-bold text-gray-800">{row.name}</td>
                            <td className="p-3 text-gray-500">{row.use}</td>
                            <td className="p-3 text-gray-600">{row.dropi}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Model table */}
                <div className="bg-white border rounded-2xl p-6 shadow-2xs" style={{ borderColor: "var(--border)" }}>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Modelo de capas recomendado para Dropi</h3>
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">Una taxonomía propia homologable — no dependiente de una sola referencia externa.</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b text-[10px] font-bold text-gray-400 uppercase tracking-wider" style={{ borderColor: "var(--border)" }}>
                          <th className="p-3 text-left">Capa</th>
                          <th className="p-3 text-left">Uso</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { layer: "Taxonomía Dropi", bg: "bg-orange-50 text-orange-700", use: "Categoría principal visible para usuarios internos, proveedores y dropshippers." },
                          { layer: "MercadoLibre Mapping", bg: "bg-amber-50 text-amber-700", use: "Referencia marketplace para validar estructura, navegación y categoría final." },
                          { layer: "Google Product Taxonomy Mapping", bg: "bg-blue-50 text-blue-700", use: "Homologación para feeds, pauta, Merchant Center y canales externos." },
                          { layer: "Amazon Reference", bg: "bg-slate-100 text-slate-600", use: "Referencia secundaria para atributos técnicos por tipo de producto (Fase 2)." },
                          { layer: "HS Code", bg: "bg-slate-100 text-slate-600", use: "Importación, aduanas y comercio exterior." },
                          { layer: "UNSPSC", bg: "bg-slate-100 text-slate-600", use: "Procurement y analítica corporativa." },
                          { layer: "GS1 / GPC", bg: "bg-slate-100 text-slate-600", use: "Retail, GTIN, supply chain e identificación de producto." },
                        ].map((row, i) => (
                          <tr key={i} className="border-b hover:bg-slate-50 transition-colors" style={{ borderColor: "var(--border)" }}>
                            <td className="p-3"><span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${row.bg}`}>{row.layer}</span></td>
                            <td className="p-3 text-gray-500 leading-relaxed">{row.use}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

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

  const renderTaxonomyDoc = () => {
    return (
      <div className="bg-white border rounded-2xl p-6 shadow-2xs space-y-4 text-xs leading-relaxed" style={{ borderColor: "var(--border)" }}>
        <h4 className="text-sm font-bold text-gray-900">Propuesta de Taxonomía Unificada de Dropi</h4>
        <p className="text-gray-500">
          Para estructurar el catálogo desordenado actual, hemos unificado las más de 160 categorías planas creadas libremente en <span className="font-bold">10 familias principales (Level 1)</span>:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-xl bg-slate-50/50" style={{ borderColor: "var(--border)" }}>
            <span className="font-bold text-slate-900 block mb-1">🏠 1. Hogar y Decoración</span>
            <span className="text-gray-500 text-[10px]">Agrupa cocina, muebles, jardinería, decoración, aseo y limpieza.</span>
          </div>
          <div className="p-4 border rounded-xl bg-slate-50/50" style={{ borderColor: "var(--border)" }}>
            <span className="font-bold text-slate-900 block mb-1">💻 2. Tecnología y Electrónica</span>
            <span className="text-gray-500 text-[10px]">Computadores, celulares, consolas, videojuegos y gadgets novedosos.</span>
          </div>
          <div className="p-4 border rounded-xl bg-slate-50/50" style={{ borderColor: "var(--border)" }}>
            <span className="font-bold text-slate-900 block mb-1">💅 3. Belleza y Cuidado Personal</span>
            <span className="text-gray-500 text-[10px]">Cosméticos, maquillaje, perfumería, fajas, cuidado corporal y capilar.</span>
          </div>
          <div className="p-4 border rounded-xl bg-slate-50/50" style={{ borderColor: "var(--border)" }}>
            <span className="font-bold text-slate-900 block mb-1">❤️ 4. Salud y Bienestar</span>
            <span className="text-gray-500 text-[10px]">Suplementos vitamínicos, encapsulados, nutrición, salud general y pods.</span>
          </div>
          <div className="p-4 border rounded-xl bg-slate-50/50" style={{ borderColor: "var(--border)" }}>
            <span className="font-bold text-slate-900 block mb-1">👗 5. Moda y Calzado</span>
            <span className="text-gray-500 text-[10px]">Ropa de vestir (dama/caballero), calzado nacional, bisutería y morrales.</span>
          </div>
          <div className="p-4 border rounded-xl bg-slate-50/50" style={{ borderColor: "var(--border)" }}>
            <span className="font-bold text-slate-900 block mb-1">🧸 6. Juguetes y Bebés</span>
            <span className="text-gray-500 text-[10px]">Juguetería para niños, accesorios de bebés, cunas y entretenimiento infantil.</span>
          </div>
          <div className="p-4 border rounded-xl bg-slate-50/50" style={{ borderColor: "var(--border)" }}>
            <span className="font-bold text-slate-900 block mb-1">⚽ 7. Deportes y Outdoor</span>
            <span className="text-gray-500 text-[10px]">Equipos de gimnasio, ropa deportiva, accesorios de camping y pesca.</span>
          </div>
          <div className="p-4 border rounded-xl bg-slate-50/50" style={{ borderColor: "var(--border)" }}>
            <span className="font-bold text-slate-900 block mb-1">🔧 8. Ferretería y Herramientas</span>
            <span className="text-gray-500 text-[10px]">Herramientas manuales/eléctricas, bricolaje, insumos de construcción y cerrajería.</span>
          </div>
          <div className="p-4 border rounded-xl bg-slate-50/50" style={{ borderColor: "var(--border)" }}>
            <span className="font-bold text-slate-900 block mb-1">🔞 9. Productos para Adultos</span>
            <span className="text-gray-500 text-[10px]">Artículos de sexshop, lubricantes, aceites corporales y bienestar sexual.</span>
          </div>
          <div className="p-4 border rounded-xl bg-slate-50/50" style={{ borderColor: "var(--border)" }}>
            <span className="font-bold text-slate-900 block mb-1">📁 10. Otras Categorías</span>
            <span className="text-gray-500 text-[10px]">Papelería, oficina, arte, libros y registros pendientes de reclasificar.</span>
          </div>
        </div>
      </div>
    );
  };

  const renderAiDoc = () => {
    return (
      <div className="bg-white border rounded-2xl p-6 shadow-2xs space-y-4 text-xs leading-relaxed" style={{ borderColor: "var(--border)" }}>
        <h4 className="text-sm font-bold text-gray-900">Pipeline de Limpieza y Reglas de Negocio</h4>
        <div className="space-y-3">
          <div className="border-l-2 border-orange-500 pl-3">
            <span className="font-bold block text-slate-900">1. Corrección de Ortografía (Typos) por Distancia Levenshtein</span>
            <p className="text-gray-500 mt-0.5">
              Usamos la distancia de edición de Levenshtein para medir la similitud entre etiquetas creadas manualmente por los proveedores (ej: <span className="font-mono text-red-500 font-bold">TEGNOLOGIA</span> o <span className="font-mono text-red-500 font-bold">FITENSS</span>) y las etiquetas oficiales. Si la distancia es menor a un umbral configurado (D &le; 2), el sistema propone la corrección automatizada.
            </p>
          </div>
          <div className="border-l-2 border-orange-500 pl-3">
            <span className="font-bold block text-slate-900">2. Normalización de Cadenas</span>
            <p className="text-gray-500 mt-0.5">
              Toda etiqueta de categoría se somete a remoción de tildes (normalización unicode NFD), eliminación de espacios en blanco excedentes y conversión a mayúsculas para detectar duplicados implícitos (ej. <span className="font-mono">Sex Shop</span> y <span className="font-mono">SEXSHOP</span>).
            </p>
          </div>
          <div className="border-l-2 border-orange-500 pl-3">
            <span className="font-bold block text-slate-900">3. Pipeline de Enriquecimiento L1 / L2 asistido por LLMs</span>
            <p className="text-gray-500 mt-0.5">
              Para los productos en categorías genéricas ("basura") como <span className="font-mono">OTRO</span>, un agente clasificador lee el título, la descripción y los atributos del producto para reasignarle dinámicamente un nodo hoja válido en la nueva taxonomía estandarizada.
            </p>
          </div>
        </div>

        {/* ── Estimación de costos IA ───────────────────────────────────────── */}
        <div className="border-t pt-5 space-y-5" style={{ borderColor: "var(--border)" }}>
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-1">Estimación de Costo IA — Categorizador GPT-4o mini</h4>
            <p className="text-gray-500 leading-relaxed">
              El categorizador envía el árbol completo de <span className="font-bold">225 nodos Dropi</span> en cada llamada (~5,700 tokens de contexto) y recibe el L4 más apropiado. Los costos fueron calculados sobre la base real de <span className="font-bold">1,076,982 productos vigentes</span> en Dropi.
            </p>
          </div>

          {/* Costo unitario */}
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Costo por producto individual</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { caso: "Proveedor sube 1 producto", n: "1 llamada", costo: "$0.0011 USD", sub: "< 1 centavo. Costo irrelevante en upload individual.", color: "emerald" },
                { caso: "Carga masiva 100 productos", n: "100 llamadas", costo: "$0.11 USD", sub: "Sin optimización. Con batch de 20: $0.005 USD.", color: "emerald" },
                { caso: "Carga masiva 1,000 productos", n: "1,000 llamadas", costo: "$1.08 USD", sub: "Sin optimización. Con batch de 20: $0.047 USD.", color: "amber" },
              ].map(({ caso, n, costo, sub, color }) => (
                <div key={caso} className={`p-4 border rounded-xl bg-${color}-50/40 border-${color}-200`}>
                  <span className="font-bold text-gray-800 block mb-1">{caso}</span>
                  <span className="text-[10px] text-gray-400 block mb-2">{n}</span>
                  <span className={`text-xl font-extrabold text-${color}-600 block mb-1`}>{costo}</span>
                  <span className="text-[10px] text-gray-500 leading-relaxed">{sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Costo base de datos completa */}
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Costo recategorización base completa (1,076,982 productos)</span>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b text-[10px] font-bold text-gray-400 uppercase tracking-wider" style={{ borderColor: "var(--border)" }}>
                    <th className="p-3 text-left">Estrategia</th>
                    <th className="p-3 text-right">Costo total</th>
                    <th className="p-3 text-right">Tiempo estimado</th>
                    <th className="p-3 text-left">Notas</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { estrategia: "Sin optimización (1 producto = 1 llamada)", costo: "~$1,159", tiempo: "~36 horas", nota: "Baseline. No recomendado para producción.", alert: true },
                    { estrategia: "Batch 10 productos por llamada", costo: "~$147", tiempo: "~216 min", nota: "La taxonomía se amortiza entre 10 productos.", alert: false },
                    { estrategia: "Batch 20 productos por llamada", costo: "~$100", tiempo: "~108 min", nota: "Punto óptimo entre costo y manejo de contexto.", alert: false },
                    { estrategia: "Batch 20 + OpenAI Batch API (50% off)", costo: "~$50", tiempo: "24h background", nota: "Recomendado. Procesa asíncrono, descuento automático del 50%.", alert: false },
                  ].map((row, i) => (
                    <tr key={i} className={`border-b ${row.alert ? "bg-red-50/30" : i === 3 ? "bg-emerald-50/30" : ""}`} style={{ borderColor: "var(--border)" }}>
                      <td className="p-3 font-semibold text-gray-800">{row.estrategia}</td>
                      <td className={`p-3 text-right font-extrabold ${row.alert ? "text-red-600" : i === 3 ? "text-emerald-600" : "text-gray-800"}`}>{row.costo}</td>
                      <td className="p-3 text-right text-gray-500">{row.tiempo}</td>
                      <td className="p-3 text-gray-500">{row.nota}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Por fases */}
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Estrategia por fases (con Batch API)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { fase: "Fase 1", label: "Productos con órdenes (~377k)", costo: "~$18 USD", desc: "Máximo ROI inmediato. Mejora feeds, pauta y búsqueda sobre lo que ya vende.", color: "orange" },
                { fase: "Fase 2", label: "Resto del catálogo (~700k)", costo: "~$33 USD", desc: "Completa la taxonomía. Se corre en background sin urgencia operativa.", color: "slate" },
              ].map(({ fase, label, costo, desc, color }) => (
                <div key={fase} className={`p-4 border rounded-xl bg-${color}-50/40`} style={{ borderColor: `var(--border)` }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold text-${color}-600 uppercase tracking-wider`}>{fase}</span>
                    <span className="text-base font-extrabold text-gray-900">{costo}</span>
                  </div>
                  <span className="font-bold text-gray-800 block mb-1">{label}</span>
                  <span className="text-[10px] text-gray-500 leading-relaxed">{desc}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="font-bold text-emerald-800">Costo total base completa (Fase 1 + 2)</span>
              <span className="text-lg font-extrabold text-emerald-700">~$50 USD — una sola vez</span>
            </div>
          </div>

          {/* Por qué es económico */}
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Por qué el costo baja tanto con optimización</span>
            <div className="space-y-2">
              {[
                { n: "1", titulo: "El costo dominante es el contexto (taxonomía)", desc: "El árbol de 225 nodos ocupa ~5,700 tokens por llamada — el 88% del costo de input. Mandarlo una sola vez para 20 productos en lugar de 20 veces lo amortiza completamente." },
                { n: "2", titulo: "OpenAI Batch API — 50% de descuento automático", desc: "Para tareas que no necesitan respuesta en tiempo real, OpenAI procesa en background con un 24h SLA y aplica el 50% de descuento sin configuración adicional." },
                { n: "3", titulo: "GPT-4o mini vs GPT-4o", desc: "GPT-4o mini cuesta ~15x menos que GPT-4o con calidad suficiente para clasificación estructurada. La taxonomía es pequeña (225 nodos) y el task es de clasificación, no de razonamiento complejo." },
                { n: "4", titulo: "El costo por consulta online es despreciable", desc: "Para uso interactivo (un proveedor subiendo productos), $0.001 por producto es ruido. El costo relevante solo aparece en operaciones masivas batch, donde la optimización lo baja 20x." },
              ].map(({ n, titulo, desc }) => (
                <div key={n} className="flex items-start gap-3 p-3 border rounded-xl bg-slate-50/50" style={{ borderColor: "var(--border)" }}>
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{n}</span>
                  <div>
                    <span className="font-bold text-gray-800 block mb-0.5">{titulo}</span>
                    <span className="text-gray-500 leading-relaxed">{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGoogle = () => {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-white border rounded-2xl p-6 shadow-2xs" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-base font-bold text-gray-900 mb-2">Google Product Taxonomy</h2>
          <p className="text-xs text-gray-500 leading-relaxed max-w-4xl">
            Taxonomía oficial de Google para clasificación de productos en Google Shopping, Merchant Center y Performance Max. Se usa como capa de homologación sobre la taxonomía Dropi para canales externos (feeds, Shopping Ads, SEO comercial).
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 font-semibold">
              google_product_category → referencia oficial Google
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 border border-orange-100 font-semibold">
              product_type → taxonomía propia Dropi
            </span>
          </div>
        </div>

        {/* Import status */}
        <div className="bg-white border rounded-2xl p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: "var(--border)" }}>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Categorías Google en Base de Datos</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-gray-900">{googleCount.toLocaleString()}</span>
              <span className="text-xs text-gray-500">categorías</span>
              {googleCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">Listo</span>
              )}
            </div>
            {googleImportMsg && (
              <p className={`text-xs mt-2 ${googleImportMsg.startsWith("Error") ? "text-red-600" : "text-emerald-600"} font-semibold`}>
                {googleImportMsg}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleImportGoogle}
              disabled={googleImporting}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {googleImporting ? "Importando..." : googleCount > 0 ? "Reimportar Taxonomía" : "Importar Taxonomía Google"}
            </button>
            {googleCount > 0 && (
              <button
                onClick={() => { setMainTab("google_mapping"); setActiveResourceTab(null); }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-sm"
              >
                Ir a Homologación →
              </button>
            )}
          </div>
        </div>

        {/* Stats breakdown */}
        {googleCount > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total categorías", value: googleCount.toLocaleString(), color: "text-gray-900" },
              { label: "Profundidad máx.", value: "7 niveles", color: "text-blue-600" },
              { label: "Idioma fuente", value: "Inglés (EN-US)", color: "text-gray-600" },
              { label: "Fuente", value: "Google Merchant", color: "text-gray-600" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white border rounded-xl p-4 shadow-2xs" style={{ borderColor: "var(--border)" }}>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">{label}</span>
                <span className={`text-sm font-extrabold ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Source info */}
        <div className="bg-slate-50 border rounded-2xl p-5 text-xs text-gray-500" style={{ borderColor: "var(--border)" }}>
          <span className="font-bold text-gray-700 block mb-1">Fuente oficial</span>
          <span className="font-mono text-blue-600 break-all">
            https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt
          </span>
          <p className="mt-2 leading-relaxed">
            Formato: <span className="font-mono">ID - Nivel1 &gt; Nivel2 &gt; Nivel3 ...</span> — Hasta 7 niveles de profundidad. Sin autenticación requerida.
          </p>
        </div>
      </div>
    );
  };

  const renderGoogleHomologacion = () => {
    const pendingCount  = mappings.filter(m => m.status === "pending_review").length;
    const approvedCount = mappings.filter(m => m.status === "approved").length;
    const rejectedCount = mappings.filter(m => m.status === "rejected").length;

    const confidenceBadge = (label: string) => {
      if (label === "high")         return "bg-emerald-50 text-emerald-700 border-emerald-200";
      if (label === "medium")       return "bg-amber-50 text-amber-700 border-amber-200";
      if (label === "low")          return "bg-orange-50 text-orange-700 border-orange-200";
      return "bg-red-50 text-red-700 border-red-200";
    };

    const statusBadge = (status: string) => {
      if (status === "approved")    return "bg-emerald-50 text-emerald-700 border-emerald-200";
      if (status === "rejected")    return "bg-red-50 text-red-700 border-red-200";
      if (status === "needs_more_context") return "bg-purple-50 text-purple-700 border-purple-200";
      return "bg-slate-100 text-slate-600 border-slate-200";
    };

    const statusLabel = (status: string) => {
      if (status === "approved")           return "Aprobado";
      if (status === "rejected")           return "Rechazado";
      if (status === "needs_more_context") return "Necesita revisión";
      return "Pendiente";
    };

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="bg-white border rounded-2xl p-6 shadow-2xs" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-base font-bold text-gray-900 mb-1">Homologación Dropi ↔ Google</h2>
          <p className="text-xs text-gray-500 leading-relaxed max-w-4xl">
            Asocia cada categoría L4 de la taxonomía Dropi con su equivalente oficial en Google Product Taxonomy. Las sugerencias son automáticas (algoritmo semántico + diccionario ES→EN) y requieren validación manual.
          </p>
        </div>

        {/* Setup checklist */}
        {mappings.length === 0 && !mappingLoading && (
          <div className="bg-white border rounded-2xl p-6 shadow-2xs space-y-4" style={{ borderColor: "var(--border)" }}>
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Setup requerido</h3>
            <div className="space-y-3">
              {[
                { label: "1. Importar taxonomía Google", done: googleCount > 0, action: handleImportGoogle, actionLabel: googleImporting ? "Importando..." : "Importar", disabled: googleImporting },
                { label: "2. Generar sugerencias automáticas", done: false, action: handleGenerateSuggestions, actionLabel: suggesting ? "Generando..." : "Generar Sugerencias", disabled: suggesting || googleCount === 0 },
              ].map(({ label, done, action, actionLabel, disabled }) => (
                <div key={label} className="flex items-center justify-between p-4 border rounded-xl bg-slate-50" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${done ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"}`}>
                      {done ? "✓" : "○"}
                    </span>
                    <span className="text-xs font-semibold text-gray-700">{label}</span>
                  </div>
                  {!done && (
                    <button
                      onClick={action}
                      disabled={disabled}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {actionLabel}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action bar */}
        {mappings.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Stats chips */}
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { label: `${mappings.length} total`, cls: "bg-slate-100 text-slate-700 border-slate-200" },
                { label: `${pendingCount} pendientes`, cls: "bg-slate-100 text-slate-600 border-slate-200" },
                { label: `${approvedCount} aprobados`, cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                { label: `${rejectedCount} rechazados`, cls: "bg-red-50 text-red-700 border-red-200" },
              ].map(({ label, cls }) => (
                <span key={label} className={`px-2.5 py-1 rounded-full font-bold border ${cls}`}>{label}</span>
              ))}
            </div>
            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleGenerateSuggestions}
                disabled={suggesting || googleCount === 0}
                className="px-3 py-2 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 disabled:opacity-50 transition-all"
              >
                {suggesting ? "Generando..." : "Regenerar"}
              </button>
              <button
                onClick={handleExportCSV}
                className="px-3 py-2 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all"
              >
                Exportar CSV
              </button>
            </div>
          </div>
        )}

        {/* Suggest result summary */}
        {suggestResult && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-xs">
            <span className="font-bold text-blue-800 block mb-2">Sugerencias generadas</span>
            <div className="flex flex-wrap gap-4 text-blue-700">
              <span>{suggestResult.dropi_categories} categorías Dropi procesadas</span>
              <span>{suggestResult.google_categories.toLocaleString()} categorías Google analizadas</span>
              <span className="text-emerald-700 font-bold">{suggestResult.rank1_summary.high} con confianza alta</span>
              <span className="text-amber-700 font-bold">{suggestResult.rank1_summary.medium} confianza media</span>
              <span className="text-orange-700 font-bold">{suggestResult.rank1_summary.low} baja</span>
              <span className="text-red-700 font-bold">{suggestResult.rank1_summary.needs_review} requieren revisión</span>
            </div>
          </div>
        )}

        {/* Filters */}
        {mappings.length > 0 && (
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filtrar:</span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg border text-[10px] font-bold" style={{ borderColor: "var(--border)" }}>
              {[["all","Todos"],["pending_review","Pendientes"],["approved","Aprobados"],["rejected","Rechazados"]].map(([val,label]) => (
                <button
                  key={val}
                  onClick={() => setStatusFilter(val)}
                  className={`px-3 py-1.5 rounded-md transition-all ${statusFilter === val ? "bg-white text-orange-600 shadow-2xs border" : "text-gray-500 hover:text-gray-900"}`}
                  style={{ borderColor: statusFilter === val ? "var(--border)" : "transparent" }}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex bg-slate-100 p-0.5 rounded-lg border text-[10px] font-bold" style={{ borderColor: "var(--border)" }}>
              {[["all","Todas"],["high","Alta"],["medium","Media"],["low","Baja"],["needs_review","Revisar"]].map(([val,label]) => (
                <button
                  key={val}
                  onClick={() => setConfidenceFilter(val)}
                  className={`px-3 py-1.5 rounded-md transition-all ${confidenceFilter === val ? "bg-white text-blue-600 shadow-2xs border" : "text-gray-500 hover:text-gray-900"}`}
                  style={{ borderColor: confidenceFilter === val ? "var(--border)" : "transparent" }}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={fetchMappings}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-white border text-gray-600 hover:bg-slate-50 transition-all"
              style={{ borderColor: "var(--border)" }}
            >
              Aplicar filtros
            </button>
          </div>
        )}

        {/* Mapping table */}
        {mappingLoading && (
          <div className="text-center py-20 text-gray-400 text-xs">Cargando mappings...</div>
        )}

        {!mappingLoading && mappings.length > 0 && (
          <div className="bg-white border rounded-2xl overflow-hidden shadow-2xs" style={{ borderColor: "var(--border)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b font-bold text-gray-500 text-[10px] uppercase tracking-wider" style={{ borderColor: "var(--border)" }}>
                    <th className="p-4">Categoría Dropi (L4)</th>
                    <th className="p-4">Mejor Match Google</th>
                    <th className="p-4 text-center">Score</th>
                    <th className="p-4 text-center">Estado</th>
                    <th className="p-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {mappings.map((m) => (
                    <React.Fragment key={m.id}>
                      <tr
                        className="border-b hover:bg-slate-50 transition-colors"
                        style={{ borderColor: "var(--border)" }}
                      >
                        {/* Dropi path */}
                        <td className="p-4 max-w-xs">
                          <span className="font-mono text-[10px] text-gray-400 block">{m.dropi_category_id}</span>
                          <span className="text-xs font-semibold text-gray-800 leading-tight">{m.dropi_category_path}</span>
                        </td>

                        {/* Google match */}
                        <td className="p-4 max-w-xs">
                          <span className="text-xs text-gray-600 leading-tight block">{m.google_category_path}</span>
                          <span className="font-mono text-[9px] text-gray-400 mt-0.5 block">ID: {m.google_category_id} · {m.match_type}</span>
                        </td>

                        {/* Confidence score */}
                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-sm font-extrabold text-gray-900">{m.confidence_score}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${confidenceBadge(m.confidence_label)}`}>
                              {m.confidence_label === "needs_review" ? "revisar" : m.confidence_label}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusBadge(m.status)}`}>
                            {statusLabel(m.status)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 justify-center">
                            {m.status !== "approved" && (
                              <button
                                onClick={() => handleUpdateMapping(m.id, "approved")}
                                className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all"
                              >
                                Aprobar
                              </button>
                            )}
                            {m.status !== "rejected" && (
                              <button
                                onClick={() => handleUpdateMapping(m.id, "rejected")}
                                className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-all"
                              >
                                Rechazar
                              </button>
                            )}
                            <button
                              onClick={() => setExpandedMappingId(expandedMappingId === m.id ? null : m.id)}
                              className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-all"
                            >
                              {expandedMappingId === m.id ? "Cerrar" : "Ver más"}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded row: notes + reviewed info */}
                      {expandedMappingId === m.id && (
                        <tr className="bg-blue-50/40 border-b" style={{ borderColor: "var(--border)" }}>
                          <td colSpan={5} className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                              <div>
                                <span className="font-bold text-gray-500 uppercase tracking-wider text-[9px] block mb-1">Path completo Dropi</span>
                                <span className="text-gray-700 font-mono">{m.dropi_category_path}</span>
                              </div>
                              <div>
                                <span className="font-bold text-gray-500 uppercase tracking-wider text-[9px] block mb-1">Path completo Google</span>
                                <span className="text-gray-700 font-mono">{m.google_category_path}</span>
                              </div>
                              <div>
                                <span className="font-bold text-gray-500 uppercase tracking-wider text-[9px] block mb-1">Revisión</span>
                                <span className="text-gray-700">{m.reviewed_by ?? "Sin revisar"}</span>
                                {m.notes && <span className="text-gray-500 block mt-1 italic">{m.notes}</span>}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!mappingLoading && mappings.length === 0 && googleCount > 0 && (
          <div className="text-center py-20 bg-white border border-dashed rounded-2xl text-gray-400 text-xs" style={{ borderColor: "var(--border)" }}>
            No hay mappings generados aún. Haz clic en "Generar Sugerencias" para iniciar el proceso.
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
              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-slate-50">
                {/* Card 1: Diagnóstico */}
                <div
                  onClick={() => setActiveResourceTab(activeResourceTab === "diagnostico" ? null : "diagnostico")}
                  className={`bg-white border rounded-2xl p-4 flex items-start gap-3 shadow-2xs cursor-pointer hover:border-orange-500 hover:shadow-xs transition-all duration-200 ${
                    activeResourceTab === "diagnostico" ? "border-orange-500 bg-orange-50/5 ring-1 ring-orange-500/20" : "border-slate-200"
                  }`}
                >
                  <span className="text-2xl mt-0.5">📊</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-gray-900 mb-1 flex items-center justify-between">
                      <span>Diagnóstico de Taxonomía</span>
                      {activeResourceTab === "diagnostico" && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
                    </div>
                    <div className="text-[10px] leading-relaxed text-gray-500">
                      Auditoría detallada de fragmentación, typos, redundancias y volumen de órdenes afectadas en Dropi.
                    </div>
                  </div>
                </div>

                {/* Card 2: Referencia ML */}
                <div
                  onClick={() => setActiveResourceTab(activeResourceTab === "meli" ? null : "meli")}
                  className={`bg-white border rounded-2xl p-4 flex items-start gap-3 shadow-2xs cursor-pointer hover:border-orange-500 hover:shadow-xs transition-all duration-200 ${
                    activeResourceTab === "meli" ? "border-orange-500 bg-orange-50/5 ring-1 ring-orange-500/20" : "border-slate-200"
                  }`}
                >
                  <span className="text-2xl mt-0.5">📊</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-gray-900 mb-1 flex items-center justify-between">
                      <span>Referencias de Industria</span>
                      {activeResourceTab === "meli" && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
                    </div>
                    <div className="text-[10px] leading-relaxed text-gray-500">
                      Análisis comparativo MELI · Google · Amazon · estándares. Conclusiones y modelo de capas para la taxonomía Dropi.
                    </div>
                  </div>
                </div>

                {/* Card 3: Taxonomía Estándar */}
                <div
                  onClick={() => setActiveResourceTab(activeResourceTab === "taxonomy" ? null : "taxonomy")}
                  className={`bg-white border rounded-2xl p-4 flex items-start gap-3 shadow-2xs cursor-pointer hover:border-orange-500 hover:shadow-xs transition-all duration-200 ${
                    activeResourceTab === "taxonomy" ? "border-orange-500 bg-orange-50/5 ring-1 ring-orange-500/20" : "border-slate-200"
                  }`}
                >
                  <span className="text-2xl mt-0.5">📖</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-gray-900 mb-1 flex items-center justify-between">
                      <span>Taxonomía Estándar</span>
                      {activeResourceTab === "taxonomy" && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
                    </div>
                    <div className="text-[10px] leading-relaxed text-gray-500">
                      Propuesta para condensar más de 160 etiquetas en 10 categorías jerárquicas estándar de Nivel 1.
                    </div>
                  </div>
                </div>

                {/* Card 4: Piloto IA */}
                <div
                  onClick={() => setActiveResourceTab(activeResourceTab === "ai" ? null : "ai")}
                  className={`bg-white border rounded-2xl p-4 flex items-start gap-3 shadow-2xs cursor-pointer hover:border-orange-500 hover:shadow-xs transition-all duration-200 ${
                    activeResourceTab === "ai" ? "border-orange-500 bg-orange-50/5 ring-1 ring-orange-500/20" : "border-slate-200"
                  }`}
                >
                  <span className="text-2xl mt-0.5">🤖</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-gray-900 mb-1 flex items-center justify-between">
                      <span>Piloto IA & Reglas</span>
                      {activeResourceTab === "ai" && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
                    </div>
                    <div className="text-[10px] leading-relaxed text-gray-500">
                      Lógica técnica y algoritmos de corrección automática de typos usando distancia Levenshtein.
                    </div>
                  </div>
                </div>

                {/* Card 5: Google Product Taxonomy */}
                <div
                  onClick={() => setActiveResourceTab(activeResourceTab === "google" ? null : "google")}
                  className={`bg-white border rounded-2xl p-4 flex items-start gap-3 shadow-2xs cursor-pointer hover:border-blue-500 hover:shadow-xs transition-all duration-200 ${
                    activeResourceTab === "google" ? "border-blue-500 bg-blue-50/5 ring-1 ring-blue-500/20" : "border-slate-200"
                  }`}
                >
                  <span className="text-2xl mt-0.5">🛒</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-gray-900 mb-1 flex items-center justify-between">
                      <span>Google Product Taxonomy</span>
                      <div className="flex items-center gap-1.5">
                        {googleCount > 0 && (
                          <span className="text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded-full">
                            {googleCount.toLocaleString()} cats.
                          </span>
                        )}
                        {activeResourceTab === "google" && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                      </div>
                    </div>
                    <div className="text-[10px] leading-relaxed text-gray-500">
                      Taxonomía oficial Google para Merchant Center, Shopping y feeds externos. Capa de homologación sobre Dropi.
                    </div>
                  </div>
                </div>

                {/* Card 6: DAT-001 Reporte de Inteligencia de Catálogo */}
                <a
                  href="/dat001-inteligencia-catalogo.html"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-3 shadow-2xs cursor-pointer hover:border-violet-500 hover:shadow-xs transition-all duration-200 no-underline"
                >
                  <span className="text-2xl mt-0.5">🔬</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-gray-900 mb-1 flex items-center justify-between">
                      <span>DAT-001 · Inteligencia de Catálogo</span>
                      <span className="text-[9px] font-bold bg-violet-50 text-violet-600 border border-violet-100 px-1.5 py-0.5 rounded-full">↗ Reporte</span>
                    </div>
                    <div className="text-[10px] leading-relaxed text-gray-500">
                      Análisis de salud de fichas: descripciones, imágenes, categorías. Comparación de los suppliers que más venden.
                    </div>
                  </div>
                </a>

                {/* Card 7: Revisión de Taxonomía para la Célula */}
                <a
                  href="/cat001-taxonomia-revision-celula.html"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-3 shadow-2xs cursor-pointer hover:border-orange-500 hover:shadow-xs transition-all duration-200 no-underline"
                >
                  <span className="text-2xl mt-0.5">🌳</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-gray-900 mb-1 flex items-center justify-between">
                      <span>Revisión Célula · Árbol + 20 Productos IA</span>
                      <span className="text-[9px] font-bold bg-orange-50 text-orange-600 border border-orange-100 px-1.5 py-0.5 rounded-full">↗ Nuevo</span>
                    </div>
                    <div className="text-[10px] leading-relaxed text-gray-500">
                      Árbol de taxonomía propuesta + 20 productos clasificados con IA (top 5 por producto). Para revisión del equipo.
                    </div>
                  </div>
                </a>
              </div>

              {/* Detailed Expanded View inside Accordion */}
              {activeResourceTab && (
                <div className="border-t p-6 bg-slate-50/50 space-y-6" style={{ borderColor: "var(--border)" }}>
                  {/* Header containing name and collapse button */}
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200/60" style={{ borderColor: "var(--border)" }}>
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                      {activeResourceTab === "diagnostico" && "📊 Diagnóstico Detallado de Taxonomía Actual"}
                      {activeResourceTab === "meli" && "📊 Referencias de Industria — Análisis Comparativo y Explorador"}
                      {activeResourceTab === "taxonomy" && "📖 Propuesta de Taxonomía Estándar (10 Nodos Raíz)"}
                      {activeResourceTab === "ai" && "🤖 Pipeline de Enriquecimiento IA y Distancia Levenshtein"}
                      {activeResourceTab === "google" && "🛒 Google Product Taxonomy — Importador y Referencia"}
                    </h3>
                    <button
                      onClick={() => setActiveResourceTab(null)}
                      className="px-2.5 py-1 text-[10px] font-bold text-slate-500 bg-white border rounded-lg hover:bg-slate-100 hover:text-slate-800 transition-colors"
                      style={{ borderColor: "var(--border)" }}
                    >
                      Cerrar Vista ✕
                    </button>
                  </div>

                  {activeResourceTab === "diagnostico" && renderDiagnostico()}
                  {activeResourceTab === "meli" && renderMeli()}
                  {activeResourceTab === "taxonomy" && renderTaxonomyDoc()}
                  {activeResourceTab === "ai" && renderAiDoc()}
                  {activeResourceTab === "google" && renderGoogle()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Body Tab System */}
        <div className="mt-8">
          {/* Tab switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl w-fit border shadow-2xs mb-6" style={{ borderColor: "var(--border)" }}>
            <button
              onClick={() => setMainTab("simulator")}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                mainTab === "simulator"
                  ? "bg-white text-orange-600 shadow-2xs border"
                  : "text-gray-500 hover:text-gray-900"
              }`}
              style={{ borderColor: mainTab === "simulator" ? "var(--border)" : "transparent" }}
            >
              Simulador de Homologación Dropi
            </button>
            <button
              onClick={() => setMainTab("google_mapping")}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                mainTab === "google_mapping"
                  ? "bg-white text-blue-600 shadow-2xs border"
                  : "text-gray-500 hover:text-gray-900"
              }`}
              style={{ borderColor: mainTab === "google_mapping" ? "var(--border)" : "transparent" }}
            >
              🛒 Homologación Google
              {googleCount > 0 && (
                <span className="text-[9px] font-bold bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                  {googleCount.toLocaleString()}
                </span>
              )}
            </button>
          </div>

          {mainTab === "simulator" && renderHomologacion()}
          {mainTab === "google_mapping" && renderGoogleHomologacion()}
        </div>
      </div>
    </main>
  );
}
