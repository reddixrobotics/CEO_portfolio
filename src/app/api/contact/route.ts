import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  saveContactMessage,
  getContactMessages,
  markMessageRead,
  deleteContactMessage,
} from "@/lib/messages/messageService";

export const dynamic = "force-dynamic";

const SESSION_COOKIE = "reddix_admin_token";
const SECRET_TOKEN = "reddix_robotics_auth_token_verified";

async function isAuthorized(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return token === SECRET_TOKEN;
}

/**
 * GET /api/contact
 * Admin endpoint to list all received contact inquiries
 */
export async function GET() {
  const authorized = await isAuthorized();
  if (!authorized) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    const messages = await getContactMessages();
    return NextResponse.json({
      success: true,
      messages,
      unreadCount: messages.filter((m) => !m.read).length,
    });
  } catch (error: any) {
    console.error("[API contact GET error]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/contact
 * Public endpoint for contact form submission
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== "string" || !subject.trim()) {
      return NextResponse.json(
        { success: false, error: "Subject is required" },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    const saved = await saveContactMessage({
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json({
      success: true,
      message: "Transmission received and dispatched successfully",
      data: saved,
      emailSent: saved.emailSent,
    });
  } catch (error: any) {
    console.error("[API contact POST error]", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to process contact transmission",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/contact
 * Admin endpoint to toggle read/unread status
 */
export async function PATCH(req: Request) {
  const authorized = await isAuthorized();
  if (!authorized) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    const { id, read } = await req.json();
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Message ID is required" },
        { status: 400 }
      );
    }

    await markMessageRead(id, Boolean(read));
    return NextResponse.json({ success: true, id, read });
  } catch (error: any) {
    console.error("[API contact PATCH error]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update message" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/contact
 * Admin endpoint to delete a contact inquiry
 */
export async function DELETE(req: Request) {
  const authorized = await isAuthorized();
  if (!authorized) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Message ID is required" },
        { status: 400 }
      );
    }

    await deleteContactMessage(id);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("[API contact DELETE error]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete message" },
      { status: 500 }
    );
  }
}
