import { redirect } from "next/navigation";

// El roadmap S2-2026 era una página hecha a mano solo de Supplier Success
// (fechas y estados hardcodeados). Se jubiló al llegar /roadmap, que arma los
// dos carriles (Product + Delivery) de todas las células desde la BD.
export default function RoadmapS2Redirect() {
  redirect("/roadmap");
}
