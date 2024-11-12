import React, { useState, useEffect } from "react";
import { Container , Tab, Table} from "semantic-ui-react";
import moment from "moment";
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
  const [data, setData] = useState([{}]);

  useEffect(() => {
    fetch(`/power/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data)
      });
  }, [id]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const selectedPoint = payload[0].payload;
      
      return (
        <Table celled>
          <Table.Header>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell style={{ padding: '5px' }}>
                <strong>Energy:</strong>
              </Table.Cell>
              <Table.Cell style={{ padding: '5px' }}>
                {selectedPoint.energy} units
              </Table.Cell>
            </Table.Row>
  
            <Table.Row>
              <Table.Cell style={{ padding: '5px' }}>
                <strong>Period:</strong>
              </Table.Cell>
              <Table.Cell style={{ padding: '5px' }}>
                {(1 / selectedPoint.frequency).toFixed(2)} seconds
              </Table.Cell>
            </Table.Row>
  
            <Table.Row>
              <Table.Cell style={{ padding: '5px' }}>
                <strong>Swell Direction:</strong>
              </Table.Cell>
              <Table.Cell style={{ padding: '5px' }}>
                {(selectedPoint.cord1 + selectedPoint.cord2) / 2}&deg;
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      );
    }
  
    return null;
  };
  return data !== undefined ? (
    <Container textAlign="center">
          <p>{moment(data[0].dataTime).format("MMM D, YYYY h:mm A")}</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data[0].values}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="frequency" />
          <YAxis
            label={{
              value: "Energy Value",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="energy"
            stroke="#d46a6a "
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
