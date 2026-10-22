import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkSupabaseHealth } from "@/lib/supabase/client";

const ADMIN_EMAIL = "reddixrobotics@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "reddix@2026";
const SESSION_COOKIE = "reddix_admin_token";
const SECRET_TOKEN = "reddix_robotics_auth_token_verified";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const health = await checkSupabaseHealth();

  if (token === SECRET_TOKEN) {
    return NextResponse.json({
      authenticated: true,
      email: ADMIN_EMAIL,
      isSupabaseConnected: health.configured && health.tableReady,
      supabaseStatus: health,
    });
  }

  return NextResponse.json({
    authenticated: false,
    isSupabaseConnected: health.configured && health.tableReady,
    supabaseStatus: health,
  });
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    if (
      email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
      password.trim() === ADMIN_PASSWORD
    ) {
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE, SECRET_TOKEN, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days session
      });

      return NextResponse.json({
        success: true,
        user: { email: ADMIN_EMAIL },
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid credentials. Please verify your email and security key.",
      },
      { status: 401 }
    );
  } catch (error) {
    console.error("[Auth API Error]", error);
    return NextResponse.json(
      { success: false, error: "Authentication system error." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}
