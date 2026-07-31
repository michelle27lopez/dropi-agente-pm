import { Bell, Wallet, UserCircle, Globe, ChevronDown } from "lucide-react";

export function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex-1" />
      
      <div className="flex items-center gap-6 text-sm">
        <button className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900">
          <span className="text-lg">🇺🇸</span>
          <span className="font-medium">English</span>
        </button>
        
        <div className="flex items-center gap-2 text-zinc-600 font-medium">
          <Wallet className="w-5 h-5 text-zinc-400" />
          <span>$ 0</span>
        </div>
        
        <button className="flex items-center gap-2 text-zinc-700 hover:text-zinc-900 ml-2">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
            <UserCircle className="w-6 h-6" />
          </div>
          <span className="font-medium">jaime dario</span>
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        </button>
      </div>
    </header>
  );
}
