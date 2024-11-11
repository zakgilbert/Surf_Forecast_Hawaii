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
import { CHART_HEIGHT_NUM } from "../constants";

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
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px", // Increased padding
            border: "2px solid #ddd", // Make border slightly thicker
            borderRadius: "8px", // Add rounded corners for better visual appeal
            fontSize: "16px", // Increase font size
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Add a subtle shadow for better visibility
            width: "300px", // Increase width of the tooltip container
          }}
        >
          <p>{moment(label).format("MMM D, YYYY h:mm A")}</p>
          <p>
            <strong>Energy Value: </strong>{selectedPoint.value}
          </p>

          {/* Render the line chart inside the tooltip */}
          <ResponsiveContainer width="100%" height={150}> {/* Increase height */}
            <LineChart data={selectedPoint.values}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="frequency" label={{ value: "Frequency (Hz)", dy: 12 }} />
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
      <ResponsiveContainer width="100%" height={CHART_HEIGHT_NUM}>
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
