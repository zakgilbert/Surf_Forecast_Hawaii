import React, { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";

const MarineForecast = ({ id }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch(`/api/marine-forecast`)
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

  if (!data?.[id]) return <></>;

  return !isMobile ? (
    // 🖥 Desktop view
    <div
      style={{
        height: "640px",
        overflowY: "scroll",
        border: "1px solid #ccc",
        padding: "10px",
        textAlign: "left",
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
        {data[id]}
      </pre>
    </div>
  ) : (
    // 📱 Mobile view
    <div style={{ padding: "10px 12px", textAlign: "left" }}>
      <pre
        style={{
          margin: 0,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          fontSize: 12, // 👈 smaller text for mobile
          lineHeight: 1.35,
        }}
      >
        {data[id]}
      </pre>
    </div>
  );
};

export default MarineForecast;
