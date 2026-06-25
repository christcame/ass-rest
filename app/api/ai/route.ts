import { NextResponse } from "next/server";
import { requireBearer, jsonError } from "../_lib";

export const runtime = "nodejs";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };
type AiBody = { messages?: ChatMessage[]; model?: string };

const DEFAULT_MODEL = "minimax-m2.7";

export async function POST(req: Request) {
  const authFail = requireBearer(req);
  if (authFail) return authFail;

  const apiKey = process.env.GENERALCOMPUTE_API_KEY;
  const baseUrl = process.env.GENERALCOMPUTE_BASE_URL ?? "https://api.generalcompute.com/v1";
  if (!apiKey) {
    return jsonError("GENERALCOMPUTE_API_KEY env var not set", 500);
  }

  let body: AiBody;
  try {
    body = (await req.json()) as AiBody;
  } catch {
    return jsonError("invalid JSON body");
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return jsonError("messages array is required");
  }

  for (const m of body.messages) {
    if (
      !m ||
      typeof m.role !== "string" ||
      typeof m.content !== "string" ||
      !["system", "user", "assistant"].includes(m.role)
    ) {
      return jsonError("invalid message in array");
    }
  }

  const upstream = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: body.model ?? DEFAULT_MODEL,
      messages: body.messages,
      stream: false,
    }),
  });

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    return NextResponse.json(
      { error: "upstream error", status: upstream.status, body: text.slice(0, 500) },
      { status: 502 }
    );
  }

  const data = await upstream.json();
  return NextResponse.json(data);
}

export async function GET() {
  return NextResponse.json(
    { error: "POST { messages: [...] }" },
    { status: 405 }
  );
}
