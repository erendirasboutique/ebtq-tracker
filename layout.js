export const metadata = {
  title: "Erendira's Boutique Tracker",
  description: "Package tracking page"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
