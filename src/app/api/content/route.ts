import { NextResponse } from "next/server";
import { getCachedSiteContent, updateSiteContent } from "@/lib/content/contentService";

export async function GET() {
  const content = await getCachedSiteContent();
  return NextResponse.json(content);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updated = await updateSiteContent(body, "content-all");
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[API content error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update content" },
      { status: 500 }
    );
  }
}
