import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const prompt = String(body?.prompt ?? "").trim();

  if (!prompt) {
    return NextResponse.json({ text: "Type a prompt and hit Ask." }, { status: 400 });
  }

  // Phase 2 stub: replace with OpenAI later (same contract)
  return NextResponse.json({
    text: `✅ (Stub) Received: "${prompt}". Next: wire OpenAI + task/calendar/market tools.`
  });
}
