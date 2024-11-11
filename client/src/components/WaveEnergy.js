
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
import { CHART_HEIGHT_NUM } from "../constants";

const WaveEnergy = ({ id }) => {
  const [data, setData] = useState([{}]);

  useEffect(() => {
    fetch(`/power/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data[0]); // Check the data fetched
      });
  }, [id]);

  return data !== undefined ? (
    <Container textAlign="center">
      {/* Main Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data[0].values}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="frequency" 
          />
          <YAxis
            label={{
              value: "Energy Value",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip>

          </Tooltip>
          <Legend />
          <Line
            type="monotone"
            dataKey="energy" 
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Container>
  ) : (
    <></>
  );
};

export default WaveEnergy;
