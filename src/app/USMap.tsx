"use client";

import { useEffect, useRef } from "react";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";

const SMALL_STATES = new Set([
  "Vermont", "New Hampshire", "Massachusetts", "Rhode Island",
  "Connecticut", "New Jersey", "Delaware", "Maryland",
]);

export default function USMap({ stateCounts }: { stateCounts: Record<string, number> }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const max = Math.max(...Object.values(stateCounts), 1);

  function getColor(count: number) {
    if (count === 0) return "#1f2937";
    const t = count / max;
    const r = Math.round(165 - t * 110);
    const g = Math.round(180 - t * 130);
    const b = Math.round(255 - t * 60);
    return `rgb(${r},${g},${b})`;
  }

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const width = svg.clientWidth || 600;
    const height = width * 0.62;
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    const projection = geoAlbersUsa().scale(width * 1.25).translate([width / 2, height / 2]);
    const pathGen = geoPath().projection(projection);

    fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
      .then((r) => r.json())
      .then((topo: Topology) => {
        const states = feature(topo, topo.objects.states as GeometryCollection<{ name: string }>);

        // Clear previous render
        while (svg.firstChild) svg.removeChild(svg.firstChild);

        states.features.forEach((geo) => {
          const name = (geo.properties as { name: string }).name;
          const count = stateCounts[name] ?? 0;
          const d = pathGen(geo);
          if (!d) return;

          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("d", d);
          path.setAttribute("fill", getColor(count));
          path.setAttribute("stroke", "#0f172a");
          path.setAttribute("stroke-width", "0.5");
          svg.appendChild(path);

          if (count > 0 && !SMALL_STATES.has(name)) {
            const centroid = pathGen.centroid(geo);
            if (!centroid || isNaN(centroid[0])) return;
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", String(centroid[0]));
            text.setAttribute("y", String(centroid[1]));
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("dominant-baseline", "middle");
            text.setAttribute("font-size", "11");
            text.setAttribute("font-weight", "800");
            text.setAttribute("fill", "white");
            text.setAttribute("pointer-events", "none");
            text.textContent = String(count);
            svg.appendChild(text);
          }
        });
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateCounts]);

  return <svg ref={svgRef} style={{ width: "100%", height: "auto" }} />;
}
