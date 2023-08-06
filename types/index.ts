export type SongArtist = {
  name: string;
};

export interface Project {
  name: string;
  desc: string;
  github?: string;
  live?: string;
}

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
  selectAction: Function;
  isSelected: boolean;
  href: string;
}

export interface NotFoundProps {
  whatNotFound: string;
}

export interface Track {
  artist: Artist;
  uts: string;
  "#text": string;
  mbid: string;
  name: string;
  image: Image[];
  url: string;
  streamable: string;
  album: {
    mbid: string;
    "#text": string;
  };
  loved: string;
  "@attr"?: {
    nowplaying: string;
  };
}

export interface Image {
  size: string;
  "#text": string;
}

export interface Artist {
  url: string;
  name: string;
  mbid: string;
  image: Image[];
}

export interface RecentTrack {
  track: Track[];
  "@attr": {
    user: string;
    totalPages: string;
    page: string;
    perPage: string;
    total: string;
  };
}

export interface RecentProjectProps {
  label: string;
  description: string;
}
