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
    label: "Telegram",
    href: "https://t.me/rockmurphy",
    icon: "✈️",
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
    label: "TinyFish Agent",
    href: "https://agent.tinyfish.ai/sign-up?ref=v1.dXNlcl8zQmhKbkxLVmNsakNud3lPS2hQS3JrbUVUWWQ.EjWwA600IA0SP4ut5lFVAEgAB6o7y3klgMB5uhtP63Y",
    icon: "🐟",
  },
  {
    label: "FreeModel",
    href: "https://freemodel.dev/invite/FRE-018aede3",
    icon: "🆓",
  },
  {
    label: "Windsor AI Partners",
    href: "https://partners.windsor.ai?sref=pl9cyyi",
    icon: "📊",
  },
  {
    label: "Windsor AI",
    href: "https://windsor.ai/?fpr=troycarboni",
    icon: "📈",
  },
  {
    label: "Wispr Flow",
    href: "https://wisprflow.ai/r?TWALTER1",
    icon: "🎙️",
  },
  {
    label: "Taskade",
    href: "https://www.taskade.com/signup?referral=Kuk3bFk3YnPT4Sha",
    icon: "✅",
  },
  {
    label: "GMI Cloud",
    href: "https://console.gmicloud.ai/ref/VT5A8PJA",
    icon: "☁️",
  },
  {
    label: "Kilo",
    href: "https://share.kilo.ai/mzTNoy3",
    icon: "⚡",
  },
  {
    label: "Morphic Studio",
    href: "https://studio.morphic.com/invite/MDE5ZGQzZjctNDhmMy03N2UwLWFkYjAtNDRjMDRhMzQ5NzY2",
    icon: "🎨",
  },
  {
    label: "Venice",
    href: "https://venice.ai/chat?ref=Mlybug",
    icon: "🏛️",
  },
  {
    label: "Manus",
    href: "https://manus.im/invitation/IYMIEOHAVGGK7",
    icon: "✋",
  },
  {
    label: "Anything",
    href: "https://www.anything.com/invite/5dcsf8rh",
    icon: "❓",
  },
  {
    label: "z.ai",
    href: "https://z.ai/subscribe?ic=F099MIN06Z",
    icon: "🧠",
  },
];
