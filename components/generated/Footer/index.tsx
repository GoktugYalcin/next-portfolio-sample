import React from "react";
import NowListeningCard from "@/components/generated/NowListeningCard";
import FooterLinkProvider from "@/components/generated/Footer/FooterLinkProvider";

export const revalidate: number = 30;

export async function Footer() {
  return (
    <div className="mt-16 flex justify-between w-full flex-col-reverse lg:flex-row gap-8 lg:gap-0">
      <div className="flex-col flex justify-center items-start">
        <span className="font-medium">Connect with me</span>
        <FooterLinkProvider />
      </div>
      <NowListeningCard />
    </div>
  );
}

export default Footer;
