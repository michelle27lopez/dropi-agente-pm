const R = "https://cdropi.github.io/Playbook-Leyendas/Resource/Premios/";

export default function PremiosGallery() {
  return (
    <div className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:grid-cols-4">
      <figure
        className="relative col-span-2 row-span-2 m-0 overflow-hidden"
        style={{ border: "1px solid rgba(234,234,234,0.12)", background: "#111" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={R + "Cinturon_1.jpeg"} alt="Cinturón Leyendas" className="h-full w-full object-cover" />
        <figcaption
          className="absolute inset-x-0 bottom-0 px-5 py-4 text-sm font-bold uppercase tracking-[0.1em]"
          style={{ background: "linear-gradient(0deg, rgba(11,11,11,0.9), rgba(11,11,11,0))" }}
        >
          Cinturón de campeón
        </figcaption>
      </figure>
      <figure className="relative m-0 hidden overflow-hidden sm:block" style={{ border: "1px solid rgba(234,234,234,0.12)", background: "#111" }}>
        <img src={R + "Cinturon_2.jpeg"} alt="Detalle cinturón" className="h-full w-full object-cover" />
      </figure>
      <figure className="relative m-0 overflow-hidden" style={{ border: "1px solid rgba(234,234,234,0.12)", background: "#111" }}>
        <img src={R + "Caja_B.jpeg"} alt="Caja Leyendas" className="h-full w-full object-cover" />
      </figure>
      <figure className="relative m-0 hidden overflow-hidden sm:block" style={{ border: "1px solid rgba(234,234,234,0.12)", background: "#111" }}>
        <img src={R + "Caja_O.jpeg"} alt="Caja edición naranja" className="h-full w-full object-cover" />
      </figure>
      <figure className="relative m-0 overflow-hidden" style={{ border: "1px solid rgba(234,234,234,0.12)", background: "#111" }}>
        <img src={R + "Pin.jpeg"} alt="Pin de rango" className="h-full w-full object-cover" />
      </figure>
      <div
        className="col-span-2 flex flex-col justify-center gap-3 p-6"
        style={{ border: "1px solid rgba(255,133,0,0.35)", background: "linear-gradient(135deg, rgba(255,72,0,0.12), rgba(11,11,11,0))" }}
      >
        <h3 className="text-xl font-bold">Cada rango, un reconocimiento</h3>
        <p className="text-sm leading-relaxed text-[#EAEAEA]/60">
          Insignias, kits físicos, comisiones preferenciales y acceso a la comunidad de líderes Leyendas.
        </p>
      </div>
    </div>
  );
}
