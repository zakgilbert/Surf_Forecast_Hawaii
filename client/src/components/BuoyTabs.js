import React, { useState, useMemo } from "react";
import { Table, Popup, Tab } from "semantic-ui-react";
import { formatDate } from "../utility";
import ArrowIndicator from "./ArrowIndicator";
import { BUOY_TAB_CHART_HEIGHT, BUOY_TAB_CHART_WIDTH } from "../constants";
import { isMobile } from "react-device-detect";
import { formatDayTime, formatTime, parseDateSafe } from "../utility";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BuoyTabs = ({ data }) => {
  const [activeTab, setActiveTab] = useState("table");

  const timeIndex = useMemo(
    () => data.cols.findIndex((c) => c.value === "Time"),
    [data]
  );

  const mobileCols = useMemo(() => {
    return data.cols
      .map((c, idx) => ({ ...c, idx }))
      .filter((c) => c.value !== "Time");
  }, [data]);

  const getChartData = (yKey) => {
    if (!data || !data.cols || !data.rows) return [];
    const yIndex = data.cols.findIndex((c) => c.value === yKey);
    if (timeIndex === -1 || yIndex === -1) return [];

    return data.rows.map((row) => {
      const d = parseDateSafe(row[timeIndex]);
      return {
        ts: d ? d.getTime() : null,
        timeStr: formatDate(row[timeIndex]),
        [yKey]: Number(row[yIndex]),
      };
    });
  };

  const DesktopTable = (
    <div className="buoy-tabs-desktop-table-wrap">
      <Table
        celled
        compact
        striped
        unstackable
        className="buoy-tabs-desktop-table"
      >
        <Table.Header>
          <Table.Row>
            {data.cols.map((col) => (
              <Popup
                key={col.value}
                trigger={<Table.HeaderCell>{col.value}</Table.HeaderCell>}
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
                <Table.Cell key={colIndex} className="buoy-tabs-desktop-cell">
                  {data.cols[colIndex].value === "Time" ? (
                    formatDayTime(val)
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
    </div>
  );

  const MobileWideTable = (
    <div className="buoy-tabs-mobile-table-scroll">
      <Table celled compact unstackable className="buoy-tabs-mobile-table">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="buoy-tabs-sticky-col buoy-tabs-sticky-header">
              Time
            </Table.HeaderCell>
            {mobileCols.map((col) => (
              <Popup
                key={col.value}
                trigger={
                  <Table.HeaderCell className="buoy-tabs-metric-col-header">
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
          {data.rows.map((row, rIdx) => (
            <Table.Row key={rIdx}>
              <Table.Cell className="buoy-tabs-sticky-col">
                {formatTime(row[timeIndex])}
              </Table.Cell>
              {mobileCols.map((col) => {
                const val = row[col.idx];
                const isDir = col.value === "MWD";
                return (
                  <Table.Cell
                    key={col.value + col.idx}
                    className="buoy-tabs-metric-col-cell"
                  >
                    {isDir ? (
                      <Popup
                        content={<ArrowIndicator direction={Number(val)} />}
                        trigger={<span>{val}°</span>}
                        position="top center"
                      />
                    ) : (
                      String(val)
                    )}
                  </Table.Cell>
                );
              })}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );

  const SwellHeightChart = isMobile ? (
    <div className="buoy-tabs-chart-mobile-wrap">
      <ResponsiveContainer width="100%" height={BUOY_TAB_CHART_HEIGHT}>
        <LineChart
          data={getChartData("SwH")}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis
            dataKey="time"
            interval="preserveStartEnd"
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => formatDayTime(v)}
          />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip labelFormatter={(v) => formatDayTime(v)} />
          <Line type="monotone" dataKey="SwH" stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  ) : (
    <div className="buoy-tabs-chart-desktop-wrap">
      <LineChart
        width={BUOY_TAB_CHART_WIDTH}
        height={BUOY_TAB_CHART_HEIGHT}
        data={getChartData("SwH")}
        margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
      >
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="time" textAnchor="end" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="SwH" stroke="#8884d8" />
      </LineChart>
    </div>
  );

  const SwellPeriodChart = isMobile ? (
    <div className="buoy-tabs-chart-mobile-wrap">
      <ResponsiveContainer width="100%" height={BUOY_TAB_CHART_HEIGHT}>
        <LineChart
          data={getChartData("SwP")}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            interval="preserveStartEnd"
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => formatDayTime(v)}
          />
          <YAxis domain={[3, "auto"]} tick={{ fontSize: 11 }} />
          <Tooltip labelFormatter={(v) => formatDayTime(v)} />
          <Line type="monotone" dataKey="SwP" stroke="#82ca9d" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  ) : (
    <div className="buoy-tabs-chart-desktop-wrap">
      <LineChart
        width={BUOY_TAB_CHART_WIDTH}
        height={BUOY_TAB_CHART_HEIGHT}
        data={getChartData("SwP")}
        margin={{ top: 10, right: 15, left: 15, bottom: 0 }}
      >
        <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
        <XAxis dataKey="time" textAnchor="front" tickSize={6} />
        <YAxis domain={[3, "auto"]} />
        <Tooltip />
        <Line type="monotone" dataKey="SwP" stroke="#82ca9d" />
      </LineChart>
    </div>
  );

  const panes = [
    {
      menuItem: "Buoy Data",
      render: () => (
        <Tab.Pane className="buoy-tabs-pane">
          {isMobile ? MobileWideTable : DesktopTable}
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Swell Height",
      render: () => (
        <Tab.Pane className="buoy-tabs-pane">{SwellHeightChart}</Tab.Pane>
      ),
    },
    {
      menuItem: "Swell Period",
      render: () => (
        <Tab.Pane className="buoy-tabs-pane">{SwellPeriodChart}</Tab.Pane>
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