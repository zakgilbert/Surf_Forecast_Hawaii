import React, { useState, useEffect } from "react";
import { Container, Table, Input, Label} from "semantic-ui-react";
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

const Tide = ({ id, beginDate, timeZone }) => {
  const { days, setDays } = useDays(); // Access days and setDays from context
  const [data, setData] = useState([{}]);

  useEffect(() => {
    const endDate = moment(beginDate).add(days, "days").format("YYYYMMDD");

    fetch(`/tide/${id}/${beginDate}/${endDate}/${timeZone}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data);
      });
  }, [id, beginDate, timeZone, days]);

  const flattenedData = data
    ? Object.entries(data).flatMap(([date, predictions]) =>
        Array.isArray(predictions)
          ? predictions.map((prediction) => ({
              ...prediction,
              t: `${date} ${prediction.t.split(" ")[1]}`,
            }))
          : []
      )
    : [];

  // Organize tide data by date with both high and low tides listed together
  const dailyTides = data
    ? Object.entries(data).map(([date, predictions]) => {
        if (!Array.isArray(predictions)) return { date, tides: [] };

        const tides = predictions.map((prediction) => ({
          time: moment(prediction.t, "YYYY-MM-DD HH:mm").format("h:mm A"),
          height: `${prediction.v} ft`,
          type: prediction.type === "H" ? "High" : "Low",
        }));
        return { date, tides };
      })
    : [];

  return (
    <Container textAlign="center">
      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={372}>
        <LineChart
          data={flattenedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="t"
            tickFormatter={(timeStr) =>
              moment(timeStr, "YYYY-MM-DD hh:mm A").format("MMM D, h:mm A")
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
              const dateTime = moment(label, "YYYY-MM-DD hh:mm A");
              return dateTime.isValid()
                ? `Date: ${dateTime.format("MMM D, YYYY h:mm A")}`
                : "Invalid date";
            }}
          />
          <Legend />
          <Line
            type="natural"
            dataKey="v"
            stroke="#8884d8"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Slider for Selecting Number of Days */}
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

      {/* Table for Tide Times by Date */}
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
                    ? tides.map((tide, index) => (
                        <div key={index}>
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
};

export default Tide;
