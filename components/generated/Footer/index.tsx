import React, { Suspense } from "react";
import { Link } from "next-view-transitions";
import { ArrowRight } from "lucide-react";
import NowListeningCard from "@/components/generated/NowListeningCard";
import FooterLinkProvider from "@/components/generated/Footer/FooterLinkProvider";
import { MailLine } from "@/components/generated/Footer/FooterLink";
import Closing from "@/components/generated/Footer/Closing";
import Pile from "@/components/generated/Pile";
import { RollingClock } from "@/components/generated/IstanbulClock";
import { Band, Section } from "@/components/generated/PageHead";
import { getContacts } from "@/lib/contacts";
import unsplash from "@/lib/fetchers/unsplash";
import { IPhoto } from "@/types";
import Info from "@/infos";

export const revalidate: number = 3600;

const KEYS = ["↑", "↑", "↓", "↓", "←", "→", "←", "→", "b", "a"];

const stampSrc = (photo: IPhoto) =>
  `/_next/image?url=${encodeURIComponent(
    `${photo.urls.raw}&q=80&w=240&h=300&fit=crop`
  )}&w=256&q=75`;

export async function Footer() {
  const [infos, photosRaw] = await Promise.all([
    getContacts(),
    unsplash.getPhotos(8),
  ]);
  const mail = infos.find((i) => i.url.startsWith("mailto:"));
  const photos: IPhoto[] = Array.isArray(photosRaw) ? photosRaw : [];
  const stamps = (photos.length > 4 ? photos.slice(4, 8) : photos).slice(0, 4);

  return (
    <footer className="site-footer">
      <Band />
      <Section id="contact" title="say hi">
        <p className="yours">Yours,</p>
        {mail && <MailLine link={mail.url} />}

        {stamps.length > 0 && (
          <div className="hi-stamps">
            <p className="hi-note">
              or see what i&apos;ve been photographing. pick a stamp.
            </p>
            <div className="row">
              {stamps.map((photo) => (
                <Link
                  key={photo.id}
                  href="/photos"
                  className="rain-keep"
                  aria-label={`open the photo archive: ${
                    photo.alt_description || "a photo"
                  }`}
                >
                  <span className="stamp">
                    <span className="stp">
                      <span className="stp-pic">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={stampSrc(photo)}
                          alt=""
                          draggable={false}
                          loading="lazy"
                        />
                      </span>
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="hi-links">
          <p className="hi-note">
            {mail ? "or find me elsewhere." : "find me elsewhere."}
          </p>
          <FooterLinkProvider className="inline" withMail={!mail} />
        </div>
      </Section>

      <Band />
      <div className="end">
        <Closing />
        <Link href="/projects">
          the work lives here
          <ArrowRight className="icon" aria-hidden />
        </Link>
      </div>

      <Pile />

      <div className="pile-base">
        <div className="psst">
          <p>
            &copy; {new Date().getFullYear()} {Info.name.toLowerCase()} &middot;
            istanbul <RollingClock />
          </p>
          <p className="psst-keys">
            psst, try{" "}
            {KEYS.map((k, i) => (
              <React.Fragment key={i}>
                <kbd>{k}</kbd>{" "}
              </React.Fragment>
            ))}
          </p>
        </div>
        <Suspense fallback={null}>
          <NowListeningCard />
        </Suspense>
      </div>
    </footer>
  );
}

export default Footer;
