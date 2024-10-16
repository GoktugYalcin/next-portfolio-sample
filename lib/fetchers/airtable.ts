import Airtable from "airtable";
import { AirtableInfo, AirtableProject } from "@/types/air";

class AirtableInstance {
  private client = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE!
  );

  getInfos = async () => {
    const res = await this.client("Info")
      .select({
        maxRecords: 10,
      })
      .firstPage();

    const mappedRecords: AirtableInfo[] = res.map((record) => ({
      label: (record.fields.Label ?? "") as string,
      url: (record.fields.URL ?? "") as string,
      type: (record.fields.LinkType ?? "") as string,
    }));

    return mappedRecords;
  };

  getShowcase = async (working: 1 | 0) => {
    const res = await this.client("Projects")
      .select({
        maxRecords: 10,
        filterByFormula: `{CurrentlyWorking} = ${working}`,
      })
      .firstPage();

    const mappedRecords: AirtableProject[] = res.map((record) => ({
      name: (record.fields.Name ?? "") as string,
      description: (record.fields.Description ?? "") as string,
      currently: (record.fields.CurrentlyWorking ?? false) as boolean | 1 | 0,
      icon: (record.fields.Icon ?? "") as string,
      live: (record.fields.Live ?? "") as string,
      github: (record.fields.Github ?? "") as string,
    }));

    return mappedRecords;
  };
}

const air = new AirtableInstance();

export default air;
