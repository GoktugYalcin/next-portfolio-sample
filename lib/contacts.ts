import air from "@/lib/fetchers/airtable";
import { AirtableInfo } from "@/types/air";
import Info from "@/infos";

/**
 * Contact links for the profile and the footer. Airtable is the source when
 * it answers; otherwise the links in infos.js are used, so the site always
 * has a way to reach me. The email address is always included.
 */
export const getContacts = async (): Promise<AirtableInfo[]> => {
  const fromAir = (await air.getInfos()).filter((i) => i.url);
  const links: AirtableInfo[] = fromAir.length
    ? fromAir
    : (Info.contacts as AirtableInfo[]);

  const hasMail = links.some((i) => i.url.startsWith("mailto:"));
  const mail: AirtableInfo = {
    type: "mail",
    label: Info.author.email,
    url: `mailto:${Info.author.email}`,
  };

  return hasMail ? links : [mail, ...links];
};
