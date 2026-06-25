import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

/**
 * Generic bearer auth helper.
 * Reads ASS_REST_API_KEY from the environment.
 */
export function requireBearer(req: Request): NextResponse | null {
  const expected = process.env.ASS_REST_API_KEY;
  if (!expected) {
    return NextResponse.json(
      { error: "ASS_REST_API_KEY env var not set" },
      { status: 500 }
    );
  }
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (token !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}

/**
 * Singleton Upstash Redis client (REST).
 * Reads UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from env.
 * Returns null if not configured — callers should fall back or 503.
 */
let _redis: Redis | null = null;
export function redis(): Redis | null {
  if (_redis) return _redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  _redis = new Redis({ url, token });
  return _redis;
}

/**
 * Tiny JSON error helper so handlers stay one-liner.
 */
export function jsonError(message: string, status = 400): NextResponse {
  return NextResponse.json({ error: message }, { status });
}
