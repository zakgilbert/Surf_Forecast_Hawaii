import React, { useState, useEffect } from "react";
import {
  Container,
  Header,
  Button,
  Icon,
  Menu,
  Popup,
  Table,
  TableCell,
} from "semantic-ui-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import moment from "moment"; // Import moment.js for date formatting
import { CHART_HEIGHT_NUM } from "../constants";

const Tide = ({ id, beginDate, endDate, timeZone }) => {
  const [data, setData] = useState([{}]);

  useEffect(() => {
    fetch(`/tide/${id}/${beginDate}/${endDate}/${timeZone}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, [id, beginDate, endDate, timeZone]);

  return data !== undefined ? (
    <Container textAlign="center">
      <ResponsiveContainer width="100%" height={CHART_HEIGHT_NUM}>
        <LineChart
          data={data.predictions}
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
            formatter={(value, name, props) => {
              const dateTime = moment(
                props.payload.dataTime,
                "YYYY-MM-DD hh:mm A"
              ); // Specify format
              return [`Value: ${value}ft`]; // Return formatted value and dateTime
            }}
            labelFormatter={(label) => {
              const dateTime = moment(label, "YYYY-MM-DD hh:mm A"); // Specify format
              if (!dateTime.isValid()) {
                console.error("Invalid label date:", label);
                return "Invalid date";
              }
              return `Date: ${dateTime.format("MMM D, YYYY h:mm A")}`; // Format the label
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
    </Container>
  ) : (
    <></>
  );
};
export default Tide;
