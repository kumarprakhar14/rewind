import type { Metadata } from "next";
import { Inter, Caveat, Permanent_Marker } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const permanentMarker = Permanent_Marker({
  variable: "--font-permanent-marker",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReWind - Batch Memory Archive",
  description: "A living, emotional archive of our college memories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${caveat.variable} ${permanentMarker.variable} antialiased h-full`}
    >
      <body className="min-h-full flex flex-col font-sans bg-paper text-ink relative" suppressHydrationWarning>
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply grain-overlay"></div>
        <main className="relative z-10 flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
