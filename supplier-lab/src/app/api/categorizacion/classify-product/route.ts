import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";
import { requireUser } from "@/lib/require-auth";

const DROPI_TAXONOMY_FLAT: { l1: string; l2: string; l3: string; l4: string }[] = [
  // Hogar y Decoración
  { l1:"Hogar y Decoración",l2:"Cocina y Utensilios",l3:"Vajilla y Servir",l4:"Platos y Vajillas Completas" },
  { l1:"Hogar y Decoración",l2:"Cocina y Utensilios",l3:"Vajilla y Servir",l4:"Vasos, Copas y Jarras" },
  { l1:"Hogar y Decoración",l2:"Cocina y Utensilios",l3:"Vajilla y Servir",l4:"Tazas, Pocillos y Tazones" },
  { l1:"Hogar y Decoración",l2:"Cocina y Utensilios",l3:"Vajilla y Servir",l4:"Cubertería y Cubiertos" },
  { l1:"Hogar y Decoración",l2:"Cocina y Utensilios",l3:"Cocción y Preparación",l4:"Sartenes y Woks" },
  { l1:"Hogar y Decoración",l2:"Cocina y Utensilios",l3:"Cocción y Preparación",l4:"Ollas y Cacerolas" },
  { l1:"Hogar y Decoración",l2:"Cocina y Utensilios",l3:"Cocción y Preparación",l4:"Moldes y Repostería" },
  { l1:"Hogar y Decoración",l2:"Cocina y Utensilios",l3:"Cocción y Preparación",l4:"Utensilios de Cocina (Cucharas, Espátulas)" },
  { l1:"Hogar y Decoración",l2:"Cocina y Utensilios",l3:"Electrodomésticos de Cocina",l4:"Licuadoras y Batidoras" },
  { l1:"Hogar y Decoración",l2:"Cocina y Utensilios",l3:"Electrodomésticos de Cocina",l4:"Freidoras de Aire y Hornos" },
  { l1:"Hogar y Decoración",l2:"Cocina y Utensilios",l3:"Electrodomésticos de Cocina",l4:"Cafeteras y Hervidores" },
  { l1:"Hogar y Decoración",l2:"Cocina y Utensilios",l3:"Electrodomésticos de Cocina",l4:"Sanducheras y Tostadoras" },
  { l1:"Hogar y Decoración",l2:"Decoración y Diseño",l3:"Adornos de Hogar",l4:"Espejos Decorativos" },
  { l1:"Hogar y Decoración",l2:"Decoración y Diseño",l3:"Adornos de Hogar",l4:"Cuadros, Marcos y Lienzos" },
  { l1:"Hogar y Decoración",l2:"Decoración y Diseño",l3:"Adornos de Hogar",l4:"Floreros, Jarrones y Macetas de Interior" },
  { l1:"Hogar y Decoración",l2:"Decoración y Diseño",l3:"Adornos de Hogar",l4:"Velas Aromáticas y Difusores" },
  { l1:"Hogar y Decoración",l2:"Decoración y Diseño",l3:"Adornos de Hogar",l4:"Adornos de Mesa y Pared" },
  { l1:"Hogar y Decoración",l2:"Decoración y Diseño",l3:"Textiles del Hogar",l4:"Alfombras y Tapetes" },
  { l1:"Hogar y Decoración",l2:"Decoración y Diseño",l3:"Textiles del Hogar",l4:"Cortinas y Persianas" },
  { l1:"Hogar y Decoración",l2:"Decoración y Diseño",l3:"Textiles del Hogar",l4:"Cojines y Mantas Decorativas" },
  { l1:"Hogar y Decoración",l2:"Muebles y Mobiliario",l3:"Muebles de Interior",l4:"Muebles de Sala (Sofás, Mesas de Centro)" },
  { l1:"Hogar y Decoración",l2:"Muebles y Mobiliario",l3:"Muebles de Interior",l4:"Muebles de Dormitorio (Camas, Mesitas)" },
  { l1:"Hogar y Decoración",l2:"Muebles y Mobiliario",l3:"Muebles de Interior",l4:"Muebles de Oficina y Escritorios" },
  { l1:"Hogar y Decoración",l2:"Muebles y Mobiliario",l3:"Estantería y Almacenamiento",l4:"Estantes, Repisas y Libreros" },
  { l1:"Hogar y Decoración",l2:"Muebles y Mobiliario",l3:"Estantería y Almacenamiento",l4:"Armarios y Clósets" },
  { l1:"Hogar y Decoración",l2:"Jardín y Exteriores",l3:"Cuidado de Jardín",l4:"Herramientas de Jardinería" },
  { l1:"Hogar y Decoración",l2:"Jardín y Exteriores",l3:"Cuidado de Jardín",l4:"Mangueras, Riego y Aspersores" },
  { l1:"Hogar y Decoración",l2:"Jardín y Exteriores",l3:"Cuidado de Jardín",l4:"Macetas y Jardineras de Exterior" },
  { l1:"Hogar y Decoración",l2:"Jardín y Exteriores",l3:"Muebles de Exterior",l4:"Sillas y Mesas de Jardín" },
  { l1:"Hogar y Decoración",l2:"Jardín y Exteriores",l3:"Muebles de Exterior",l4:"Parasoles y Sombrillas" },
  { l1:"Hogar y Decoración",l2:"Limpieza, Aseo y Cuidado",l3:"Utensilios de Limpieza",l4:"Escobas, Trapeadores y Mopas" },
  { l1:"Hogar y Decoración",l2:"Limpieza, Aseo y Cuidado",l3:"Utensilios de Limpieza",l4:"Plumeros y Paños de Microfibra" },
  { l1:"Hogar y Decoración",l2:"Limpieza, Aseo y Cuidado",l3:"Utensilios de Limpieza",l4:"Limpiadores Magnéticos y de Vidrios" },
  { l1:"Hogar y Decoración",l2:"Limpieza, Aseo y Cuidado",l3:"Químicos y Consumibles",l4:"Detergentes y Suavizantes" },
  { l1:"Hogar y Decoración",l2:"Limpieza, Aseo y Cuidado",l3:"Químicos y Consumibles",l4:"Desinfectantes y Jabones" },
  { l1:"Hogar y Decoración",l2:"Organización de Espacios",l3:"Almacenamiento Hogar",l4:"Cajas y Cestas Organizadoras" },
  { l1:"Hogar y Decoración",l2:"Organización de Espacios",l3:"Almacenamiento Hogar",l4:"Zapateras y Organizadores de Calzado" },
  { l1:"Hogar y Decoración",l2:"Organización de Espacios",l3:"Almacenamiento Hogar",l4:"Organizadores de Clóset y Cajones" },
  { l1:"Hogar y Decoración",l2:"Iluminación",l3:"Iluminación Interior",l4:"Lámparas de Techo y Colgantes" },
  { l1:"Hogar y Decoración",l2:"Iluminación",l3:"Iluminación Interior",l4:"Lámparas de Mesa y Escritorio" },
  { l1:"Hogar y Decoración",l2:"Iluminación",l3:"Iluminación Interior",l4:"Bombillos y Cintas LED" },
  { l1:"Hogar y Decoración",l2:"Iluminación",l3:"Iluminación Exterior",l4:"Reflectores Solares y LED" },
  { l1:"Hogar y Decoración",l2:"Iluminación",l3:"Iluminación Exterior",l4:"Luces para Jardín" },
  { l1:"Hogar y Decoración",l2:"Baño y Grifería",l3:"Accesorios de Baño",l4:"Cortinas y Tapetes de Baño" },
  { l1:"Hogar y Decoración",l2:"Baño y Grifería",l3:"Accesorios de Baño",l4:"Organizadores y Repisas de Baño" },
  { l1:"Hogar y Decoración",l2:"Baño y Grifería",l3:"Accesorios de Baño",l4:"Toallas y Batas de Baño" },
  { l1:"Hogar y Decoración",l2:"Baño y Grifería",l3:"Grifería",l4:"Grifos de Lavamanos/Cocina" },
  { l1:"Hogar y Decoración",l2:"Baño y Grifería",l3:"Grifería",l4:"Cabezales de Ducha" },
  { l1:"Hogar y Decoración",l2:"Hogar General",l3:"Artículos Varios",l4:"Otros Productos de Hogar" },
  // Mascotas
  { l1:"Mascotas",l2:"Mascotas General",l3:"Accesorios de Mascota",l4:"Accesorios de Paseo y Arnés" },
  { l1:"Mascotas",l2:"Mascotas General",l3:"Accesorios de Mascota",l4:"Camas y Casas para Mascotas" },
  { l1:"Mascotas",l2:"Mascotas General",l3:"Accesorios de Mascota",l4:"Ropa y Disfraces de Mascotas" },
  { l1:"Mascotas",l2:"Alimento para Mascotas",l3:"Comidas",l4:"Concentrados para Perros" },
  { l1:"Mascotas",l2:"Alimento para Mascotas",l3:"Comidas",l4:"Concentrados para Gatos" },
  { l1:"Mascotas",l2:"Alimento para Mascotas",l3:"Comidas",l4:"Premios, Snacks y Galletas" },
  { l1:"Mascotas",l2:"Juguetes y Accesorios",l3:"Diversión",l4:"Juguetes Mordedores y Pelotas" },
  { l1:"Mascotas",l2:"Juguetes y Accesorios",l3:"Diversión",l4:"Juguetes Interactivos y Rascadores" },
  { l1:"Mascotas",l2:"Juguetes y Accesorios",l3:"Diversión",l4:"Platos y Bebederos Automáticos" },
  { l1:"Mascotas",l2:"Higiene y Cuidado de Mascotas",l3:"Cuidado Animal",l4:"Champús y Acondicionadores" },
  { l1:"Mascotas",l2:"Higiene y Cuidado de Mascotas",l3:"Cuidado Animal",l4:"Bandejas Sanitarias y Arenas" },
  { l1:"Mascotas",l2:"Higiene y Cuidado de Mascotas",l3:"Cuidado Animal",l4:"Cepillos y Cortauñas" },
  { l1:"Mascotas",l2:"Acuarofilia y Aves",l3:"Otros Animales",l4:"Comida e Insumos para Peces" },
  { l1:"Mascotas",l2:"Acuarofilia y Aves",l3:"Otros Animales",l4:"Jaulas y Accesorios de Aves" },
  // Tecnología y Electrónica
  { l1:"Tecnología y Electrónica",l2:"Tecnología General",l3:"Componentes y Accesorios",l4:"Cables y Adaptadores de Datos" },
  { l1:"Tecnología y Electrónica",l2:"Tecnología General",l3:"Componentes y Accesorios",l4:"Soportes y Fundas Tecnológicas" },
  { l1:"Tecnología y Electrónica",l2:"Tecnología General",l3:"Componentes y Accesorios",l4:"Baterías Portátiles y Cargadores" },
  { l1:"Tecnología y Electrónica",l2:"Computación y Tablets",l3:"Hardware y Periféricos",l4:"Tablets e iPads" },
  { l1:"Tecnología y Electrónica",l2:"Computación y Tablets",l3:"Hardware y Periféricos",l4:"Teclados, Mouses y Diademas" },
  { l1:"Tecnología y Electrónica",l2:"Computación y Tablets",l3:"Hardware y Periféricos",l4:"Monitores y Accesorios de PC" },
  { l1:"Tecnología y Electrónica",l2:"Celulares y Accesorios",l3:"Accesorios de Celular",l4:"Estuches y Vidrios Templados" },
  { l1:"Tecnología y Electrónica",l2:"Celulares y Accesorios",l3:"Accesorios de Celular",l4:"Audífonos Inalámbricos y Bluetooth" },
  { l1:"Tecnología y Electrónica",l2:"Celulares y Accesorios",l3:"Accesorios de Celular",l4:"Cargadores Inalámbricos y Soportes para Auto" },
  { l1:"Tecnología y Electrónica",l2:"Audio y Video",l3:"Equipos de Sonido e Imagen",l4:"Parlantes Portátiles y Bluetooth" },
  { l1:"Tecnología y Electrónica",l2:"Audio y Video",l3:"Equipos de Sonido e Imagen",l4:"Cámaras de Seguridad y Vigilancia" },
  { l1:"Tecnología y Electrónica",l2:"Audio y Video",l3:"Equipos de Sonido e Imagen",l4:"Proyectores y Pantallas" },
  { l1:"Tecnología y Electrónica",l2:"Gadgets y Novedades",l3:"Dispositivos Inteligentes",l4:"Smartwatches y Pulseras Inteligentes" },
  { l1:"Tecnología y Electrónica",l2:"Gadgets y Novedades",l3:"Dispositivos Inteligentes",l4:"Lentes de Realidad Virtual" },
  { l1:"Tecnología y Electrónica",l2:"Gadgets y Novedades",l3:"Dispositivos Inteligentes",l4:"Novedades Tecnológicas Varias" },
  { l1:"Tecnología y Electrónica",l2:"Videojuegos y Consolas",l3:"Accesorios de Consolas",l4:"Controles y Joysticks" },
  { l1:"Tecnología y Electrónica",l2:"Videojuegos y Consolas",l3:"Accesorios de Consolas",l4:"Accesorios para Consolas PS5/Switch" },
  { l1:"Tecnología y Electrónica",l2:"Videojuegos y Consolas",l3:"Accesorios de Consolas",l4:"Sillas y Teclados Gamers" },
  { l1:"Tecnología y Electrónica",l2:"Cámaras y Drones",l3:"Fotografía y Vuelo",l4:"Drones de Fotografía" },
  { l1:"Tecnología y Electrónica",l2:"Cámaras y Drones",l3:"Fotografía y Vuelo",l4:"Cámaras Deportivas y de Acción" },
  { l1:"Tecnología y Electrónica",l2:"Cámaras y Drones",l3:"Fotografía y Vuelo",l4:"Estabilizadores y Trípodes" },
  { l1:"Tecnología y Electrónica",l2:"Electrónica General",l3:"Otros Artículos",l4:"Otros Artículos Electrónicos" },
  // Belleza y Cuidado Personal
  { l1:"Belleza y Cuidado Personal",l2:"Belleza General",l3:"Almacenamiento de Belleza",l4:"Espejos Cosméticos con Luz LED" },
  { l1:"Belleza y Cuidado Personal",l2:"Belleza General",l3:"Almacenamiento de Belleza",l4:"Organizadores de Maquillaje" },
  { l1:"Belleza y Cuidado Personal",l2:"Belleza General",l3:"Almacenamiento de Belleza",l4:"Bolsos Cosméticos y Neceser" },
  { l1:"Belleza y Cuidado Personal",l2:"Maquillaje y Cosméticos",l3:"Maquillaje Rostro/Ojos",l4:"Maquillaje de Ojos y Rostro" },
  { l1:"Belleza y Cuidado Personal",l2:"Maquillaje y Cosméticos",l3:"Maquillaje Rostro/Ojos",l4:"Labiales y Brillos" },
  { l1:"Belleza y Cuidado Personal",l2:"Maquillaje y Cosméticos",l3:"Maquillaje Rostro/Ojos",l4:"Brochas, Esponjas y Aplicadores" },
  { l1:"Belleza y Cuidado Personal",l2:"Perfumería y Fragancias",l3:"Fragancias de Diseño",l4:"Perfumes de Dama" },
  { l1:"Belleza y Cuidado Personal",l2:"Perfumería y Fragancias",l3:"Fragancias de Diseño",l4:"Perfumes de Caballero" },
  { l1:"Belleza y Cuidado Personal",l2:"Perfumería y Fragancias",l3:"Fragancias de Diseño",l4:"Fragancias Corporales y Splash" },
  { l1:"Belleza y Cuidado Personal",l2:"Cuidado Capilar",l3:"Productos para el Cabello",l4:"Planchas y Rizadores de Cabello" },
  { l1:"Belleza y Cuidado Personal",l2:"Cuidado Capilar",l3:"Productos para el Cabello",l4:"Secadores de Cabello" },
  { l1:"Belleza y Cuidado Personal",l2:"Cuidado Capilar",l3:"Productos para el Cabello",l4:"Tratamientos y Aceites Capilares" },
  { l1:"Belleza y Cuidado Personal",l2:"Cuidado Capilar",l3:"Productos para el Cabello",l4:"Cepillos Eléctricos y Tradicionales" },
  { l1:"Belleza y Cuidado Personal",l2:"Cuidado Corporal",l3:"Estética Corporal",l4:"Depiladores Eléctricos y Ceras" },
  { l1:"Belleza y Cuidado Personal",l2:"Cuidado Corporal",l3:"Estética Corporal",l4:"Cremas Hidratantes y Exfoliantes" },
  { l1:"Belleza y Cuidado Personal",l2:"Cuidado Corporal",l3:"Estética Corporal",l4:"Masajeadores Corporales" },
  { l1:"Belleza y Cuidado Personal",l2:"Cuidado Facial y Skincare",l3:"Estética Facial",l4:"Limpiadores Faciales Ultrasónicos" },
  { l1:"Belleza y Cuidado Personal",l2:"Cuidado Facial y Skincare",l3:"Estética Facial",l4:"Sueros y Cremas Faciales" },
  { l1:"Belleza y Cuidado Personal",l2:"Cuidado Facial y Skincare",l3:"Estética Facial",l4:"Mascarillas e Hidratantes de Rostro" },
  { l1:"Belleza y Cuidado Personal",l2:"Fajas y Ropa Control",l3:"Moldeadores",l4:"Fajas Reductoras Femeninas" },
  { l1:"Belleza y Cuidado Personal",l2:"Fajas y Ropa Control",l3:"Moldeadores",l4:"Cinturillas Deportivas" },
  { l1:"Belleza y Cuidado Personal",l2:"Fajas y Ropa Control",l3:"Moldeadores",l4:"Fajas Postparto/Postquirúrgicas" },
  { l1:"Belleza y Cuidado Personal",l2:"Higiene y Cuidado Personal",l3:"Afeitado y Depilación",l4:"Cuidado Bucal e Irrigadores" },
  { l1:"Belleza y Cuidado Personal",l2:"Higiene y Cuidado Personal",l3:"Afeitado y Depilación",l4:"Rasuradoras y Cortadoras de Barba" },
  // Salud y Bienestar
  { l1:"Salud y Bienestar",l2:"Salud General",l3:"Ortopedia y Postura",l4:"Termómetros y Tensiómetros" },
  { l1:"Salud y Bienestar",l2:"Salud General",l3:"Ortopedia y Postura",l4:"Correctores de Postura" },
  { l1:"Salud y Bienestar",l2:"Salud General",l3:"Ortopedia y Postura",l4:"Férulas, Rodilleras y Soportes" },
  { l1:"Salud y Bienestar",l2:"Suplementos y Nutrición",l3:"Suplementos Dietarios",l4:"Proteínas y Aminoácidos" },
  { l1:"Salud y Bienestar",l2:"Suplementos y Nutrición",l3:"Suplementos Dietarios",l4:"Colágeno Hidrolizado y Biotina" },
  { l1:"Salud y Bienestar",l2:"Suplementos y Nutrición",l3:"Suplementos Dietarios",l4:"Vitaminas y Minerales de Venta Libre" },
  { l1:"Salud y Bienestar",l2:"Suplementos y Nutrición",l3:"Suplementos Dietarios",l4:"Quemadores de Grasa y Adelgazantes" },
  { l1:"Salud y Bienestar",l2:"Equipos Médicos y Cuidado de la Salud",l3:"Aparatos Médicos",l4:"Nebulizadores y Concentradores" },
  { l1:"Salud y Bienestar",l2:"Equipos Médicos y Cuidado de la Salud",l3:"Aparatos Médicos",l4:"Humidificadores y Vaporizadores" },
  { l1:"Salud y Bienestar",l2:"Equipos Médicos y Cuidado de la Salud",l3:"Aparatos Médicos",l4:"Almohadillas Térmicas y Masajeadores de Terapia" },
  { l1:"Salud y Bienestar",l2:"Bienestar General",l3:"Cuidado Alternativo",l4:"Aceites Esenciales y Aromaterapia" },
  { l1:"Salud y Bienestar",l2:"Bienestar General",l3:"Cuidado Alternativo",l4:"Vaporizadores Personales y Pods" },
  { l1:"Salud y Bienestar",l2:"Bienestar General",l3:"Cuidado Alternativo",l4:"Parches de Alivio y Relajación" },
  { l1:"Salud y Bienestar",l2:"Óptica y Cuidado Ocular",l3:"Óptica",l4:"Gafas de Lectura" },
  { l1:"Salud y Bienestar",l2:"Óptica y Cuidado Ocular",l3:"Óptica",l4:"Estuches y Accesorios de Gafas" },
  { l1:"Salud y Bienestar",l2:"Óptica y Cuidado Ocular",l3:"Óptica",l4:"Limpiadores de Lentes" },
  // Productos para Adultos
  { l1:"Productos para Adultos",l2:"Bienestar Sexual",l3:"Lubricantes y Geles",l4:"Lubricantes y Geles Íntimos" },
  { l1:"Productos para Adultos",l2:"Bienestar Sexual",l3:"Lubricantes y Geles",l4:"Estimuladores y Geles Sensibilizantes" },
  { l1:"Productos para Adultos",l2:"Bienestar Sexual",l3:"Protección Sexual",l4:"Preservativos y Barreras de Protección" },
  { l1:"Productos para Adultos",l2:"Lencería y Ropa Erótica",l3:"Prendas Íntimas Eróticas",l4:"Lencería de Dama" },
  { l1:"Productos para Adultos",l2:"Lencería y Ropa Erótica",l3:"Prendas Íntimas Eróticas",l4:"Disfraces y Ropa de Noche" },
  { l1:"Productos para Adultos",l2:"Lencería y Ropa Erótica",l3:"Prendas Íntimas Eróticas",l4:"Accesorios Eróticos" },
  { l1:"Productos para Adultos",l2:"Juguetes para Adultos",l3:"Entretenimiento Adulto",l4:"Vibradores y Succionadores" },
  { l1:"Productos para Adultos",l2:"Juguetes para Adultos",l3:"Entretenimiento Adulto",l4:"Juguetes de Pareja" },
  { l1:"Productos para Adultos",l2:"Juguetes para Adultos",l3:"Entretenimiento Adulto",l4:"Bolas Chinas y Ejercitadores" },
  // Moda y Calzado
  { l1:"Moda y Calzado",l2:"Moda General",l3:"Accesorios de Moda",l4:"Gafas de Sol" },
  { l1:"Moda y Calzado",l2:"Moda General",l3:"Accesorios de Moda",l4:"Cinturones y Correas" },
  { l1:"Moda y Calzado",l2:"Moda General",l3:"Accesorios de Moda",l4:"Sombreros, Gorras y Bufandas" },
  { l1:"Moda y Calzado",l2:"Bolsos, Morrales y Accesorios",l3:"Carteras y Bolsos",l4:"Carteras de Dama y Crossbody" },
  { l1:"Moda y Calzado",l2:"Bolsos, Morrales y Accesorios",l3:"Carteras y Bolsos",l4:"Billeteras de Caballero y Tarjeteros" },
  { l1:"Moda y Calzado",l2:"Bolsos, Morrales y Accesorios",l3:"Morrales",l4:"Morrales Escolares y Universitarios" },
  { l1:"Moda y Calzado",l2:"Ropa Femenina (Dama)",l3:"Prendas Superiores",l4:"Blusas y Camisetas" },
  { l1:"Moda y Calzado",l2:"Ropa Femenina (Dama)",l3:"Prendas Superiores",l4:"Chaquetas y Sacos" },
  { l1:"Moda y Calzado",l2:"Ropa Femenina (Dama)",l3:"Prendas Inferiores",l4:"Vestidos y Faldas" },
  { l1:"Moda y Calzado",l2:"Ropa Femenina (Dama)",l3:"Prendas Inferiores",l4:"Jeans, Pantalones y Leggings" },
  { l1:"Moda y Calzado",l2:"Ropa Masculina (Caballero)",l3:"Prendas Superiores Masculinas",l4:"Camisas y Camisetas" },
  { l1:"Moda y Calzado",l2:"Ropa Masculina (Caballero)",l3:"Prendas Superiores Masculinas",l4:"Chaquetas y Buzos" },
  { l1:"Moda y Calzado",l2:"Ropa Masculina (Caballero)",l3:"Prendas Inferiores Masculinas",l4:"Pantalones y Bermudas" },
  { l1:"Moda y Calzado",l2:"Calzado y Zapatos",l3:"Calzado Deportivo",l4:"Tenis y Zapatillas Deportivas" },
  { l1:"Moda y Calzado",l2:"Calzado y Zapatos",l3:"Calzado Casual",l4:"Zapatos Casuales y Mocasines" },
  { l1:"Moda y Calzado",l2:"Calzado y Zapatos",l3:"Calzado Casual",l4:"Sandalias y Chanclas" },
  { l1:"Moda y Calzado",l2:"Calzado y Zapatos",l3:"Calzado Casual",l4:"Botas y Botines" },
  { l1:"Moda y Calzado",l2:"Bisutería, Joyas y Relojes",l3:"Bisutería",l4:"Bisutería de Acero y Fantasía" },
  { l1:"Moda y Calzado",l2:"Bisutería, Joyas y Relojes",l3:"Bisutería",l4:"Cadenas, Pulseras y Aretes" },
  { l1:"Moda y Calzado",l2:"Bisutería, Joyas y Relojes",l3:"Relojería",l4:"Relojes de Pulso de Dama/Caballero" },
  { l1:"Moda y Calzado",l2:"Ropa Interior y de Descanso",l3:"Ropa Interior",l4:"Ropa Interior Femenina" },
  { l1:"Moda y Calzado",l2:"Ropa Interior y de Descanso",l3:"Ropa Interior",l4:"Bóxers y Ropa Interior Masculina" },
  { l1:"Moda y Calzado",l2:"Ropa Interior y de Descanso",l3:"Ropa Interior",l4:"Pijamas de Dama/Caballero" },
  { l1:"Moda y Calzado",l2:"Ropa Deportiva",l3:"Prendas Deportivas",l4:"Leggings Deportivos" },
  { l1:"Moda y Calzado",l2:"Ropa Deportiva",l3:"Prendas Deportivas",l4:"Camisetas de Secado Rápido" },
  { l1:"Moda y Calzado",l2:"Ropa Deportiva",l3:"Prendas Deportivas",l4:"Conjuntos Deportivos" },
  // Juguetes y Bebés
  { l1:"Juguetes y Bebés",l2:"Accesorios y Cuidado Infantil (Bebés)",l3:"Higiene y Cuidado",l4:"Pañaleras y Bolsos de Bebé" },
  { l1:"Juguetes y Bebés",l2:"Accesorios y Cuidado Infantil (Bebés)",l3:"Higiene y Cuidado",l4:"Termómetros y Aspiradores Nasales" },
  { l1:"Juguetes y Bebés",l2:"Accesorios y Cuidado Infantil (Bebés)",l3:"Higiene y Cuidado",l4:"Higiene del Bebé y Baño" },
  { l1:"Juguetes y Bebés",l2:"Juguetes y Juegos",l3:"Juguetes Didácticos",l4:"Juguetes Didácticos y de Madera" },
  { l1:"Juguetes y Bebés",l2:"Juguetes y Juegos",l3:"Juguetes de Acción",l4:"Muñecas y Figuras de Acción" },
  { l1:"Juguetes y Bebés",l2:"Juguetes y Juegos",l3:"Juguetes de Acción",l4:"Carros a Control Remoto y Pistas" },
  { l1:"Juguetes y Bebés",l2:"Juguetes y Juegos",l3:"Juegos de Mesa",l4:"Juegos de Mesa y Rompecabezas" },
  { l1:"Juguetes y Bebés",l2:"Lactancia y Alimentación",l3:"Alimentación Bebé",l4:"Biberones y Teteros" },
  { l1:"Juguetes y Bebés",l2:"Lactancia y Alimentación",l3:"Alimentación Bebé",l4:"Extractores de Leche" },
  { l1:"Juguetes y Bebés",l2:"Lactancia y Alimentación",l3:"Alimentación Bebé",l4:"Baberos y Vajilla Infantil" },
  { l1:"Juguetes y Bebés",l2:"Coches y Sillas para Auto",l3:"Transporte Bebé",l4:"Coches Paseadores" },
  { l1:"Juguetes y Bebés",l2:"Coches y Sillas para Auto",l3:"Transporte Bebé",l4:"Sillas de Seguridad para Carro" },
  { l1:"Juguetes y Bebés",l2:"Coches y Sillas para Auto",l3:"Transporte Bebé",l4:"Canguros y Portabebés" },
  { l1:"Juguetes y Bebés",l2:"Cuarto del Bebé y Mobiliario",l3:"Dormitorio Bebé",l4:"Nidos y Almohadas de Lactancia" },
  { l1:"Juguetes y Bebés",l2:"Cuarto del Bebé y Mobiliario",l3:"Dormitorio Bebé",l4:"Móviles y Luces de Noche" },
  { l1:"Juguetes y Bebés",l2:"Cuarto del Bebé y Mobiliario",l3:"Dormitorio Bebé",l4:"Cunas y Corrales Portátiles" },
  // Deportes y Outdoor
  { l1:"Deportes y Outdoor",l2:"Deportes General",l3:"Protección Deportiva",l4:"Botatodo e Hidratación" },
  { l1:"Deportes y Outdoor",l2:"Deportes General",l3:"Protección Deportiva",l4:"Relojes Deportivos e Instrumentos" },
  { l1:"Deportes y Outdoor",l2:"Deportes General",l3:"Protección Deportiva",l4:"Protecciones Deportivas (Rodilleras/Coderas)" },
  { l1:"Deportes y Outdoor",l2:"Equipos Fitness y Gimnasio",l3:"Entrenamiento en Casa",l4:"Lazos para Saltar" },
  { l1:"Deportes y Outdoor",l2:"Equipos Fitness y Gimnasio",l3:"Entrenamiento en Casa",l4:"Mancuernas y Pesas" },
  { l1:"Deportes y Outdoor",l2:"Equipos Fitness y Gimnasio",l3:"Entrenamiento en Casa",l4:"Bandas de Resistencia" },
  { l1:"Deportes y Outdoor",l2:"Equipos Fitness y Gimnasio",l3:"Entrenamiento en Casa",l4:"Colchonetas y Mats de Yoga" },
  { l1:"Deportes y Outdoor",l2:"Camping y Pesca",l3:"Equipamiento de Camping",l4:"Linternas de Cabeza y Camping" },
  { l1:"Deportes y Outdoor",l2:"Camping y Pesca",l3:"Equipamiento de Camping",l4:"Navajas y Multiherramientas" },
  { l1:"Deportes y Outdoor",l2:"Camping y Pesca",l3:"Equipamiento de Camping",l4:"Carpas y Sacos de Dormir" },
  { l1:"Deportes y Outdoor",l2:"Camping y Pesca",l3:"Insumos de Pesca",l4:"Artículos de Pesca" },
  { l1:"Deportes y Outdoor",l2:"Ciclismo y Mobilidad",l3:"Accesorios Ciclismo",l4:"Accesorios para Bicicleta y Luces" },
  { l1:"Deportes y Outdoor",l2:"Ciclismo y Mobilidad",l3:"Accesorios Ciclismo",l4:"Cascos de Ciclismo" },
  { l1:"Deportes y Outdoor",l2:"Ciclismo y Mobilidad",l3:"Accesorios Ciclismo",l4:"Guantes Deportivos" },
  { l1:"Deportes y Outdoor",l2:"Deportes de Aventura",l3:"Aventura",l4:"Otros Accesorios Outdoor" },
  // Ferretería y Herramientas
  { l1:"Ferretería y Herramientas",l2:"Ferretería General",l3:"Cerrajería",l4:"Candados, Cerraduras y Cerrajería" },
  { l1:"Ferretería y Herramientas",l2:"Ferretería General",l3:"Suministros Ferreteros",l4:"Cintas Adhesivas y Pegantes" },
  { l1:"Ferretería y Herramientas",l2:"Ferretería General",l3:"Suministros Ferreteros",l4:"Tornillería y Anclajes" },
  { l1:"Ferretería y Herramientas",l2:"Ferretería General",l3:"Suministros Ferreteros",l4:"Material Eléctrico e Interruptores" },
  { l1:"Ferretería y Herramientas",l2:"Herramientas Manuales/Eléctricas",l3:"Equipos Eléctricos",l4:"Taladros, Pulidoras y Soldadores" },
  { l1:"Ferretería y Herramientas",l2:"Herramientas Manuales/Eléctricas",l3:"Herramientas Manuales",l4:"Destornilladores y Llaves" },
  { l1:"Ferretería y Herramientas",l2:"Herramientas Manuales/Eléctricas",l3:"Herramientas Manuales",l4:"Cajas de Herramientas y Organizadores" },
  { l1:"Ferretería y Herramientas",l2:"Herramientas Manuales/Eléctricas",l3:"Herramientas Manuales",l4:"Brocas y Accesorios de Corte" },
  { l1:"Ferretería y Herramientas",l2:"Seguridad y Cerramientos",l3:"Seguridad Personal y Hogar",l4:"Cámaras de Seguridad Falsas" },
  { l1:"Ferretería y Herramientas",l2:"Seguridad y Cerramientos",l3:"Seguridad Personal y Hogar",l4:"Alarmas de Puerta/Ventana" },
  { l1:"Ferretería y Herramientas",l2:"Seguridad y Cerramientos",l3:"Seguridad Personal y Hogar",l4:"Epp: Guantes y Gafas de Seguridad" },
  { l1:"Ferretería y Herramientas",l2:"Materiales de Construcción",l3:"Construcción",l4:"Iluminación Industrial" },
  { l1:"Ferretería y Herramientas",l2:"Materiales de Construcción",l3:"Construcción",l4:"Medidores de Distancia Láser" },
  { l1:"Ferretería y Herramientas",l2:"Pinturas y Acabados",l3:"Acabados",l4:"Pinceles, Rodillos y Brochas" },
  { l1:"Ferretería y Herramientas",l2:"Pinturas y Acabados",l3:"Acabados",l4:"Pintura en Spray" },
  { l1:"Ferretería y Herramientas",l2:"Automotriz y Accesorios (Carros/Motos)",l3:"Accesorios para Carros",l4:"Accesorios de Lujo para Auto" },
  { l1:"Ferretería y Herramientas",l2:"Automotriz y Accesorios (Carros/Motos)",l3:"Accesorios para Carros",l4:"Cámaras de Reversa y Sensores" },
  { l1:"Ferretería y Herramientas",l2:"Automotriz y Accesorios (Carros/Motos)",l3:"Accesorios para Carros",l4:"Cuidado del Auto: Ceras y Champú" },
  { l1:"Ferretería y Herramientas",l2:"Automotriz y Accesorios (Carros/Motos)",l3:"Accesorios para Carros",l4:"Soportes de Celular para Rejilla" },
  { l1:"Ferretería y Herramientas",l2:"Automotriz y Accesorios (Carros/Motos)",l3:"Accesorios para Motos",l4:"Cascos e Impermeables para Moto" },
  // Otras Categorías
  { l1:"Otras Categorías",l2:"Papelería y Oficina",l3:"Escritorio",l4:"Cuadernos, Agendas y Libretas" },
  { l1:"Otras Categorías",l2:"Papelería y Oficina",l3:"Escritorio",l4:"Marcadores, Colores y Esferos" },
  { l1:"Otras Categorías",l2:"Papelería y Oficina",l3:"Escritorio",l4:"Organizadores de Escritorio" },
  { l1:"Otras Categorías",l2:"Papelería y Oficina",l3:"Escritorio",l4:"Calculadoras" },
  { l1:"Otras Categorías",l2:"Libros y Material Educativo",l3:"Literatura",l4:"Libros Físicos de Interés General" },
  { l1:"Otras Categorías",l2:"Libros y Material Educativo",l3:"Literatura",l4:"Agendas de Planificación" },
  { l1:"Otras Categorías",l2:"Libros y Material Educativo",l3:"Literatura",l4:"Material Didáctico Escolar" },
  { l1:"Otras Categorías",l2:"Arte, Artesanías y Hobbies",l3:"Hobbies",l4:"Kits de Pintura por Números" },
  { l1:"Otras Categorías",l2:"Arte, Artesanías y Hobbies",l3:"Hobbies",l4:"Lanas, Hilos y Tejeduría" },
  { l1:"Otras Categorías",l2:"Arte, Artesanías y Hobbies",l3:"Hobbies",l4:"Herramientas de Costura y Manualidades" },
  { l1:"Otras Categorías",l2:"Sin Categorizar",l3:"Sin Clasificar",l4:"Registros por Reclasificar" },
  { l1:"Otras Categorías",l2:"Sin Categorizar",l3:"Sin Clasificar",l4:"Productos Sin Datos Clasificados" },
  { l1:"Otras Categorías",l2:"Campaña Temporal",l3:"Ventas Especiales",l4:"Eventos Comerciales" },
  { l1:"Otras Categorías",l2:"Campaña Temporal",l3:"Ventas Especiales",l4:"Ofertas de Temporada" },
];

const TAXONOMY_TEXT = DROPI_TAXONOMY_FLAT
  .map(n => `${n.l1} > ${n.l2} > ${n.l3} > ${n.l4}`)
  .join("\n");

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const ip = getClientIp(req);
  if (isRateLimited(`classify-product:${ip}`, 20, 60_000)) {
    return NextResponse.json({ error: "Demasiadas solicitudes, intenta de nuevo en un minuto" }, { status: 429 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
  }

  const { product_name } = await req.json() as { product_name: string };
  if (!product_name?.trim()) {
    return NextResponse.json({ error: "product_name is required" }, { status: 400 });
  }

  const openai = new OpenAI({ apiKey });

  const systemPrompt = `Eres un experto en categorización de productos para Dropi, un marketplace de dropshipping que opera en Colombia y Latinoamérica.

Tienes el siguiente árbol de taxonomía oficial de Dropi (formato L1 > L2 > L3 > L4):

${TAXONOMY_TEXT}

Tu tarea: dado el nombre de un producto, devuelve las 5 mejores categorías L4 ordenadas de mayor a menor relevancia, cada una con un score de 0 a 100 que refleja qué tan bien encaja el producto en esa categoría.

Reglas de scoring:
- 90-100: encaje perfecto o casi perfecto
- 70-89: encaje bueno, el producto claramente pertenece ahí
- 50-69: encaje razonable pero con dudas
- 30-49: encaje forzado, es la opción menos mala
- <30: no encaja bien

Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional, sin markdown, sin bloques de código. Formato exacto:
{
  "results": [
    {"l1":"...","l2":"...","l3":"...","l4":"...","score":85,"reasoning":"..."},
    {"l1":"...","l2":"...","l3":"...","l4":"...","score":60,"reasoning":"..."},
    {"l1":"...","l2":"...","l3":"...","l4":"...","score":40,"reasoning":"..."},
    {"l1":"...","l2":"...","l3":"...","l4":"...","score":25,"reasoning":"..."},
    {"l1":"...","l2":"...","l3":"...","l4":"...","score":15,"reasoning":"..."}
  ],
  "gap": true/false,
  "gap_note": "Si gap=true, describe qué categoría faltaría. Si gap=false, deja vacío."
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: product_name.trim() },
      ],
      temperature: 0.1,
      max_tokens: 900,
    });

    const raw = completion.choices[0].message?.content?.trim() ?? "";
    const parsed = JSON.parse(raw) as {
      results: { l1: string; l2: string; l3: string; l4: string; score: number; reasoning: string }[];
      gap: boolean;
      gap_note: string;
    };

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
