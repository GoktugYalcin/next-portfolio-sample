"use client";

import React from "react";
import { DefaultSeo } from "next-seo";
import { usePathname } from "next/navigation";
import Info from "@/infos";

const Seo = () => {
  const pathname = usePathname();
  const canonicalUrl = `https://gokyalc.in${pathname}`;

  return (
    <DefaultSeo
      title={Info.name}
      description={Info.description}
      canonical={canonicalUrl}
      openGraph={{
        type: "website",
        locale: "en_IE",
        url:
          process.env.NODE_ENV === "production"
            ? "localhost:3000"
            : "https://gokyalc.in",
        site_name: "goktugyalcin",
      }}
    />
  );
};

export default Seo;
