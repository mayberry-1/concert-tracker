"use client";

import { useState } from "react";
import type { Show } from "@/lib/concerts";

export default function ConcertList({ shows }: { shows: Show[] }) {
  const [query, setQuery] = useState("");
  const [newestFirst, setNewestFirst] = useState(true);

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
            {newestFirst ? "Newest first ↓" : "Oldest first ↑"}
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
                  <span
                    key={j}
                    className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                      query && artist.toLowerCase().includes(query.toLowerCase())
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-800 text-gray-300"
                    }`}
                  >
                    {artist}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
