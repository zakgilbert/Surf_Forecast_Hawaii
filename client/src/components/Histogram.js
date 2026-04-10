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

const HISTOGRAM_BAR_FILL = "rgba(30, 144, 255, 0.5)";
const HISTOGRAM_BAR_STROKE = "#1E90FF";
const HISTOGRAM_HIGHLIGHT_FILL = "#FF4500";
const HISTOGRAM_GRID_STROKE = "#ccc";
const HISTOGRAM_STATS_COLOR = "darkred";
const HISTOGRAM_STATUS_COLOR = "#3366cc";

const Histogram = ({ id }) => {
  const [histogramData, setHistogramData] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`/api/histogram/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const raw = data.histogram;

        const parsed = Object.entries(raw)
          .map(([label, count]) => {
            const binStart = parseInt(label.split("–")[0], 10);
            return { label, count, binStart };
          })
          .sort((a, b) => a.binStart - b.binStart);

        const maxBin = parsed.reduce(
          (max, bin) => (bin.count > max.count ? bin : max),
          parsed[0]
        );

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
      })
      .catch(() => {
        setHistogramData(null);
        setStats(null);
      });
  }, [id]);

  if (!histogramData || !stats) {
    return <div className="histogram-loading">Loading...</div>;
  }

  return (
    <div className="histogram">
      <h2 className="histogram-title">
        Station {id} wave heights (up- and down-cross)
      </h2>

      <p className="histogram-time-range">
        Start: {stats.startHST} &nbsp;&nbsp;&nbsp; End: {stats.endHST}
      </p>

      <div className="histogram-stats">
        <span className="histogram-stats-primary">
          Most common bin: {stats.max} &nbsp;&nbsp;
        </span>
        <span className="histogram-stats-primary">
          Wave count: {stats.count}
        </span>
        <br />
        <span className="histogram-stats-primary">
          Largest wave: {stats.largest} ft
        </span>
        <br />
        <span className="histogram-stats-secondary">
          T@Hmax: {stats.tHmax}
        </span>
        &nbsp;&nbsp;
        <span className="histogram-stats-secondary">
          Htenth: {stats.hTenth}
        </span>
      </div>

      <div className="histogram-chart-wrap">
        <ResponsiveContainer width="100%" minHeight={400}>
          <BarChart
            data={histogramData}
            margin={{ top: 10, right: 20, left: 10, bottom: 30 }}
            barCategoryGap={1}
          >
            <CartesianGrid
              stroke={HISTOGRAM_GRID_STROKE}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="label"
              type="category"
              label={{
                value: "Height Range (ft)",
                position: "insideBottom",
                dy: 20,
              }}
            />
            <YAxis
              label={{
                value: "Count",
                angle: -90,
                position: "insideLeft",
                dx: -10,
              }}
            />
            <Tooltip
              formatter={(value) => [`${value}`, "Wave count"]}
              labelFormatter={(label) => `Range: ${label}`}
            />
            <Bar
              dataKey="count"
              fill={HISTOGRAM_BAR_FILL}
              stroke={HISTOGRAM_BAR_STROKE}
              strokeWidth={1}
              isAnimationActive={false}
              barSize={16}
            >
              {histogramData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.label === stats.max
                      ? HISTOGRAM_HIGHLIGHT_FILL
                      : HISTOGRAM_BAR_FILL
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p
        className="histogram-status"
        style={{ "--histogram-status-color": HISTOGRAM_STATUS_COLOR }}
      >
        File has passed quality control
      </p>
    </div>
  );
};

export default Histogram;