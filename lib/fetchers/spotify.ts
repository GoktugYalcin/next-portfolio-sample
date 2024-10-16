import {
  SpotifyAccessToken,
  SpotifyClass,
  SpotifyNowListeningResponse,
  SpotifyRecentlyPlayedResponse,
} from "@/types/spotify";

class Spotify implements SpotifyClass {
  static readonly ENDPOINTS = {
    NOW_PLAYING: "https://api.spotify.com/v1/me/player/currently-playing",
    RECENT_TRACKS:
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
    TOKEN: "https://accounts.spotify.com/api/token",
  };

  readonly CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  readonly CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  readonly REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

  readonly basic: string;

  constructor() {
    this.basic = Buffer.from(
      `${this.CLIENT_ID}:${this.CLIENT_SECRET}`
    ).toString("base64");
  }

  async fetchWithAuth(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const { access_token } = await this.getAccessToken();
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-store",
    });
  }

  async getAccessToken(): Promise<SpotifyAccessToken> {
    const response = await fetch(Spotify.ENDPOINTS.TOKEN, {
      method: "POST",
      headers: {
        Authorization: `Basic ${this.basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=refresh_token&refresh_token=${this.REFRESH_TOKEN}`,
      cache: "no-store",
    });

    return response.json();
  }

  async getNowPlaying(): Promise<SpotifyNowListeningResponse | null> {
    const response = await this.fetchWithAuth(Spotify.ENDPOINTS.NOW_PLAYING);

    if (response.status === 204 || response.status >= 400) {
      return null;
    }

    return response.json();
  }

  async getRecentTrack(): Promise<SpotifyRecentlyPlayedResponse> {
    const response = await this.fetchWithAuth(Spotify.ENDPOINTS.RECENT_TRACKS);

    return response.json();
  }

  async getLastListened() {
    const nowPlaying = await this.getNowPlaying();

    if (nowPlaying) {
      return this.formatTrackInfo(nowPlaying.item, true);
    }

    const recentTrack = await this.getRecentTrack();
    return this.formatTrackInfo(recentTrack.items[0].track, false);
  }

  formatTrackInfo(track: any, isNowPlaying: boolean) {
    return {
      url: track.external_urls.spotify,
      artists: track.artists.map((i: { name: string }) => i.name),
      song: track.name,
      img: track.album.images[0].url,
      isNowPlaying,
    };
  }
}

const spotify = new Spotify();

export default spotify;
