import { NextRequest, NextResponse } from "next/server";
import { MOCK_USERS } from "../../../../proyectos/leyendas-dropi/mock/user";
import { TIERS } from "../../../../proyectos/leyendas-dropi/mock/tiers";
import type { UserLevelSummary } from "../../../../proyectos/leyendas-dropi/types";
import { otpStore } from "@/lib/otp-store";

function buildUserSummaryFromMock(email: string): UserLevelSummary | null {
  // Look up in mock users
  const known = MOCK_USERS[email.toLowerCase()];
  if (known) return known;

  // If email not found in mock, generate a "Bienvenido" profile
  return {
    email,
    displayName: email.split("@")[0].replace(/[._]/g, " "),
    currentTierId: 0,
    currentSubLevelCode: "unica",
    ordersThisMonth: 0,
    growthPct: 0,
    lastActivityIso: new Date().toISOString().split("T")[0],
    points: 0,
    months: [],
  };
}

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Correo y código requeridos" }, { status: 400 });
    }

    // Get OTP challenge from store
    const challenge = otpStore.get(email);

    // In development, accept code "000000" as universal bypass for quick testing
    const isDev = process.env.NODE_ENV === "development";
    const isDevBypass = isDev && code === "000000";

    if (!isDevBypass) {
      if (!challenge) {
        return NextResponse.json(
          { error: "No hay un código activo para este correo. Solicita uno nuevo." },
          { status: 401 }
        );
      }

      if (challenge.consumedAt) {
        return NextResponse.json(
          { error: "Este código ya fue utilizado. Solicita uno nuevo." },
          { status: 401 }
        );
      }

      if (Date.now() > challenge.expiresAt) {
        otpStore.delete(email);
        return NextResponse.json(
          { error: "El código ha expirado. Solicita uno nuevo." },
          { status: 401 }
        );
      }

      if (challenge.attemptsLeft <= 0) {
        return NextResponse.json(
          { error: "Has agotado los intentos. Solicita un nuevo código." },
          { status: 429 }
        );
      }

      if (challenge.code !== code) {
        // Decrement attempts
        otpStore.set(email, { ...challenge, attemptsLeft: challenge.attemptsLeft - 1 });
        const remaining = challenge.attemptsLeft - 1;
        return NextResponse.json(
          {
            error:
              remaining > 0
                ? `Código incorrecto. Te quedan ${remaining} intento${remaining === 1 ? "" : "s"}.`
                : "Código incorrecto. Has agotado los intentos. Solicita uno nuevo.",
            attemptsLeft: remaining,
          },
          { status: 401 }
        );
      }

      // Mark as consumed
      otpStore.set(email, { ...challenge, consumedAt: Date.now() });
    }

    // Get user data — try Supabase first, fallback to mock
    let userData: UserLevelSummary | null = null;

    // Supabase integration (optional — only if env vars are set)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_KEY
        );

        // Look up seller
        const { data: seller } = await supabase
          .from("sellers")
          .select("id, email, display_name")
          .eq("email", email.toLowerCase())
          .single();

        if (seller) {
          // Get last 3 month snapshots
          const { data: snapshots } = await supabase
            .from("seller_month_snapshots")
            .select("*, tiers(name)")
            .eq("seller_id", seller.id)
            .order("month_date", { ascending: false })
            .limit(3);

          const months = (snapshots ?? [])
            .reverse()
            .map((s: {
              month_date: string;
              tier_id: number;
              sub_level_code: string;
              orders_delivered: number;
              leveled_up: boolean;
            }) => {
              const d = new Date(s.month_date);
              return {
                monthLabel: d.toLocaleString("es-CO", { month: "long" }),
                isoDate: s.month_date,
                tierId: s.tier_id,
                subLevelCode: s.sub_level_code,
                ordersDelivered: s.orders_delivered,
                leveledUp: s.leveled_up,
              };
            });

          const current = months[months.length - 1];
          const prev = months[months.length - 2];
          const growthPct =
            prev && prev.ordersDelivered > 0
              ? Math.round(((current.ordersDelivered - prev.ordersDelivered) / prev.ordersDelivered) * 100)
              : 0;

          // Calculate points (1.8x orders)
          const points = Math.round((current?.ordersDelivered ?? 0) * 1.8);

          userData = {
            email: seller.email,
            displayName: seller.display_name,
            currentTierId: current?.tierId ?? 0,
            currentSubLevelCode: current?.subLevelCode ?? "unica",
            ordersThisMonth: current?.ordersDelivered ?? 0,
            growthPct,
            lastActivityIso: new Date().toISOString().split("T")[0],
            points,
            months,
          };
        }
      } catch (dbErr) {
        console.warn("[OTP Verify] Supabase error, falling back to mock:", dbErr);
      }
    }

    // Fallback to mock data
    if (!userData) {
      userData = buildUserSummaryFromMock(email);
    }

    if (!userData) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Validate tier data integrity
    const tier = TIERS[userData.currentTierId];
    if (!tier) {
      userData.currentTierId = 0;
      userData.currentSubLevelCode = "unica";
    }

    return NextResponse.json(userData);
  } catch (err) {
    console.error("[OTP Verify Error]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
