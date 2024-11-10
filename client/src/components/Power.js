import React, { useState, useEffect } from "react";
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
import moment from "moment"; // Import moment.js for date formatting
import { CHART_HEIGHT } from "../constants";

const Power = ({ id }) => {
  const [data, setData] = useState([{}]);

  useEffect(() => {
    fetch(`/power/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data); // Check the data fetched
      });
  }, [id]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const selectedPoint = payload[0].payload; // The selected data point from the chart
      return (
        <div style={{ backgroundColor: "#fff", padding: "10px", border: "1px solid #ddd" }}>
          <p>{moment(label).format("MMM D, YYYY h:mm A")}</p>
          <p><strong>Energy Value: </strong>{selectedPoint.value}</p>

          {/* Render the line chart inside the tooltip */}
          <ResponsiveContainer width={200} height={100}>
            <LineChart data={selectedPoint.values}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="frequency" label={{ value: "Frequency(Hz)", dy: 12  }} />
              <YAxis label={{ value: "Energy", angle: -90 }} />
              <Line type="monotone" dataKey="energy" stroke="#82ca9d" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }

    return null;
  };

  return data !== undefined ? (
    <Container textAlign="center">
      {/* Main Chart */}
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="dataTime" // Use dataTime for the main chart
            tickFormatter={(timeStr) =>
              moment(timeStr, "YYYY-MM-DD hh:mm A").format("MMM D, h:mm A")
            } // Format for x-axis
          />
          <YAxis
            label={{
              value: "Energy Value",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            content={<CustomTooltip />} // Use custom tooltip for chart rendering
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value" // Assuming 'value' is the main energy for this graph
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Container>
  ) : (
    <></>
  );
};

export default Power;
