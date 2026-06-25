import { createBunStream } from "../_stream";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function GET() {
  return new Response(createBunStream(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache, no-store",
      "x-accel-buffering": "no",
    },
  });
}

export async function POST() {
  return GET();
}