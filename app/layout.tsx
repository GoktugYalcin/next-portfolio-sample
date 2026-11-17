import "./globals.css";
import "./notebook.css";
import {
  Architects_Daughter,
  Geist,
  Geist_Mono,
  Instrument_Serif,
} from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import Footer from "@/components/generated/Footer";
import NavMenu from "@/components/generated/NavMenu/NavMenu";
import ProviderTheme from "@/components/generated/ThemeProvider";
import { KonamiEasterEgg } from "@/components/generated/KonamiEasterEgg";
import Motion from "@/components/generated/Motion";
import { BOOT_SCRIPT } from "@/components/generated/Motion/boot";
import Info from "@/infos";

const display = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
  display: "swap",
});

const hand = Architects_Daughter({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-hand",
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
        <head>
          <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        </head>
        <body
          className={`${display.variable} ${sans.variable} ${mono.variable} ${hand.variable}`}
        >
          <ProviderTheme>
            <KonamiEasterEgg />
            <div className="page">
              <NavMenu />
              <main id="top">{children}</main>
              <Footer />
            </div>
            <Motion />
          </ProviderTheme>
        </body>
      </html>
    </ViewTransitions>
  );
}
