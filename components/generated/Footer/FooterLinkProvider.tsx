import React from "react";
import FooterLink from "@/components/generated/Footer/FooterLink";
import Info from "@/infos";
import { FooterLinkProps } from "@/types";

const FooterLinkProvider = () => {
  return (
    <ul className="mt-4 flex flex-col gap-1.5">
      {Info.contact.map((item: FooterLinkProps, index: number) => {
        return <FooterLink {...item} key={index} />;
      })}
    </ul>
  );
};

export default FooterLinkProvider;
