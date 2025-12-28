import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Pulse Manga",
  description: "Read manga online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-text-main font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
