import { AirtableInfo, AirtableProject } from "@/types/air";

class AirtableInstance {
  getInfos = async () => {
    const res = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}/Info?maxRecords=3&view=Grid%20view`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        },
      }
    );
    const data = await res.json();

    const mappedRecords: AirtableInfo[] = (
      data.records as unknown as Array<{ fields: any }>
    ).map((record: any) => ({
      label: (record.fields.Label ?? "") as string,
      url: (record.fields.URL ?? "") as string,
      type: (record.fields.LinkType ?? "") as string,
    }));

    return mappedRecords;
  };

  getShowcase = async (working: 1 | 0) => {
    const res = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}/Projects?maxRecords=10&view=Grid%20view&&filterByFormula={CurrentlyWorking}=${working}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        },
      }
    );
    const data = await res.json();

    const mappedRecords: AirtableProject[] = (
      data.records as unknown as Array<{ fields: any }>
    ).map((record) => ({
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
