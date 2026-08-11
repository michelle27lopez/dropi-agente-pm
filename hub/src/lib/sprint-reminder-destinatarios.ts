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
];

// PENDIENTES DE CONFIRMAR
//
// 1. jesus.garavito@dropi.co — aparece en `profiles` bajo la célula Suppliers
//    como super_admin, pero no está en `equipo_roles` de ninguna célula. No se
//    incluyó porque no sé su rol.
// 2. Kevin Paternina — figura como Product Designer de Experience en el MD de
//    la célula, pero NO existe en `profiles`. Si debe recibirlo hay que crearle
//    el perfil primero (o al menos tener su correo).
// 3. laura.torres@dropi.co — Product Ops, es quien mide el cumplimiento de
//    horas. No se incluyó como destinataria del recordatorio; si quieres que
//    le llegue copia, se agrega aparte como observadora.
//
// EXCLUIDOS a propósito: Lucho y María (stakeholders), José Pineda (Growth),
// Catherin Salazar (Growth Marketing), Nicolás Vargas y Harry Hernández
// (Fintech).
