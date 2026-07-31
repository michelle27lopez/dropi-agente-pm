---
name: project-bac001-backoffice
description: Proyecto BAC-001 - Validación de Identidad Países (KYC / KYB / KYT) de la Célula Backoffice.
metadata:
  type: project
  code: BAC-001
  celula: Backoffice
  po: Paula Macias
  pd: Catalina Giraldo
---

# Proyecto BAC-001: Validación de Identidad Países

## Visión General
- **Código:** BAC-001
- **Nombre:** Validación de Identidad Países (KYC / KYB / KYT)
- **Célula:** Backoffice (Prioridad P0 - Transversal)
- **Product Owner:** Paula Macias
- **Product Designer:** Catalina Giraldo
- **Stakeholders:** Legal, Financiero, Tesorería
- **Estado Actual:** Discovery / Definición (Fase 0 - Validación Asistida)

## Diagnóstico & Problema (AS-IS)
- **40% de validación manual en Colombia:** Entre 3.000 y 4.000 casos/mes deben ser revisados manualmente por un agente de Back Office.
- **Fallas en dispositivos Apple:** Truora no es compatible con iOS/MacBook, excluyendo a marcas y proveedores con perfil profesional.
- **Falsos positivos en extranjeros:** Truora busca por nombre y no por documento, generando homónimos y decisiones erróneas de KYC.
- **Fragmentación:** El usuario debe ingresar sus datos personales hasta 3 veces (Registro, Validación, Facturación).
- **Cero cobertura KYB:** Personas jurídicas operan sin validación formal de empresa/representante legal.
- **Cero cobertura KYT:** Retiros en Tether (USDT) procesados sin screening de wallet.

## Arquitectura de Solución (Sumsub + Truora)
- **Estrategia Mixta:** 
  - **Sumsub:** Cobertura en 240+ países, 92% de conversión automática en Colombia, tiempo de respuesta de 20s, soporte KYB (empresas) y KYT (criptowallets).
  - **Truora:** Mantenida temporalmente para KYC PN en Colombia según reglas del contrato renovado en mayo 2026.

## Plan de Fases (Roadmap)
1. **Fase 0 (Fase Actual):** Validación asistida sin desarrollo en Core (UserPilot + Webhook a API de almacenamiento).
2. **Fase 1:** Bloqueo cruzado de usuarios y documentos baneados entre países.
3. **Fase 2:** Integración nativa del flujo de validación unificado en Colombia (Formulario unificado + KYC/KYB).
4. **Fase 3:** KYT (screening de retiros y recargas en criptoactivos USDT).
5. **Fase 4:** Réplica multipaís a los 12 países LATAM.

## Métricas & Objetivos (OKRs)
- **OKR2:** Consolidar operación multipaís (KR 14 países operando).
- **Tasa de validación manual:** Reducir de 40% a < 8%.
- **Conversión automatizada:** > 92%.
- **Tiempo de respuesta:** ~20 segundos.

## Enlaces Directos en Darwin
- [Tablero de Proyecto BAC-001](http://localhost:3004/proyectos/bac-001)
- [Tablero Célula Backoffice](http://localhost:3004/celula/backoffice)
