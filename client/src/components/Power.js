/**
 * Power.js
 */
import React, { useState, useEffect, useMemo } from "react";
import { Container } from "semantic-ui-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";
import { CHART_HEIGHT_NUM } from "../constants";
import { isMobile } from "react-device-detect";

const Power = ({ id }) => {
  const [data, setData] = useState([]); // safer default than [{}]

  useEffect(() => {
    let alive = true;
    fetch(`/power/${id}`)
      .then((res) => res.json())
      .then((d) => {
        if (alive) setData(Array.isArray(d) ? d : []);
      })
      .catch(() => {
        if (alive) setData([]);
      });
    return () => {
      alive = false;
    };
  }, [id]);

  // Ensure values are numeric so the chart behaves consistently
  const series = useMemo(
    () =>
      (data || []).map((pt) => ({
        ...pt,
        value: Number(pt?.value),
      })),
    [data]
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const selectedPoint = payload[0]?.payload || {};
      const nested = Array.isArray(selectedPoint.values)
        ? selectedPoint.values
        : [];

      return (
        <div
          style={{
            backgroundColor: "#fff",
            padding: 16,
            border: "2px solid #ddd",
            borderRadius: 8,
            fontSize: 14,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            width: 300,
          }}
        >
          <p style={{ margin: 0, fontWeight: 600 }}>
            {moment(label).isValid()
              ? moment(label).format("MMM D, YYYY h:mm A")
              : String(label)}
          </p>
          <p style={{ margin: "6px 0 0" }}>
            <strong>Energy Value: </strong>
            {selectedPoint.value}
          </p>
          {selectedPoint.frequency != null && (
            <p style={{ margin: "4px 0 8px" }}>
              <strong>Period: </strong>
              {(1 / Number(selectedPoint.frequency)).toFixed(2)} seconds
            </p>
          )}

          {/* Mini chart inside tooltip */}
          {nested.length > 0 && (
            <div style={{ width: "100%", height: 150 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={nested}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={true}
                    horizontal={true}
                  />
                  <XAxis
                    dataKey="frequency"
                    label={{ value: "Frequency (Hz)", dy: 12 }}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    label={{ value: "Energy", angle: -90 }}
                    tick={{ fontSize: 10 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="energy"
                    stroke="#82ca9d"
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  if (!series || series.length === 0) return <></>;

  // === Desktop: unchanged visual behavior ===
  if (!isMobile) {
    return (
      <Container textAlign="center">
        <ResponsiveContainer width="100%" height={CHART_HEIGHT_NUM}>
          <LineChart
            data={series}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={true}
              horizontal={true}
            />
            <XAxis
              dataKey="dataTime"
              tickFormatter={(timeStr) =>
                moment(timeStr, "YYYY-MM-DD HH:mm").format("MMM D, h:mm A")
              }
            />
            <YAxis
              label={{
                value: "m²/Hz",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#9ca3af", strokeDasharray: "5 5" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </Container>
    );
  }

  // === Mobile: compact height, dots visible, stable tooltips, vertical grid lines ===
  return (
    <Container textAlign="center">
      <div style={{ touchAction: "none" }}>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart
            data={series}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={true}
              horizontal={true}
            />
            <XAxis
              dataKey="dataTime"
              tick={{ fontSize: 11 }}
              tickCount={6}
              interval="preserveStartEnd"
              tickFormatter={(timeStr) =>
                moment(timeStr, "YYYY-MM-DD HH:mm").format("MMM D, h a")
              }
            />
            <YAxis
              tick={{ fontSize: 11 }}
              label={{
                value: "m²/Hz",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#9ca3af", strokeDasharray: "5 5" }}
              allowEscapeViewBox={{ x: true, y: true }}
              wrapperStyle={{ outline: "none" }}
            />
            {/* Hide legend on mobile to save space; turn on dots & disable animation */}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Container>
  );
};

export default Power;
