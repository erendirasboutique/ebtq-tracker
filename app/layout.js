import localFont from "next/font/local";
import "./globals.css";

// Headings: The Silver Editorial. Body and everything else: Evolve Early.
// The heading face covers every weight so browsers never fake a bold version of it.
const headingFont = localFont({
  src: "./fonts/TheSilverEditorial-Regular.otf",
  variable: "--font-heading",
  weight: "100 900",
  display: "swap"
});

const bodyFont = localFont({
  src: "./fonts/EvolveEarly-Medium.otf",
  variable: "--font-body",
  weight: "400",
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
    <html lang="es" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
