export type LinkItem = {
  /** Display label for the link button */
  label: string;
  /** Destination URL */
  href: string;
  /** Optional inline icon (emoji or short text) */
  icon?: string;
  /** Optional secondary line under the label */
  description?: string;
};

/**
 * Edit this list to change the links on your page.
 * Empty strings are skipped at render time.
 */
export const LINKS: LinkItem[] = [
  {
    label: "X / Twitter",
    href: "https://x.com/ManchakaRoad",
    icon: "𝕏",
    description: "@ManchakaRoad",
  },
  {
    label: "Zo Computer",
    href: "https://zo-computer.cello.so",
    icon: "🖥️",
  },
  {
    label: "Zo Computer Club",
    href: "https://x.com/i/communities/ZoCC",
    icon: "🌐",
    description: "bring back the old internet",
  },
  {
    label: "Telegram",
    href: "https://t.me/rockmurphy",
    icon: "✈️",
  },
];
