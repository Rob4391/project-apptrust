import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AppTrust | Know what you're installing",
  description: "Understand app permissions, developer credibility, and privacy risks before you install.",
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
