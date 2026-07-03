import localFont from "next/font/local";
import "./globals.css";

const laLuxesSerif = localFont({
  src: "./fonts/la_luxes_serif.otf",
  variable: "--font-heading",
  display: "swap"
});

const recoleta = localFont({
  src: "./fonts/recoleta-regular.otf",
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
    <html lang="en" className={`${laLuxesSerif.variable} ${recoleta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
