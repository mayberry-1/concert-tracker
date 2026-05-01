import { getConcerts } from "@/lib/concerts";
import ConcertList from "./ConcertList";
import USMap from "./USMap";
import UploadCSV from "./UploadCSV";

export default function Home() {
  const shows = getConcerts();

  const totalArtists = shows.reduce((sum, s) => sum + s.artists.length, 0);
  const uniqueArtists = new Set(
    shows.flatMap((s) => s.artists.map((a) => a.toLowerCase()))
  ).size;
  const earliestYear = shows
    .filter((s) => s.sortKey > 0)
    .at(-1)
    ?.date.match(/\d{4}/)?.[0];

  // Count appearances per artist
  const artistCounts = new Map<string, number>();
  for (const show of shows) {
    for (const artist of show.artists) {
      const key = artist.trim();
      artistCounts.set(key, (artistCounts.get(key) ?? 0) + 1);
    }
  }
  const topArtists = Array.from(artistCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const maxCount = topArtists[0]?.[1] ?? 1;

  // Count shows per venue
  const venueCounts = new Map<string, number>();
  for (const show of shows) {
    const key = show.venue.trim();
    venueCounts.set(key, (venueCounts.get(key) ?? 0) + 1);
  }
  const topVenues = Array.from(venueCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const maxVenueCount = topVenues[0]?.[1] ?? 1;

  // Count shows per year
  const yearCounts = new Map<string, number>();
  for (const show of shows) {
    const year = show.date.match(/\d{4}/)?.[0];
    if (year) yearCounts.set(year, (yearCounts.get(year) ?? 0) + 1);
  }
  const showsByYear = Array.from(yearCounts.entries()).sort((a, b) => +a[0] - +b[0]);
  const maxYearCount = Math.max(...showsByYear.map(([, c]) => c));

  // Count shows per state
  const stateCounts = new Map<string, number>();
  for (const show of shows) {
    const key = show.state.trim();
    if (key) stateCounts.set(key, (stateCounts.get(key) ?? 0) + 1);
  }

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900 px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Concert Tracker</h1>
            <p className="mt-1.5 text-gray-400">Every show, every artist</p>
          </div>
          <UploadCSV />
        </div>

        <div className="mt-8 flex flex-wrap gap-10">
          <Stat label="Shows" value={shows.length} />
          <Stat label="Artist Appearances" value={totalArtists} />
          <Stat label="Unique Artists" value={uniqueArtists} />
          {earliestYear && <Stat label="Since" value={earliestYear} />}
        </div>
      </div>

      {/* Most seen artists + Most visited venues + Map */}
      <div className="border-b border-gray-800 bg-gray-900/50 px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Most Seen Artists
            </h2>
            <div className="space-y-2.5">
              {topArtists.map(([artist, count]) => (
                <div key={artist} className="flex items-center gap-2">
                  <span className="w-28 shrink-0 truncate text-sm text-gray-200" title={artist}>
                    {artist}
                  </span>
                  <div className="flex flex-1 items-center gap-2">
                    <div className="flex-1 rounded-full bg-gray-800 h-2 overflow-hidden">
                      <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${(count / maxCount) * 100}%` }} />
                    </div>
                    <span className="w-5 text-right text-sm text-gray-400">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Most Visited Venues
            </h2>
            <div className="space-y-2.5">
              {topVenues.map(([venue, count]) => (
                <div key={venue} className="flex items-center gap-2">
                  <span className="w-28 shrink-0 truncate text-sm text-gray-200" title={venue}>
                    {venue}
                  </span>
                  <div className="flex flex-1 items-center gap-2">
                    <div className="flex-1 rounded-full bg-gray-800 h-2 overflow-hidden">
                      <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${(count / maxVenueCount) * 100}%` }} />
                    </div>
                    <span className="w-5 text-right text-sm text-gray-400">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Shows Per State
            </h2>
            <USMap stateCounts={Object.fromEntries(stateCounts)} />
          </div>

        </div>
      </div>

      {/* Shows per year */}
      <div className="border-b border-gray-800 bg-gray-900/50 px-6 py-6">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
            Shows Per Year
          </h2>
          <div className="flex items-end gap-1.5 h-28">
            {showsByYear.map(([year, count]) => (
              <div key={year} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs text-gray-400">{count}</span>
                <div
                  className="w-full rounded-t bg-violet-500"
                  style={{ height: `${(count / maxYearCount) * 80}px` }}
                />
                <span className="text-[10px] text-gray-500 -rotate-45 origin-top-left translate-y-3">
                  {year}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ConcertList shows={shows} />
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
    </div>
  );
}
