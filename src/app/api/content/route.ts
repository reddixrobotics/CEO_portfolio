import { NextResponse } from "next/server";
import { readStoredContent, updateSiteContent } from "@/lib/content/contentService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const content = await readStoredContent();
  return NextResponse.json(content, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updated = await updateSiteContent(body, "content-all");
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("[API content error]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update content" },
      { status: 500 }
    );
  }
}
