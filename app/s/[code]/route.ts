import { NextResponse } from "next/server";
import { redis } from "../../api/_lib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ code: string }> }
) {
  const { code } = await ctx.params;
  if (!code || !/^[A-Za-z0-9]{1,32}$/.test(code)) {
    return new NextResponse("bad code", { status: 400 });
  }

  const r = redis();
  if (!r) {
    return new NextResponse("service unavailable", { status: 503 });
  }

  const target = await r.get<string>(`short:${code}`);
  if (!target) {
    return new NextResponse("not found", { status: 404 });
  }

  // Increment hit counter (fire and forget)
  r.incr(`short:${code}:hits`).catch(() => {});

  return NextResponse.redirect(target, 302);
}
