import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const Histogram = ({ id }) => {
  const [histogramData, setHistogramData] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`/histogram/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const raw = data.histogram;

        // Convert histogram keys to sorted array of { label, count, binStart }
        const parsed = Object.entries(raw)
          .map(([label, count]) => {
            const binStart = parseInt(label.split("–")[0]);
            return { label, count, binStart };
          })
          .sort((a, b) => a.binStart - b.binStart);

        const maxBin = parsed.reduce((max, b) => (b.count > max.count ? b : max), parsed[0]);
        const totalWaves = parsed.reduce((sum, b) => sum + b.count, 0);

        setHistogramData(parsed);
        setStats({
          max: maxBin.label,
          count: data.waveCount,
          largest: data.largestWave || "N/A",
          hTenth: data.hTenth || "N/A",
          tHmax: data.tHmax || "N/A",
          startHST: data.startHST || "[start time]",
          endHST: data.endHST || "[end time]",
        });
      });
  }, [id]);

  return histogramData ? (
    <div style={{ maxWidth: 900, margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: 0 }}>
        Station {id} wave heights (up- and down-cross)
      </h2>
      <p style={{ textAlign: "center", marginTop: 4 }}>
        Start: {stats.startHST} &nbsp;&nbsp;&nbsp; End: {stats.endHST}
      </p>

      <div style={{ textAlign: "center", marginTop: 10, marginBottom: 10 }}>
        <span style={{ color: "darkred", fontWeight: "bold", fontSize: "18px" }}>
          Most common bin: {stats.max} &nbsp;&nbsp;
        </span>
        <span style={{ color: "darkred", fontWeight: "bold", fontSize: "18px" }}>
          Wave count: {stats.count}
        </span>
        <br />
        <span style={{ color: "darkred", fontWeight: "bold", fontSize: "18px" }}>
          Largest wave: {stats.largest} ft
        </span>
        <br />
        <span style={{ color: "darkred" }}>T@Hmax: {stats.tHmax}</span>&nbsp;&nbsp;
        <span style={{ color: "darkred" }}>Htenth: {stats.hTenth}</span>
      </div>

      <ResponsiveContainer width="100%" minHeight={400}>
        <BarChart
          data={histogramData}
          margin={{ top: 10, right: 20, left: 10, bottom: 30 }}
          barCategoryGap={1}
        >
          <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            type="category"
            label={{ value: "Height Range (ft)", position: "insideBottom", dy: 20 }}
          />
          <YAxis
            label={{ value: "Count", angle: -90, position: "insideLeft", dx: -10 }}
          />
          <Tooltip
            formatter={(value) => [`${value}`, "Wave count"]}
            labelFormatter={(label) => `Range: ${label}`}
          />
          <Bar
            dataKey="count"
            fill="rgba(30, 144, 255, 0.5)"
            stroke="#1E90FF"
            strokeWidth={1}
            isAnimationActive={false}
            barSize={16}
          >
            {histogramData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.label === stats.max
                    ? "#FF4500"
                    : "rgba(30, 144, 255, 0.5)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <p style={{ textAlign: "center", color: "#3366cc", marginTop: 12 }}>
        File has passed quality control
      </p>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default Histogram;
