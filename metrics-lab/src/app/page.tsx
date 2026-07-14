import { getCRMSnapshot, getCitasData, getAgingData, getConversionData } from "@/lib/crm-db";
import { Dashboard } from "@/components/Dashboard";

export default async function DashboardPage() {
  try {
    const [snapshot, citasData, agingData, conversionData] = await Promise.all([
      getCRMSnapshot(),
      getCitasData(),
      getAgingData(),
      getConversionData(),
    ]);
    return <Dashboard snapshot={snapshot} citasData={citasData} agingData={agingData} conversionData={conversionData} />;
  } catch (e) {
    console.error(e);
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "red" }}>No se pudo conectar al CRM. Revisa las variables de entorno.</p>
      </main>
    );
  }
}
