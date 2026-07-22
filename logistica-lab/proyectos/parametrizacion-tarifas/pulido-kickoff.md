# §1 · Kick-off — Correcciones de pulido (Tarifas)

> El Kick-off ya está **lleno y es bueno**; solo necesita correcciones. 🧠 Sección del PM (Juan).
> Aquí están los arreglos puntuales (antes → después) y las decisiones que solo tú puedes cerrar.

## ⛔ Ojo: Mercancía Industrial está descrita pero NO se construyó
El Kick-off describe **2 modelos** (Express + Industrial). Pero **Industrial no se diseñó ni desarrolló** (no está en Figma ni en el panel). Decisión: marcar Industrial en el doc como **discovery / fase futura / no-objetivo de esta entrega**, no como algo entregado. No sacarlo del Kick-off (es contexto válido), pero sí dejar explícito su estado para que no se lea como construido.

## 🔴 Decisiones que debes cerrar (no las puedo inventar)
1. **KR de órdenes — hay 3 cifras distintas.** Unificar a UNA:
   - En 1.3: *"KR: Alcanzar **7.6M** órdenes mensuales"*.
   - En 1.4: *"OKR 1 — KR 1 — Alcanzar **9.6M** órdenes (**7.8M**/mes promedio)"*.
   - 👉 ¿Cuál es la meta real? (7.6M/mes, 7.8M/mes, o 9.6M total). Dejar una sola y borrar la otra.
2. **Corte de peso Express/Industrial: 5 kg vs >8 kg.** El cuerpo dice **5 kg**; la nota de prototipo dice *"Mercancia industrial es rango de peso >8kg"*. Definir el corte real.

## 🐛 Correcciones mecánicas (puedo dejarlas listas; tú las aplicas en el Doc)
**Typos / nombres propios:**
- `Owner / PM: Juan Diego Bautista.` → quitar el punto: **Juan Diego Bautista**
- `Product Designer: Michel pino` → **Michel Pino**
- `Stakeholder principal: William morale,` → **William Morales**
- `Desarrollador: Kevin fory` → **Kevin Fory** (en la cabecera del Hand-off ya está bien: "Kevin Fory")
- Header de la tabla 1.1: `Campo | Contenido esperado` → **Campo | Contenido** (era texto de plantilla).

**Emojis de rol corruptos (encoding) — en TODOS los encabezados:**
- `ð§` → 🧠 (PM) · `ð«` → 🎨 (PD) · `ð»` → 💻 (TI) · `ð` (título) → 🚀/📄 según corresponda.
- En el Traffic Light (§7): `ð¢` → 🟢 · `ð¡` → 🟡 · `ð´` → 🔴.

**Numeración OKR rota:**
- En 1.4 la lista salta de `OKR 1 — KR 1` a `OKR 3 — KR 1`. → renumerar a **OKR 1** y **OKR 2** (no hay un OKR 2 hoy).
- Además hay **dos enunciados de OKR distintos** (1.3: *"Escalar volumen hacia el unicornio"*; 1.4: *"Habilitar nuevas líneas de servicio…"*). Decidir si son el mismo OKR redactado distinto o dos OKR; dejar consistente.

**Conteo de dudas (1.5) no cuadra:**
- Dice `Resueltas: 14 · Pendientes: 3` pero **lista 4 pendientes** (1,2,3,4) y el cuerpo tiene **16** preguntas numeradas. → recontar: poner **Pendientes: 4** (identificar Marca/híbridos · escalar industrial · corte 5 kg en 12 países · fórmulas nacionales vs internacionales) y ajustar "Resueltas".

**Bullets vacíos a borrar (1.4):**
- `Hallazgo principal:` (vacío, duplicado) y `Fuentes:` (vacío) → eliminar o llenar.

**# de transportadoras:** el doc dice "12 países" (correcto) pero cuida no confundir con "# transportadoras"; en CO el panel real tiene **5** (Veloces, Coordinadora, Envia, Interrapidísimo, Domina). Verificar cualquier conteo suelto.

## 🧱 Arreglo estructural (1 movimiento)
En **1.4 Enlaces** quedaron metidos, fuera de lugar, tres bloques que NO son enlaces: **"Impacto"**, **"Research como punto de partida"** y **"OKR (Objetivo Trimestral)"**.
- Mover **Impacto** y **OKR** a **1.3** (Problema/Impacto/Objetivos).
- Dejar en 1.4 **solo** los enlaces (Épica PROD-235, Figma, prototipo, research links).

## ✅ Lo que está bien (NO tocar)
- 1.2 POR QUÉ ahora: contexto sólido (panel inexistente, tarifas por código, caso Urbano $5.737 vs $10.412 = 82%, COD AR 0.7% vs 1.5%, apertura de mercancía industrial para Marcas).
- 1.3 los 5 painpoints (Dolor 1–5) y la descripción de los 2 modelos.
- 1.5 el detalle de las 16 preguntas con respuestas.

> Para la §6 Hand-off ya está el contenido listo en [`pulido-handoff.md`](pulido-handoff.md).
