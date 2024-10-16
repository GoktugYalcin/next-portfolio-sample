/**
 * I got this class from Adem İlter(https://github.com/ademilter)
 */

class Unsplash {
  private base_url: string = "https://api.unsplash.com/users/yalcingoktug";
  private client_id: string = `client_id=${process.env.UNSPLASH_ACCESS_KEY}`;

  async getData(url: string) {
    try {
      const res = await fetch(url, {
        method: "GET",
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  getStats() {
    const url = [this.base_url, "/statistics?", this.client_id].join("");
    return this.getData(url);
  }

  getPhotos(per_page = 50) {
    const url = [
      this.base_url,
      `/photos?per_page=${per_page}&`,
      this.client_id,
    ].join("");
    return this.getData(url);
  }
}

const unsplash = new Unsplash();

export default unsplash;
