import { contacts } from "@/data/portfolio";
import { ContactLink } from "@/types/portfolio";

/** Contact links for the profile and the footer, from data/portfolio.ts. */
export const getContacts = async (): Promise<ContactLink[]> => contacts;
