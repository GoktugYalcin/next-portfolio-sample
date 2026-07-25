import React, { Suspense } from "react";
import NowListeningCard from "@/components/generated/NowListeningCard";
import FooterLinkProvider from "@/components/generated/Footer/FooterLinkProvider";

export const revalidate: number = 30;

export async function Footer() {
  return (
    <footer className="mt-16 border-t border-border pt-8 flex justify-between w-full flex-col-reverse lg:flex-row gap-8 lg:gap-0">
      <div className="flex-col flex justify-center items-start">
        <p className="font-display italic text-lg text-foreground">Yours,</p>
        <FooterLinkProvider />
      </div>
      <Suspense fallback={null}>
        <NowListeningCard />
      </Suspense>
    </footer>
  );
}

export default Footer;
