import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import { getSupabaseClient } from "@/lib/supabase/client";

const SESSION_COOKIE = "reddix_admin_token";
const SECRET_TOKEN = "reddix_robotics_auth_token_verified";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (token !== SECRET_TOKEN) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `proj_${Date.now()}_${safeName}`;

    // 1. Try Supabase Storage bucket 'projects' if configured
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error: uploadError } = await supabase.storage
          .from("projects")
          .upload(filename, buffer, {
            contentType: file.type || "image/png",
            upsert: true,
          });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from("projects")
            .getPublicUrl(filename);
          if (publicUrlData?.publicUrl) {
            return NextResponse.json({ success: true, url: publicUrlData.publicUrl });
          }
        }
      } catch (err) {
        console.warn("[Upload API] Supabase storage upload failed, falling back to local disk", err);
      }
    }

    // 2. Local disk fallback
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("[Upload API error]", error);
    return NextResponse.json(
      { success: false, error: "File upload failed" },
      { status: 500 }
    );
  }
}
