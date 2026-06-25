import { NextResponse } from "next/server";
import { requireBearer, redis, jsonError } from "../_lib";

export const runtime = "nodejs";

type ShortenBody = { url?: string };

function isValidUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function makeCode(len = 7): string {
  // URL-safe base62, ~3.5e12 combos at len=7
  const alpha =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < len; i++) {
    out += alpha[Math.floor(Math.random() * alpha.length)];
  }
  return out;
}

export async function POST(req: Request) {
  const authFail = requireBearer(req);
  if (authFail) return authFail;

  let body: ShortenBody;
  try {
    body = (await req.json()) as ShortenBody;
  } catch {
    return jsonError("invalid JSON body");
  }

  const url = (body.url ?? "").trim();
  if (!url) return jsonError("url is required");
  if (!isValidUrl(url)) return jsonError("url must be http(s)");

  const r = redis();
  if (!r) return jsonError("redis not configured", 503);

  // Generate code, retry on collision (rare)
  let code = makeCode();
  for (let i = 0; i < 5; i++) {
    const existing = await r.get<string>(`short:${code}`);
    if (!existing) break;
    code = makeCode();
  }

  await r.set(`short:${code}`, url);

  // Best-effort TTL (90 days) — won't kill active links, bounds storage
  // r.expire(`short:${code}`, 60 * 60 * 24 * 90);

  const origin = new URL(req.url).origin;
  return NextResponse.json({
    code,
    short: `${origin}/s/${code}`,
    url,
  });
}

export async function GET() {
  return NextResponse.json(
    { error: "POST { url } to shorten" },
    { status: 405 }
  );
}
