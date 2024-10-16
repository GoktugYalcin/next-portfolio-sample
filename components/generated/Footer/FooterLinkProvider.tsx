import React from "react";
import FooterLink from "@/components/generated/Footer/FooterLink";
import Info from "@/infos";
import { FooterLinkProps } from "@/types";
import air from "@/lib/fetchers/airtable";

const FooterLinkProvider = async () => {
  const infos = await air.getInfos();

  return (
    <ul className="mt-4 flex flex-col gap-1.5">
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
