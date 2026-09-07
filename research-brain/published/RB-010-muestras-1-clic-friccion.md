# Documento de Research: Muestras 1-Clic y Fricción Cognitiva (RB-010)

**Iniciativa Relacionada:** Solicitar Muestra 1-Clic (`PROD-MUESTRA`)
**Segmento:** Dropshippers (Exploradores / Activos)
**Fecha:** 2026-08-27
**Estado:** Publicado
**Confianza:** Alta

## 1. Problema y Contexto Conductual

Los dropshippers necesitan probar la calidad de los productos de un Supplier antes de comprometer pauta publicitaria. Actualmente, el proceso de "auto-comprarse" una muestra genera alta fricción cognitiva y técnica (deben simular ser clientes finales en sus propias tiendas). 

### Diagnóstico B=MAP
- **Ability (A):** Baja. El flujo actual obliga a romper el contexto (salir de Dropi, ir a su tienda, crear un pedido falso, volver a Dropi, confirmar el pago).
- **Sesgo - Loss Aversion:** Miedo a gastar dinero en una muestra si el producto resulta ser malo o si el proceso de pago falla.

## 2. Hallazgos del Benchmark (Exa Deep Research)

La psicología detrás de micro-compras y *sampling* revela dinámicas de fricción:
1. **Efecto Dotación (Endowment Effect):** Ofrecer pruebas fáciles permite a los usuarios "poseer" el producto mentalmente, aumentando la confianza para venderlo masivamente después.
2. **Fricción Negativa vs. Positiva:** 
   - *Negativa:* Pasos redundantes (como simular un checkout externo) destruyen la intención de compra instintiva (Sistema 1).
   - *Positiva:* Agregar un "micropause" estratégico ("Estás a punto de confirmar tu muestra a precio de proveedor") da seguridad en el pago.

## 3. Intervención Conductual Propuesta

Diseñar `PROD-MUESTRA` como una compra impulsiva segura y protegida.

- **Eliminar el salto de plataforma (Easiest beats loudest):** Incluir un botón de "Solicitar Muestra" directamente en la vista del producto en el catálogo Dropi (Sistema 1).
- **Transparencia de Costos:** Desglosar explícitamente el precio del producto + envío para reducir la aversión a la pérdida y el sesgo de ambigüedad.
- **Checkout 1-Clic:** Aprovechar si el usuario tiene saldo en su *wallet* (Dropi Pay) para omitir la carga cognitiva de meter tarjetas de crédito. 

## 4. Supuesto Más Riesgoso (RAT)
- **Supuesto:** "Si reducimos la fricción de pedir muestras, los dropshippers pedirán más muestras y, en consecuencia, escalarán campañas de los productos que validen".
- **Falsificación:** Construir un Fake Door o Wizard of Oz con un botón "Pedir Muestra"; medir la intención de clic antes de desarrollar el puente financiero complejo. Si la intención es baja, el problema no es la fricción de compra, sino el costo del producto para el seller.
