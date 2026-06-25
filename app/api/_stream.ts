const DURATION_MS = 120_000;
const TICK_MS = 250;

const BUN_FRAMES = [
  [
    "      .---.       .---.",
    "     /     \\     /     \\",
    "    |       |   |       |",
    "     \\     /     \\     /",
    "      '---'       '---'",
  ],
  [
    "      .---.       .---.",
    "     /     \\     /     \\",
    "    |      /     \\      |",
    "     \\     /     \\     /",
    "      '---'       '---'",
  ],
  [
    "      .---.       .---.",
    "     /     \\     /     \\",
    "    |     |       |     |",
    "     \\     /     \\     /",
    "      '---'       '---'",
  ],
  [
    "      .---.       .---.",
    "     /    \\|     |/    \\",
    "    |       |   |       |",
    "     \\     /     \\     /",
    "      '---'       '---'",
  ],
  [
    "      .---.       .---.",
    "     /     \\     /     \\",
    "    |       |   |       |",
    "     \\    /       \\    /",
    "      '--'         '--'",
  ],
  [
    "      .---.       .---.",
    "     /     \\     /     \\",
    "    |  ~ ~  |   |  ~ ~  |",
    "     \\     /     \\     /",
    "      '---'       '---'",
  ],
];

function renderFrame(frameIdx: number, progress: number, done: boolean): string {
  const barWidth = 40;
  const filled = Math.round((progress / 100) * barWidth);
  const bar = "█".repeat(filled) + "░".repeat(barWidth - filled);
  const pct = Math.min(100, Math.floor(progress));
  const art = BUN_FRAMES[frameIdx % BUN_FRAMES.length].join("\n");
  const status = done ? "done." : "loading buns...";
  return `\x1b[2J\x1b[H${art}\n\n[${bar}] ${pct}%\n${status}\n`;
}

export function createBunStream(): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  let intervalId: ReturnType<typeof setInterval> | undefined;
  let startTime = 0;

  return new ReadableStream({
    start(controller) {
      startTime = Date.now();

      const tick = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, (elapsed / DURATION_MS) * 100);
        const frameIdx = Math.floor(elapsed / 200);
        const done = elapsed >= DURATION_MS;

        controller.enqueue(
          encoder.encode(renderFrame(frameIdx, progress, done))
        );

        if (done) {
          if (intervalId) clearInterval(intervalId);
          controller.close();
        }
      };

      tick();
      intervalId = setInterval(tick, TICK_MS);
    },
    cancel() {
      if (intervalId) clearInterval(intervalId);
    },
  });
}