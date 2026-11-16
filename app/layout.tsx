import "./globals.css";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import Footer from "@/components/generated/Footer";
import NavMenu from "@/components/generated/NavMenu/NavMenu";
import ProviderTheme from "@/components/generated/ThemeProvider";
import { KonamiEasterEgg } from "@/components/generated/KonamiEasterEgg";
import Info from "@/infos";

const display = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(Info.siteUrl),
  title: Info.name,
  description: Info.description,
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>👽</text></svg>",
  },
  openGraph: {
    title: Info.name,
    description: Info.description,
    url: Info.siteUrl,
    siteName: Info.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: Info.name,
    description: Info.description,
  },
};

export const revalidate = 86400;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${display.variable} ${sans.variable} ${mono.variable} relative flex min-h-screen flex-col`}
        >
          <ProviderTheme>
            <KonamiEasterEgg />
            <NavMenu />
            <main className="flex w-full flex-1 flex-col">
              {children}
              <div className="frame min-h-[48px] flex-1" aria-hidden />
              <Footer />
            </main>
          </ProviderTheme>
        </body>
      </html>
    </ViewTransitions>
  );
}
