import React, { Suspense } from "react";
import { Link } from "next-view-transitions";
import NowListeningCard from "@/components/generated/NowListeningCard";
import FooterLinkProvider from "@/components/generated/Footer/FooterLinkProvider";
import { MailLine } from "@/components/generated/Footer/FooterLink";
import Closing from "@/components/generated/Footer/Closing";
import { IstanbulSeconds } from "@/components/generated/IstanbulClock";
import { Frame, Gutter, SectionHeader } from "@/components/generated/Frame";
import air from "@/lib/fetchers/airtable";
import Info from "@/infos";

export const revalidate: number = 30;

export async function Footer() {
  const infos = await air.getInfos();
  const mail = infos.find((i) => i.url.startsWith("mailto:"));

  return (
    <footer id="contact" className="scroll-mt-12">
      <SectionHeader title="say hi" />
      <Frame>
        {mail && <MailLine link={mail.url} />}
        <p className={`label-mono ${mail ? "mt-5" : ""}`}>
          {mail ? "or find me elsewhere." : "find me elsewhere."}
        </p>
        <FooterLinkProvider className="mt-3" withMail={!mail} />
      </Frame>

      <Gutter />
      <Frame className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Closing />
          <p className="mt-1 font-serif text-xl italic text-muted-foreground">
            Yours,
          </p>
        </div>
        <Link href="/projects" className="link-arrow">
          the work lives here <span aria-hidden>→</span>
        </Link>
      </Frame>

      <Suspense fallback={null}>
        <NowListeningCard />
      </Suspense>

      <div className="w-full border-t border-dotted border-border">
        <Frame className="py-4">
          <p className="label-mono">
            © {new Date().getFullYear()} {Info.name.toLowerCase()} · istanbul{" "}
            <IstanbulSeconds />
          </p>
        </Frame>
      </div>
    </footer>
  );
}

export default Footer;
