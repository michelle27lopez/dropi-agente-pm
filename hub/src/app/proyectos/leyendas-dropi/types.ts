export type TierName =
  | "Bienvenido"
  | "Explorador"
  | "Master"
  | "Experto"
  | "Sabio VIP"
  | "Leyenda";

export interface SubLevel {
  code: string; // "I" | "II" | "III" | "unica"
  label: string; // "Subnivel I"
  minOrders: number;
  maxOrders: number | null; // null = rango abierto (+20000)
  badgeUrl: string | null; // null = medalla pendiente de diseño
}

export interface Tier {
  id: number; // 0..5, orden de progresión
  name: TierName;
  eyebrow: string; // "01".."06" (rango autoritativo del playbook)
  minOrders: number;
  maxOrders: number | null;
  subLevels: SubLevel[];
}

export interface UserMonthSnapshot {
  monthLabel: string; // "Junio"
  isoDate: string; // "2026-06-01"
  tierId: number;
  subLevelCode: string;
  ordersDelivered: number;
  leveledUp: boolean;
}

export interface CommunityTopDropshipper {
  name: string;
  orders: number;
}

export interface CommunityTopCategory {
  name: string;
  pct: number; // % del volumen de la comunidad
}

// Forma provisional — José la va a refinar cuando tenga las métricas
// definitivas de líder de comunidad; hasta entonces esto alimenta el tab
// "Líder de comunidad" en la pantalla de sesión.
export interface CommunityLeaderInfo {
  name: string;
  memberCount: number;
  activityRatePct: number; // % de la comunidad con al menos 1 orden en 30 días
  zombieCount: number; // miembros sin actividad reciente
  bestSalesDay: { label: string; orders: number };
  topDropshippers: CommunityTopDropshipper[];
  topCategories: CommunityTopCategory[];
  hazanas: string[]; // hitos/logros destacados de la comunidad
}

export interface UserLevelSummary {
  email: string;
  displayName: string;
  currentTierId: number;
  currentSubLevelCode: string;
  ordersThisMonth: number;
  growthPct: number;
  lastActivityIso: string;
  points: number;
  months: UserMonthSnapshot[]; // últimos 3, orden cronológico
  community?: CommunityLeaderInfo; // presente solo si además es líder de comunidad
}

export interface OtpChallenge {
  email: string;
  code: string; // 6 dígitos, generado server-side
  expiresAt: string; // ISO
  attemptsLeft: number;
}
