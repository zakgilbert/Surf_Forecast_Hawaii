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
import { useDays } from "./DaysContext";
import { isMobile } from "react-device-detect";

const Tide = ({ id, beginDate, timeZone }) => {
  const { days, setDays } = useDays();
  const [data, setData] = useState({});

  useEffect(() => {
    const endDate = moment(beginDate).add(days, "days").format("YYYYMMDD");
    fetch(`/api/tide/${id}/${beginDate}/${endDate}/${timeZone}`)
      .then((res) => res.json())
      .then((d) => setData(d || {}));
  }, [id, beginDate, timeZone, days]);

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

  if (!isMobile) {
    return (
      <Container textAlign="center" className="tide-container">
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
              dot
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="tide-desktop-controls">
          <Label size="medium">Number of Days: {days + 1}</Label>
          <Input
            type="range"
            min={0}
            max={6}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="tide-desktop-slider"
          />
        </div>

        <div className="tide-desktop-table-wrap">
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

  return (
    <Container textAlign="left" className="tide-container tide-mobile-wrap">
      <div className="tide-mobile-chart-box">
        <div className="tide-mobile-touch-guard">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={flattenedData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={true}
                horizontal={true}
              />
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
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="tide-mobile-slider-row">
        <Label size="small" className="tide-mobile-days-label">
          Days: {days + 1}
        </Label>
        <input
          type="range"
          min={0}
          max={6}
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="tide-mobile-slider"
        />
      </div>

      <div className="tide-mobile-card-list">
        {dailyTides.map(({ date, tides }) => (
          <div key={date} className="tide-mobile-card">
            <div className="tide-mobile-card-header">
              {moment(date).format("ddd, MMM D")}
            </div>

            {tides.length > 0 ? (
              <ul className="tide-mobile-list">
                {tides.map((tide, i) => (
                  <li key={i} className="tide-mobile-list-item">
                    <span
                      className={`tide-mobile-badge ${
                        tide.type === "High"
                          ? "tide-mobile-badge-high"
                          : "tide-mobile-badge-low"
                      }`}
                    >
                      {tide.type}
                    </span>
                    <span className="tide-mobile-value">{tide.height}</span>
                    <span className="tide-mobile-time">{tide.time}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="tide-mobile-no-data">No data</div>
            )}
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Tide;