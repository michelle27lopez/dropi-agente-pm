# Plantilla estándar — Entrega de proyecto a TI (Producto → TI)

> Formato oficial de Dropi (la **fuente de verdad** de cada proyecto). Base en blanco:
> [Google Doc](https://docs.google.com/document/d/1pw2H33wc4jGrHRFNLdyl6U4M7sXu76FLzkIlhQX9DZg/edit).
> Ejemplo lleno (a actualizar a esta base): `proyectos/parametrizacion-tarifas/`.

## Principio rector
- **Producto define QUÉ · POR QUÉ · PARA QUÉ.** TI define **CÓMO · CUÁNDO.**
- Producto NO define stack/componentes/cronograma. Aporta el **C4 Nivel 1** (actores, sistemas externos, dominios, flujo de datos a alto nivel).
- Gobierno: **TDL/Program Manager** (RACI, riesgos, DORA) + **TPL/Project Lead** (PERT, Traffic Light) se activan en el hand-off.
- Regla: campo que no aplica → **N/A** (no vacío). Roles: 🧠 PM/PO · 🎨 PD · ⭐ Marketing · 💻 TI.

## Flujo del PM (orden de llenado)
1. **Kick-off** (lo lleno yo primero) → 2. **Discovery** → 3. **Definición** → 4. **Following y lanzamiento** → 5. **Comunicación** → cuando 1-4 están llenos, armar el **6. Hand-off a DEV & Stakeholders** con todo. Luego TI activa 7 (TDL/TPL), 8 (lanzamiento), 9 (hallazgos following).

## Estructura completa (secciones del doc)

### 1 · Kick-off de Producto
1.1 Información general & equipo (nombre, célula, owner/PM, PD, stakeholder, fecha, estado) ·
1.2 Introducción y contexto — **POR QUÉ ahora** (cambio externo/interno, costo de no hacerlo) ·
1.3 Problema, impacto y painpoints — **QUÉ** (frecuencia, importancia, segmento/target/size, ≥2 painpoints, objetivos negocio/UX, **OKR/KR/Data**) ·
1.4 Enlaces (épica, Figma, research) · 1.5 Dudas e incógnitas (solo negocio/funcional).
> NO va: esfuerzo técnico, tiempos de dev, stack, performance.

### 2 · Discovery & Levantamiento
2.1 Usuarios implicados & madurez · 2.2 **AS-IS** (soluciones actuales + limitaciones) ·
2.3 Research, bench, apéndices · 2.4 **Riesgos de producto** (valor, usabilidad, factibilidad, viabilidad, legal) ·
2.5 Hipótesis, validaciones y preguntas abiertas · 2.6 Conclusiones del discovery · 2.7 Requerimientos, compatibilidad, performance.

### 3 · Definición & Alcance
3.1 Primeras ideas/escenarios · 3.2 Fases (MVP / evolutivo / optimización) · **Lo que NO entra (no-objetivos)** ·
3.3 Estimación de esfuerzo de producto · 3.4 Segmento y país · 3.5 **Supuestos** · 3.6 Próximos pasos · 3.7 Entregables (Figma final, TANGO, Loom).

### 4 · Following y lanzamiento
Fuentes a instrumentar (eventos backend, frontend/Userpilot, data warehouse) ·
Métricas de negocio (framework **HEART**, con fuente/fórmula/criterio de éxito/segmentación) ·
Métricas de comportamiento (target, adopción, retención, satisfacción) ·
Micro-surveys **SEQ** (trigger, frecuencia, escala 1-5, lógica condicional) ·
Esquema piloto **12 semanas** (M1 semanal, M2 quincenal, M3 mensual) · Kick-off a Marketing.

### 5 · Estrategia de comunicación (para MKT)
Título · descripción · beneficios · objetivo/fechas · mensajes y angles · recursos (TANGO/video/Figma) · contacto.

### 6 · Hand-off a DEV & Stakeholders ⭐ (se arma cuando 1-5 están listos)
Cabecera (segmento, equipo TI, tech lead, fecha, docs previos) ·
4.1 **JTBD** ("Cuando [situación], quiero [acción], para [resultado]") ·
4.2 **C4 Nivel 1** (actores · sistemas externos · dominios · flujo de datos a alto nivel) ·
4.3 Glosario de dominio · 4.4 **Reglas de negocio** numeradas · 4.5 **Criterios de aceptación** (Gherkin: Dado/Cuando/Entonces por módulo, incl. casos de borde) ·
4.6 Consideraciones de negocio/UX · 4.7 Riesgos desde Producto · 4.8 Lo que TI debe devolver (C4 N2-N4, estimación, cronograma, dependencias, observabilidad, seguridad, riesgos técnicos).

### 7 · Activación TDL/TPL (lo llena TI/gobierno)
RACI · **DORA** (Deployment Frequency, Lead Time, Change Failure Rate, MTTR) · **Risk Heat Map** (Prob×Impacto, zonas verde/amarilla/roja) · **PERT** (TE=(O+4M+P)/6, camino crítico) · **Traffic Light** semanal (alcance/tiempo/calidad/riesgos).

### 8 · Lanzamiento · 9 · Hallazgos Following
Estrategia de salida (coms) · monitoreo post-lanzamiento (dashboard, bitácora, resumen semanal, próximos pasos basados en data).

## Checklist de gates (antes de pasar de fase)
- **Kick-off:** POR QUÉ ahora claro · ≥2 painpoints · perfil principal · objetivo negocio + UX · sin nada técnico.
- **Discovery:** evidencia con usuarios (no opinión) · AS-IS en pasos · hipótesis con evidencia · conclusión ejecutiva.
- **Definición:** una propuesta elegida · lista de NO-objetivos · fases en valor (no implementación) · supuestos.
- **Hand-off TI:** JTBD · C4 N1 completo · glosario · reglas numeradas · criterios Gherkin por módulo · riesgos.
- **Lanzamiento/Following:** métricas con fórmula y criterio · eventos a trackear · ≥1 SEQ · plan 12 semanas · insumos MKT.

## Conexión con la metodología
- **Discovery con datos** (foco de Juan) = fase 2 + el diccionario `conocimiento/temas/10` + el filtro de `product-logistics.md`.
- "Definición de datos cerrada antes de la UI" (estándar de Juan) = cerrar Discovery (2) antes de Definición/diseño (3).
- OKR/KR/Data del kick-off deben atarse a los NSM: movilización, % entrega, tiempo por fases.
