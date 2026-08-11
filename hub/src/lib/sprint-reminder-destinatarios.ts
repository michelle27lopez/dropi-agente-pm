// Quién recibe el recordatorio de arranque de sprint.
//
// Lista explícita a propósito: `profiles` tiene a todo el mundo (Growth,
// Fintech, stakeholders) y un envío a la persona equivocada no se puede
// deshacer. Aquí solo van las duplas del área de producto.
//
// Roles inferidos de `equipo_roles` en celulas-development.json (repo HOP)
// cruzado con la tabla `profiles`. PENDIENTE DE CONFIRMAR por Jaime — ver
// PENDIENTES al final del archivo.

import type { Destinatario } from "./sprint-reminder";

export const DESTINATARIOS: Destinatario[] = [
  // ── Sellers ────────────────────────────────────────────────
  { email: "santiago.herrera@dropi.co",   nombre: "Santiago Herrera",   celula: "Sellers",     rol: "PM" },
  { email: "alejandra.melo@dropi.co",     nombre: "Alejandra Melo",     celula: "Sellers",     rol: "PD" },

  // ── Brands ─────────────────────────────────────────────────
  { email: "katerine.pencue@dropi.co",    nombre: "Katerine Pencue",    celula: "Brands",      rol: "PM" },
  { email: "francisco.velandia@dropi.co", nombre: "Francisco Velandia", celula: "Brands",      rol: "PD" },

  // ── Logística ──────────────────────────────────────────────
  { email: "juan.bautista@dropi.co",      nombre: "Juan Diego Bautista", celula: "Logística",  rol: "PM" },
  { email: "michel.pino@dropi.co",        nombre: "Michel Pino",         celula: "Logística",  rol: "PD" },

  // ── Backoffice ─────────────────────────────────────────────
  { email: "paula.macias@dropi.co",       nombre: "Paula Macías",       celula: "Backoffice",  rol: "PO" },

  // ── Suppliers ──────────────────────────────────────────────
  { email: "jaime.guevara@dropi.co",      nombre: "Jaime Guevara",      celula: "Suppliers",   rol: "PM" },
  { email: "michelle.lopez@dropi.co",     nombre: "Michelle López",     celula: "Suppliers",   rol: "PD" },

  // ── Experience ─────────────────────────────────────────────
  { email: "diana.aldana@dropi.co",       nombre: "Diana Aldana",       celula: "Experience",  rol: "PM" },
  { email: "catalina.giraldo@dropi.co",   nombre: "Catalina Giraldo",   celula: "Experience",  rol: "PD" },

  // ── Diseño (lead) ──────────────────────────────────────────
  { email: "laura.contreras@dropi.co",    nombre: "Laura Contreras",    celula: "Product Designers", rol: "PD" },

  // ── Growth ─────────────────────────────────────────────────
  { email: "jose.pineda@dropi.co",        nombre: "José Pineda",        celula: "Growth",            rol: "PM" },

  // ── Growth Marketing ───────────────────────────────────────
  { email: "catherin.salazar@dropi.co",   nombre: "Catherin Salazar",   celula: "Growth Marketing",  rol: "PM" },
  { email: "laura.torres@dropi.co",       nombre: "Laura Torres",       celula: "Growth Marketing",  rol: "PO" },

  // ── Fintech ────────────────────────────────────────────────
  { email: "harry.hernandez@dropi.co",    nombre: "Harry Hernández",    celula: "Fintech",           rol: "PM" },
  { email: "nicolas.vargas@dropi.co",     nombre: "Nicolás Vargas",     celula: "Fintech",           rol: "PD" },
];

// Sobre el campo `rol`: es metadato interno, el mensaje no lo muestra —
// solo agrupa nombres por célula. Donde no estaba documentado se dedujo del
// campo `lead` de la tabla `celulas` (el lead se marca PM). Laura Torres es
// Product Ops: entra porque pertenece a Growth Marketing, y además es quien
// mide el cumplimiento de horas.
//
// EXCLUIDOS a propósito (confirmado con Jaime, 2026-08-11):
//   · Lucho y María — stakeholders, no ejecutan sprint
//   · Jesús Garavito — seguridad, no es del equipo
//   · Kevin Paternina — comercial, no es del equipo (tampoco está en `profiles`)
