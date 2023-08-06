import { RecentTrack, Track } from "@/types";

class LastFm {
  private method_type: string = "method=user.getrecenttracks";
  private user_name: string = "&user=gok212";
  private api_key: string = `&api_key=${process.env.NEXT_PUBLIC_LASTFM_API_KEY}`;
  private format: string = "&format=json";
  private extended: string = "&extended=1";
  private base_url: string = "https://ws.audioscrobbler.com/2.0/?";

  async getData(url: string) {
    return await fetch(url, {
      method: "GET",
    })
      .then((data) => data.json())
      .catch((e) => {
        return {};
      });
  }

  async getRecentTracks() {
    const data = await this.getData(
      [
        this.base_url,
        this.method_type,
        this.user_name,
        this.api_key,
        this.format,
        this.extended,
      ].join("")
    );
    return data?.recenttracks?.track[0] as Track;
  }
}

export default new LastFm();
