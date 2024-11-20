import React, { useState } from "react";
import { Table, Popup, Tab } from "semantic-ui-react";
import { formatDate } from "../utility";
import ArrowIndicator from "./ArrowIndicator";
import { BUOY_TAB_CHART_HEIGHT } from "../constants";
import { BUOY_TAB_CHART_WIDTH } from "../constants";
import CustomXAxisTick from "./CustomXAxisTick";
import dayjs from 'dayjs'; // For date manipulation

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const BuoyTabs = ({ data }) => {
  const [activeTab, setActiveTab] = useState("table");

  // Helper function to prepare chart data
  const getChartData = (yKey) => {
    const timeIndex = data.cols.findIndex((col) => col.value === "Time");
    const yIndex = data.cols.findIndex((col) => col.value === yKey);

    if (timeIndex === -1 || yIndex === -1) return [];

    return data.rows.map((row) => ({
      time: formatDate(row[timeIndex]), // Format time for better readability
      [yKey]: Number(row[yIndex]),
    }));
  };

  // Function to format X-axis labels (show date for the first entry of each day, time for others)
  const formatXAxis = (tickItem) => {
    const date = dayjs(tickItem);
    const formattedDate = date.format("YYYY-MM-DD"); // Format the date as 'YYYY-MM-DD'
    const formattedTime = date.format("HH:mm"); // Format the time as 'HH:mm'

    // Only show the date on the first entry of each day
    if (date.hour() === 0) {
      return formattedDate; // Show date only for the first entry
    }

    return formattedTime; // Show time for the other entries
  };

  // Tab panes
  const panes = [
    {
      menuItem: "Buoy Data",
      render: () => (
        <Tab.Pane>
          <Table celled>
            <Table.Header>
              <Table.Row>
                {data.cols.map((col) => (
                  <Popup
                    trigger={
                      <Table.HeaderCell key={col.value}>
                        {col.value}
                      </Table.HeaderCell>
                    }
                    content={col.toolTip}
                    position="top center"
                  />
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.rows.map((row, rowIndex) => (
                <Table.Row key={rowIndex}>
                  {row.map((val, colIndex) => (
                    <Table.Cell key={colIndex} style={{ padding: "5px" }}>
                      {data.cols[colIndex].value === "Time" ? (
                        formatDate(val)
                      ) : data.cols[colIndex].value === "MWD" ? (
                        <Popup
                          content={<ArrowIndicator direction={Number(val)} />}
                          trigger={<span>{val}°</span>}
                          position="top center"
                        />
                      ) : (
                        val
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Swell Height",
      render: () => (
        <Tab.Pane>
          <div style={{ overflow: "visible" }}>
            <LineChart
              width={BUOY_TAB_CHART_WIDTH}
              height={BUOY_TAB_CHART_HEIGHT}
              data={getChartData("SwH")}
              margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
            >
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="time" textAnchor="end"/>
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="SwH" stroke="#8884d8" />
            </LineChart>
          </div>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Swell Period",
      render: () => (
        <Tab.Pane>
          <div style={{ overflow: "visible" }}>
            {" "}
            {/* Adjust container height */}
            <LineChart
              width={BUOY_TAB_CHART_WIDTH}
              height={BUOY_TAB_CHART_HEIGHT}
              data={getChartData("SwP")}
              margin={{ top: 10, right: 15, left: 15, bottom: 0 }}
            >
              <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
              <XAxis dataKey="time"  
              textAnchor="front"
              tickSize={6}
              />
              <YAxis domain={[3, "auto"]} />
              <Tooltip />
              <Line type="monotone" dataKey="SwP" stroke="#82ca9d" />
            </LineChart>
          </div>
        </Tab.Pane>
      ),
    },
  ];

  return (
    <Tab
      panes={panes}
      onTabChange={(e, { activeIndex }) =>
        setActiveTab(panes[activeIndex].menuItem.toLowerCase())
      }
    />
  );
};

export default BuoyTabs;
