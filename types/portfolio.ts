/** A way to reach me: shown as pills, and the email as the big address. */
export type ContactLink = {
  label: string;
  url: string;
  type: string;
};

export type PortfolioProject = {
  name: string;
  description: string;
  /** listed under "right now" on the home page */
  currently: boolean;
  icon: string;
  live: string;
  github: string;
};
