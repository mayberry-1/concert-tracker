import fs from "fs";
import path from "path";
import Papa from "papaparse";

export interface Show {
  date: string;
  sortKey: number; // timestamp for sorting, 0 if no date
  venue: string;
  city: string;
  state: string;
  artists: string[];
}

const MONTH_MAP: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Sept: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parseDate(raw: string): number {
  // Formats: "Sept. 25, 1993", "Mar. 5, 1998", "May 09, 1998"
  const match = raw.trim().match(/^(\w+)\.?\s+(\d{1,2}),\s+(\d{4})$/);
  if (!match) return 0;
  const month = MONTH_MAP[match[1]];
  if (month === undefined) return 0;
  return new Date(parseInt(match[3]), month, parseInt(match[2])).getTime();
}

export function getConcerts(): Show[] {
  const filePath = path.join(process.cwd(), "src/data/concerts.csv");
  const raw = fs.readFileSync(filePath, "utf-8");

  const { data } = Papa.parse<string[]>(raw, { skipEmptyLines: false });

  // Group rows into shows: blank rows are separators
  const showMap = new Map<string, Show>();
  const showOrder: string[] = [];

  for (const row of data) {
    const [date, artist, venue, city, state] = row.map((v) => v?.trim() ?? "");

    // Skip header row and blank rows
    if (!artist || artist === "Artist") continue;

    const key = `${date}||${venue}||${city}`;

    if (!showMap.has(key)) {
      showMap.set(key, {
        date: date || "Unknown",
        sortKey: parseDate(date),
        venue: venue || "Unknown Venue",
        city: city || "",
        state: state || "",
        artists: [],
      });
      showOrder.push(key);
    }

    showMap.get(key)!.artists.push(artist);
  }

  const shows = showOrder.map((k) => showMap.get(k)!);

  // Sort: dated shows newest first, undated at the end
  return shows.sort((a, b) => {
    if (a.sortKey === 0 && b.sortKey === 0) return 0;
    if (a.sortKey === 0) return 1;
    if (b.sortKey === 0) return -1;
    return b.sortKey - a.sortKey;
  });
}
