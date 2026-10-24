import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = { title: 'B2B Commerce', description: 'Kenya-first B2B commerce & ordering' };
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0b0f14' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="top">
          <strong>🛒 B2B Commerce</strong>
          <nav>
            <a href="/">Dashboard</a>
            <a href="/vendors">Vendors</a>
            <a href="/products">Products</a>
            <a href="/purchase-orders">Purchase Orders</a>
          </nav>
        </header>
        <main className="wrap">{children}</main>
        <footer className="foot">KENYA254 · B2B Commerce · dev</footer>
      </body>
    </html>
  );
}
