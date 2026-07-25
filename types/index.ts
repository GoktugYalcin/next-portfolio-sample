export interface IPhoto {
  id: string;
  alt_description: string;
  links: any;
  urls: any;
  description: string;
  width: number;
  height: number;
  blur_hash: string;
}

export interface IPhotosWrapper {
  data: IPhoto[];
}

export interface PhotoStatCardProps {
  link: string;
  label: string;
  stat: number;
}

export interface IBlog {
  title: string;
  pubDate: string;
  link: string;
}

export interface IBlogs {
  status: string;
  feed: any;
  items: IBlog[];
}

export interface TextProps {
  text: string;
  lightColor: string;
  darkColor: string;
  icon: any;
}

export interface FooterLinkProps {
  siteName: string;
  link: string;
  label: string;
}

export interface INavItem {
  label: string;
  isSelected: boolean;
  href: string;
  labelRef?: (el: HTMLSpanElement | null) => void;
}

export interface NotFoundProps {
  whatNotFound: string;
}

export interface RecentProjectProps {
  label: string;
  description: string;
}