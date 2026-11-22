import "./globals.css";

// Logo, colors and fonts (Charman Serif headings, Ltt Recoleta body) come from
// the shared brand files the Customer Portal serves. Change them there.
const BRAND_CSS =
  (process.env.NEXT_PUBLIC_BRAND_URL || "https://my.erendirasboutique.com/brand").replace(/\/+$/, "") + "/brand.css";

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
    <html lang="es">
      <head>
        <link rel="stylesheet" href={BRAND_CSS} />
      </head>
      <body>{children}</body>
    </html>
  );
}
