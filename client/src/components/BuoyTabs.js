import React, { useState, useMemo } from "react";
import { Table, Popup, Tab, Segment } from "semantic-ui-react";
import { formatDate } from "../utility";
import ArrowIndicator from "./ArrowIndicator";
import { BUOY_TAB_CHART_HEIGHT, BUOY_TAB_CHART_WIDTH } from "../constants";
import { isMobile } from "react-device-detect";
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

  /* ------------ column indices ------------ */
  const timeIndex = useMemo(
    () => data.cols.findIndex((c) => c.value === "Time"),
    [data]
  );

  // Mobile columns: everything except Time (in current order)
  const mobileCols = useMemo(() => {
    return data.cols
      .map((c, idx) => ({ ...c, idx }))
      .filter((c) => c.value !== "Time");
  }, [data]);

  /* ------------ helpers ------------ */
  // Show time-of-day only (e.g., "10:40 AM") on mobile; desktop uses formatDate as-is
  const formatTimeOnly = (val) => {
    // Try Date parsing first
    const d = new Date(val);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }
    // Fallback: if formatDate returns "Aug 19, 10:40 AM", grab the last chunk
    const s = String(formatDate(val));
    const parts = s.split(", ");
    return parts.length ? parts[parts.length - 1] : s;
  };

  /* ------------ chart data helper ------------ */
  const getChartData = (yKey) => {
    const yIndex = data.cols.findIndex((c) => c.value === yKey);
    if (timeIndex === -1 || yIndex === -1) return [];
    return data.rows.map((row) => ({
      time: formatDate(row[timeIndex]),
      [yKey]: Number(row[yIndex]),
    }));
  };

  /* ------------ DESKTOP TABLE (unchanged) ------------ */
  const DesktopTable = (
    <div style={styles.desktopTableWrap}>
      <Table celled compact striped unstackable style={styles.desktopTableMinWidth}>
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
                <Table.Cell key={colIndex} style={styles.desktopCell}>
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
    </div>
  );

  /* ------------ MOBILE TABLE (rows = timestamps, cols = metrics) ------------ */
  const MobileWideTable = (
    <div style={styles.mobileTableScroll}>
      <Table celled compact unstackable style={styles.mobileTable}>
        <Table.Header>
          <Table.Row>
            {/* Sticky Time header (no fixed px width; we shortened the content instead) */}
            <Table.HeaderCell style={{ ...styles.stickyCol, ...styles.stickyHeader }}>
              Time
            </Table.HeaderCell>
            {mobileCols.map((col) => (
              <Popup
                key={col.value}
                trigger={
                  <Table.HeaderCell style={styles.metricColHeader}>
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
              {/* Sticky first column with TIME-ONLY for mobile */}
              <Table.Cell style={styles.stickyCol}>
                {formatTimeOnly(row[timeIndex])}
              </Table.Cell>
              {mobileCols.map((col) => {
                const val = row[col.idx];
                const isDir = col.value === "MWD";
                return (
                  <Table.Cell key={col.value + col.idx} style={styles.metricColCell}>
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

  /* ------------ Charts (responsive on mobile) ------------ */
  const SwellHeightChart = isMobile ? (
    <div style={styles.chartMobileWrap}>
      <ResponsiveContainer width="100%" height={BUOY_TAB_CHART_HEIGHT}>
        <LineChart data={getChartData("SwH")} margin={styles.chartMobileMargin}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="time" interval="preserveStartEnd" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line type="monotone" dataKey="SwH" stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  ) : (
    <div style={styles.chartDesktopWrap}>
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
    <div style={styles.chartMobileWrap}>
      <ResponsiveContainer width="100%" height={BUOY_TAB_CHART_HEIGHT}>
        <LineChart data={getChartData("SwP")} margin={styles.chartMobileMargin}>
          <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
          <XAxis dataKey="time" interval="preserveStartEnd" tick={{ fontSize: 11 }} />
          <YAxis domain={[3, "auto"]} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line type="monotone" dataKey="SwP" stroke="#82ca9d" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  ) : (
    <div style={styles.chartDesktopWrap}>
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
        <Tab.Pane style={styles.pane}>
          {isMobile ? MobileWideTable : DesktopTable}
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Swell Height",
      render: () => <Tab.Pane style={styles.pane}>{SwellHeightChart}</Tab.Pane>,
    },
    {
      menuItem: "Swell Period",
      render: () => <Tab.Pane style={styles.pane}>{SwellPeriodChart}</Tab.Pane>,
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

/* ---------------- Styles ---------------- */
const styles = {
  pane: { padding: "0.5rem" },

  // Desktop table
  desktopTableWrap: { overflowX: "auto" },
  desktopTableMinWidth: { minWidth: "900px" },
  desktopCell: { padding: "4px", whiteSpace: "nowrap" },

  // Mobile table container
  mobileTableScroll: {
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
    borderRadius: 6,
  },
  mobileTable: {
    // allow natural widths; horizontal scroll will handle overflow
    tableLayout: "auto",
  },

  // Sticky first column (Time)
  stickyCol: {
    position: "sticky",
    left: 0,
    top: 0,
    background: "white",
    zIndex: 2,
    whiteSpace: "nowrap",
    fontWeight: 600,
    padding: "6px 10px",
    textAlign: "left",
  },
  stickyHeader: { zIndex: 3 },

  // Metric columns
  metricColHeader: {
    whiteSpace: "nowrap",
    textAlign: "center",
    padding: "6px 8px",
  },
  metricColCell: {
    whiteSpace: "nowrap",
    textAlign: "right",
    padding: "6px 8px",
    fontSize: 13,
  },

  // Charts
  chartMobileWrap: { width: "100%", height: BUOY_TAB_CHART_HEIGHT },
  chartMobileMargin: { top: 10, right: 10, left: 0, bottom: 0 },
  chartDesktopWrap: { overflow: "visible" },
};

export default BuoyTabs;
