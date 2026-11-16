import React, { Suspense } from "react";
import NowListeningCard from "@/components/generated/NowListeningCard";
import FooterLinkProvider from "@/components/generated/Footer/FooterLinkProvider";
import { Frame, SectionHeader } from "@/components/generated/Frame";
import Info from "@/infos";

export const revalidate: number = 30;

export async function Footer() {
  return (
    <footer id="contact" className="scroll-mt-14">
      <SectionHeader
        title={<span className="italic">Yours,</span>}
        aside={<span className="label-mono">{Info.title}</span>}
      />
      <Frame flush>
        <FooterLinkProvider />
        <Suspense fallback={null}>
          <NowListeningCard />
        </Suspense>
        <p className="label-mono px-6 py-4 sm:px-8">
          © {new Date().getFullYear()} {Info.name}
        </p>
      </Frame>
    </footer>
  );
}

export default Footer;
