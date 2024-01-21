import "./globals.css";
import Footer from "@/components/generated/Footer";
import NavMenu from "@/components/generated/NavMenu/NavMenu";
import Seo from "@/app/seo";

export const metadata = {
  title: "A. Göktuğ Yalçın",
  description: "A Frontend Developer from Istanbul, TR",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>👽</text></svg>",
  },
};

export const revalidate = 84600;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`transition-colors duration-200 ease-in-out dark:bg-[#1B2430] relative flex min-h-screen flex-col`}
      >
        <Seo />
        <NavMenu />
        <main className="flex min-h-screen flex-col items-start justify-start mx-auto mb-14 w-full max-w-screen-md flex-1 animate-main-content px-4 py-12 ">
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
