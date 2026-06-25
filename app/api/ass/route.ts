import { createBunStream } from "../_stream";

export const runtime = "nodejs";
export const maxDuration = 120;

function wantsRichText(request: Request): boolean {
  const userAgent = request.headers.get("user-agent") ?? "";
  return /curl|wget|httpie|fetch|axios|postmanruntime/i.test(userAgent);
}

export async function GET(request: Request) {
  return new Response(createBunStream({ richText: wantsRichText(request) }), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache, no-store",
      "x-accel-buffering": "no",
    },
  });
}

export async function POST(request: Request) {
  return GET(request);
}