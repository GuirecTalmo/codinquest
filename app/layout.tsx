import type { Metadata } from "next";
import { Pixelify_Sans, Silkscreen } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeInQuest",
  description: "Entraînez-vous aux entretiens techniques front-end (HTML, CSS, JavaScript, React, Vue.js...) et progressez en divisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${pixelifySans.variable} ${silkscreen.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
