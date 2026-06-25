import "./globals.css";

export const metadata = {
  title: "ass.rest",
  description: "ass.rest API",
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
