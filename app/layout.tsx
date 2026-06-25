import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ass.rest",
  description: "Links — ass.rest",
  openGraph: {
    title: "ass.rest",
    description: "Links — ass.rest",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
