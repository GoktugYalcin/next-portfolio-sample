import React, { Suspense } from "react";
import NowListeningCard from "@/components/generated/NowListeningCard";
import FooterLinkProvider from "@/components/generated/Footer/FooterLinkProvider";

export const revalidate: number = 30;

export async function Footer() {
  return (
    <footer className="hud-corners mt-16 flex w-full flex-col-reverse gap-8 border border-border bg-card/40 p-6 lg:flex-row lg:items-start lg:justify-between lg:gap-0">
      <div className="flex flex-col items-start justify-center">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em] text-accent">
          Transmit
        </p>
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
