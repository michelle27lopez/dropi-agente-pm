# 11 · Plataforma Dropi — módulos y funciones (inventario)

> **Fuente:** capturas de la plataforma (vista del dropshipper, cuenta Juan Diego, CO, BETA) · **Fecha:** 2026-06-24 · **Tipo:** inventario/referencia · **Confianza:** observado en UI (parcial — faltan módulos y sub-vistas).
> ⚠️ **Inventario incompleto a propósito.** Es la vista del *dropshipper*; faltan vistas de proveedor/admin y sub-pantallas. Ampliar con cada captura nueva.

## TL;DR
- La plataforma tiene **~24 módulos de primer nivel** (sidebar). El core logístico vive en **Órdenes** + **Logistic** + **Transportadora** + **EcomScanner**.
- Hallazgo clave: **la validación de direcciones YA es un feature vivo** (`Tipo de validación: Automática`, escudo verde en el listado). Hay log por orden → fuente de datos, no obra nueva. Matiza H5 (`temas/05`: "geo no medible") — no hay coordenadas pero sí evento de validación.
- Cada orden trae **historiales** ya instrumentados: estados, cartera, novedades, **validación de dirección**, movimientos, **whatsapp**, garantías. Mucho de lo que en data figura como "ciego" puede estar logueado aquí.

## Módulos del sidebar (vista dropshipper)
| Módulo | Sub-vistas / notas | Etiqueta |
|---|---|---|
| Inicio | home: capacitaciones (Proveedor, Garantías, EcomScanner, Logística), updates, Dropi Cup, canal WhatsApp | |
| Dashboard | métricas del usuario | Beta |
| Productos | Productos (Activos/Archivados); SIMPLE/VARIABLE, stock por bodega, precio + precio sugerido, Aprobado, Privado, carga masiva, actualización masiva, garantías | |
| **Órdenes** | **Mis Pedidos · Novedades · Etiquetas · Manifiesto · Configuración de pedidos** | |
| Mis Garantías | | |
| **Logistic** | (submenú — por mapear) | |
| Clientes | | |
| Mis Integraciones | conectores ecom (Shopify, etc.) | |
| Historial de Cartera | movimientos de saldo / COD | |
| Mis usuarios | (submenú) | |
| Mis Referidos | viral loop / referidos (PLG) | |
| Bodegas | | |
| Configuraciones | | Nuevo |
| Calendario | | |
| Marketing | (submenú) | |
| Reportes | (submenú) | |
| Facturas | (submenú) | |
| **Transportadora** | (submenú — transportadoras: ENVIA, COORDINADORA, WED-ENVIOS, Interrapidísimo, VELOCES…) | |
| Dropi Card | tarjeta / medio de pago | Nuevo |
| Roax | (por entender) | Nuevo |
| CAS | módulo CAS (combos / servicios — ver [[ref-cas-arquitectura]]) | |
| EcomScanner | recepción de devoluciones + registro de novedades en bodega | Beta |
| Academy | formación | Nuevo |

## Anatomía de "Mis Pedidos" (zona de la orden)
Columnas: ID · Producto (marca "Orden de Dropshipper") · Fecha · **Cliente** (nombre + dirección con **escudo verde = validada** + tel) · **Estatus** (RECHAZADO, GENERADA EN <ciudad>, PENDIENTE…) · **Transportadora** · Bodega · **Tipo de Envío (CON RECAUDO / SIN RECAUDO** = COD vs prepago) · Impreso · Etiqueta.
Acciones masivas: actualizar estatus en lote, imprimir seleccionadas, filtros.

## Anatomía del detalle de orden (#67069799) — lo que YA se loguea
- Cabecera: estatus, nº de guía, compañía de envío, tipo de envío, subtotal / **costo de envío** / total.
- **Historial de estados** (ciclo de vida): `PENDIENTE → GUIA_GENERADA → GUIA_ANULADA → RECHAZADO`, con usuario + comentario por transición. → base para **tiempo por fases** (NSM).
- **Historial de Cartera** (movimientos COD).
- **Historial de novedades** (novedad · solución · observación · solucionado por · aclaración/comentario de la transportadora).
- **Historial de validación de dirección** ⭐: fecha · dirección que se validó · **dirección confirmada** · **tipo de validación (Automática)** · **respuesta (Validación exitosa)**. → el feature de direcciones ya existe y deja rastro.
- **Historial de movimientos**.
- **Historial de whatsapp** (message · fecha · estado · response) → confirmación vía WhatsApp/ChateaPro logueada por orden.
- **Historial de garantías**.

## Implicaciones para producto / experimentos
- **Direcciones:** medir cobertura y tasa de éxito de la validación automática que YA corre (¿en qué % de órdenes corre? ¿la validación exitosa se correlaciona con +entrega / −novedad?). No empezar por "construir validación".
- **Tiempo por fases (NSM):** el `Historial de estados` por orden es la materia prima; cruzar con `history_orders` (`temas/03`).
- **Confirmación / WhatsApp:** el `Historial de whatsapp` permite medir el embudo de confirmación a nivel orden, no solo agregado.
- **COD:** `Tipo de Envío` (CON/SIN RECAUDO) + `Historial de Cartera` = el lente del hallazgo #1 (devolución = problema de pago).

## Preguntas abiertas / pendientes
- Mapear submenús de **Logistic, Transportadora, Marketing, Reportes, Mis usuarios** (faltan capturas).
- Mapear vistas de **proveedor** y **admin** (esta es solo dropshipper).
- Entender **Roax** y **Dropi Card** (módulos nuevos) y su rol en la cadena de valor.
- ¿La "validación automática" de dirección es propia de Dropi o del carrier? ¿Qué motor usa? (conecta con PRM-91 [[ ]] y el action item del Cell Board 17-jun).
