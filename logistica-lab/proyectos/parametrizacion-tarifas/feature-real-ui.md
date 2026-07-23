# Tarifas — Feature REAL ya construido (captura de UI)

> Fuente de verdad de **lo que existe de verdad** (no lo que dice la plantilla del doc).
> Capturado de screenshots de la pantalla **Configuraciones → Parametrizar Tarifas** · 23-jun-2026.
> Sirve para reemplazar el relleno genérico del doc E2E con la realidad. Re-validar contra la build actual.

## Pantalla: Configuraciones → Parametrizar Tarifas

### Selector de transportadoras (multi-selección para comparar)
Tarjetas con checkbox. Texto guía: *"Selecciona una transportadora para editar sus tarifas, o dos o más para comparar."*

| Transportadora | País | Trayectos |
|----------------|------|-----------|
| Veloces | CO | 4 |
| Coordinadora | CO | 4 |
| Envia | CO | 4 |
| Interrapidisimo | CO | 2 |
| Domina | CO | 4 |

Al elegir una (ej. **Veloces**): badge `CO` + tipo de servicio `Express`. Tabs de trayecto: **Local · Regional · Nacional**.

### Bloques de parametrización (por transportadora y trayecto)
Cada concepto tiene su par **Dropi / Transportadora** y, casi todos, un toggle **"Incluido en el cálculo del IVA"**.

1. **Flete** — *"se determina según la ruta y el peso que ingreses en el simulador"*.
   - Campo `Flete Local (Transportadora)` → "Selecciona Origen-Destino para ver". Toggle IVA.
2. **COD** — *"se cobra el mayor entre el porcentaje del valor y el mínimo establecido"* (⬅ regla de negocio explícita).
   - `COD Dropi` (%), `COD Transportadora` (%), `Mínimo COD Dropi` (%), `Mínimo COD Transportadora` (%). Toggle IVA.
3. **Sobreflete** — `Sobreflete Dropi`, `Sobreflete Transportadora`, cada uno con selector **% / $** (puede ser porcentaje o valor fijo). Toggle IVA.
4. **Seguro** — `Seguro Dropi` (ej. 1%), `Seguro Transportadora` (ej. 0,7%), `Mínimo Seguro Dropi` ($0), `Mínimo Seguro Transportadora` ($0). Toggle IVA.
5. **Monetización Dropi (incremento fijo)** — ej. `$1.100`. + `Tasa IVA país` (ej. 19%). Toggle IVA.
6. **Cargos adicionales** — ej. `$0`.
7. **Flete devolución transportadora** — ej. `$4.200`.

### Descuentos por Volumen
*"Rangos de descuento según cantidad de guías mensuales."* Solo un rango **Vigente**; los demás tienen botón **Aplicar**.

| Rango guías/mes | Descuento | Factor | Estado |
|-----------------|-----------|--------|--------|
| 0 – 500 | 0% | 100% | ✓ Vigente |
| 501 – 2.000 | 2% | 98% | Aplicar |
| 2.001 – 5.000 | 4% | 96% | Aplicar |
| 5.001 en adelante | 6% | 94% | Aplicar |

### Guardar / confirmar
Botones **Descartar** y **Guardar cambios**. Al guardar, modal **"¿Confirmar cambios?"**:
*"Los siguientes cambios se aplicarán a las tarifas. Esta acción no se puede deshacer."* Muestra el **diff** antes de aplicar, ej. `[Local] COD Dropi  1.5% → 5%`. Botones Cancelar / Aplicar cambios.

## Panel derecho: Simulador de ganancia
*"Calcula la rentabilidad del trayecto [Local] con las tarifas actuales."*
- Inputs: `Valor a recaudar ($)`, `Peso del paquete (kg)`, `Tipo de servicio` (toggle **Con recaudo**), `Origen` (Departamento/Ciudad), `Destino` (Departamento/Ciudad). Botón **Cotizar**.

**Ejemplo capturado (Veloces · Local · orden $50.000 · 3 kg · con recaudo):**

| Tarifas Dropi | $17.126 |
|---|---|
| Flete Local | $6.400 |
| Sobreflete Dropi (1.2%) | $2.400 |
| Seguro Dropi (1%) | $2.000 |
| COD Dropi (1.5%) | $3.000 |
| Monetización Dropi | $1.100 |
| IVA Dropi (19%) | $2.226 |
| **Costo transportadora** | **$12.714** |

**MARGEN DROPI** (*sobre orden de $50.000*):
Diferencia Sobreflete `+$600` · Diferencia Seguro `+$1.150` · Diferencia COD `$0` · Monetización `+$1.100` · Devolución `-$4.200` · **Ganancia estimada `-$1.350`**.

> 🔎 **Insight real:** en este escenario la **ganancia estimada es NEGATIVA (-$1.350)** porque el costo de devolución ($4.200) se come el margen. Es la evidencia viva de por qué el simulador importa: deja ver márgenes negativos antes de parametrizar.

## Reglas de negocio que se LEEN de la UI (para sección 6 del doc)
- **R-COD:** el COD se cobra como **MAX(porcentaje del valor, mínimo establecido)**.
- **R-Flete:** el flete depende de **ruta (Origen-Destino) + peso**.
- **R-IVA:** cada concepto (flete, COD, sobreflete, seguro, monetización) puede **incluirse o no** en el cálculo de IVA, vía toggle independiente. La tasa de IVA es **por país**.
- **R-Sobreflete:** se define como **% o como valor fijo ($)**.
- **R-Monetización:** la monetización Dropi es un **incremento fijo** en $.
- **R-Margen:** `Margen Dropi = Tarifa Dropi − Costo transportadora`, desagregado por concepto (diferencia sobreflete + diferencia seguro + diferencia COD + monetización − costo de devolución).
- **R-Volumen:** descuento por **guías/mes**, con factor multiplicador; solo un rango **Vigente** a la vez.
- **R-Trayecto:** tarifas independientes por **Local / Regional / Nacional**; cada transportadora tiene N trayectos (la mayoría 4; Interrapidísimo 2).
- **R-Confirmación:** los cambios se muestran como **diff** y se confirman explícitamente; **no se pueden deshacer**.

## Preguntas abiertas (verificar, no inventar en el doc)
- **Base de cálculo de los %:** en el ejemplo, Sobreflete 1.2% = $2.400, Seguro 1% = $2.000, COD 1.5% = $3.000 sobre una orden de $50.000 no cuadran como % directo del valor a recaudar. ¿Sobre qué base se aplica cada porcentaje (valor recaudado, flete, valor declarado)? → **cerrar antes del hand-off**.
- **Tipo de servicio "Express"** vs otros: ¿qué tipos existen por transportadora?
- **Corte de peso** express/industrial (el doc menciona 5 kg y una nota suelta dice >8 kg) → no aparece en estos screenshots; confirmar.
- ¿`Cargos adicionales` y `Flete devolución` aplican por trayecto o globales por transportadora?
