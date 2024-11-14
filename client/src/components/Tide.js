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
        console.log(data);
      });
  }, [id, beginDate, endDate, timeZone]);

  const flattenedData = data
    ? Object.entries(data).flatMap(([date, predictions]) =>
        Array.isArray(predictions)
          ? predictions.map((prediction) => ({
              ...prediction,
              t: `${date} ${prediction.t.split(" ")[1]}`, // Construct full timestamp with date and time
            }))
          : []
      )
    : [];

 // Organize tide data by date with both high and low tides listed together
 const dailyTides = data
 ? Object.entries(data).map(([date, predictions]) => {
     if (!Array.isArray(predictions)) return { date, tides: [] };

     const tides = predictions.map(prediction => ({
       time: moment(prediction.t, "YYYY-MM-DD HH:mm").format("h:mm A"),
       height: `${prediction.v} ft`,
       type: prediction.type === 'H' ? 'High' : 'Low'
     }));
     return { date, tides };
   })
 : [];

  return data !== undefined ? (
    <Container textAlign="center">
      <ResponsiveContainer width="100%" height={330}>
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
      {/* Table for Tide Times by Date */}
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
                        {tide.height} at {tide.time} ({tide.type})
                      </div>
                    ))
                  : "No data"}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  ) : (
    <></>
  );
};
export default Tide;
