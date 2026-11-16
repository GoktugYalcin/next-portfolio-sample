import React from "react";
import FooterLink from "@/components/generated/Footer/FooterLink";
import air from "@/lib/fetchers/airtable";

const FooterLinkProvider = async () => {
  const infos = await air.getInfos();
  if (!infos.length) return null;

  return (
    <ul className="grid grid-cols-2 gap-px border-b border-border bg-border sm:grid-cols-4">
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
