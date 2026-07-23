# 18 · Métricas de operación — abril (cerrado) y mayo (parcial) 2026

> **Fuente:** capturas de Power BI + 1 export Excel aportados por Juan, **2026-06-26**. · **Tipo:** reporte operativo vivo. · **Confianza:** alta de enero a abril (meses cerrados); **mayo = mes incompleto** → entrega/devolución/cierre subestimados (ver §5). · **Alcance:** operación por transportadora y por departamento = **multipaís** (CO, MX, CL, EC, GT, PA, PY, AR, PE); los **motivos de cancelación/rechazo son solo Colombia**.
>
> **Cobertura de esta nota:** §1-5 = corte abr/may por transportadora · **§6 = panel mensual por país (ene–may) + acumulado YTD** · **§7 = enero por transportadora** (prueba de madurez) · **§8 = geografía de la entrega por departamento** · **§9 = curva de madurez del cierre + reconciliación**.
>
> **🗃️ Data cruda (fuente de verdad de los números) en [`conocimiento/Data/`](../Data/):** `operacion_pais_mensual.csv` (país×mes) · `operacion_transportadora_mensual.csv` (carrier×mes, ENE–MAY, grano completo) · `Dpto Y Ciudad Destino (1).xlsx` (departamento×mes). Esta nota es la **síntesis**; los números se citan desde ahí. Ver [`Data/README.md`](../Data/README.md).
>
> Complementa [tema 04 · hallazgos de data](04-hallazgos-data.md) (base abril previa). Sustenta el re-ranking de fugas en [`estrategia/roadmap-okr-impacto.md`](../../estrategia/roadmap-okr-impacto.md).

## TL;DR
- **Fuga #1 = movilización.** Mayo: **788.039 órdenes no movilizadas (21,44%)**; de eso ~541K es Colombia. Es la métrica más confiable aun en mes incompleto (la movilización resuelve en horas), y viene **empeorando** (−8,74% vs abril).
- **La "caída" de entrega de mayo (63,28%) es artefacto de mes incompleto, no una caída real.** El panel mensual lo prueba: entrega **plana en 72,5–73,7% de enero a abril** y devolución **plana en ~26%** todos los meses; solo mayo (incompleto) baja a 63%. Para decidir se usa **abril**, no mayo.
- **Hay una caja negra de medición: 23,52% de guías "sin cierre logístico" en mayo** vs **0,21% en enero** (cerrado) → confirma que el sin-cierre es **madurez del mes**, no homologación rota… salvo excepciones puntuales (AMPM tiene 23,6% sin cierre hasta en enero = homologación rota real).
- **México: matiz corregido.** No es solo artefacto: entrega **~57% país, estable todos los meses** (genuinamente más baja que Colombia ~74%) **+** una brecha de medición de ~13% aun en mes cerrado. El "39%" que veníamos citando era un carrier (QUALITY POST) en mayo incompleto, no el país.
- **La entrega tiene geografía (export por departamento):** dentro de Colombia, el núcleo andino entrega ~80% (BOYACÁ, QUINDÍO, RISARALDA, CALDAS, SANTANDER) vs la periferia Pacífico/Caribe ~64–69% (CHOCÓ, GUAJIRA, NARIÑO, BOLÍVAR, MAGDALENA). México y Argentina enteros caen al 45–60%.
- **Devolución real (abril) = 26,04%**, concentrada en **México (AFIMEX 44%, AMPM 36%), Argentina (FIXY 44%) y Guatemala (GINTRACOM 47%)**; Colombia más sana (DEROCHA 16%, COORDINADORA 21%, ENVIA 24%). Confirma el hallazgo #1 (COD devuelve ~25%).
- **Concentración:** INTERRAPIDISIMO (31,9%) + ENVIA (28,7%) = **60,6% de la movilización.** Dropi moviliza por su cuenta solo **8.610 órdenes (0,3%)** → es orquestador, no operador.
- **El motivo de cancelación está ciego en Colombia:** ~415K registros sin causa útil ("Otros", "sin nota", "Autorizado por gerencia"). Texto libre con typos → hoy no es analizable.

## 1 · Movilización

### 1.1 Tendencia mensual y no-mov (toda la operación)
Tooltip mayo 2026 (capt. "Tendencia de operación"):

| Métrica | Mayo 2026 |
|---|---|
| Ord. creadas | 3.675.113 |
| Movilizadas | 2.885.793 |
| **No movilizadas** | **788.039** |
| **% No Mov** | **21,44%** |
| % Var Ord (vs ant.) | −4,87% |
| % Var Mov (vs ant.) | −8,74% |
| Prom Mov | 412.256 |
| Prom Mov mes anterior | 451.759 |
| % Var Prom | −8,74% |

Serie de movilización (variación mensual): ene 3.140.440 (+3,7%) · feb 2.866.273 (−8,7%) · mar 3.236.301 (+12,9%) · abr 3.162.313 (−2,3%) · **may 2.885.793 (−8,7%)**.

> **Lectura:** la movilización cayó más (−8,74%) que la creación (−4,87%) → la *tasa* de movilización empeoró en mayo, no solo el volumen. La movilización es de las pocas métricas legibles en mes incompleto porque resuelve en horas (orden→guía→red ≈ 10h).

### 1.2 Concentración por transportadora (% participación de la movilización, mayo)
INTERRAPIDISIMO **31,92%** · ENVIA **28,71%** · COORDINADORA 5,94% · QUALITY POST (MX) 5,59% · STARKEN (CL) 5,30% · SERVIENTREGA (EC) 4,27% · FORZA (GT) 3,44% · VELOCES (CO) 2,81% · GINTRACOM (EC) 2,54% · BLUE (CL) 1,96% · TCC 1,30% · JAMV DRIVE 0,81% · TIUI (MX) 0,75% · HL EXPRESS (PA) 0,68% · AEX (PY) 0,45% · FIXY (AR) 0,41% · LAARCOURIER (EC) 0,39% · VELOCES (EC) 0,36% · DEROCHA 0,34% · FIXY NEXTDAY (PY) 0,31% · DOMINA 0,28% · WIILOG 0,28% · VELOCES (MX) 0,19% · GINTRACOM (GT) 0,18% · AMPM (MX) 0,14% · 99MINUTOS 0,14% · URBANO (AR) 0,12% · VELOCES (CL) 0,11% · resto <0,1%.

> **INTER + ENVIA = 60,6%** de toda la movilización. Cualquier palanca sobre esos dos mueve más que el resto junto. **"Mov Proc dropi" (movilización propia de Dropi) = 8.610 órdenes (0,3%)** → confirma Fulfillment by Dropi ≈ 0; Dropi depende 100% de carriers terceros.

## 2 · Entrega y devolución

### 2.1 Tendencia de % entrega (mensual)
ene 72,88% (+1,6%) · feb 73,68% (+1,1%) · mar ~73% · abr **72,46%** (−1,1%) · may **63,28%** (−12,7%).

> Entrega **plana en 72–74%** de enero a abril; el "−12,7%" de mayo es el mes incompleto (ver §3 y §5). **No leer mayo como caída.**

### 2.2 Abril cerrado vs mayo parcial (totales)
| | Entrega | Devolución | Sin cierre log | Suma |
|---|---|---|---|---|
| **Abril (cerrado)** | 72,46% | **26,04%** | ~0 | ≈ 100% |
| **Mayo (parcial)** | 63,28% | 13,13% | **23,52%** | ≈ 100% |

> En abril, entrega + devolución ≈ 100% (casi todo cerrado). En mayo, el 23,52% sin cierre "presta" ~9 pts a la entrega aparente. Sobre guías cerradas, la entrega de mayo sería 63,28 / (63,28+13,13) = **~83%** (sesgada al alza porque las entregas cierran antes que las devoluciones).

### 2.3 % Devolución por transportadora — **ABRIL** (cerrado, multipaís)
Total **26,04%**. (📍 = devolución alta)

| País | Transportadora | % Dev |
|---|---|---|
| MX | GINTRACOM | 46,64% 📍 |
| MX | AFIMEX | 44,19% 📍 |
| AR | FIXY | 43,82% 📍 |
| MX | AMPM | 35,52% 📍 |
| MX | COORDI | 32,37% |
| CL | BLUE | 30,73% |
| EC | GINTRACOM | 30,33% |
| EC | LAARCOURIER | 29,00% |
| PY | AEX | 28,20% |
| GT | FORZA | 27,22% |
| CO | INTERRAPIDISIMO | 26,62% |
| CO | 99MINUTOS | 25,98% |
| PY | FIXY NEXTDAY | 25,83% |
| CO | JAMV DRIVE | 25,47% |
| CO | DOMINA | 24,44% |
| CO | ENVIA | 24,13% |
| PY | FIXY | 23,46% |
| CO | COORDINADORA | 20,63% |
| CO | DEROCHA EXPRESS | 16,01% |

> **El "GINTRACOM 46,64%" del encabezado es GT/EC** (la captura mostraba dos GINTRACOM). Patrón claro: la devolución se concentra en **MX, AR y GT**; Colombia es la región más sana (DEROCHA 16%, COORDINADORA 21%). Ata con el hallazgo #1: **devolución = problema de pago en COD**, no de última milla.

### 2.4 Operación por transportadora — **MAYO** (parcial, multipaís)
Creadas · Movilizadas · %Entrega · %Devolución · %Guías sin cierre log. **Total: 3.675.108 creadas · 2.877.181 mov · 63,28% ent · 13,13% dev · 23,52% sin cierre.** (Recordar: mayo incompleto.)

| País | Transportadora | Creadas | Mov | %Ent | %Dev | %SinCierre |
|---|---|---|---|---|---|---|
| CO | INTERRAPIDISIMO | 1.116.907 | 917.379 | 63,37 | 14,02 | 22,60 |
| CO | ENVIA | 1.055.966 | 826.125 | 68,33 | 13,22 | 18,45 |
| CO | COORDINADORA | 227.738 | 171.409 | 64,17 | 8,65 | 27,18 |
| MX | QUALITY POST | 213.936 | 160.224 | 39,00 | 3,69 | **57,31** |
| CL | STARKEN | 208.658 | 153.019 | 64,70 | 16,91 | 18,39 |
| EC | SERVIENTREGA | 143.931 | 123.157 | 61,70 | 12,71 | 23,85 |
| GT | FORZA | 117.768 | 99.405 | 68,50 | 18,84 | 12,66 |
| CO | VELOCES | 105.800 | 81.026 | 56,80 | 10,97 | 32,23 |
| EC | GINTRACOM | 109.871 | 73.346 | 64,34 | 17,71 | 17,96 |
| CL | BLUE | 79.183 | 56.576 | 61,29 | 17,75 | 20,86 |
| CO | TCC | 53.283 | 37.381 | 69,06 | 12,69 | 18,26 |
| CO | JAMV DRIVE | 30.698 | 23.353 | 68,18 | 12,73 | 19,09 |
| MX | TIUI | 30.886 | 21.494 | 44,71 | 3,04 | **52,25** |
| PA | HL EXPRESS | 25.434 | 19.722 | 60,00 | 10,55 | 29,45 |
| PY | AEX | 18.129 | 12.888 | 56,57 | 8,28 | 35,15 |
| AR | FIXY | 13.895 | 11.829 | 44,48 | 26,16 | 29,37 |
| EC | LAARCOURIER | 17.991 | 11.279 | 68,30 | 19,07 | 12,63 |
| EC | VELOCES | 15.058 | 10.351 | 65,23 | 12,96 | 21,81 |
| CO | DEROCHA EXPRESS | 11.816 | 9.667 | 79,45 | 11,13 | 9,42 |
| PY | FIXY NEXTDAY | 12.422 | 9.068 | 66,20 | 11,26 | 22,54 |
| CO | DOMINA | 10.558 | 7.957 | 63,40 | 10,03 | 26,57 |
| CO | WIILOG | 7.014 | 5.785 | 75,97 | 4,93 | 19,07 |
| MX | VELOCES | 7.321 | 5.466 | 37,83 | 21,97 | 40,19 |
| GT | GINTRACOM | 7.193 | 5.252 | 58,93 | 24,60 | 16,47 |
| CO | 99MINUTOS | 5.196 | 3.970 | 59,09 | 10,65 | 29,90 |
| MX | AMPM | 5.689 | 3.911 | 49,48 | — | **50,52** |
| AR | URBANO | 4.496 | 3.594 | 30,05 | 25,79 | 44,16 |
| CL | VELOCES | 4.568 | 3.111 | 72,32 | 13,05 | 14,63 |
| MX | AFIMEX | 3.753 | 2.499 | 44,70 | 26,09 | 29,21 |
| PA | SERVIENTREGA | 3.087 | 2.422 | 62,18 | 18,17 | 19,65 |
| EC | URBANO | 1.559 | 1.106 | 55,88 | 13,65 | 30,47 |
| PY | FIXY | 1.327 | 1.031 | 78,08 | 11,06 | 10,86 |
| PY | PUNTO A PUNTO | 1.351 | 766 | 29,90 | — | **70,10** |
| MX | COORDI | 1.110 | 679 | 57,73 | 3,24 | 39,03 |
| PE | URBANO | 814 | 479 | 58,46 | 11,06 | 30,48 |
| CO | QUVI | 312 | 229 | 66,81 | — | 33,19 |
| PE | FENIX | 315 | 185 | 65,41 | — | 34,59 |
| CL | WIILOG | 75 | 42 | 19,05 | 19,05 | 61,90 |

## 3 · Cierre logístico (la caja negra de medición)
**23,52% de las guías movilizadas no tienen desenlace registrado** (ni entrega ni devolución). Casos extremos: PUNTO A PUNTO (PY) 70% · QUALITY POST (MX) 57% · TIUI (MX) 52% · AMPM (MX) 51% · URBANO (AR) 44% · VELOCES (MX) 40% · COORDI (MX) 39%.

En mes incompleto, parte es **inmadurez** (entrega/devolución tardan días; aún en tránsito) y parte puede ser **homologación rota** (entregó pero el estado no se mapeó). Se separan por **antigüedad de la guía**: una guía sin cierre con 30+ días = homologación rota. **Prueba directa (§7):** enero cerrado tiene **0,21% sin cierre** → casi todo es inmadurez del mes en curso. **Excepción real: AMPM (MX) con 23,6% sin cierre en enero = homologación rota de ese carrier.** **México (corregido):** su entrega país es **~57% estable todos los meses** (genuinamente más baja, no artefacto); el "39%" era el carrier QUALITY POST en mayo incompleto. México combina entrega real más baja + brecha de medición de ~13% aun cerrado.

> Eleva **Normalización de estados (PRM-1297)** de "habilitador" a **pre-requisito de medición**: no se puede priorizar entrega en MX/AR mientras 1 de cada 2 guías no cierra.

## 4 · Motivos de cancelación / rechazo — **COLOMBIA** (periodo sin confirmar)
Captura sin etiqueta de mes (ver caveat §5). Top motivos:

| Cancelación | Órd. | | Rechazo | Órd. |
|---|---:|---|---|---:|
| Otros (literal) | 182.669 | | Autorizado por gerencia | 50.091 |
| Cliente final cancela | 160.228 | | (sin nota) | 24.374 |
| (sin nota) | 158.181 | | No despacho del proveedor | ~10.200 |
| Pedido duplicado | 66.802 | | Cobertura (sin cobertura) | ~4.300 |
| Datos incompletos | 51.909 | | Cliente final cancela | 3.594 |
| Cambio tipo recaudo | 9.956 | | No permite generar guía | 1.886 |
| Cambio transportadora | 9.523 | | Pedido duplicado | 1.628 |
| Excede valor a recaudar | 5.820 | | No recibe por tamaños | ~570 |
| **Total (top 8)** | **645.088** | | **Total (top 8)** | **~96.643** |

**La ceguera:** Otros (182.669) + sin nota (158.181) en cancelación + "Autorizado por gerencia" (50.091) + sin nota (24.374) en rechazo = **~415K registros sin causa útil.** "Autorizado por gerencia" es el "Otros" del rechazo: dice *quién* autorizó, no *por qué*. Submotivos en texto libre con typos ("CLINETE NUNCA RECIBE", "h", "c", "malo", "cali", "prueba"). **Hoy el motivo no es analizable — y eso mismo es el hallazgo de producto.**

Catálogo cerrado propuesto (cancelación), agrupado por la data:
- **Rescatable** (gate pre-despacho): Datos incompletos · Cambio tipo recaudo · Cambio transportadora (~71K) → completar y reactivar.
- **Demanda / cliente**: Cliente final cancela · Excede valor a recaudar (~166K) → no es logística; medir y rutear a demanda/pago.
- **Limpieza / sistema**: Pedido duplicado (~67K) → deduplicar.
- **A eliminar**: Otros · (sin nota) (~341K) → prohibir guardar sin submotivo cerrado.

## 5 · Alcance, caveats y reconciliación (leer antes de citar)
- **Mayo = mes incompleto.** Casi completo en **creación** (3,68M, −4,87% vs abr) pero **inmaduro en desenlace** (entrega/devolución/cierre tardan días). → entrega 63% y dev 13% subestimadas; movilización 78,5% es la más leíble. **Para decisiones usar abril/ene–abr (cerrados); mayo solo tendencia direccional.** (Confirmado por Juan, 26-jun.) La serie ene–abr (§6) da la línea base estable: entrega ~73%, dev ~26%, mov ~81%.
- **Por qué la movilización sí se puede leer en mayo:** resuelve en horas; entrega/devolución resuelven en días → solo aquéllas se contaminan con el mes abierto.
- **Denominadores:** en la operación por carrier, **%Ent + %Dev + %SinCierre ≈ 100% sobre movilizadas**. La devolución de abril (26,04%) es sobre cerradas; la de mayo (13,13%) sobre movilizadas → **no comparar ambos %Dev directo.**
- **Las dos capturas de mayo reconcilian:** Mov 2.885.793 (participación) − 2.877.181 (entrega/dev) = 8.612 ≈ los 8.610 "Mov Proc dropi". Buena señal de que son el mismo corte.
- **Motivos = Colombia, sin fecha.** No sumar los 645K cancelación al no-mov de 788K (toda la operación): cancelación CO (645K) ya **supera** el no-mov estimado de CO (~541K en mayo) → o la captura es otro periodo/acumulado, o incluye cancelaciones post-movilización. **Pendiente: confirmar mes y si "rechazo" ocurre antes o después de movilizar.**

## 6 · Panel mensual por país (ene–may 2026) + acumulado YTD

### 6.1 Totales por mes (toda la operación)
| Mes | Creadas | Movilizadas | Mov% | %Ent | %Dev |
|---|---:|---:|---:|---:|---:|
| ENE | 3.886.625 | 3.140.440 | 80,8% | 72,88% | 26,90% |
| FEB | 3.527.279 | 2.866.273 | 81,3% | 73,68% | 25,91% |
| MAR | 3.951.547 | 3.236.301 | 81,9% | 73,28% | 25,99% |
| ABR | 3.863.064 | 3.162.313 | 81,9% | 72,46% | 26,04% |
| **MAY (parcial)** | 3.675.108 | 2.885.793 | 78,5% | **63,28%** | **13,13%** |
| **YTD (ene–may)** | **18.903.628** | **15.281.256** | **80,8%** | **71,22%** | **23,75%** |

> Entrega y devolución **estables** ene–abr; mayo cae en ambas (entrega por inmadurez, devolución porque las devoluciones tardan más en cerrar). Movilización ~81% estable, baja a 78,5% en mayo (−8,7%): mayo está casi completo en **creación** (−4,87% vs abr) pero inmaduro en **desenlace**.

### 6.2 % Entrega por país y mes
| País | ENE | FEB | MAR | ABR | MAY* |
|---|---:|---:|---:|---:|---:|
| Colombia | 74,10 | 75,16 | 74,77 | 74,43 | (parcial) |
| Ecuador | 70,62 | 74,23 | 72,75 | 71,59 | — |
| Chile | 71,02 | 70,68 | 70,25 | 68,46 | — |
| México | 57,04 | 56,96 | 56,92 | 56,82 | — |
| Guatemala | 67,65 | 66,26 | 69,25 | 70,01 | — |
| Paraguay | 70,78 | 74,26 | 70,76 | 70,14 | — |
| Panamá | 66,77 | 69,86 | 70,90 | 70,95 | — |
| Argentina | 63,57 | 61,15 | 52,09 | 48,75 | — |
| Perú | 51,23 | 49,06 | 52,40 | 47,75 | — |
| **Total** | **72,88** | **73,68** | **73,28** | **72,46** | **63,28** |

\* MAY por país no vino como captura propia; el corte de mayo está por transportadora en §2.4 (y el agregado en §6.1).

### 6.3 % Devolución por país y mes
| País | ENE | FEB | MAR | ABR |
|---|---:|---:|---:|---:|
| Colombia | 25,86 | 24,76 | 25,06 | 25,03 |
| Ecuador | 29,23 | 28,45 | 26,95 | 27,92 |
| Chile | 28,08 | 28,30 | 27,77 | 28,33 |
| México | 38,94 | 32,23 | 32,23 | 30,06 |
| Guatemala | 31,76 | 33,25 | 30,12 | 28,94 |
| Paraguay | 29,04 | 26,77 | 28,87 | 26,80 |
| Panamá | 33,23 | 33,23 | 29,02 | 27,87 |
| Argentina | 36,18 | 35,14 | 44,37 | 47,87 |
| Perú | 46,75 | 48,25 | 35,79 | 20,71 |
| **Total** | **26,90** | **25,91** | **25,99** | **26,04** |

> Colombia ~25% estable. **México y Argentina son los focos de devolución** (MX ~30–39%, AR sube a 44–48% en mar/abr). Argentina además entrega cada vez peor (63→49%): operación deteriorándose.

### 6.4 Acumulado YTD 2026 por país (ene–may, ~18,9M órdenes)
| País | Creadas | %Part | Movilizadas | UDS entregadas | %Ent | UDS devueltas | %Dev |
|---|---:|---:|---:|---:|---:|---:|---:|
| Colombia | 13.947.502 | 73,78% | 11.453.028 | 8.352.722 | 72,93% | 2.631.619 | 22,98% |
| Ecuador | 1.578.118 | 8,35% | 1.224.710 | 857.622 | 70,03% | 315.489 | 25,76% |
| Chile | 1.512.966 | 8,00% | 1.141.083 | 786.393 | 68,92% | 297.356 | 26,06% |
| México | 886.819 | 4,69% | 660.520 | 348.218 | 52,72% | 159.253 | 24,11% |
| Guatemala | 586.142 | 3,10% | 499.484 | 341.237 | 68,32% | 142.009 | 28,43% |
| Paraguay | 174.293 | 0,92% | 131.946 | 91.115 | 69,05% | 32.359 | 24,52% |
| Panamá | 147.613 | 0,78% | 116.023 | 78.025 | 67,25% | 31.428 | 27,09% |
| Argentina | 62.066 | 0,33% | 49.620 | 25.461 | 51,31% | 18.214 | 36,71% |
| Perú | 8.109 | 0,04% | 4.842 | 2.499 | 51,61% | 1.715 | 35,42% |
| **Total** | **18.903.628** | **100%** | **15.281.256** | **10.883.292** | **71,22%** | **3.629.442** | **23,75%** |

> **Colombia = 73,8% del volumen.** Atacar la fuga empieza por Colombia por pura masa. México pesa poco (4,7%) pero es el de peor entrega (52,7% YTD, con su brecha de medición encima).

## 7 · Enero por transportadora (prueba de madurez del cierre)
Mes **cerrado**: %sin cierre log total = **0,21%** (vs mayo 23,52%). Esto demuestra que el sin-cierre de mayo es **madurez**, no homologación rota. Total: 3.886.517 creadas · 3.140.149 mov · 72,88% ent · 26,90% dev.

| País, Transportadora | Creadas | Mov | %Ent | %Dev | %SinCierre |
|---|---:|---:|---:|---:|---:|
| Colombia, INTERRAPIDISIMO | 1.306.576 | 1.105.271 | 72,92 | 27,06 | 0,02 |
| Colombia, ENVIA | 1.129.182 | 921.774 | 75,40 | 24,54 | 0,03 |
| Chile, STARKEN | 227.934 | 171.440 | 73,75 | 25,28 | 0,98 |
| Colombia, COORDINADORA | 223.124 | 167.048 | 76,81 | 23,17 | 0,04 |
| Ecuador, SERVIENTREGA | 178.881 | 150.041 | 72,13 | 27,56 | 0,30 |
| Ecuador, GINTRACOM | 136.926 | 97.576 | 68,86 | 31,14 | — |
| Guatemala, FORZA | 106.697 | 92.452 | 68,12 | 31,23 | 0,65 |
| Colombia, VELOCES | 111.384 | 89.875 | 68,91 | 30,93 | 0,04 |
| Colombia, TCC | 79.900 | 58.099 | 75,34 | 24,55 | 0,12 |
| Chile, BLUE | 77.097 | 57.096 | 64,36 | 34,89 | 0,72 |
| Colombia, JAMV DRIVE | 45.039 | 36.169 | 72,39 | 27,55 | 0,06 |
| México, TIUI | 38.043 | 26.790 | 63,64 | 35,30 | 1,06 |
| Panamá, HL EXPRESS | 25.943 | 20.488 | 66,77 | 33,22 | — |
| México, AFIMEX | 22.144 | 15.503 | 48,17 | 51,72 | 0,11 |
| Paraguay, AEX | 21.735 | 16.651 | 69,08 | 30,69 | 0,23 |
| Ecuador, VELOCES | 18.731 | 13.581 | 68,26 | 31,74 | — |
| Colombia, DEROCHA EXPRESS | 17.597 | 14.212 | 78,41 | 21,54 | — |
| Ecuador, LAARCOURIER | 16.606 | 9.726 | 70,13 | 29,86 | 0,01 |
| México, AMPM | 14.114 | 9.695 | 54,48 | 21,92 | **23,60** |
| Guatemala, GINTRACOM | 13.892 | 11.028 | 63,76 | 36,23 | 0,02 |
| México, VELOCES | 13.389 | 9.805 | 56,27 | 43,72 | — |
| Argentina, FIXY | 10.797 | 8.237 | 63,59 | 36,17 | 0,24 |
| Paraguay, FIXY NEXTDAY | 10.030 | 8.102 | 72,99 | 26,91 | 0,10 |
| Colombia, DOMINA | 9.267 | 6.661 | 72,50 | 24,50 | 0,18 |
| Chile, VELOCES | 8.628 | 6.427 | 57,59 | 42,06 | 0,14 |
| México, COORDI | 4.617 | 2.673 | 54,66 | 45,27 | 0,07 |
| Colombia, WIILOG | 4.054 | 3.433 | 82,58 | 17,39 | — |
| Panamá, SERVIENTREGA | 3.750 | 2.956 | 66,75 | 33,25 | — |
| Ecuador, URBANO | 3.352 | 2.703 | 61,78 | 38,22 | — |
| Colombia, 99MINUTOS | 3.087 | 1.969 | 73,49 | 25,60 | 0,05 |
| Perú, FENIX | 1.525 | 1.021 | 48,19 | 49,17 | 2,64 |
| Paraguay, FIXY | 1.451 | 1.219 | 79,33 | 20,59 | 0,08 |
| **Total** | **3.886.517** | **3.140.149** | **72,88** | **26,90** | **0,21** |

> **AMPM (MX) = 23,6% sin cierre en un mes cerrado** → homologación rota real, no madurez. Es el caso a separar del resto. El resto de carriers cierran casi al 100% cuando el mes madura.

## 8 · Geografía de la entrega — por departamento (export Dpto/Ciudad)
Fuente de verdad: [`conocimiento/Data/Dpto Y Ciudad Destino (1).xlsx`](../Data/Dpto%20Y%20Ciudad%20Destino%20(1).xlsx) — 201 filas (departamentos de los 9 países) × meses ene–may, con MOV · %Ent · %Dev. Total MOV 15,29M (cuadra con §6). **Mismo patrón temporal: ene–abr estable, mayo cae** (total ABR 72,5% ent / 26,0% dev → MAY 63,3% / 13,1%).

**Gradiente dentro de Colombia (mes abril, cerrado):**
- **Mejores (núcleo andino):** QUINDÍO 81,5% · BOYACÁ 80,5% · RISARALDA 80,3% · CALDAS 79,6% · SANTANDER 78,4% · TOLIMA 77,7% · HUILA 76,4% · VALLE 75,7% · ANTIOQUIA 74,6% · CUNDINAMARCA 74,0%.
- **Peores (periferia Pacífico/Caribe/Amazonía):** CHOCÓ 64,2% · LA GUAJIRA 67,8% · BOLÍVAR 69,2% · NARIÑO 69,6% · MAGDALENA 71,1% · CAUCA 72,5% · CESAR 72,4%. Ahí la devolución sube a 28–32%.

> **Hay 12–17 puntos de entrega entre el centro y la periferia colombiana.** Esa brecha es geográfica (cobertura/distancia/dirección), no de carrier — es el insumo natural del frente de **direcciones / cobertura / same-day** y de la priorización por zona.

**Por país (abril, ejemplos):** México uniformemente bajo (CDMX 58,5% · Jalisco 61,2% · Nuevo León 62,5% · Chihuahua 59,3%); Argentina en colapso (Prov. Buenos Aires 54,7% con 45% dev; muchas provincias 30–50%). Confirma §6.2.

## 9 · Curva de madurez del cierre + reconciliación (todo cuadra)
El % de guías **sin cierre log** crece monotónicamente cuanto más reciente el mes → **prueba de que el sin-cierre es madurez, no error de medición:**

| Mes | ENE | FEB | MAR | ABR | MAY (parcial) |
|---|---:|---:|---:|---:|---:|
| **% sin cierre log** | **0,21%** | 0,40% | 0,72% | 1,50% | **23,52%** |

> Un mes cerrado queda en ~0,2–1,5%. Mayo en 23,5% = inmadurez (las entregas/devoluciones aún no cierran). Cuando mayo madure, caerá al rango de los demás. **Por eso entrega/dev de mayo no se leen; movilización sí.**

**Carriers con homologación rota** (quedan altos AUN en mes cerrado, no es madurez): **QUALITY POST (MX)** 10,5→14,4% · **AMPM (MX)** 18,6/22,4/14,4% todos los meses · menores FENIX (PE), QUVI (CO abr 23,8%). **Son la brecha de medición de México** — separar de la inmadurez general.

**Reconciliación (verificada por script):** Σ(carrier) por mes = total país por mes dentro de decenas (carriers minúsculos fuera del top); en mayo Σmov_carrier = mov_país − 8.612 (= "Mov Proc dropi", movilización propia 0,3%); Σ(meses) = acumulado YTD (§6.4). Los tres cortes (país · transportadora · departamento) cuadran. Detalle y reglas en [`Data/README.md`](../Data/README.md).

## 10 · Relación entre cortes — geografía, rutas, sellers y huecos de datos
> De los exports nativos del 26-jun (sellers · ciudades · dpto · ruta origen→destino). Todos son el mismo hecho cortado por dimensiones; modelo y llaves en [`Data/README.md`](../Data/README.md).

### 10.1 Reconciliación entre cortes (cuadra)
Movilización YTD: **país = ciudad = 15.281.256 (exacto)** · dpto 15.291.120 (+0,06%) · ruta 15.250.153 (−0,2%). Los cortes geográficos son consistentes.

### 10.2 La operación es hub-and-spoke (matriz origen→destino)
**93% inter-ciudad**; solo **6,9% intra-ciudad** (MX/CL ~0–1%). Tres orígenes concentran el despacho: **Bogotá 34,7% + Cali 10,2% + Medellín 8,6% = 53,6%** (top10 = 71,6%). → El producto es **despacho desde hub a todo el país**; same-day hoy direcciona solo ~7% del volumen.

### 10.3 La entrega la define el DESTINO, no la ruta ni el origen
Cruce ruta × %entrega-del-destino: **intra-ciudad 70,9% ≈ inter-ciudad 71,3%**; por origen-hub todos ~73%. La distancia no mueve la aguja — la mueve **la zona de destino**. Gradiente (dpto + ciudad): núcleo andino ~78–80% (Ibagué, Bucaramanga, Boyacá, Quindío) vs **periferia Pacífico/Caribe ~55–65%** (Tumaco 55,7% · Quibdó 60% · Buenaventura 65% · Soacha 64%). ⚠️ entrega **imputada** del destino (la ruta solo trae mov).

### 10.4 Sellers: concentración brutal + cobertura 88%
**623 sellers (1,3%) = 50% del volumen; 2.488 (5,2%) = 80%.** Los grandes (83% del vol, buckets 1k+) están en el baseline ~70% ent / 25% dev; sellers del **mismo tamaño van de 57% a 80% de entrega** → la **gestión del seller** (dirección, confirmación) es palanca, no solo el carrier. El archivo cubre **88% de las órdenes** (16,66M de 18,9M); el ~12% restante = órdenes **sin dropshipper asignado** (concentrado en CO 86% / PE 86%) → confirmar canal.

### 10.5 Qué se puede cruzar y qué no (marginales vs cubo)
Un cruce solo se puede hacer si las dos dimensiones **viven juntas en algún archivo**. Dos cortes marginales (ej. `carrier×mes` y `dpto×mes`) son como **totales de fila y de columna**: no permiten recuperar las celdas (`carrier×dpto`) — hay infinitas combinaciones con esos mismos totales. Estimar bajo independencia (carrier igual en toda zona) sería falso. **El cruce hay que pedirlo ya cruzado.**
- ✅ **Ya posible:** `novedad × carrier` (Novedades.xlsx, §10.6) · **`carrier × geografía × mes` con %ent/%dev** (`Ciudades destino (2).xlsx`, §10.7) · `ruta origen→destino × mov` · entrega imputada por destino.
- ⛔ **No joinable hoy (pero existe en la fuente):** `seller × geografía` (¿zona o gestión?) · `entrega/dev por ruta`. → pedir el export desde Tabla A (ya tiene seller + ciudad/dpto destino).

**Pedir:** export `carrier×dpto×mes`, `seller×ciudad (o dpto)`, `ruta con %ent/%dev` — o data a **nivel orden** (permite cualquier cruce).

> 🔓 **CORRECCIÓN (26-jun, modelo Power BI):** el "no joinable" es solo de los **archivos planos exportados**. El **modelo semántico SÍ tiene el grano de orden conectado a todas las dimensiones** (Tabla A: Pedidos + Recolecciones traen carrier + geografía + seller + estado juntos) → los cruces se **construyen en la fuente**, no hay que estimarlos. No es pedir data nueva, es **armar la vista al grano correcto**. Modelo documentado en [`Data/modelo-powerbi.md`](../Data/modelo-powerbi.md). Bonus: las **medidas de fases de despacho ya existen** (Recolecciones: Recibido_PAU→Preparado→Recogido→Entregado a Tte) → tiempo por fases computable ya.

### 10.6 Novedades × transportadora (Novedades.xlsx) — ⚠️ INUSABLE como censo de causas
Trae `novedad×carrier×país×tiempo` (2024–2026), pero al revisarlo a fondo **no sirve para dimensionar causas**, por dos defectos:
- **Es la MODA, no el censo:** 37/50 combos (país,carrier) tienen **una sola novedad** (CL 100% "RECHAZADO POR CLIENTE", PY 100% "VISITA SIN CONTACTO", EC 99% "NO CONTESTA"). Es la etiqueta dominante por carrier, no la distribución.
- **Etiquetas SIN homologar entre países** (CO "se rehúsa" · CL "rechazado" · MX "no hay quien reciba" · PE "dirección insuficiente"…) → **no se pueden sumar**.
> ❌ **Corrección (Juan, 26-jun):** el "62% es rechazo/COD-refusal" que se había anotado aquí era un **artefacto** de sumar etiquetas incomparables. **Retirado.** Además, **una novedad ≠ una guía devuelta** (la novedad es un evento intermedio; puede resolverse). El desenlace real = **UDS DEV / %DEV** (hecho duro, en los cubos) y el **motivo de cierre** (`Estados_cierre_Transportadora`, Tabla A — no exportado aún). Las causas se miran desde mov/no-mov y devolución, NO desde novedades.

### 10.7 Carrier × geografía (Ciudades destino (2).xlsx) — el cruce de oro para Selección de Transportadoras
`dpto → ciudad → transportadora × mes` con %ent/%dev. 199 dptos · 6.439 ciudades · 32 carriers · reconcilia exacto a **15.281.256**.
- **Dentro de la MISMA ciudad, elegir bien el carrier mueve 10–17 pp de entrega:** Bogotá WIILOG 82,5% vs VELOCES 65,6% (**Δ17pp**) · Barranquilla TCC 74,2% vs JAMV 59,6% (Δ15) · Cartagena ENVIA 71,7% vs INTER 59,1% (Δ13) · Cali TCC 79,4% vs INTER 69,2% (Δ10).
- **Un carrier no es bueno/malo en abstracto — depende de la zona:** VELOCES = Cali 75% · Bogotá 66% · Soacha 58% (varía 17pp). → la decisión de carrier es **por zona, no global**. Insumo directo del Sistema Inteligente de Selección de Transportadoras (PRM-1513/203).
- Ranking global (YTD, pond): ENVIA 74,6% ent · COORDINADORA 73,2% · TCC 75,1% (mejor de los grandes) · INTER 71,5% · VELOCES 68,0% · QUALITY POST 51,1% (MX, con su brecha de medición).
- **Validado en mes cerrado** (`Ciudades destino enero.xlsx`, ciudad×carrier×**país**, solo enero maduro): el gap persiste limpio — Bogotá DEROCHA 78,5% vs VELOCES 59,5% (**Δ19pp**). Con país explícito confirma que **México es bajo a nivel ciudad, no artefacto**: Chihuahua 40% · Juárez 37% · Monterrey 59% (las fronterizas, las peores). 9 países, 3.818 ciudades.

## 11 · Frente de sellers — la palanca está concentrada (Seguimiento Usuarios Dropshipper)
47.959 sellers · entrega global pond **70,4%**. (Detalle por seller —emails, volumen— en el archivo fuente; aquí lo agregado.)
- **564 "whales" (mov≥5.000) = 47% del volumen movilizado.** El frente no es 48K sellers; son unos cientos.
- Entre whales la entrega va de **34% a 90%** (mediana 71,6%) → **a igual tamaño/país, varía enorme** ⇒ es **gestión del seller** (producto, dirección, confirmación), no solo carrier ni zona.
- Calidad de whales: ~156 (27%) entregan <65%. **Oportunidad concentrada: subir los 282 whales bajo la mediana a 72% = +286.573 entregas** — atacar <300 sellers (0,6% del total) mueve la aguja.
- Casos extremos (alto volumen + entrega pésima): un seller CO con 28,6K mov entrega **34%** (quema ~18K órdenes); otro con 64K mov entrega 57,5%.
- Por país (entrega pond de sus sellers): CO 72,0% · PY 69,4% · CL 69,2% · EC 69,1% · GT 68,8% · PA 67,3% · **MX 52,6% · PE 51,6% · AR 51,5%** (MX/AR/PE mucho peor).
- ⬜ **Falta para separar causa:** `seller × zona/carrier/producto` (export desde Tabla A) → cuánto del seller-malo es su zona, su carrier o su gestión. Pero ya se ve que **no es solo zona** (whales del mismo país van de 34% a 90%).
> **Encuadre (no es rama nueva):** el seller es una **dimensión transversal** (como el país) por la que se **focaliza** el ataque a las fugas del árbol — el seller-malo alimenta Rama A (confirma mal), B (dirección), C (rechazo/pago). Vive como **Insight de concentración** pegado a esas ramas / al KR2.1, no como Proyecto OKR propio. Paralelo a la Oportunidad de Marcas PRM-1437.

## Conexión con el árbol de problemas (OKR → KR → fuga → oportunidad → Insight)
> Reanclaje (26-jun): toda esta data son **Insights** que se pegan a las ramas del [árbol objetivo](../../estrategia/arbol-okr-objetivo.md). **No** crea ramas nuevas; nutre las que ya existen. El centro son los OKR (ver [arbol-discovery-okr-jira](../../metodologia/arbol-discovery-okr-jira.md)).

**OKR1 · KR1.1 (volumen) — Rama A · Movilización (PRM-1497/1574)**
- Insight: **788K no-mov (21,4% YTD)**, ~541K CO, empeorando (−8,74% mayo). Dimensiona la fuga #1.
- Insight: **~53% del no-mov es ciego** (415K CO sin causa: "Otros"/"sin nota"/"Autorizado por gerencia") → sustenta **Idea A1: catálogo de motivos**.

**OKR2 · KR2.1 (tasa de entrega ≥70%) — el centro**
- El KR mismo: **entrega real ~72% estable** (mayo = artefacto); se mide **por país** (CO 74 · MX 57 · AR 49) → reporte del KR multi-país (OKR2 = consolidar países).
- **Rama B · Dirección+geo (PRM-1577):** Insight "la entrega tiene MAPA" — gradiente periferia Pacífico/Caribe ~55–65% vs andino ~78–80%.
- **Rama C · Devoluciones COD (PRM-1523):** Insight dev **26% estable**, concentrada MX/AR/GT; **rechazo/rehúsa = 62% de las novedades** (COD-refusal) → confirma "devolución = pago".
- **Rama D · Novedad (PRM-1512):** Insight cada carrier con su novedad característica (ENVIA→rehúsa · COORDINADORA→visita no logra · VELOCES→no hay quien reciba).
- **Rama E · Torre/tiempo por fases:** Insight sin-cierre **23,5% mayo (madurez) vs 0,21% enero**; homologación rota MX (Quality Post, AMPM). **Las medidas de fases YA existen en Power BI** (Recibido_PAU→Preparado→Recogido→Entregado_a_Tte) → desbloquea el KPI norte. Normalización PRM-1297 = tabla **Homologacion Estados** del modelo.
- **Habilitador · Selección de Transportadoras (PRM-1513/203):** Insight carrier×zona → **Δ10–19 pp entre carriers en la misma ciudad**; el mejor carrier es **por zona**, no global.

**OKR3 · KR3.1 (gross margin ≥22%) — Rama F · Tarifas (PRM-1362)**
- Habilitador de data: `suma_fletes` (Tabla A) = margen/flete medible por orden.

**Dimensiones TRANSVERSALES (segmentos, NO ramas — como el país):**
- **País:** el KR2.1 se mide/reporta por país (brecha CO 74 vs MX 57). Ya en el modelo multi-país (§6 del árbol-discovery).
- **Seller:** las fugas se **concentran** — 564 whales = 47% del volumen; **282 whales bajo la mediana = +287K entregas**. El seller-malo (vende/confirma/captura dirección mal) **alimenta las fugas A, B y C** → es la **dimensión por la que se focaliza** el ataque a las fugas (paralelo a la Oportunidad de Marcas PRM-1437 "el volumen depende de pocas cuentas"). NO es una rama nueva.
- **Producto:** Tabla G trae `ordenes_devolucion/entregadas` por `tipo_producto` → otra dimensión de segmentación de la devolución.

## Preguntas abiertas / pendientes
1. **¿De qué periodo es la captura de motivos (Colombia)?** Sin esto no se cuadra con el no-mov mensual.
2. **¿"Rechazo" pasa antes o después de movilizar?** Define si es fuga de movilización o de devolución.
3. **Cierre logístico: inmadurez vs homologación rota** → cortar por antigüedad de guía (≥30 días = homologación).
4. **Cruces que faltan en plano** (existen en la fuente, Tabla A): `seller × zona/carrier/producto` y `ruta con %ent/%dev`. (carrier×geo ✅ resuelto con Ciudades destino (2).)
5. **Confirmar el canal del archivo de sellers** (cubre 88% de las órdenes; el 12% sin dropshipper en CO/PE).
6. Refrescar mes a mes con **exports nativos** (ya llegando) en vez de capturas.
