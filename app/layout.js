import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const bringbold = localFont({
  src: "./fonts/bringbold_nineties_regular.otf",
  variable: "--font-heading",
  display: "swap"
});

const mdNichrome = localFont({
  src: "./fonts/MDNichrome-Bold.otf",
  variable: "--font-body",
  display: "swap"
});

export const metadata = {
  title: "Erendira's Boutique | Track Your Order",
  description: "Track your Erendira's Boutique package",
  icons: {
    icon: "/favicon.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bringbold.variable} ${mdNichrome.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
