import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { getSupabaseClient } from "../supabase/client";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
  emailSent?: boolean;
  emailError?: string;
}

const MESSAGES_FILE = path.join(process.cwd(), "public", "contact-messages.json");
const RECIPIENT_EMAIL = "reddixrobotics@gmail.com";

function readLocalMessages(): ContactMessage[] {
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      const raw = fs.readFileSync(MESSAGES_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("[MessageService] Could not read local messages fallback:", err);
  }
  return [];
}

function writeLocalMessages(messages: ContactMessage[]): void {
  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), "utf-8");
  } catch (err) {
    console.warn("[MessageService] Could not write local messages fallback:", err);
  }
}

/**
 * Sends email notification to reddixrobotics@gmail.com
 */
export async function sendEmailNotification(
  msg: ContactMessage
): Promise<{ success: boolean; error?: string }> {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER || process.env.GMAIL_USER || RECIPIENT_EMAIL;
  const pass =
    process.env.SMTP_PASS ||
    process.env.GMAIL_APP_PASSWORD ||
    process.env.SMTP_PASSWORD ||
    "";
  const resendKey = process.env.RESEND_API_KEY;

  // 1. Try Resend if configured
  if (resendKey) {
    try {
      const fromAddr = process.env.RESEND_FROM || "Reddix Contact <onboarding@resend.dev>";
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddr,
          to: [RECIPIENT_EMAIL],
          reply_to: msg.email,
          subject: `[Reddix CEO Portal] ${msg.subject} - from ${msg.name}`,
          html: generateEmailHtml(msg),
        }),
      });
      if (res.ok) {
        return { success: true };
      }
      const data = await res.json().catch(() => ({}));
      console.warn("[MessageService] Resend send warning:", data);
    } catch (err: any) {
      console.warn("[MessageService] Resend API error:", err);
    }
  }

  // 2. Try Nodemailer SMTP (e.g. Gmail App Password)
  if (pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      await transporter.sendMail({
        from: `"Reddix Robotics Transmission" <${user}>`,
        to: RECIPIENT_EMAIL,
        replyTo: `"${msg.name}" <${msg.email}>`,
        subject: `[Reddix CEO Inquiry] ${msg.subject} (from ${msg.name})`,
        text: `New transmission received from ${msg.name} <${msg.email}>\n\nSubject: ${msg.subject}\n\nMessage:\n${msg.message}\n\nReceived: ${msg.createdAt}`,
        html: generateEmailHtml(msg),
      });

      return { success: true };
    } catch (smtpErr: any) {
      console.error("[MessageService] SMTP send error:", smtpErr);
      return { success: false, error: smtpErr?.message || "SMTP error" };
    }
  }

  // If credentials aren't set in env yet
  const note =
    "Email saved to Admin Dashboard. (To enable automated SMTP sending directly to Gmail, set SMTP_PASS / GMAIL_APP_PASSWORD or RESEND_API_KEY in environment variables).";
  console.info(`[MessageService] ${note}`);
  return { success: false, error: note };
}

function generateEmailHtml(msg: ContactMessage): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #030712; color: #f3f4f6; margin: 0; padding: 24px; }
          .card { max-width: 600px; margin: 0 auto; background: #0b1329; border: 1px solid #00D9FF; border-radius: 12px; overflow: hidden; box-shadow: 0 0 30px rgba(0,217,255,0.2); }
          .header { background: linear-gradient(135deg, #020617 0%, #082f49 100%); padding: 20px 24px; border-bottom: 1px solid rgba(0,217,255,0.3); }
          .tag { font-family: monospace; font-size: 11px; font-weight: bold; letter-spacing: 0.2em; color: #00D9FF; text-transform: uppercase; }
          .title { font-size: 20px; font-weight: 800; color: #ffffff; margin: 6px 0 0 0; }
          .content { padding: 24px; }
          .field { margin-bottom: 16px; }
          .label { font-family: monospace; font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 4px; }
          .value { font-size: 15px; color: #ffffff; font-weight: 600; }
          .message-box { background: #030712; border: 1px solid #1e293b; border-left: 3px solid #00D9FF; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap; }
          .footer { padding: 16px 24px; background: #020617; border-top: 1px solid #1e293b; font-family: monospace; font-size: 11px; color: #64748b; text-align: center; }
          .btn { display: inline-block; background: #00D9FF; color: #000000; font-family: monospace; font-weight: bold; font-size: 12px; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-top: 12px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div class="tag">// REDDIX ROBOTICS // INCOMING TRANSMISSION</div>
            <div class="title">New CEO Direct Inquiry</div>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">From</div>
              <div class="value">${escapeHtml(msg.name)} &lt;<a href="mailto:${escapeHtml(msg.email)}" style="color: #00D9FF; text-decoration: none;">${escapeHtml(msg.email)}</a>&gt;</div>
            </div>
            <div class="field">
              <div class="label">Subject</div>
              <div class="value">${escapeHtml(msg.subject)}</div>
            </div>
            <div class="field">
              <div class="label">Message Content</div>
              <div class="message-box">${escapeHtml(msg.message)}</div>
            </div>
            <div>
              <a href="mailto:${escapeHtml(msg.email)}?subject=Re:%20${encodeURIComponent(msg.subject)}" class="btn">REPLY DIRECTLY TO SENDER &rarr;</a>
            </div>
          </div>
          <div class="footer">
            TRANSMISSION LOGGED • ${new Date(msg.createdAt).toUTCString()} • HYDERABAD, INDIA
          </div>
        </div>
      </body>
    </html>
  `;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Retrieves all contact messages (from Supabase first, then local fallback)
 */
export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        return data.map((d: any) => ({
          id: d.id,
          name: d.name,
          email: d.email,
          subject: d.subject,
          message: d.message,
          createdAt: d.created_at || d.createdAt,
          read: Boolean(d.read),
          emailSent: Boolean(d.email_sent ?? d.emailSent),
        }));
      }
    } catch (err) {
      console.warn("[MessageService] Supabase read exception:", err);
    }
  }

  // Local fallback
  return readLocalMessages().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Saves a new contact message and dispatches email notification
 */
export async function saveContactMessage(
  input: Omit<ContactMessage, "id" | "createdAt" | "read" | "emailSent">
): Promise<ContactMessage> {
  const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const createdAt = new Date().toISOString();

  const newMsg: ContactMessage = {
    id,
    name: input.name.trim(),
    email: input.email.trim(),
    subject: input.subject.trim(),
    message: input.message.trim(),
    createdAt,
    read: false,
  };

  // Dispatch email notification
  const mailResult = await sendEmailNotification(newMsg);
  newMsg.emailSent = mailResult.success;
  if (!mailResult.success && mailResult.error) {
    newMsg.emailError = mailResult.error;
  }

  // 1. Try to persist to Supabase
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from("contact_messages").insert([
        {
          id: newMsg.id,
          name: newMsg.name,
          email: newMsg.email,
          subject: newMsg.subject,
          message: newMsg.message,
          created_at: newMsg.createdAt,
          read: false,
          email_sent: newMsg.emailSent,
        },
      ]);
      if (error) {
        console.warn("[MessageService] Supabase insert warning:", error.message);
      }
    } catch (err) {
      console.warn("[MessageService] Supabase insert exception:", err);
    }
  }

  // 2. Always persist to local fallback
  const existing = readLocalMessages();
  const updated = [newMsg, ...existing.filter((m) => m.id !== newMsg.id)].slice(0, 100);
  writeLocalMessages(updated);

  return newMsg;
}

/**
 * Marks a message as read / unread
 */
export async function markMessageRead(id: string, read: boolean): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("contact_messages").update({ read }).eq("id", id);
    } catch (err) {
      console.warn("[MessageService] Supabase mark read exception:", err);
    }
  }

  const existing = readLocalMessages();
  const updated = existing.map((m) => (m.id === id ? { ...m, read } : m));
  writeLocalMessages(updated);
  return true;
}

/**
 * Deletes a contact message
 */
export async function deleteContactMessage(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("contact_messages").delete().eq("id", id);
    } catch (err) {
      console.warn("[MessageService] Supabase delete exception:", err);
    }
  }

  const existing = readLocalMessages();
  const updated = existing.filter((m) => m.id !== id);
  writeLocalMessages(updated);
  return true;
}
