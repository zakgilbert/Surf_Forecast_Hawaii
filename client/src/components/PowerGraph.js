import React from "react";
import { Container, Header } from "semantic-ui-react";
import "./PowerGraph.css";
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

const data = [
  { name: "Jan", value: 40 },
  { name: "Feb", value: 30 },
  { name: "Mar", value: 20 },
  { name: "Apr", value: 27 },
  { name: "May", value: 18 },
  { name: "Jun", value: 23 },
];

const PowerGraph = () => (
  <Container textAlign="center" className="power-graph-container">
    <Header as="h2" className="power-graph-title">
      Monthly Data Overview
    </Header>

    <div className="chart-fill-wrap">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </Container>
);

export default PowerGraph;
