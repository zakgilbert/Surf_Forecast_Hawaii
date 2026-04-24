import React, { useState, useEffect } from "react";
import "./WaveEnergy.css";
import { Container, Table } from "semantic-ui-react";
import ArrowIndicator from "./ArrowIndicator";
import { formatDateTime, formatDate } from "../utility";
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

const WaveEnergy = ({ id }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`/api/power/${id}`)
      .then((res) => res.json())
      .then((responseData) => {
        setData(Array.isArray(responseData) ? responseData : []);
      })
      .catch(() => {
        setData([]);
      });
  }, [id]);

  const firstPoint = data?.[0];
  const chartData = Array.isArray(firstPoint?.values) ? firstPoint.values : [];

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length || !payload[0]?.payload) {
      return null;
    }

    const selectedPoint = payload[0].payload;
    const direction = (selectedPoint.cord1 + selectedPoint.cord2) / 2;

    return (
      <Table celled className="wave-energy-tooltip-table">
        <Table.Body>
          <Table.Row>
            <Table.Cell className="wave-energy-tooltip-label">
              <strong>Energy:</strong>
            </Table.Cell>
            <Table.Cell className="wave-energy-tooltip-value">
              {selectedPoint.energy} units
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell className="wave-energy-tooltip-label">
              <strong>Period:</strong>
            </Table.Cell>
            <Table.Cell className="wave-energy-tooltip-value">
              {(1 / selectedPoint.frequency).toFixed(2)} seconds
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell className="wave-energy-tooltip-label">
              <strong>Swell Direction:</strong>
            </Table.Cell>
            <Table.Cell className="wave-energy-tooltip-value">
              <div className="wave-energy-direction-cell">
                <span>{direction}&deg;</span>
                <ArrowIndicator direction={direction} />
              </div>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  };
  if (!firstPoint || chartData.length === 0) {
    return null;
  }

  return (
    <Container textAlign="center" className="wave-energy-container">
      <p className="wave-energy-timestamp">{formatDate(firstPoint.dataTime)}</p>

      <div className="wave-energy-chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 15 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="frequency"
              label={{
                value: "Frequency (Hz)",
                position: "insideBottom",
                offset: -10,
              }}
            />
            <YAxis
              label={{
                value: "m^2/Hz",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ display: "none" }} />
            <Line
              type="monotone"
              dataKey="energy"
              stroke="#fa1010"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Container>
  );
};

export default WaveEnergy;
