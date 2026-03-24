import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import { CartProvider } from "./context/CartContext";
import Header from "./components/layout/Header";
import MobileNav from "./components/layout/MobileNav";
import Footer from "./components/layout/Footer";

// Global styles
import "./styles/index.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Atelier Alabaster — Modest Fashion Boutique | Fluid Modernity" },
    { name: "description", content: "Atelier Alabaster is a premium modest fashion boutique curating architectural silhouettes and fluid modernity." },
  ];
}

export function links() {
  return [
    { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    { rel: "apple-touch-icon", href: "/favicon.svg" },
    { rel: "preload", as: "image", href: "/hero-hijab.webp", fetchpriority: "high" },
    { rel: "preload", as: "image", href: "/editorial-structural.webp" },
    { rel: "preload", as: "image", href: "/editorial-muted.webp" },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    { rel: "preconnect", href: "https://api.fontshare.com", crossOrigin: "anonymous" },
    { rel: "preconnect", href: "https://cdn.fontshare.com", crossOrigin: "anonymous" },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1a1a1a" />
        <Meta />
        <Links />
        {/* Fonts (non-blocking async load) */}
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
        <link rel="preload" as="style" href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&f[]=satoshi@300,400,500,700,900&display=swap" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" media="print" onLoad={(e) => { e.currentTarget.media = 'all'; }} />
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&f[]=satoshi@300,400,500,700,900&display=swap" rel="stylesheet" media="print" onLoad={(e) => { e.currentTarget.media = 'all'; }} />
        <noscript>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
          <link href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&f[]=satoshi@300,400,500,700,900&display=swap" rel="stylesheet" />
        </noscript>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <CartProvider>
      <div className="app">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
        <MobileNav />
      </div>
    </CartProvider>
  );
}
