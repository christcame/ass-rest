import "./globals.css";

export const metadata = {
  title: "ass.rest",
  description: "Bouncing buns in the browser. Streaming buns in the terminal.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
