"use client";

import React, { useState } from "react";
import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";
import { Bell, Send, CheckCircle2, MessageSquare, Mail, Zap, Smartphone, Sparkles, Code, Filter, Copy, Check } from "lucide-react";

interface NotificationTrigger {
  id: string;
  module: string;
  eventName: string;
  title: string;
  description: string;
  triggerCondition: string;
  channels: {
    userpilot: boolean;
    whatsapp: boolean;
    email: boolean;
    push: boolean;
  };
  attributes: {
    name: string;
    type: string;
    example: string;
    desc: string;
  }[];
  payloadSample: Record<string, any>;
  targetRole: "Dropshipper" | "Supplier" | "Marca" | "Todos";
  status: "Definido" | "En Producción" | "Pendiente TI";
}

const TRIGGERS_DATA: NotificationTrigger[] = [
  {
    id: "NOTIF-001",
    module: "Registro & Onboarding",
    eventName: "onboarding:account_created",
    title: "Bienvenida & Primeros Pasos",
    description: "Se dispara inmediatamente cuando un comercio crea su cuenta en Dropi exitosamente.",
    triggerCondition: "Registro completado en la pantalla /auth/register",
    channels: { userpilot: true, whatsapp: true, email: true, push: false },
    attributes: [
      { name: "user_id", type: "String", example: '"818136"', desc: "ID único del usuario" },
      { name: "email", type: "String", example: '"comercio@dropi.co"', desc: "Correo registrado" },
      { name: "name", type: "String", example: '"María"', desc: "Nombre del usuario" },
      { name: "phone", type: "Number", example: '"3225903618"', desc: "Teléfono WhatsApp" },
      { name: "role", type: "String", example: '"dropshipper"', desc: "Rol asignado" },
      { name: "country_code", type: "String", example: '"CO"', desc: "País de operación" },
      { name: "referred_by", type: "String", example: '"COMMUNITY_IVAN"', desc: "Comunidad / Referidor" }
    ],
    payloadSample: {
      event: "onboarding:account_created",
      user_id: "818136",
      name: "María",
      phone: "+573225903618",
      role: "dropshipper",
      country: "CO"
    },
    targetRole: "Todos",
    status: "En Producción"
  },
  {
    id: "NOTIF-002",
    module: "Pedidos & Activación Bruta",
    eventName: "orders:first_order_created",
    title: "¡Primera Orden Creada! (TTFO)",
    description: "Alerta de celebración cuando el dropshipper o marca genera su primera orden en plataforma.",
    triggerCondition: "Inserción de orden exitosa (manual o vía Shopify/WooCommerce)",
    channels: { userpilot: true, whatsapp: true, email: true, push: true },
    attributes: [
      { name: "user_id", type: "String", example: '"818136"', desc: "ID del comercio" },
      { name: "order_id", type: "String", example: '"ORD-99182"', desc: "ID de la orden" },
      { name: "order_total", type: "Number", example: "85000", desc: "Monto en COP/USD" },
      { name: "shop", type: "String", example: '"SHOPIFY-MI-TIENDA"', desc: "Canal de venta" },
      { name: "delivery_type", type: "String", example: '"CON RECAUDO"', desc: "Modalidad de recaudo" }
    ],
    payloadSample: {
      event: "orders:first_order_created",
      user_id: "818136",
      order_id: "ORD-99182",
      order_total: 85000,
      channel: "Shopify"
    },
    targetRole: "Dropshipper",
    status: "Definido"
  },
  {
    id: "NOTIF-003",
    module: "Pedidos & Activación Neta (TTV)",
    eventName: "orders:first_order_delivered",
    title: "¡Primera Orden Entregada! (TTV Neto)",
    description: "El hito más importante: confirma que la orden fue entregada al cliente final y se habilitó la ganancia.",
    triggerCondition: "Cambio de estado de guía a 'ENTREGADO' por la transportadora",
    channels: { userpilot: true, whatsapp: true, email: true, push: true },
    attributes: [
      { name: "user_id", type: "String", example: '"818136"', desc: "ID del seller" },
      { name: "order_id", type: "String", example: '"ORD-99182"', desc: "ID de la orden" },
      { name: "carrier", type: "String", example: '"Envia"', desc: "Transportadora" },
      { name: "supplier_id", type: "String", example: '"245055"', desc: "ID del proveedor" },
      { name: "delivery_date", type: "Timestamp", example: '"2026-08-05 10:30"', desc: "Fecha de entrega" }
    ],
    payloadSample: {
      event: "orders:first_order_delivered",
      user_id: "818136",
      order_id: "ORD-99182",
      carrier: "Envia",
      profit_available: true
    },
    targetRole: "Todos",
    status: "Definido"
  },
  {
    id: "NOTIF-004",
    module: "Recuperación & Novedades",
    eventName: "orders:order_canceled",
    title: "Alerta de Cancelación / Novedad",
    description: "Notificación preventiva cuando una orden entra en novedad o es cancelada por datos incompletos.",
    triggerCondition: "Estado de orden cambia a 'CANCELADA' o 'NOVEDAD_DIRECCION'",
    channels: { userpilot: false, whatsapp: true, email: true, push: true },
    attributes: [
      { name: "user_id", type: "String", example: '"818136"', desc: "ID del seller" },
      { name: "order_id", type: "String", example: '"ORD-99182"', desc: "ID de la orden" },
      { name: "canceled_type", type: "String", example: '"datos_incompletos"', desc: "Causa de cancelación" },
      { name: "customer_phone", type: "String", example: '"+573001234567"', desc: "WhatsApp cliente final" }
    ],
    payloadSample: {
      event: "orders:order_canceled",
      user_id: "818136",
      order_id: "ORD-99182",
      reason: "datos_incompletos",
      recovery_url: "https://dropi.co/dashboard/novelties"
    },
    targetRole: "Dropshipper",
    status: "Pendiente TI"
  },
  {
    id: "NOTIF-005",
    module: "Wallet & Finanzas",
    eventName: "withdrawals:withdrawal_requested",
    title: "Confirmación de Retiro de Ganancias",
    description: "Notificación de confirmación cuando el usuario solicita la transferencia de sus ganancias de la Wallet.",
    triggerCondition: "Solicitud de retiro procesada en la pantalla /dashboard/wallet",
    channels: { userpilot: true, whatsapp: true, email: true, push: false },
    attributes: [
      { name: "user_id", type: "String", example: '"818136"', desc: "ID del usuario" },
      { name: "withdrawal_amount", type: "Number", example: "450000", desc: "Monto a retirar" },
      { name: "withdrawal_method", type: "String", example: '"Transfer between wallets"', desc: "Método de pago" },
      { name: "date_withdrawal_request", type: "Timestamp", example: '"2026-08-05 10:40"', desc: "Fecha de solicitud" }
    ],
    payloadSample: {
      event: "withdrawals:withdrawal_requested",
      user_id: "818136",
      amount: 450000,
      method: "Wallet Transfer",
      status: "COMPLETED"
    },
    targetRole: "Todos",
    status: "Definido"
  },
  {
    id: "NOTIF-006",
    module: "Catálogo & Stock",
    eventName: "product:favorite_added",
    title: "Alerta de Cambio de Stock / Precio en Favorito",
    description: "Dispara alertas cuando un producto guardado en favoritos recibe reabastecimiento o baja comisión.",
    triggerCondition: "Actualización de inventario por proveedor en producto marcado como favorito",
    channels: { userpilot: true, whatsapp: true, email: false, push: true },
    attributes: [
      { name: "user_id", type: "String", example: '"818136"', desc: "ID del comercio" },
      { name: "product_id", type: "String", example: '"2014760"', desc: "ID de producto" },
      { name: "supplier_id", type: "String", example: '"245055"', desc: "ID del proveedor" },
      { name: "stock_quantity", type: "Number", example: "500", desc: "Nuevo stock disponible" }
    ],
    payloadSample: {
      event: "product:favorite_added",
      user_id: "818136",
      product_id: "2014760",
      new_stock: 500,
      price_drop: true
    },
    targetRole: "Dropshipper",
    status: "En Producción"
  }
];

export default function NotificacionesModulePage() {
  const [selectedModule, setSelectedModule] = useState<string>("Todos");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeChannel, setActiveChannel] = useState<string>("Todos");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTrigger, setSelectedTrigger] = useState<NotificationTrigger>(TRIGGERS_DATA[0]);

  const modules = ["Todos", "Registro & Onboarding", "Pedidos & Activación Bruta", "Pedidos & Activación Neta (TTV)", "Recuperación & Novedades", "Wallet & Finanzas", "Catálogo & Stock"];

  const filteredTriggers = TRIGGERS_DATA.filter((item) => {
    const matchesModule = selectedModule === "Todos" || item.module === selectedModule;
    const matchesChannel =
      activeChannel === "Todos" ||
      (activeChannel === "WhatsApp" && item.channels.whatsapp) ||
      (activeChannel === "Userpilot" && item.channels.userpilot) ||
      (activeChannel === "Email" && item.channels.email) ||
      (activeChannel === "Push" && item.channels.push);
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesModule && matchesChannel && matchesSearch;
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0f172a", color: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      <HubHeader
        title="Módulo de Notificaciones 360 (PROD-1664 / PRM-1305)"
        subtitle="Catálogo Canónico de Triggers, Eventos y Payloads para UX/UI (Alejandra Melo) y TI (Jose Giraldo)"
        currentSlug="sellers"
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        
        {/* Banner de Destrabe */}
        <div style={{
          background: "linear-gradient(135deg, rgba(255, 107, 53, 0.15) 0%, rgba(247, 127, 0, 0.05) 100%)",
          border: "1px solid rgba(255, 107, 53, 0.4)",
          borderRadius: 16,
          padding: "20px 24px",
          marginBottom: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "linear-gradient(135deg, #ff6b35 0%, #e0531f 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              boxShadow: "0 0 20px rgba(255, 107, 53, 0.4)",
              flexShrink: 0
            }}>
              ⚡
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#ffffff", display: "flex", alignItems: "center", gap: 10 }}>
                Catálogo de Triggers & Eventos Desbloqueado
                <span style={{ fontSize: 11, background: "rgba(16, 185, 129, 0.2)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.4)", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
                  ● Listo para Handoff a TI
                </span>
              </div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
                Especificaciones exactas de disparo para WhatsApp (CRM), Userpilot (In-App), Email (Zeptomail) y Firebase Push.
              </div>
            </div>
          </div>
          
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => copyToClipboard(JSON.stringify(TRIGGERS_DATA, null, 2), "all")}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#ffffff",
                padding: "10px 16px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >
              {copiedId === "all" ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
              <span>Exportar JSON Completo</span>
            </button>
          </div>
        </div>

        {/* Filtros y Buscador */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          
          {/* Canales Tabs */}
          <div style={{ display: "flex", background: "#1e293b", padding: 4, borderRadius: 12, border: "1px solid #334155" }}>
            {["Todos", "WhatsApp", "Userpilot", "Email", "Push"].map((ch) => (
              <button
                key={ch}
                onClick={() => setActiveChannel(ch)}
                style={{
                  background: activeChannel === ch ? "#ff6b35" : "transparent",
                  color: activeChannel === ch ? "#ffffff" : "#94a3b8",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                {ch}
              </button>
            ))}
          </div>

          {/* Buscador */}
          <div style={{ position: "relative", minWidth: 320 }}>
            <input
              type="text"
              placeholder="Buscar evento (ej: account_created, first_order)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: 10,
                padding: "10px 14px 10px 38px",
                color: "#ffffff",
                fontSize: 13,
                outline: "none"
              }}
            />
            <Filter size={16} style={{ position: "absolute", left: 12, top: 12, color: "#64748b" }} />
          </div>
        </div>

        {/* Módulos Filter Pills */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, marginBottom: 24 }}>
          {modules.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedModule(m)}
              style={{
                background: selectedModule === m ? "rgba(255, 107, 53, 0.2)" : "#1e293b",
                border: `1px solid ${selectedModule === m ? "#ff6b35" : "#334155"}`,
                color: selectedModule === m ? "#ff6b35" : "#94a3b8",
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Layout Principal: Lista de Triggers (Izq) + Visor de Payload (Der) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 24 }}>
          
          {/* Lista de Triggers */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filteredTriggers.map((trig) => {
              const isSelected = selectedTrigger.id === trig.id;
              return (
                <div
                  key={trig.id}
                  onClick={() => setSelectedTrigger(trig)}
                  style={{
                    background: isSelected ? "#1e293b" : "#0f172a",
                    border: `1.5px solid ${isSelected ? "#ff6b35" : "#1e293b"}`,
                    borderRadius: 14,
                    padding: "20px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: isSelected ? "0 4px 20px rgba(255, 107, 53, 0.15)" : "none"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 800, color: "#ff6b35", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                        {trig.module} · {trig.id}
                      </span>
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: "#ffffff", marginTop: 2, marginBottom: 4 }}>
                        {trig.title}
                      </h3>
                    </div>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: "3px 10px",
                      borderRadius: 12,
                      background: trig.status === "En Producción" ? "rgba(16,185,129,0.15)" : trig.status === "Definido" ? "rgba(59,130,246,0.15)" : "rgba(245,158,11,0.15)",
                      color: trig.status === "En Producción" ? "#10b981" : trig.status === "Definido" ? "#60a5fa" : "#fbbf24",
                      border: `1px solid ${trig.status === "En Producción" ? "rgba(16,185,129,0.3)" : trig.status === "Definido" ? "rgba(59,130,246,0.3)" : "rgba(245,158,11,0.3)"}`
                    }}>
                      {trig.status}
                    </span>
                  </div>

                  <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5, marginBottom: 16 }}>
                    {trig.description}
                  </p>

                  <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, fontSize: 12, color: "#cbd5e1", fontFamily: "monospace", marginBottom: 16 }}>
                    ⚡ Evento: <span style={{ color: "#38bdf8", fontWeight: 700 }}>{trig.eventName}</span>
                  </div>

                  {/* Canales Mapeados */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Canales:</span>
                      {trig.channels.whatsapp && (
                        <span style={{ fontSize: 11, background: "rgba(34, 197, 94, 0.15)", color: "#4ade80", padding: "2px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 4 }}>
                          <MessageSquare size={12} /> WhatsApp
                        </span>
                      )}
                      {trig.channels.userpilot && (
                        <span style={{ fontSize: 11, background: "rgba(168, 85, 247, 0.15)", color: "#c084fc", padding: "2px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 4 }}>
                          <Zap size={12} /> Userpilot
                        </span>
                      )}
                      {trig.channels.email && (
                        <span style={{ fontSize: 11, background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", padding: "2px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 4 }}>
                          <Mail size={12} /> Email
                        </span>
                      )}
                      {trig.channels.push && (
                        <span style={{ fontSize: 11, background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", padding: "2px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 4 }}>
                          <Smartphone size={12} /> Push
                        </span>
                      )}
                    </div>

                    <span style={{ fontSize: 12, color: "#ff6b35", fontWeight: 700 }}>Ver Especificaciones →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visor de Payload & Atributos (Derecha) */}
          <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 16, padding: "24px", position: "sticky", top: 24, height: "fit-content" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #334155" }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#ff6b35", textTransform: "uppercase" }}>Especificación de Disparo</span>
                <h4 style={{ fontSize: 16, fontWeight: 800, color: "#ffffff", marginTop: 2 }}>{selectedTrigger.title}</h4>
              </div>
              <button
                onClick={() => copyToClipboard(JSON.stringify(selectedTrigger.payloadSample, null, 2), selectedTrigger.id)}
                style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#ffffff", padding: "6px 10px", borderRadius: 8, fontSize: 12, cursor: "pointer" }}
              >
                {copiedId === selectedTrigger.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
            </div>

            {/* Condición de Disparo */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 4 }}>Condición de Trigger:</div>
              <div style={{ fontSize: 13, color: "#f8fafc", background: "#0f172a", padding: "10px 14px", borderRadius: 8, border: "1px solid #334155" }}>
                {selectedTrigger.triggerCondition}
              </div>
            </div>

            {/* Variables & Atributos Requeridos */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 8 }}>Atributos y Variables de Contexto ({selectedTrigger.attributes.length}):</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 220, overflowY: "auto", paddingRight: 4 }}>
                {selectedTrigger.attributes.map((attr, idx) => (
                  <div key={idx} style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, fontSize: 12, border: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <span style={{ color: "#38bdf8", fontWeight: 700, fontFamily: "monospace" }}>{attr.name}</span>
                      <span style={{ color: "#a855f7", fontSize: 10, fontWeight: 700 }}>{attr.type}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{attr.desc} (Ej: <span style={{ color: "#cbd5e1" }}>{attr.example}</span>)</div>
                  </div>
                ))}
              </div>
            </div>

            {/* JSON Payload Sample */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 6 }}>Payload JSON para Backend / Userpilot:</div>
              <pre style={{
                background: "#090d16",
                padding: "14px",
                borderRadius: 10,
                fontSize: 12,
                color: "#4ade80",
                fontFamily: "'Fira Code', monospace",
                overflowX: "auto",
                border: "1px solid #1e293b",
                margin: 0
              }}>
                {JSON.stringify(selectedTrigger.payloadSample, null, 2)}
              </pre>
            </div>
          </div>

        </div>

      </div>
      <HubFooter />
    </main>
  );
}
