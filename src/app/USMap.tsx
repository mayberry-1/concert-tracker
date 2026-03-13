"use client";

import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { geoCentroid } from "d3-geo";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Small states where the label won't fit inside the shape
const SMALL_STATES = new Set(["Vermont", "New Hampshire", "Massachusetts", "Rhode Island", "Connecticut", "New Jersey", "Delaware", "Maryland"]);

export default function USMap({ stateCounts }: { stateCounts: Record<string, number> }) {
  const max = Math.max(...Object.values(stateCounts), 1);

  function getColor(count: number) {
    if (count === 0) return "#1f2937";
    const t = count / max;
    const r = Math.round(165 - t * 110);
    const g = Math.round(180 - t * 130);
    const b = Math.round(255 - t * 60);
    return `rgb(${r},${g},${b})`;
  }

  return (
    <ComposableMap projection="geoAlbersUsa" style={{ width: "100%", height: "auto" }}>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const name: string = geo.properties.name;
            const count = stateCounts[name] ?? 0;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const centroid = geoCentroid(geo as any);
            const isSmall = SMALL_STATES.has(name);

            return (
              <g key={geo.rsmKey}>
                <Geography
                  geography={geo}
                  fill={getColor(count)}
                  stroke="#0f172a"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", opacity: 0.85 },
                    pressed: { outline: "none" },
                  }}
                />
                {count > 0 && !isSmall && (
                  <Marker coordinates={centroid}>
                    <text
                      textAnchor="middle"
                      dy=".35em"
                      fontSize={10}
                      fontWeight="800"
                      fill="white"
                      style={{ pointerEvents: "none" }}
                    >
                      {count}
                    </text>
                  </Marker>
                )}
              </g>
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
}
