# Proyecto · Parametrización de Tarifas por Transportadora

> Tipo: **proyecto largo / documentación para entrega a TI**. Etapa de cadena: costo por
> orden / tarifas. Estado: **Feature construido + Discovery completado; el doc E2E hay que PULIRLO**
> (está ~50% real, ~50% relleno genérico de plantilla).
>
> ⭐ **FUENTE DE VERDAD = [`spec.md`](spec.md)** (estándar spec-driven). Los demás archivos son apoyo.
> 📌 **Revisión real-vs-genérico + plan** → [`revision-doc-e2e.md`](revision-doc-e2e.md).
> 📌 **Feature real construido** (captura UI) → [`feature-real-ui.md`](feature-real-ui.md).
> ✅ **Pulido §1 Kick-off** (correcciones) → [`pulido-kickoff.md`](pulido-kickoff.md).
> ✅ **Pulido §6 Hand-off** (contenido para pegar) → [`pulido-handoff.md`](pulido-handoff.md).
>
> ⭐ **Alcance REAL construido = solo Paquetería Express** (≤5 kg: panel para lo que hoy va por código, con simulador de margen).
> ⛔ **Mercancía Industrial** (>5 kg: tabla O-D, peso volumétrico, remesas) está en el **doc como discovery/intención** pero **NO se diseñó ni construyó** → fase futura / no-objetivo de esta entrega.

## Ficha
- **Owner / PM:** Juan Diego Bautista · **Product Designer:** Michel Pino
- **Stakeholder principal:** William Morales (Operaciones)
- **Célula:** Logistics · **Países:** inicia CO, debe servir a todos (AR, GT, CR, PA, PE, MX, PY, CL, EC, VZ, ES)
- **Kick-off:** 10/05/2026

## Enlaces (todo está relacionado — revisar en conjunto)
- **Épica Jira:** [PROD-235](https://dropi-it.atlassian.net/browse/PROD-235) — [Dropi] Parametrización tarifas mercancía industrial / refacturación
- **Historia/ticket:** [PRM-1362](https://dropi-it.atlassian.net/browse/PRM-1362)
- **Solicitud:** [INVS-13](https://dropi-it.atlassian.net/browse/INVS-13)
- **Figma (diseño):** [Parametrización de tarifas](https://www.figma.com/design/PDeeZVQMyF3i6SUFCWyuQa/Parametrizaci%C3%B3n-de-tarifas)
- **Doc E2E (Producto→TI):** [Google Doc](https://docs.google.com/document/d/1zVCV1UJDkqTHr7SxP9LlfCy4ciVlucg2U-5nVQfIIhQ/edit) ⚠️ viejo, **hay que pulirlo**
- **Prototipo inicial:** [Drive](https://drive.google.com/file/d/1v20bIOaMpjhtcEkQNgRpj5ill6yKuYhj/view)

## Estado real del doc E2E (qué está lleno y qué es plantilla)
- ✅ **REAL:** §1 Kick-off · §2 Discovery (usuarios, AS-IS express/industrial, 4 hipótesis) · §4 Following (7 microsurveys + Userpilot, piloto 12 sem).
- ❌ **GENÉRICO (placeholder sin tocar):** §3 Definición (parcial) · §5 Comunicación · §6 **Hand-off a TI** (JTBD, C4 N1, glosario, reglas, Gherkin — lo más grave) · §7 TDL/TPL · §9 Hallazgos.
- 🐛 Emojis de rol corruptos (encoding) + inconsistencias de cifras (KR órdenes, corte de peso, # transportadoras).
> Detalle accionable en [`revision-doc-e2e.md`](revision-doc-e2e.md). Plantilla genérica de referencia: `metodologia/handoff-ti.md`.

## Datos relevantes (diccionario)
Campos en `distribution_companies` (`pricing_rules`, `porcentaje_tasa_sobreflete*`, `insurance`,
`iva_percentage`) y `colombia_shipping_orders` (`base_shipping`, `overload_base`,
`devolution_shipping_base`, `base_profit`). Ver `conocimiento/temas/10`.

## Estado / próximos pasos (pulido)
- [ ] 🔴 **Llenar §6 Hand-off a TI** con lo real: JTBD (ya escrito, copiar), C4 N1 (actores/sistemas/dominios), reglas numeradas (R-COD…), glosario y Gherkin → material en [`feature-real-ui.md`](feature-real-ui.md).
- [ ] 🔴 **Arreglar encoding** de emojis de rol + corregir inconsistencias de cifras (KR órdenes 7.6/9.6/7.8M, corte de peso 5 vs 8 kg, # transportadoras = 5 en CO).
- [ ] 🟡 **Cerrar §3 Definición:** convertir el bloque crudo "Conceptualización Prototipo" en propuesta + fases + no-objetivos + supuestos reales.
- [ ] 🟡 **§4:** etiquetar métricas con **HEART** y microsurveys como **SEQ**; renumerar a 4.x.
- [ ] 🟢 **§5 y §9:** completar Comunicación; dejar Hallazgos como estructura + **N/A** (no placeholder).
- [ ] Decidir cómo aplicar: (a) contenido de reemplazo en el repo para pegar, o (b) doc nuevo en Drive.
- [x] Conexiones Jira verificadas (23-jun): **PROD-235** (Epic) ⟵ implements ⟵ **PRM-1362** (Solicitud, *Inv. y definición*). INVS-13 = solicitud origen.

## Preguntas abiertas (cerrar antes del hand-off)
- **Base de cálculo de cada %** (sobreflete/seguro/COD): ¿sobre valor recaudado, flete, valor declarado? (no cuadran como % directo en el simulador).
- **Corte de peso** express vs industrial: 5 kg vs >8 kg.
- **Tipos de servicio** por transportadora (aparece "Express"): ¿cuáles existen?
- ¿`Cargos adicionales` y `Flete devolución` son por trayecto o globales por transportadora?
