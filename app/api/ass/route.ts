import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * 32-byte Windows .wav file header + a 1.5s synthetic "fart" envelope.
 * White noise gated with two short envelopes, low-pass-ish via averaging
 * adjacent samples. 8 kHz mono 8-bit PCM keeps the payload tiny (~12 KB).
 */
function buildFartWav(): Buffer {
  const sampleRate = 8000;
  const durationSec = 1.5;
  const numSamples = sampleRate * durationSec;
  const dataBytes = numSamples; // 8-bit unsigned PCM
  const fileSize = 44 + dataBytes;
  const buf = Buffer.alloc(fileSize);

  // RIFF header
  buf.write("RIFF", 0, "ascii");
  buf.writeUInt32LE(fileSize - 8, 4);
  buf.write("WAVE", 8, "ascii");
  // fmt chunk
  buf.write("fmt ", 12, "ascii");
  buf.writeUInt32LE(16, 16); // chunk size
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate, 28); // byte rate (8-bit mono)
  buf.writeUInt16LE(1, 32); // block align
  buf.writeUInt16LE(8, 34); // bits per sample
  // data chunk
  buf.write("data", 36, "ascii");
  buf.writeUInt32LE(dataBytes, 40);

  // Two-burst envelope: 0-300ms, 500-800ms, 1100-1300ms
  const bursts: Array<[number, number]> = [
    [0.0, 0.3],
    [0.5, 0.8],
    [1.1, 1.3],
  ];
  const inBurst = (t: number) => {
    for (const [a, b] of bursts) {
      if (t >= a && t < b) return (t - a) / (b - a);
    }
    return 0;
  };

  let prev = 0;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const env = inBurst(t);
    // envelope: quick attack, slow decay
    const localT = (i % Math.floor(sampleRate * 0.1)) / (sampleRate * 0.1);
    const shape = env * (1 - localT) * (0.6 + 0.4 * Math.sin(t * 30));
    // crude low-pass: mix noise with previous sample
    const noise = (Math.random() * 2 - 1) * 0.5 + 0.5; // 0..1
    const filtered = 0.4 * noise + 0.6 * prev;
    prev = filtered;
    // 8-bit unsigned PCM, center at 128
    const sample = Math.max(0, Math.min(255, Math.round(128 + (filtered - 0.5) * 220 * shape)));
    buf[44 + i] = sample;
  }

  return buf;
}

let cached: Buffer | null = null;
function fart() {
  if (!cached) cached = buildFartWav();
  return cached;
}

export async function GET() {
  return new NextResponse(fart(), {
    status: 200,
    headers: {
      "content-type": "audio/wav",
      "content-length": String(fart().length),
      "cache-control": "public, max-age=86400",
    },
  });
}
