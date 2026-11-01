import localFont from "next/font/local";
import "./globals.css";

const bricolage = localFont({
  src: "./fonts/BricolageGrotesque.woff",
  variable: "--font-eb",
  weight: "200 800",
  display: "swap"
});

export const metadata = {
  title: "Erendira's Boutique | Rastrea tu pedido",
  description: "Rastrea tu paquete de Erendira's Boutique. Track your Erendira's Boutique package.",
  icons: {
    icon: "/favicon.png"
  },
  openGraph: {
    title: "Erendira's Boutique | Rastrea tu pedido",
    description: "Rastrea tu paquete de Erendira's Boutique.",
    images: [
      {
        url: "/social-preview1.png",
        width: 1200,
        height: 630,
        alt: "Erendira's Boutique — Rastrea tu pedido"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Erendira's Boutique | Rastrea tu pedido",
    description: "Rastrea tu paquete de Erendira's Boutique.",
    images: ["/social-preview1.png"]
  }
};

export const viewport = {
  themeColor: "#f5f3ef",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={bricolage.variable}>
      <body>{children}</body>
    </html>
  );
}
