import React, { useState, useEffect } from "react";
import { CHART_HEIGHT_STR } from "../constants";
import { isMobile } from "react-device-detect";

const Forecast = ({ id }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch(`/forecast/${id}`)
      .then((res) => res.json())
      .then((d) => {
        if (alive) setData(d);
      })
      .catch(() => {
        if (alive) setData(null);
      });
    return () => {
      alive = false;
    };
  }, [id]);

  if (!data?.forecast) return <></>;

  return !isMobile ? (
    // 🖥 Desktop: same as before
    <div
      style={{
        maxHeight: CHART_HEIGHT_STR,
        overflowY: "scroll",
        border: "1px solid #ccc",
        padding: "10px",
        textAlign: "left",
        height: "700px",
      }}
    >
      <pre
        style={{
          margin: 0,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          fontSize: 14,
          lineHeight: 1.4,
        }}
      >
        {data.forecast}
      </pre>
    </div>
  ) : (
    // 📱 Mobile: condensed, smaller text
    <div style={{ padding: "10px 12px", textAlign: "left" }}>
      <pre
        style={{
          margin: 0,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          fontSize: 12, // 👈 a bit smaller
          lineHeight: 1.35,
        }}
      >
        {data.forecast}
      </pre>
    </div>
  );
};

export default Forecast;
