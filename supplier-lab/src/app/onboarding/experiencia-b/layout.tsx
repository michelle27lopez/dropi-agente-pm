export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Topbar limpia */}
      <header className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between shadow-sm shrink-0 z-50 relative">
        <div className="flex items-center gap-2">
          <img 
            src="https://d1l4mzebo786pw.cloudfront.net/image/input/white-labels/1/logos/secondary_logo/logo-naranja.png" 
            alt="Dropi Logo" 
            className="h-7 object-contain"
          />
        </div>
        <div className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">
          Supplier Activation
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-4xl">
          {children}
        </div>
      </main>
    </div>
  );
}
