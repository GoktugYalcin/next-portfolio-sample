import React from "react";
import FooterLink from "@/components/generated/Footer/FooterLink";
import air from "@/lib/fetchers/airtable";

/** The contact links from Airtable, as a row of pills. */
const FooterLinkProvider = async ({
  className,
  withMail = true,
}: {
  className?: string;
  /** false where the address is already shown in full */
  withMail?: boolean;
}) => {
  const all = await air.getInfos();
  const infos = withMail
    ? all
    : all.filter((i) => !i.url.startsWith("mailto:"));
  if (!infos.length) return null;

  return (
    <ul className={`flex flex-wrap gap-2 ${className ?? ""}`}>
      {infos.map((i, index) => {
        return (
          <FooterLink
            label={i.label}
            link={i.url}
            siteName={i.type}
            key={index}
          />
        );
      })}
    </ul>
  );
};

export default FooterLinkProvider;
