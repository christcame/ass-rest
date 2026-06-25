const DURATION_MS = 120_000;
const TICK_MS = 250;
const MESSAGE_INTERVAL_MS = 15_000;

const ANSI = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  gold: "\x1b[38;5;220m",
  orange: "\x1b[38;5;208m",
  pink: "\x1b[38;5;205m",
  peach: "\x1b[38;5;217m",
  green: "\x1b[38;5;46m",
  cyan: "\x1b[38;5;51m",
};

const LOADING_MESSAGES = [
  "kneading the dough...",
  "preheating the oven...",
  "buttering the buns...",
  "letting them rise...",
  "sprinkling sesame seeds...",
  "glazing with honey...",
  "toasting to perfection...",
  "fluffing the buns...",
  "measuring the yeast...",
  "rotating the baking sheet...",
  "checking internal temperature...",
  "applying egg wash...",
  "resting the dough...",
  "bouncing with anticipation...",
  "waiting for the magic...",
  "warming the proofing drawer...",
  "tucking in the parchment...",
  "listening for the ding...",
];



function pickRandomMessage(exclude?: string): string {
  const pool = exclude
    ? LOADING_MESSAGES.filter((message) => message !== exclude)
    : LOADING_MESSAGES;
  return pool[Math.floor(Math.random() * pool.length)];
}

const CHEEK_HEIGHT = 5;
const MAX_BOUNCE = 3;
// Fixed canvas height so the frame never changes size and the TUI stays put.
const CANVAS_HEIGHT = CHEEK_HEIGHT + MAX_BOUNCE;

/**
 * Returns a vertical offset (number of lines to rise) for a single cheek.
 * The two cheeks bounce on offset sine waves so they jiggle independently.
 */
function bounceOffset(elapsed: number, phase: number): number {
  // 2.5 Hz bounce cycle, max MAX_BOUNCE lines of vertical travel
  return Math.round(
    ((1 - Math.cos((elapsed / 400) * Math.PI * 2 + phase)) / 2) * MAX_BOUNCE
  );
}

const MIRROR_CHARS: Record<string, string> = {
  "(": ")",
  ")": "(",
  "[": "]",
  "]": "[",
  "{": "}",
  "}": "{",
  "/": "\\",
  "\\": "/",
  "<": ">",
  ">": "<",
};

function mirrorCheek(line: string): string {
  return line
    .split("")
    .reverse()
    .map((ch) => MIRROR_CHARS[ch] ?? ch)
    .join("");
}

// Jiggle variants — left cheek art; mirrored on the right for a center cleft.
const CHEEK_VARIANTS = [
  // 0 — plump resting
  [
    "      .--'      ",
    "     /     \\    ",
    "    |      |    ",
    "    |      |    ",
    "     \\____/     ",
  ],
  // 1 — clench
  [
    "       .-'      ",
    "      /   \\    ",
    "     |     |    ",
    "     |     |    ",
    "      \\___/     ",
  ],
  // 2 — spread
  [
    "     .----'     ",
    "    /       \\   ",
    "   |         |  ",
    "   |         |  ",
    "    \\_______/   ",
  ],
  // 3 — wobble
  [
    "      .--'      ",
    "     /     \\    ",
    "    |  ~~   |   ",
    "     \\     /    ",
    "      \\___/     ",
  ],
];

/**
 * Render two independently bouncing buttocks side by side inside a
 * fixed-height canvas.  Each cheek is anchored to the bottom of the
 * canvas and the bounce offset pushes it upward, so the overall frame
 * size never changes and the TUI doesn't jump around.
 */
function renderBouncingButts(elapsed: number, frameIdx: number): string[] {
  const leftBounce = bounceOffset(elapsed, 0);
  const rightBounce = bounceOffset(elapsed, Math.PI * 0.6); // ~108° out of phase

  const cheekWidth = 20;

  const variant = CHEEK_VARIANTS[frameIdx % CHEEK_VARIANTS.length];

  // Each cheek is placed so its bottom row sits at (CANVAS_HEIGHT - 1 - bounce).
  // topRow is the canvas row where line 0 of the cheek art lands.
  const leftTop = CANVAS_HEIGHT - CHEEK_HEIGHT - leftBounce;
  const rightTop = CANVAS_HEIGHT - CHEEK_HEIGHT - rightBounce;

  const lines: string[] = [];

  for (let row = 0; row < CANVAS_HEIGHT; row++) {
    const lIdx = row - leftTop;
    const rIdx = row - rightTop;

    const leftStr =
      lIdx >= 0 && lIdx < CHEEK_HEIGHT
        ? variant[lIdx].padEnd(cheekWidth)
        : " ".repeat(cheekWidth);

    const rightStr =
      rIdx >= 0 && rIdx < CHEEK_HEIGHT
        ? mirrorCheek(variant[rIdx]).padEnd(cheekWidth)
        : "";

    lines.push(leftStr + rightStr);
  }

  return lines;
}

function colorizeButts(lines: string[]): string {
  return lines
    .map((line) => `${ANSI.peach}${line}${ANSI.reset}`)
    .join("\n");
}

function renderBar(filled: number, barWidth: number): string {
  const filledPart = `${ANSI.green}${"█".repeat(filled)}${ANSI.reset}`;
  const emptyPart = `${ANSI.dim}${"░".repeat(barWidth - filled)}${ANSI.reset}`;
  return `[${filledPart}${emptyPart}]`;
}

type StreamOptions = {
  richText?: boolean;
};

// Erase to end of line so shorter redraws don't leave stale characters.
const EL = "\x1b[K";

function renderFrame(
  frameIdx: number,
  progress: number,
  done: boolean,
  elapsed: number,
  statusMessage: string,
  richText: boolean,
  isFirstFrame: boolean
): string {
  const barWidth = 40;
  const filled = Math.round((progress / 100) * barWidth);
  const pct = Math.min(100, Math.floor(progress));

  const buttLines = renderBouncingButts(elapsed, frameIdx);

  if (!richText) {
    const art = buttLines.join("\n");
    const bar = "█".repeat(filled) + "░".repeat(barWidth - filled);
    const status = done ? "done." : statusMessage;
    return `${art}\n\n[${bar}] ${pct}%\n${status}\n\n`;
  }

  const art = colorizeButts(buttLines)
    .split("\n")
    .map((line) => `${line}${EL}`)
    .join("\n");
  const bar = renderBar(filled, barWidth);
  const status = done
    ? `${ANSI.bold}${ANSI.green}done.${ANSI.reset}`
    : `${ANSI.cyan}${statusMessage}${ANSI.reset}`;

  // Full clear only once; later frames overwrite in place to avoid flashing.
  const prefix = isFirstFrame ? "\x1b[?25l\x1b[2J\x1b[H" : "\x1b[H";
  const suffix = done ? "\x1b[?25h" : "";

  return `${prefix}${art}\n\n${bar} ${ANSI.bold}${ANSI.gold}${pct}%${ANSI.reset}${EL}\n${status}${EL}\n${suffix}`;
}

export function createBunStream(
  options: StreamOptions = {}
): ReadableStream<Uint8Array> {
  const richText = options.richText ?? true;
  const encoder = new TextEncoder();
  let intervalId: ReturnType<typeof setInterval> | undefined;
  let startTime = 0;
  let statusMessage = pickRandomMessage();
  let lastMessageBucket = 0;
  let isFirstFrame = true;
  let closed = false;

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
  };

  const closeStream = (controller: ReadableStreamDefaultController<Uint8Array>) => {
    if (closed) return;
    closed = true;
    stop();
    try {
      controller.close();
    } catch {
      // Client already disconnected.
    }
  };

  return new ReadableStream({
    start(controller) {
      startTime = Date.now();

      const tick = () => {
        if (closed) return;

        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, (elapsed / DURATION_MS) * 100);
        const frameIdx = Math.floor(elapsed / 200);
        const done = elapsed >= DURATION_MS;
        const messageBucket = Math.floor(elapsed / MESSAGE_INTERVAL_MS);

        if (messageBucket !== lastMessageBucket) {
          statusMessage = pickRandomMessage(statusMessage);
          lastMessageBucket = messageBucket;
        }

        try {
          controller.enqueue(
            encoder.encode(
              renderFrame(
                frameIdx,
                progress,
                done,
                elapsed,
                statusMessage,
                richText,
                isFirstFrame
              )
            )
          );
          isFirstFrame = false;
        } catch {
          closeStream(controller);
          return;
        }

        if (done) {
          closeStream(controller);
        }
      };

      tick();
      intervalId = setInterval(tick, TICK_MS);
    },
    cancel() {
      closed = true;
      stop();
    },
  });
}
