import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { ChecklistPopup } from "@/components/shared/ChecklistPopup";
import { OnboardingWizard } from "@/components/shared/OnboardingWizard";
import { AdminLabControls } from "@/components/shared/AdminLabControls";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-zinc-50 overflow-hidden text-zinc-900 font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
        {/* The floating checklist widget */}
        <ChecklistPopup />
      </div>
      
      {/* Laboratorio: Wizard Inicial y Controles Admin */}
      <OnboardingWizard />
      <AdminLabControls />
    </div>
  );
}
