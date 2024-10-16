export type AirtableInfo = {
  label: string;
  url: string;
  type: string;
};

export type AirtableProject = {
  name: string;
  description: string;
  currently: boolean | 1 | 0;
  icon: string;
  live: string;
  github: string;
};
