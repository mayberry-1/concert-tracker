"use client";

import { useState, useMemo } from "react";
import type { Show } from "@/lib/concerts";

function ArtistModal({
  artist,
  shows,
  onClose,
}: {
  artist: string;
  shows: Show[];
  onClose: () => void;
}) {
  const artistShows = useMemo(
    () => shows.filter((s) => s.artists.some((a) => a === artist)),
    [artist, shows]
  );

  const firstSeen = artistShows.at(-1);
  const lastSeen = artistShows[0];
  const cities = new Set(artistShows.map((s) => s.city).filter(Boolean));
  const venues = new Set(artistShows.map((s) => s.venue));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white text-lg"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-white pr-8">{artist}</h2>

        <div className="mt-4 flex flex-wrap gap-6 text-sm">
          <div>
            <p className="text-xl font-bold text-indigo-400">{artistShows.length}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              {artistShows.length === 1 ? "Show" : "Shows"}
            </p>
          </div>
          <div>
            <p className="text-xl font-bold text-indigo-400">{venues.size}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              {venues.size === 1 ? "Venue" : "Venues"}
            </p>
          </div>
          <div>
            <p className="text-xl font-bold text-indigo-400">{cities.size}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              {cities.size === 1 ? "City" : "Cities"}
            </p>
          </div>
        </div>

        {firstSeen && lastSeen && (
          <p className="mt-3 text-xs text-gray-400">
            {firstSeen === lastSeen
              ? `Seen on ${firstSeen.date}`
              : `First seen ${firstSeen.date} \u2022 Last seen ${lastSeen.date}`}
          </p>
        )}

        <div className="mt-6 space-y-2">
          {artistShows.map((show, i) => (
            <div
              key={i}
              className="rounded border border-gray-800 bg-gray-800/50 px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-28 shrink-0">{show.date}</span>
                <span className="text-sm font-medium text-white">{show.venue}</span>
              </div>
              {show.city && (
                <p className="mt-0.5 ml-[7.5rem] text-xs text-gray-400">
                  {show.city}, {show.state}
                </p>
              )}
              {show.artists.length > 1 && (
                <div className="mt-1.5 ml-[7.5rem] flex flex-wrap gap-1">
                  {show.artists
                    .filter((a) => a !== artist)
                    .map((a, j) => (
                      <span
                        key={j}
                        className="rounded bg-gray-700 px-1.5 py-0.5 text-xs text-gray-300"
                      >
                        {a}
                      </span>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ConcertList({ shows }: { shows: Show[] }) {
  const [query, setQuery] = useState("");
  const [newestFirst, setNewestFirst] = useState(true);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);

  const filtered = query.trim()
    ? shows.filter((show) => {
        const q = query.toLowerCase();
        return (
          show.artists.some((a) => a.toLowerCase().includes(q)) ||
          show.venue.toLowerCase().includes(q) ||
          show.city.toLowerCase().includes(q)
        );
      })
    : [...shows];

  if (!newestFirst) filtered.reverse();

  return (
    <div>
      {selectedArtist && (
        <ArtistModal
          artist={selectedArtist}
          shows={shows}
          onClose={() => setSelectedArtist(null)}
        />
      )}

      {/* Search bar */}
      <div className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950 px-4 py-3">
        <div className="mx-auto max-w-4xl flex gap-2">
          <input
            type="text"
            placeholder="Search artists, venues, or cities…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
          />
          <button
            onClick={() => setNewestFirst((p) => !p)}
            className="shrink-0 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs text-gray-300 hover:border-gray-500 hover:text-white transition-colors"
          >
            {newestFirst ? "Newest first \u2193" : "Oldest first \u2191"}
          </button>
        </div>
        {query && (
          <p className="mt-2 text-center text-xs text-gray-500">
            {filtered.length} {filtered.length === 1 ? "show" : "shows"} found
          </p>
        )}
      </div>

      {/* Show list */}
      <div className="px-4 py-4 space-y-2">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-16">No shows match &ldquo;{query}&rdquo;</p>
        ) : (
          filtered.map((show, i) => (
            <div
              key={i}
              className="rounded border border-gray-800 bg-gray-900 px-4 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-28 shrink-0">{show.date}</span>
                  <span className="text-sm font-semibold text-white">{show.venue}</span>
                  {show.city && (
                    <span className="text-xs text-gray-400">
                      {show.city}, {show.state}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {show.artists.map((artist, j) => (
                  <button
                    key={j}
                    onClick={() => setSelectedArtist(artist)}
                    className={`rounded px-1.5 py-0.5 text-xs font-medium cursor-pointer hover:bg-indigo-500 hover:text-white transition-colors ${
                      query && artist.toLowerCase().includes(query.toLowerCase())
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-800 text-gray-300"
                    }`}
                  >
                    {artist}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
