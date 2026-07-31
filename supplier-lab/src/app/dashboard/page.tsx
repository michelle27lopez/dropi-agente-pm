import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Megaphone, CheckCircle, ClipboardList, Handshake } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Alert Banners */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium">Completa los datos personales y luego realiza la validación.</span>
          </div>
          <Button size="sm" className="bg-orange-400 hover:bg-orange-500 text-white font-semibold">
            Completar datos
          </Button>
        </div>
        
        <div className="flex items-center justify-between bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
            <span className="text-sm font-medium pr-4">
              El doble factor de autenticación pronto será obligatorio. Se te pedirá un código de verificación al iniciar sesión y al realizar operaciones sensibles como pagos con Wallet o Dropicard, gestión de usuarios y cambios de configuración o contraseña.
            </span>
          </div>
          <Button size="sm" className="bg-orange-400 hover:bg-orange-500 text-white font-semibold flex-shrink-0">
            Habilitar 2FA
          </Button>
        </div>
      </div>

      {/* Greeting */}
      <h1 className="text-2xl font-extrabold text-zinc-800 tracking-tight">
        ¡Hola, jaime dario!
      </h1>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Big Banner */}
        <div className="lg:col-span-5 relative rounded-2xl overflow-hidden bg-zinc-900 text-white min-h-[500px] flex flex-col justify-between p-8 group">
          {/* Background overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
          
          {/* Content */}
          <div className="relative z-20 text-center space-y-6 mt-8">
            <h2 className="text-4xl font-black uppercase italic tracking-wider leading-tight">
              Plataforma dropi<br/>
              <span className="text-orange-500 text-5xl">EN EVOLUCIÓN</span>
            </h2>
            <div className="bg-orange-500 text-white text-sm font-bold uppercase py-1 px-4 inline-block tracking-widest rounded-sm shadow-md">
              Últimas actualizaciones y lanzamientos<br/>que maximizarán tu negocio
            </div>
            
            <div className="space-y-3 text-sm text-zinc-300 font-medium">
              <p>Presentamos:</p>
              <ul className="space-y-2 inline-block text-left">
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-orange-500" /> Caza de productos
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-orange-500" /> Negociaciones
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-orange-500" /> Huella digital
                </li>
              </ul>
            </div>
            
            <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
              Aprende de estas actualizaciones y encuentra oportunidades para tu Ecommerce.
            </p>
          </div>

          <div className="relative z-20 flex flex-col items-center gap-4">
            <div className="flex items-center gap-4 text-lg font-bold">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-6 h-6" />
                <span className="text-2xl">12</span> <span className="text-sm font-normal uppercase text-zinc-400">Mayo</span>
              </div>
              <div className="w-px h-6 bg-zinc-600" />
              <div className="flex items-center gap-2">
                <ClockIcon className="w-6 h-6" />
                <span>18:00 HRS</span>
              </div>
            </div>
            <Button className="bg-[#ff5722] hover:bg-[#e64a19] text-white w-full max-w-[200px] font-bold text-lg rounded-full py-6">
              REGÍSTRATE AQUÍ
            </Button>
            <div className="mt-2 text-xl font-bold flex items-center gap-2 opacity-80">
              📦 dropi
            </div>
          </div>

          {/* Carousel Arrows */}
          <button className="absolute left-4 top-1/2 -translate-y-1/2 z-30 text-white/50 hover:text-white transition-colors">
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 z-30 text-white/50 hover:text-white transition-colors">
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>

        {/* Right Column: Two sections */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Info Banner */}
          <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center flex-shrink-0">
              <Megaphone className="w-6 h-6" />
            </div>
            <p className="text-zinc-600 text-sm leading-relaxed">
              ¡Sigue automatizando la comunicación de tu tienda! Chatcenter pronto estará inactivo, tanto las automatizaciones y campañas por WhatsApp Business ya no estarán disponibles en Dropi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nueva Actualización */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-800">Nueva actualización</h3>
              <div className="bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-orange-400 to-red-600 relative p-4 flex items-center justify-center text-white text-center">
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative z-10 flex flex-col items-center">
                    <h4 className="font-black text-2xl uppercase italic leading-none">RECIBE SIN FRENAR</h4>
                    <p className="text-sm font-bold">MÁS VOLUMEN, MÁS CONTROL</p>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <h4 className="font-bold text-lg leading-tight text-zinc-800">
                    ¿Recibes y registras novedades al mismo tiempo?
                  </h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Con el nuevo flujo de Ecom Scanner ya no tienes que recibir y registrar novedades al mismo tiempo: primero ingresas las devoluciones rápido, luego las revisas con orden y detalle. Menos errores, menos congestión y trazabilidad completa de cada paquete, sin importar el volumen del día.
                  </p>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold w-full">
                    Ver cómo usar
                  </Button>
                </div>
              </div>
            </div>

            {/* Capacitaciones */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-800">Capacitaciones</h3>
              <div className="space-y-3">
                <CapacitacionCard icon={BoxIcon} title="Proveedor" />
                <CapacitacionCard icon={CheckCircle} title="Garantías Proveedor" />
                <CapacitacionCard icon={ClipboardList} title="EcomScanner" />
                <CapacitacionCard icon={Handshake} title="Logística" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Helper Components
function ClockIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  );
}

function BoxIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
  );
}

function CapacitacionCard({ icon: Icon, title }: { icon: any, title: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-orange-500 text-white flex items-center justify-center shadow-inner">
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-semibold text-zinc-800 text-sm">{title}</span>
      </div>
      <Button size="sm" variant="outline" className="text-orange-500 border-orange-200 hover:bg-orange-50">
        Agendarme
      </Button>
    </div>
  );
}
