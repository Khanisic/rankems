import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rankems",
  description: "Rankems is a platform for creating and sharing rankings.",
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
