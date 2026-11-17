import { AirtableInfo, AirtableProject } from "@/types/air";

/**
 * Airtable failures used to vanish into an empty list. Say why in the server
 * logs (never the key itself), so a bad token or base id is easy to spot.
 */
const report = async (table: string, res: Response) => {
  let detail = "";
  try {
    const body = await res.json();
    /* Airtable answers either {error: {type}} or {errors: [{error}]} */
    detail =
      body?.error?.type ??
      body?.errors?.[0]?.error ??
      body?.error ??
      JSON.stringify(body).slice(0, 160);
    if (typeof detail === "object") detail = JSON.stringify(detail);
  } catch (e) {}
  const base = process.env.AIRTABLE_BASE ?? "";
  console.error(
    `[airtable] ${table}: ${res.status} ${detail} (base ${
      base ? base.slice(0, 6) + "…" : "missing"
    }, key ${process.env.AIRTABLE_API_KEY ? "set" : "missing"})`
  );
};

class AirtableInstance {
  getInfos = async (): Promise<AirtableInfo[]> => {
    try {
      const res = await fetch(
        `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}/Info?maxRecords=10&view=Grid%20view`,
        {
          headers: {
            Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          },
          /* contact links barely change; a day keeps well inside Airtable's
           * monthly API allowance (every page reads them twice) */
          next: { revalidate: 86400 },
        }
      );

      if (!res.ok) {
        await report("Info", res);
        return [];
      }

      const data = await res.json();

      return (data.records as unknown as Array<{ fields: any }>).map(
        (record: any) => ({
          label: (record.fields.Label ?? "") as string,
          url: (record.fields.URL ?? "") as string,
          type: (record.fields.LinkType ?? "") as string,
        })
      );
    } catch (e) {
      console.error("[airtable] request failed:", (e as Error).message);
      return [];
    }
  };

  getShowcase = async (working: 1 | 0): Promise<AirtableProject[]> => {
    try {
      const res = await fetch(
        `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}/Projects?maxRecords=10&view=Grid%20view&&filterByFormula={CurrentlyWorking}=${working}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          },
          next: { revalidate: 86400 },
        }
      );

      if (!res.ok) {
        await report("Projects", res);
        return [];
      }

      const data = await res.json();

      return (data.records as unknown as Array<{ fields: any }>).map(
        (record) => ({
          name: (record.fields.Name ?? "") as string,
          description: (record.fields.Description ?? "") as string,
          currently: (record.fields.CurrentlyWorking ?? false) as
            | boolean
            | 1
            | 0,
          icon: (record.fields.Icon ?? "") as string,
          live: (record.fields.Live ?? "") as string,
          github: (record.fields.Github ?? "") as string,
        })
      );
    } catch (e) {
      console.error("[airtable] request failed:", (e as Error).message);
      return [];
    }
  };
}

const air = new AirtableInstance();

export default air;
