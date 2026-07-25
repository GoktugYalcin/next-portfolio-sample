import "./globals.css";
import { Fraunces, Newsreader } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import Footer from "@/components/generated/Footer";
import NavMenu from "@/components/generated/NavMenu/NavMenu";
import ProviderTheme from "@/components/generated/ThemeProvider";
import { KonamiEasterEgg } from "@/components/generated/KonamiEasterEgg";
import Info from "@/infos";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-body-serif",
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
      <html lang="en">
        <body
          className={`${fraunces.variable} ${newsreader.variable} transition-colors duration-200 ease-in-out relative flex min-h-screen flex-col`}
        >
          <ProviderTheme>
            <KonamiEasterEgg />
            <NavMenu />
            <main
              className={
                "flex min-h-screen flex-col items-start justify-start lg:max-w-screen-lg max-w-screen-md mx-auto mb-14 w-full flex-1 animate-main-content px-4 py-12"
              }
            >
              {children}
              <Footer />
            </main>
          </ProviderTheme>
        </body>
      </html>
    </ViewTransitions>
  );
}
