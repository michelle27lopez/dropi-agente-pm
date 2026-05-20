import { getCRMSnapshot, getCitasData } from "@/lib/crm-db";
import { Dashboard } from "@/components/Dashboard";

export default async function DashboardPage() {
  try {
    const [snapshot, citasData] = await Promise.all([
      getCRMSnapshot(),
      getCitasData(),
    ]);
    return <Dashboard snapshot={snapshot} citasData={citasData} />;
  } catch {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p style={{ color: "red" }}>No se pudo conectar al CRM. Revisa las variables de entorno.</p>
      </main>
    );
  }
}
