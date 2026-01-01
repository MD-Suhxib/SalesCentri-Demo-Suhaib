import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GlobalLenisProvider } from "./providers/GlobalLenisProvider";
import { LoginRedirectHandler } from "./components/LoginRedirectHandler";
import { TrackerInitializer } from "./components/TrackerInitializer";
import { AppShell } from "./components/AppShell";
import NewUserPopupManager from "./components/NewUserPopupManager";

const trackerConfig = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_SALESCENTRI_API_BASE_URL ??
    "https://app.demandintellect.com/app/api",
  debug: false,
  autoTrack: {
    // Keep pageViews false to avoid double-counting because TrackerInitializer bridges page views
    pageViews: false,
    clicks: true,
    formSubmissions: true,
    scrolls: false,
    conversions: true,
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://salescentri.com"),
  title: {
    default: "Sales Centri",
    template: "%s | Sales Centri",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-black`}
      >
        <Script
          src="https://app.demandintellect.com/app/public/js/an.js"
          strategy="beforeInteractive"
          data-tracker-config={JSON.stringify(trackerConfig)}
        />
        <Script
          src="https://www.google.com/recaptcha/api.js?render=6LcBMxgsAAAAAPGN83gm3_o0kJC-6X07d7ECwsZ2"
          strategy="afterInteractive"
        />
        <Script
          src="https://unpkg.com/@elevenlabs/convai-widget-embed"
          strategy="afterInteractive"
        />
        <ThemeProvider>
          <GlobalLenisProvider>
            <TrackerInitializer />
            <LoginRedirectHandler />
            <AppShell>{children}</AppShell>
            <NewUserPopupManager />
          </GlobalLenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
