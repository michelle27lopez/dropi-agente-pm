import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Canonical Dropi taxonomy L1 > L2 > L3 > L4
// Source of truth: page.tsx DROPI_COMPLETE_TAXONOMY
const DROPI_TAXONOMY: Record<string, Record<string, Record<string, string[]>>> = {
  "Hogar y Decoración": {
    "Cocina y Utensilios": {
      "Vajilla y Servir": ["Platos y Vajillas Completas","Vasos, Copas y Jarras","Tazas, Pocillos y Tazones","Cubertería y Cubiertos"],
      "Cocción y Preparación": ["Sartenes y Woks","Ollas y Cacerolas","Moldes y Repostería","Utensilios de Cocina (Cucharas, Espátulas)"],
      "Electrodomésticos de Cocina": ["Licuadoras y Batidoras","Freidoras de Aire y Hornos","Cafeteras y Hervidores","Sanducheras y Tostadoras"],
    },
    "Decoración y Diseño": {
      "Adornos de Hogar": ["Espejos Decorativos","Cuadros, Marcos y Lienzos","Floreros, Jarrones y Macetas de Interior","Velas Aromáticas y Difusores","Adornos de Mesa y Pared"],
      "Textiles del Hogar": ["Alfombras y Tapetes","Cortinas y Persianas","Cojines y Mantas Decorativas"],
    },
    "Muebles y Mobiliario": {
      "Muebles de Interior": ["Muebles de Sala (Sofás, Mesas de Centro)","Muebles de Dormitorio (Camas, Mesitas)","Muebles de Oficina y Escritorios"],
      "Estantería y Almacenamiento": ["Estantes, Repisas y Libreros","Armarios y Clósets"],
    },
    "Jardín y Exteriores": {
      "Cuidado de Jardín": ["Herramientas de Jardinería","Mangueras, Riego y Aspersores","Macetas y Jardineras de Exterior"],
      "Muebles de Exterior": ["Sillas y Mesas de Jardín","Parasoles y Sombrillas"],
    },
    "Limpieza, Aseo y Cuidado": {
      "Utensilios de Limpieza": ["Escobas, Trapeadores y Mopas","Plumeros y Paños de Microfibra","Limpiadores Magnéticos y de Vidrios"],
      "Químicos y Consumibles": ["Detergentes y Suavizantes","Desinfectantes y Jabones"],
    },
    "Organización de Espacios": {
      "Almacenamiento Hogar": ["Cajas y Cestas Organizadoras","Zapateras y Organizadores de Calzado","Organizadores de Clóset y Cajones"],
    },
    "Iluminación": {
      "Iluminación Interior": ["Lámparas de Techo y Colgantes","Lámparas de Mesa y Escritorio","Bombillos y Cintas LED"],
      "Iluminación Exterior": ["Reflectores Solares y LED","Luces para Jardín"],
    },
    "Baño y Grifería": {
      "Accesorios de Baño": ["Cortinas y Tapetes de Baño","Organizadores y Repisas de Baño","Toallas y Batas de Baño"],
      "Grifería": ["Grifos de Lavamanos/Cocina","Cabezales de Ducha"],
    },
    "Hogar General": { "Artículos Varios": ["Otros Productos de Hogar"] },
  },
  "Mascotas": {
    "Mascotas General": { "Accesorios de Mascota": ["Accesorios de Paseo y Arnés","Camas y Casas para Mascotas","Ropa y Disfraces de Mascotas"] },
    "Alimento para Mascotas": { "Comidas": ["Concentrados para Perros","Concentrados para Gatos","Premios, Snacks y Galletas"] },
    "Juguetes y Accesorios": { "Diversión": ["Juguetes Mordedores y Pelotas","Juguetes Interactivos y Rascadores","Platos y Bebederos Automáticos"] },
    "Higiene y Cuidado de Mascotas": { "Cuidado Animal": ["Champús y Acondicionadores","Bandejas Sanitarias y Arenas","Cepillos y Cortauñas"] },
    "Acuarofilia y Aves": { "Otros Animales": ["Comida e Insumos para Peces","Jaulas y Accesorios de Aves"] },
  },
  "Tecnología y Electrónica": {
    "Tecnología General": { "Componentes y Accesorios": ["Cables y Adaptadores de Datos","Soportes y Fundas Tecnológicas","Baterías Portátiles y Cargadores"] },
    "Computación y Tablets": { "Hardware y Periféricos": ["Tablets e iPads","Teclados, Mouses y Diademas","Monitores y Accesorios de PC"] },
    "Celulares y Accesorios": { "Accesorios de Celular": ["Estuches y Vidrios Templados","Audífonos Inalámbricos y Bluetooth","Cargadores Inalámbricos y Soportes para Auto"] },
    "Audio y Video": { "Equipos de Sonido e Imagen": ["Parlantes Portátiles y Bluetooth","Cámaras de Seguridad y Vigilancia","Proyectores y Pantallas"] },
    "Gadgets y Novedades": { "Dispositivos Inteligentes": ["Smartwatches y Pulseras Inteligentes","Lentes de Realidad Virtual","Novedades Tecnológicas Varias"] },
    "Videojuegos y Consolas": { "Accesorios de Consolas": ["Controles y Joysticks","Accesorios para Consolas PS5/Switch","Sillas y Teclados Gamers"] },
    "Cámaras y Drones": { "Fotografía y Vuelo": ["Drones de Fotografía","Cámaras Deportivas y de Acción","Estabilizadores y Trípodes"] },
    "Electrónica General": { "Otros Artículos": ["Otros Artículos Electrónicos"] },
  },
  "Belleza y Cuidado Personal": {
    "Belleza General": { "Almacenamiento de Belleza": ["Espejos Cosméticos con Luz LED","Organizadores de Maquillaje","Bolsos Cosméticos y Neceser"] },
    "Maquillaje y Cosméticos": { "Maquillaje Rostro/Ojos": ["Maquillaje de Ojos y Rostro","Labiales y Brillos","Brochas, Esponjas y Aplicadores"] },
    "Perfumería y Fragancias": { "Fragancias de Diseño": ["Perfumes de Dama","Perfumes de Caballero","Fragancias Corporales y Splash"] },
    "Cuidado Capilar": { "Productos para el Cabello": ["Planchas y Rizadores de Cabello","Secadores de Cabello","Tratamientos y Aceites Capilares","Cepillos Eléctricos y Tradicionales"] },
    "Cuidado Corporal": { "Estética Corporal": ["Depiladores Eléctricos y Ceras","Cremas Hidratantes y Exfoliantes","Masajeadores Corporales"] },
    "Cuidado Facial y Skincare": { "Estética Facial": ["Limpiadores Faciales Ultrasónicos","Sueros y Cremas Faciales","Mascarillas e Hidratantes de Rostro"] },
    "Fajas y Ropa Control": { "Moldeadores": ["Fajas Reductoras Femeninas","Cinturillas Deportivas","Fajas Postparto/Postquirúrgicas"] },
    "Higiene y Cuidado Personal": { "Afeitado y Depilación": ["Cuidado Bucal e Irrigadores","Rasuradoras y Cortadoras de Barba"] },
  },
  "Salud y Bienestar": {
    "Salud General": { "Ortopedia y Postura": ["Termómetros y Tensiómetros","Correctores de Postura","Férulas, Rodilleras y Soportes"] },
    "Suplementos y Nutrición": { "Suplementos Dietarios": ["Proteínas y Aminoácidos","Colágeno Hidrolizado y Biotina","Vitaminas y Minerales de Venta Libre","Quemadores de Grasa y Adelgazantes"] },
    "Equipos Médicos y Cuidado de la Salud": { "Aparatos Médicos": ["Nebulizadores y Concentradores","Humidificadores y Vaporizadores","Almohadillas Térmicas y Masajeadores de Terapia"] },
    "Bienestar General": { "Cuidado Alternativo": ["Aceites Esenciales y Aromaterapia","Vaporizadores Personales y Pods","Parches de Alivio y Relajación"] },
    "Óptica y Cuidado Ocular": { "Óptica": ["Gafas de Lectura","Estuches y Accesorios de Gafas","Limpiadores de Lentes"] },
  },
  "Productos para Adultos": {
    "Bienestar Sexual": {
      "Lubricantes y Geles": ["Lubricantes y Geles Íntimos","Estimuladores y Geles Sensibilizantes"],
      "Protección Sexual": ["Preservativos y Barreras de Protección"],
    },
    "Lencería y Ropa Erótica": { "Prendas Íntimas Eróticas": ["Lencería de Dama","Disfraces y Ropa de Noche","Accesorios Eróticos"] },
    "Juguetes para Adultos": { "Entretenimiento Adulto": ["Vibradores y Succionadores","Juguetes de Pareja","Bolas Chinas y Ejercitadores"] },
  },
  "Moda y Calzado": {
    "Moda General": { "Accesorios de Moda": ["Gafas de Sol","Cinturones y Correas","Sombreros, Gorras y Bufandas"] },
    "Bolsos, Morrales y Accesorios": {
      "Carteras y Bolsos": ["Carteras de Dama y Crossbody","Billeteras de Caballero y Tarjeteros"],
      "Morrales": ["Morrales Escolares y Universitarios"],
    },
    "Ropa Femenina (Dama)": {
      "Prendas Superiores": ["Blusas y Camisetas","Chaquetas y Sacos"],
      "Prendas Inferiores": ["Vestidos y Faldas","Jeans, Pantalones y Leggings"],
    },
    "Ropa Masculina (Caballero)": {
      "Prendas Superiores Masculinas": ["Camisas y Camisetas","Chaquetas y Buzos"],
      "Prendas Inferiores Masculinas": ["Pantalones y Bermudas"],
    },
    "Calzado y Zapatos": {
      "Calzado Deportivo": ["Tenis y Zapatillas Deportivas"],
      "Calzado Casual": ["Zapatos Casuales y Mocasines","Sandalias y Chanclas","Botas y Botines"],
    },
    "Bisutería, Joyas y Relojes": {
      "Bisutería": ["Bisutería de Acero y Fantasía","Cadenas, Pulseras y Aretes"],
      "Relojería": ["Relojes de Pulso de Dama/Caballero"],
    },
    "Ropa Interior y de Descanso": { "Ropa Interior": ["Ropa Interior Femenina","Bóxers y Ropa Interior Masculina","Pijamas de Dama/Caballero"] },
    "Ropa Deportiva": { "Prendas Deportivas": ["Leggings Deportivos","Camisetas de Secado Rápido","Conjuntos Deportivos"] },
  },
  "Juguetes y Bebés": {
    "Accesorios y Cuidado Infantil (Bebés)": { "Higiene y Cuidado": ["Pañaleras y Bolsos de Bebé","Termómetros y Aspiradores Nasales","Higiene del Bebé y Baño"] },
    "Juguetes y Juegos": {
      "Juguetes Didácticos": ["Juguetes Didácticos y de Madera"],
      "Juguetes de Acción": ["Muñecas y Figuras de Acción","Carros a Control Remoto y Pistas"],
      "Juegos de Mesa": ["Juegos de Mesa y Rompecabezas"],
    },
    "Lactancia y Alimentación": { "Alimentación Bebé": ["Biberones y Teteros","Extractores de Leche","Baberos y Vajilla Infantil"] },
    "Coches y Sillas para Auto": { "Transporte Bebé": ["Coches Paseadores","Sillas de Seguridad para Carro","Canguros y Portabebés"] },
    "Cuarto del Bebé y Mobiliario": { "Dormitorio Bebé": ["Nidos y Almohadas de Lactancia","Móviles y Luces de Noche","Cunas y Corrales Portátiles"] },
  },
  "Deportes y Outdoor": {
    "Deportes General": { "Protección Deportiva": ["Botatodo e Hidratación","Relojes Deportivos e Instrumentos","Protecciones Deportivas (Rodilleras/Coderas)"] },
    "Equipos Fitness y Gimnasio": { "Entrenamiento en Casa": ["Lazos para Saltar","Mancuernas y Pesas","Bandas de Resistencia","Colchonetas y Mats de Yoga"] },
    "Camping y Pesca": {
      "Equipamiento de Camping": ["Linternas de Cabeza y Camping","Navajas y Multiherramientas","Carpas y Sacos de Dormir"],
      "Insumos de Pesca": ["Artículos de Pesca"],
    },
    "Ciclismo y Mobilidad": { "Accesorios Ciclismo": ["Accesorios para Bicicleta y Luces","Cascos de Ciclismo","Guantes Deportivos"] },
    "Deportes de Aventura": { "Aventura": ["Otros Accesorios Outdoor"] },
  },
  "Ferretería y Herramientas": {
    "Ferretería General": {
      "Cerrajería": ["Candados, Cerraduras y Cerrajería"],
      "Suministros Ferreteros": ["Cintas Adhesivas y Pegantes","Tornillería y Anclajes","Material Eléctrico e Interruptores"],
    },
    "Herramientas Manuales/Eléctricas": {
      "Equipos Eléctricos": ["Taladros, Pulidoras y Soldadores"],
      "Herramientas Manuales": ["Destornilladores y Llaves","Cajas de Herramientas y Organizadores","Brocas y Accesorios de Corte"],
    },
    "Seguridad y Cerramientos": { "Seguridad Personal y Hogar": ["Cámaras de Seguridad Falsas","Alarmas de Puerta/Ventana","Epp: Guantes y Gafas de Seguridad"] },
    "Materiales de Construcción": { "Construcción": ["Iluminación Industrial","Medidores de Distancia Láser"] },
    "Pinturas y Acabados": { "Acabados": ["Pinceles, Rodillos y Brochas","Pintura en Spray"] },
    "Automotriz y Accesorios (Carros/Motos)": {
      "Accesorios para Carros": ["Accesorios de Lujo para Auto","Cámaras de Reversa y Sensores","Cuidado del Auto: Ceras y Champú","Soportes de Celular para Rejilla"],
      "Accesorios para Motos": ["Cascos e Impermeables para Moto"],
    },
  },
  "Otras Categorías": {
    "Papelería y Oficina": { "Escritorio": ["Cuadernos, Agendas y Libretas","Marcadores, Colores y Esferos","Organizadores de Escritorio","Calculadoras"] },
    "Libros y Material Educativo": { "Literatura": ["Libros Físicos de Interés General","Agendas de Planificación","Material Didáctico Escolar"] },
    "Arte, Artesanías y Hobbies": { "Hobbies": ["Kits de Pintura por Números","Lanas, Hilos y Tejeduría","Herramientas de Costura y Manualidades"] },
    "Sin Categorizar": { "Sin Clasificar": ["Registros por Reclasificar","Productos Sin Datos Clasificados"] },
    "Campaña Temporal": { "Ventas Especiales": ["Eventos Comerciales","Ofertas de Temporada"] },
  },
};

function slugify(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30);
}

function buildId(l1: string, l2: string, l3: string, l4: string): string {
  return `DROP-${slugify(l1).slice(0,4)}-${slugify(l2).slice(0,4)}-${slugify(l3).slice(0,4)}-${slugify(l4).slice(0,6)}`;
}

// GET — count seeded Dropi categories
export async function GET() {
  if (!supabase) return NextResponse.json({ count: 0 });
  const { count, error } = await supabase
    .from("dropi_categories")
    .select("*", { count: "exact", head: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ count: count ?? 0 });
}

// POST — seed all L4 leaf nodes from DROPI_TAXONOMY
export async function POST() {
  if (!supabase)
    return NextResponse.json({ error: "No Supabase client" }, { status: 500 });

  const records: {
    dropi_category_id: string;
    dropi_category_path: string;
    level_1: string;
    level_2: string;
    level_3: string;
    level_4: string;
    depth: number;
    status: string;
  }[] = [];

  for (const [l1, l2Map] of Object.entries(DROPI_TAXONOMY)) {
    for (const [l2, l3Map] of Object.entries(l2Map)) {
      for (const [l3, l4List] of Object.entries(l3Map)) {
        for (const l4 of l4List) {
          records.push({
            dropi_category_id: buildId(l1, l2, l3, l4),
            dropi_category_path: `${l1} > ${l2} > ${l3} > ${l4}`,
            level_1: l1,
            level_2: l2,
            level_3: l3,
            level_4: l4,
            depth: 4,
            status: "active",
          });
        }
      }
    }
  }

  // Resolve ID collisions deterministically (e.g. "Lámparas de Techo" vs "Lámparas de Mesa" → both hash to LAMPAR)
  const idCount = new Map<string, number>();
  for (const r of records) idCount.set(r.dropi_category_id, (idCount.get(r.dropi_category_id) ?? 0) + 1);
  const idSeen = new Map<string, number>();
  const finalRecords = records.map(r => {
    if ((idCount.get(r.dropi_category_id) ?? 1) <= 1) return r;
    const n = (idSeen.get(r.dropi_category_id) ?? 0) + 1;
    idSeen.set(r.dropi_category_id, n);
    return { ...r, dropi_category_id: `${r.dropi_category_id}-${n}` };
  });

  console.log(`[seed-dropi] ${finalRecords.length} records (${records.length - finalRecords.length + finalRecords.length} unique IDs). First ID: ${finalRecords[0]?.dropi_category_id}`);

  const CHUNK = 200;
  let seeded = 0;

  for (let i = 0; i < finalRecords.length; i += CHUNK) {
    const chunk = finalRecords.slice(i, i + CHUNK);
    const { error } = await supabase
      .from("dropi_categories")
      .upsert(chunk, { onConflict: "dropi_category_id" });
    if (error) {
      console.error(`[seed-dropi] Upsert error:`, error);
      return NextResponse.json({ error: `${error.message} (code: ${error.code})` }, { status: 500 });
    }
    seeded += chunk.length;
    console.log(`[seed-dropi] Chunk ${i}-${i + seeded} OK`);
  }

  console.log(`[seed-dropi] Done. ${seeded} records seeded.`);
  return NextResponse.json({ success: true, seeded, total: finalRecords.length });
}
