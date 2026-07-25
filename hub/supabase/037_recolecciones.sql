-- ═══════════════════════════════════════════════════════════════════════════
-- Control de Recolecciones — modelo completo
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- El módulo no es un mapa: es un ciclo diario. Se mira qué carga está quieta,
-- se decide a quién pedirle que la mueva, se le manda el pedido, y al día
-- siguiente se verifica si pasó. Hoy solo existe el primer paso; el resto vive
-- en correos, chats y Excels sueltos que nadie puede medir.
--
-- Tres cosas del negocio que explican por qué el modelo tiene esta forma:
--
--   1. Hay TRES destinatarios, no uno: la transportadora (que recoge), el
--      proveedor (que debe tener la carga lista) y Dropi mismo cuando la bodega
--      es fulfillment propio — ahí no hay a quién pedirle nada, vamos nosotros.
--   2. El canal es mixto y no se puede unificar: a veces Excel por correo, a
--      veces WhatsApp, a veces cargarlo en el portal de la transportadora. Ese
--      último no se integra: queda un check de "ya lo subí", con quién y cuándo.
--   3. La elegibilidad es mixta: reglas automáticas por transportadora Y
--      criterio del operador. El sistema propone, una persona confirma.
--
-- Escritura: solo por la service key (hub/src/lib/supabase.ts), como el resto
-- del hub. RLS en "authenticated read" — mismo criterio que 032. Nada abierto a
-- anon: acá hay teléfonos de proveedores y direcciones operativas de Dropi.
-- ═══════════════════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────────────────
-- CATÁLOGOS — quién es quién
-- ───────────────────────────────────────────────────────────────────────────

-- Transportadoras. El id es el nombre tal como viene en el export de Chronos
-- ('ENVIA', 'INTERRAPIDISIMO'…) para no tener que mantener un mapeo aparte.
-- Agregar una transportadora nueva es insertar una fila: no hay código que tocar.
create table if not exists rec_transportadora (
  id                text primary key,
  nombre            text,
  activa            boolean default true,

  -- Cómo se le manda la solicitud. 'portal' significa que el operador la sube a
  -- mano al sitio de la transportadora y acá solo queda registrado que lo hizo.
  canal_preferido   text check (canal_preferido in ('correo','whatsapp','portal')) default 'correo',
  portal_url        text,
  -- Qué columnas lleva el archivo. Cada transportadora pide lo suyo.
  formato_archivo   text default 'generico',

  -- Por debajo de esto no vale mover un camión. El 10 sale de la distribución
  -- real (ver la nota de la semilla al final del archivo), no de una corazonada.
  min_paquetes      integer default 10,
  -- Después de esta hora, lo que se arme es para mañana.
  hora_corte        time,

  notas             text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- NO se crea `rec_transportadora_cobertura` (qué municipios cubre cada una).
-- Sería la regla más útil para no mandarle bodegas a quien no va a ir, pero
-- HOY NADIE TIENE ESE DATO: no viene en el export, no está pedido, y no está
-- claro que exista consolidado. Una tabla vacía que nadie llena es ruido: se
-- lee como si la regla existiera y en realidad nunca filtra nada.
--
-- El código ya la soporta (`ReglasTransportadora.cobertura` en
-- src/lib/recolecciones/elegibilidad.ts es opcional y, si no hay lista, deja
-- pasar en vez de inventar). El día que consigamos la cobertura, la tabla es
-- una migración de seis líneas y el resto no se toca.

-- NO se crean `rec_proveedor` ni `rec_contacto_directorio`.
--
-- El directorio (varios contactos por entidad, con cargo, canal e histórico)
-- resuelve un problema que TODAVÍA NO TENEMOS: hoy el export traería un
-- teléfono de la bodega y uno del proveedor, y punto. Dos columnas en
-- rec_bodega cubren el 100% del caso real sin dos tablas y dos joins.
--
-- El nombre del proveedor se desnormaliza en rec_bodega: se repite entre las
-- bodegas de un mismo dueño, pero viene del mismo export y evita una tabla
-- entera para guardar un nombre.
--
-- Cuándo sí harán falta: cuando el equipo empiece a CURAR contactos (el de la
-- mañana, el de devoluciones, el que sí contesta) y necesite historial. Ese día
-- el directorio entra como tabla nueva y estas columnas pasan a ser su semilla.
-- La jerarquía "bodega primero, proveedor de respaldo" ya vive en
-- src/lib/recolecciones/contacto.ts y no cambia.

-- ───────────────────────────────────────────────────────────────────────────
-- OPERACIÓN — bodegas y stock
-- ───────────────────────────────────────────────────────────────────────────

create table if not exists rec_bodega (
  warehouse_id            text primary key,
  nombre                  text,
  direccion               text,
  municipio               text,
  dpto                    text,
  cod_dane                text,           -- 5 díg (municipio); el depto son los 2 primeros

  -- De quién es la bodega. El nombre va desnormalizado (se repite entre las
  -- bodegas del mismo dueño) para poder agrupar sin una tabla aparte: en el
  -- export de hoy hay 36 bodegas distintas llamadas "BODEGA PRINCIPAL", y sin
  -- el proveedor no se distinguen ni se agrupan.
  supplier_id             text,
  supplier_nombre         text,

  -- Los DOS teléfonos, porque no son intercambiables: un proveedor con bodega
  -- en Medellín y en Bogotá puede tener al jefe de bodega en una y al dueño en
  -- la otra. La jerarquía (bodega primero, proveedor de respaldo) se resuelve
  -- en src/lib/recolecciones/contacto.ts, en un solo lugar, para que no termine
  -- mostrándose un número distinto en cada pantalla.
  telefono                text,      -- el de ESTA bodega
  telefono_proveedor      text,      -- el del dueño; respaldo cuando no hay propio

  -- ¿Quién mueve esta carga? Si es fulfillment by Dropi, recoger es NUESTRO
  -- trabajo: pedirle al proveedor que despache carga que debemos ir a buscar
  -- nosotros quema la credibilidad del módulo en una semana.
  -- NULL = todavía no lo sabemos, y eso también se muestra distinto.
  fulfillment_by_dropi    boolean,

  -- A qué hora se puede ir. Va en el archivo que recibe la transportadora.
  ventana_atencion_desde  time,
  ventana_atencion_hasta  time,

  -- Cuándo se creó la bodega EN DROPI (el w.created_at pedido a Data). No es
  -- el created_at de más abajo, que es cuándo la vimos nosotros por primera
  -- vez. Sirve para el corte de "bodegas nuevas": una que abrió hace una
  -- semana y no despacha necesita acompañamiento, no presión.
  bodega_creada_at        timestamptz,

  lat                     double precision,
  lng                     double precision,
  -- Qué tan buena es la ubicación. NUNCA se infiere: si no se pudo resolver,
  -- queda en centroide y se declara como tal. Un centroide jamás se muestra
  -- como si fuera la puerta de la bodega.
  nivel_precision         text check (nivel_precision in (
                            'manual_verificada',   -- alguien la marcó en el mapa: la más confiable
                            'predio',              -- catastro (IDESC Cali, etc.)
                            'via',                 -- geocodificador comercial: UNA vía con ese nombre
                            'barrio',
                            'centroide_municipio',
                            'centroide_depto',
                            'sin_ubicar')),
  fuente                  text,           -- locationiq | catastro_cali | mapbox | centroide | manual
  -- Con qué texto se resolvió la coordenada actual. Si en un export futuro la
  -- dirección cambia, la coord deja de valer y la bodega vuelve a la cola.
  direccion_geocodificada text,
  geocoded_at             timestamptz,
  verificado_por          text,
  verificado_at           timestamptz,

  activa                  boolean default true,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

create index if not exists rec_bodega_dane_idx      on rec_bodega (cod_dane);
create index if not exists rec_bodega_precision_idx on rec_bodega (nivel_precision);
create index if not exists rec_bodega_supplier_idx  on rec_bodega (supplier_id);

-- NO se crea `rec_ubicacion_log` (historial de cambios de coordenada) todavía.
--
-- Para qué serviría: rec_bodega guarda solo la ubicación VIGENTE. Cuando el
-- equipo empiece a corregir puntos a mano en el mapa, sin un log una corrección
-- equivocada es irreversible y no hay a quién preguntarle por qué se movió.
--
-- Por qué no ahora: la corrección manual es F7. Hasta entonces las coordenadas
-- solo las escribe la geocodificación automática, que es reproducible —si algo
-- sale mal se vuelve a correr. Crear la tabla antes es crear algo que nadie
-- llena. Entra junto con la pantalla que la necesita.

-- La carga de cada día: la película, no la foto. Grano bodega × transportadora, el
-- mismo del export. El pivote a columnas lo hace el frontend, no la tabla.
create table if not exists rec_carga_diaria (
  fecha           date    not null,
  warehouse_id    text    not null,
  transportadora  text    not null,

  preparadas      integer not null default 0,
  guia_generada   integer not null default 0,

  -- Cubetas de antigüedad — pedidas a Data, aún no llegan. Quedan NULL a
  -- propósito: 0 significaría "no hay guías de esa edad", y la verdad hoy es
  -- "no sabemos". No se rellenan con ceros.
  edad_0_1d       integer,
  edad_2_3d       integer,
  edad_4_7d       integer,
  edad_8_15d      integer,
  edad_15d_mas    integer,

  -- MAX(updated_at) del grupo. OJO: es la última vez que se tocó el registro,
  -- NO hace cuánto la guía está preparada. El 95,7% viene de las últimas 24h
  -- porque algo refresca la fila a diario. No usarlo como antigüedad.
  ultimo_evento   timestamptz,

  primary key (fecha, warehouse_id, transportadora)
);

create index if not exists rec_carga_diaria_bodega_idx on rec_carga_diaria (warehouse_id, fecha desc);
create index if not exists rec_carga_diaria_fecha_idx  on rec_carga_diaria (fecha desc);


-- ───────────────────────────────────────────────────────────────────────────
-- GESTIÓN — el ciclo que hoy no existe en ninguna parte
--
-- NOTA sobre los datos "repetidos" de acá abajo. Hay tres campos que parecen
-- redundantes y NO lo son: son valores CONGELADOS, no copias.
--
--   rec_solicitud.bodegas / .paquetes   se pueden sumar de los items…
--   rec_solicitud_bodega.direccion        …está en rec_bodega…
--   rec_gestion.telefono                …está en el directorio…
--
-- …pero todos describen el pasado: qué se pidió, a qué dirección se mandó al
-- conductor, a qué número se escribió. Si mañana la bodega se muda o el
-- contacto cambia, el registro de lo que hicimos ayer no puede cambiar con él.
-- Recalcularlos con un join daría el dato de hoy, no el del momento — y ahí se
-- pierde la capacidad de auditar por qué una recolección falló.
-- No "normalizar" esto.
-- ───────────────────────────────────────────────────────────────────────────

-- Lo que le pedimos a UNA transportadora en UN día.
create table if not exists rec_solicitud (
  id              uuid primary key default gen_random_uuid(),
  fecha           date not null default current_date,
  transportadora_id text not null references rec_transportadora(id),

  estado          text not null default 'borrador' check (estado in (
                    'borrador',        -- se está armando
                    'lista',           -- archivo generado, sin mandar
                    'enviada',         -- salió por correo o whatsapp
                    'subida_portal',   -- el operador la cargó en el portal y lo marcó
                    'confirmada',      -- la transportadora confirmó recibido
                    'cancelada')),
  canal           text check (canal in ('correo','whatsapp','portal')),

  enviada_por     text,
  enviada_at      timestamptz,
  archivo_nombre  text,
  archivo_url     text,

  -- Congelados al enviar: importa qué se pidió ese día, no qué hay hoy.
  bodegas         integer,
  paquetes        integer,

  notas           text,
  created_at      timestamptz default now(),
  unique (fecha, transportadora_id)
);

create index if not exists rec_solicitud_fecha_idx on rec_solicitud (fecha desc, transportadora_id);

-- Cada bodega dentro de una solicitud.
create table if not exists rec_solicitud_bodega (
  id                uuid primary key default gen_random_uuid(),
  solicitud_id      uuid not null references rec_solicitud(id) on delete cascade,
  warehouse_id      text not null references rec_bodega(warehouse_id),

  paquetes          integer,      -- lo declarado al pedir
  ventana_desde     time,
  ventana_hasta     time,
  direccion         text,         -- congelada: la dirección puede cambiar después
  contacto_nombre   text,
  contacto_telefono text,

  -- Si la regla la propuso o la metió una persona. Es el campo que hace que el
  -- sistema aprenda: si el operador saca a mano el 40% de lo que la regla
  -- propone, la regla está mal — y hay que poder verlo, no adivinarlo.
  incluida_por      text check (incluida_por in ('regla','operador')) default 'regla',
  motivo            text,         -- por qué entró o por qué se forzó

  -- Se llena con la carga del día siguiente: ¿bajó la carga de esta bodega?
  recogido          boolean,
  recogido_at       timestamptz,

  created_at        timestamptz default now(),
  unique (solicitud_id, warehouse_id)
);

create index if not exists rec_solicitud_bodega_bodega_idx on rec_solicitud_bodega (warehouse_id);

-- Bitácora de todo lo que se le dijo a alguien, por el canal que sea. Unifica
-- presión al proveedor, aviso de recolección y la solicitud a la transportadora:
-- son el mismo acto —le dijimos algo a alguien— y separarlos en tres tablas
-- triplicaría las consultas de medición sin ganar nada.
create table if not exists rec_gestion (
  id                uuid primary key default gen_random_uuid(),
  tipo              text not null check (tipo in (
                      'presion_proveedor',        -- "tenés carga quieta hace 5 días"
                      'aviso_recoleccion',        -- "mañana pasa Envia por tus 40 paquetes"
                      'aviso_dropi',              -- "pasamos nosotros" (fulfillment propio)
                      'solicitud_transportadora')),
  -- Mismos tipos que el directorio: el número puede ser el de la bodega y no
  -- el del proveedor, y hay que saber a cuál de los dos se le escribió.
  destinatario_tipo text not null check (destinatario_tipo in ('bodega','proveedor','transportadora')),
  entidad_id        text,         -- supplier_id o transportadora_id
  warehouse_id      text references rec_bodega(warehouse_id) on delete set null,
  solicitud_id      uuid references rec_solicitud(id) on delete set null,

  canal             text check (canal in ('whatsapp','llamada','correo','visita','otro')),
  telefono          text,
  mensaje           text,         -- lo que efectivamente se armó
  usuario           text,

  resultado         text check (resultado in (
                      'abierto',        -- se disparó el contacto, sin respuesta aún
                      'promete',
                      'ya_despacho',
                      'no_contesta',
                      'rechaza',
                      'numero_errado')) default 'abierto',
  promesa_fecha     date,
  notas             text,
  created_at        timestamptz default now()
);

create index if not exists rec_gestion_bodega_idx on rec_gestion (warehouse_id, created_at desc);
create index if not exists rec_gestion_fecha_idx  on rec_gestion (created_at desc);

-- Quién subió qué archivo y cuándo. Sirve para saber si lo que estás mirando es
-- de hoy o de hace una semana.
create table if not exists rec_importacion (
  id            uuid primary key default gen_random_uuid(),
  archivo       text,
  fecha_datos   date,
  filas         integer,
  bodegas       integer,
  guias         integer,
  usuario       text,
  created_at    timestamptz default now()
);

create index if not exists rec_importacion_fecha_idx on rec_importacion (created_at desc);


-- ───────────────────────────────────────────────────────────────────────────
-- RLS — lectura para usuarios logueados, escritura solo por service key
-- ───────────────────────────────────────────────────────────────────────────

do $$
declare
  t text;
  tables text[] := array[
    'rec_transportadora','rec_bodega','rec_carga_diaria',
    'rec_solicitud','rec_solicitud_bodega','rec_gestion','rec_importacion'
  ];
begin
  foreach t in array tables loop
    execute format('alter table %I enable row level security', t);

    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = t
        and policyname = 'authenticated_read_' || t
    ) then
      execute format(
        'create policy %I on %I for select to authenticated using (true)',
        'authenticated_read_' || t, t
      );
    end if;
  end loop;
end $$;


-- ───────────────────────────────────────────────────────────────────────────
-- SEMILLA — las 10 transportadoras del export del 24-jul
--
-- min_paquetes = 10, y ese número NO es arbitrario: sale de la distribución
-- real del export del 24-jul (4.130 pares bodega × transportadora):
--
--     umbral   elegibles   % del volumen
--        1       4.130         100%
--        5       1.518          93,0%
--     → 10         962          87,5%   ← el codo de la curva
--       20         570          79,5%
--       50         252          64,5%
--      100         113          49,4%
--
-- Debajo de 10 quedan 3.168 pares que suman 8.151 paquetes: 2,6 por visita.
-- Ahí no vale mover un camión. Subir de 10 a 50 ahorra 710 visitas pero deja
-- 15.000 paquetes sin recoger — mal negocio.
--
-- Es un punto de partida, no una verdad: se ajusta por transportadora y por
-- municipio (recoger 8 paquetes en Bogotá no cuesta lo mismo que en Garzón), y
-- el campo `incluida_por` de rec_solicitud_bodega dirá si la regla acierta: si el
-- operador mete a mano bodegas de 6 paquetes, el umbral está alto.
-- ───────────────────────────────────────────────────────────────────────────

insert into rec_transportadora (id, nombre, canal_preferido, min_paquetes)
select v.id, v.nombre, v.canal, 10
from (values
  ('INTERRAPIDISIMO', 'Interrapidísimo', 'correo'),
  ('ENVIA',           'Envía',           'correo'),
  ('COORDINADORA',    'Coordinadora',    'correo'),
  ('VELOCES',         'Veloces',         'whatsapp'),
  ('JAMV DRIVE',      'JAMV Drive',      'whatsapp'),
  ('TCC',             'TCC',             'correo'),
  ('DEROCHA EXPRESS', 'Derocha Express', 'whatsapp'),
  ('DOMINA',          'Domina',          'correo'),
  ('WIILOG',          'Wiilog',          'whatsapp'),
  ('SUPPLI EXPRESS',  'Suppli Express',  'whatsapp')
) as v(id, nombre, canal)
where not exists (select 1 from rec_transportadora t where t.id = v.id);
