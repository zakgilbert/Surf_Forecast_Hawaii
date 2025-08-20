/**
 * Tide.js
 */
import React, { useState, useEffect, useMemo } from "react";
import { Container, Table, Input, Label } from "semantic-ui-react";
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
import { useDays } from "./DaysContext";
import { isMobile } from "react-device-detect";

const Tide = ({ id, beginDate, timeZone }) => {
  const { days, setDays } = useDays();
  const [data, setData] = useState({}); // keyed by date -> predictions[]

  useEffect(() => {
    const endDate = moment(beginDate).add(days, "days").format("YYYYMMDD");
    fetch(`/tide/${id}/${beginDate}/${endDate}/${timeZone}`)
      .then((res) => res.json())
      .then((d) => setData(d || {}));
  }, [id, beginDate, timeZone, days]);

  // Flatten for the chart; ensure consistent "YYYY-MM-DD HH:mm" timestamp and numeric v
  const flattenedData = useMemo(() => {
    if (!data) return [];
    return Object.entries(data).flatMap(([date, predictions]) =>
      Array.isArray(predictions)
        ? predictions.map((p) => {
            const timePart = (p.t || "").split(" ")[1] || "00:00";
            const t = `${date} ${timePart}`;
            return { ...p, t, v: Number(p.v) };
          })
        : []
    );
  }, [data]);

  // Per-day grouped tides
  const dailyTides = useMemo(() => {
    if (!data) return [];
    return Object.entries(data).map(([date, predictions]) => {
      if (!Array.isArray(predictions)) return { date, tides: [] };
      const tides = predictions.map((p) => ({
        time: moment(p.t, "YYYY-MM-DD HH:mm").isValid()
          ? moment(p.t, "YYYY-MM-DD HH:mm").format("h:mm A")
          : String(p.t),
        height: `${p.v} ft`,
        type: p.type === "H" ? "High" : "Low",
      }));
      return { date, tides };
    });
  }, [data]);

  /* ==================== DESKTOP (unchanged) ==================== */
  if (!isMobile) {
    return (
      <Container textAlign="center">
        <ResponsiveContainer width="100%" height={372}>
          <LineChart
            data={flattenedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="t"
              tickFormatter={(timeStr) =>
                moment(timeStr, "YYYY-MM-DD HH:mm").format("MMM D, h:mm A")
              }
            />
            <YAxis
              label={{
                value: "Height in ft",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              formatter={(value) => [`Value: ${value}ft`]}
              labelFormatter={(label) => {
                const dt = moment(label, "YYYY-MM-DD HH:mm");
                return dt.isValid()
                  ? `Date: ${dt.format("MMM D, YYYY h:mm A")}`
                  : "Invalid date";
              }}
            />
            <Legend />
            <Line
              type="natural"
              dataKey="v"
              stroke="#8884d8"
              strokeWidth={2}
              dot // desktop dots on (as before)
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div style={{ marginTop: "20px", textAlign: "left" }}>
          <Label size="medium">Number of Days: {days + 1}</Label>
          <Input
            type="range"
            min={0}
            max={6}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            style={{ marginLeft: "10px", width: "70%" }}
          />
        </div>

        <div style={{ maxHeight: "158px", overflow: "auto", padding: "5px" }}>
          <Table celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Tide Times</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {dailyTides.map(({ date, tides }) => (
                <Table.Row key={date}>
                  <Table.Cell>{moment(date).format("MMM D, YYYY")}</Table.Cell>
                  <Table.Cell>
                    {tides.length > 0
                      ? tides.map((tide, i) => (
                          <div key={i}>
                            {tide.type} {tide.height} at {tide.time}
                          </div>
                        ))
                      : "No data"}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </Container>
    );
  }

  /* ==================== MOBILE (dots restored + stable tooltips) ==================== */
  return (
    <Container textAlign="left" style={mStyles.wrap}>
      <div style={mStyles.chartBox}>
        {/* Prevent browser scroll from stealing touch events inside the chart */}
        <div style={mStyles.touchGuard}>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={flattenedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true}/>
              <XAxis
                dataKey="t"
                tick={{ fontSize: 11 }}
                tickCount={6}
                interval="preserveStartEnd"
                tickFormatter={(timeStr) =>
                  moment(timeStr, "YYYY-MM-DD HH:mm").format("MMM D, h a")
                }
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                cursor={{ stroke: "#9ca3af", strokeDasharray: "5 5" }}
                allowEscapeViewBox={{ x: true, y: true }}
                wrapperStyle={{ outline: "none" }}
                formatter={(value) => [`${value} ft`]}
                labelFormatter={(label) => {
                  const dt = moment(label, "YYYY-MM-DD HH:mm");
                  return dt.isValid() ? dt.format("MMM D, h:mm A") : String(label);
                }}
              />
              <Line
                type="natural"
                dataKey="v"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 3 }}             // ✅ show points
                activeDot={{ r: 6 }}       // ✅ larger on touch
                isAnimationActive={false}  // ✅ reduce tooltip flicker
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={mStyles.sliderRow}>
        <Label size="small" style={{ marginBottom: 6 }}>
          Days: {days + 1}
        </Label>
        <input
          type="range"
          min={0}
          max={6}
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          style={mStyles.slider}
        />
      </div>

      <div style={mStyles.cardList}>
        {dailyTides.map(({ date, tides }) => (
          <div key={date} style={mStyles.card}>
            <div style={mStyles.cardHeader}>{moment(date).format("ddd, MMM D")}</div>
            {tides.length > 0 ? (
              <ul style={mStyles.ul}>
                {tides.map((tide, i) => (
                  <li key={i} style={mStyles.li}>
                    <span style={mStyles.badge(tide.type)}>{tide.type}</span>
                    <span style={mStyles.val}>{tide.height}</span>
                    <span style={mStyles.time}>{tide.time}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ opacity: 0.7 }}>No data</div>
            )}
          </div>
        ))}
      </div>
    </Container>
  );
};

/* ---------------- Mobile styles ---------------- */
const mStyles = {
  wrap: { paddingTop: 8, paddingBottom: 8 },
  chartBox: {
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "8px 10px",
    background: "#fff",
    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    marginBottom: 12,
  },
  // prevent the page from scrolling while the user slides their finger across the chart
  touchGuard: {
    touchAction: "none",
  },
  sliderRow: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginBottom: 12,
  },
  slider: {
    width: "100%",
    height: 34,
    WebkitAppearance: "none",
    appearance: "none",
    background: "linear-gradient(#e5e7eb, #e5e7eb) left/100% 4px no-repeat",
    borderRadius: 999,
  },
  cardList: { display: "flex", flexDirection: "column", gap: 10 },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "10px 12px",
    background: "#fff",
    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
  },
  cardHeader: { fontWeight: 700, marginBottom: 8, fontSize: 14 },
  ul: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 6 },
  li: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    alignItems: "center",
    gap: 8,
    padding: "4px 0",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
  },
  badge: (type) => ({
    fontSize: 12,
    fontWeight: 700,
    padding: "2px 6px",
    borderRadius: 6,
    background: type === "High" ? "#e0f2fe" : "#fef3c7",
    color: type === "High" ? "#0369a1" : "#92400e",
  }),
  val: { fontWeight: 600, fontSize: 14 },
  time: { fontSize: 13, opacity: 0.85, justifySelf: "end" },
};

export default Tide;
