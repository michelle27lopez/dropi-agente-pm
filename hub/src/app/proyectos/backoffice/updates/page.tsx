"use client";

import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";
import WeeklyBackofficeView from "../_components/WeeklyView";
import { weeklyBackoffice } from "../_lib/data";

export default function BackofficeUpdatesPage() {
  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title="Weekly · Célula Backoffice"
        subtitle="Actualización semanal de proyectos · PO: Paula Macias"
        currentSlug="backoffice"
      />
      <main style={{ flex: 1 }}>
        <WeeklyBackofficeView weeklies={weeklyBackoffice} />
      </main>
      <HubFooter />
    </div>
  );
}
