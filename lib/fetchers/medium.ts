class Medium {
  private base_url: string =
    "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@gokyalcin";

  async getData(url: string) {
    try {
      const res = await fetch(url, {
        method: "GET",
      });
      return await res.json();
    } catch (e) {
      return { items: [] };
    }
  }

  getBlogs() {
    return this.getData(this.base_url);
  }
}

export default new Medium();
