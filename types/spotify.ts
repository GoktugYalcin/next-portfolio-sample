export interface ExternalUrls {
  spotify: string;
}

export interface Artist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface Image {
  height: number;
  url: string;
  width: number;
}

export interface Album {
  album_type: string;
  artists: Artist[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

export interface ExternalIds {
  isrc: string;
}

export interface Track {
  album: Album;
  artists: Artist[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
}

export interface Context {
  type: string;
  href: string;
  external_urls: ExternalUrls;
  uri: string;
}

export interface RecentlyPlayedItem {
  track: Track;
  played_at: string;
  context: Context;
}

export interface Cursors {
  after: string;
  before: string;
}

export interface SpotifyRecentlyPlayedResponse {
  items: RecentlyPlayedItem[];
  next: string;
  cursors: Cursors;
  limit: number;
  href: string;
  error?: boolean;
}

export interface Actions {
  disallows: {
    pausing: boolean;
  };
}

export interface SpotifyNowListeningResponse {
  timestamp: number;
  context: Context;
  progress_ms: number;
  item: Track;
  currently_playing_type: string;
  actions: Actions;
  is_playing: boolean;
}

export interface SpotifyEnvironmentVariables {
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_CLIENT_SECRET: string;
  SPOTIFY_REFRESH_TOKEN: string;
}

export interface SpotifyAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  error?: boolean;
}

export interface FormattedTrackInfo {
  year: string;
  url: string;
  artists: string[];
  song: string;
  img: string;
  isNowPlaying: boolean;
}

export interface ISpotify {
  getLastListened(): Promise<FormattedTrackInfo>;
}

interface SpotifyPrivateMethods {
  getAccessToken(): Promise<SpotifyAccessToken>;
  getNowPlaying(): Promise<SpotifyNowListeningResponse | null>;
  getRecentTrack(): Promise<SpotifyRecentlyPlayedResponse>;
  getLastListenedSongs(
    limit: SPOTIFY_RECENT_TRACKS_TYPES
  ): Promise<FormattedTrackInfo[]>;
  fetchWithAuth(url: string, options?: RequestInit): Promise<Response>;
  formatTrackInfo(track: any, isNowPlaying: boolean): FormattedTrackInfo;
}

export interface SpotifyClass extends ISpotify, SpotifyPrivateMethods {}

export enum SPOTIFY_RECENT_TRACKS_TYPES {
  SINGLE = 1,
  MULTIPLE_TRACKS = 9,
}
