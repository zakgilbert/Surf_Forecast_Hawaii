import React, { useState, useEffect, useMemo } from "react";
import {
  Grid, GridColumn, GridRow, Segment,
  Table, Popup, Header, Divider
} from "semantic-ui-react";
import { isMobile } from "react-device-detect";
import WaveEnergy from "./WaveEnergy";
import ArrowIndicator from "./ArrowIndicator";
import BuoyTabs from "./BuoyTabs";
import { formatDate } from "../utility";
import { formatTimeMobile, formatDateTime } from "../utility";

const StationInput = ({ id }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch(`/report/${id}`)
      .then((res) => res.json())
      .then((d) => { if (alive) setData(d); });
    return () => { alive = false; };
  }, [id]);

  // ---- IMPORTANT: hooks before any early return ----
  const ready = !!(data && data.cols && data.rows);

  const summaryFields = useMemo(() => {
    if (!ready) return [];
    const base = data.cols.slice(1, 7).map((col, idx) => ({
      key: col.toolTip,
      value: data.rows[0][idx + 1],
      isDir: false,
    }));
    const dir = {
      key: data.cols[10].toolTip,
      value: data.rows[0][10],
      isDir: true,
    };
    return [...base, dir];
  }, [ready, data]);

  if (!ready) return null;

  const SummarySection = () => {
    if (!isMobile) {
      // Desktop: unchanged table
      return (
        <Segment style={styles.segmentBase}>
          <Table celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan="2" textAlign="center">
                  {formatDate(data.rows[0][0])}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {summaryFields.map((row, i) => (
                <Table.Row key={i}>
                  <Table.Cell style={styles.cellLabel}>
                    <strong>{row.key}:</strong>
                  </Table.Cell>
                  <Table.Cell>
                    {row.isDir ? (
                      <Popup
                        content={<ArrowIndicator direction={Number(row.value)} />}
                        trigger={<span>{row.value}&deg;</span>}
                        position="top center"
                      />
                    ) : (
                      row.value
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Segment>
      );
    }

    // Mobile: condensed key–value list
    return (
      <Segment style={styles.segmentBase}>
        <Header as="h4" style={styles.mobileSummaryTitle}>
          {formatDateTime(data.rows[0][0])}
        </Header>
        <div style={styles.kvList}>
          {summaryFields.map((row, i) => (
            <div key={i} style={styles.kvRow}>
              <div style={styles.kvLabel}>{row.key}</div>
              <div style={styles.kvValue}>
                {row.isDir ? (
                  <Popup
                    content={<ArrowIndicator direction={Number(row.value)} />}
                    trigger={<span>{row.value}&deg;</span>}
                    position="top center"
                  />
                ) : (
                  String(row.value)
                )}
              </div>
            </div>
          ))}
        </div>
      </Segment>
    );
  };

  // Chart & tabs (unchanged)
  const chart = (
    <Segment style={styles.segmentBase}>
      <Header as="h4" style={styles.sectionTitle}>Wave Energy</Header>
      <WaveEnergy id={id} />
    </Segment>
  );

  const tabs = (
    <Segment
      style={{
        ...styles.segmentBase,
        ...(isMobile ? styles.tabsMobile : styles.tabsDesktop),
      }}
    >
      <Header as="h4" style={styles.sectionTitle}>Buoy Details</Header>
      <BuoyTabs data={data} />
    </Segment>
  );

  // Layout
  if (isMobile) {
    return (
      <div style={styles.mobileWrap}>
        <Header as="h3" style={styles.pageTitle}>Forecast</Header>
        <SummarySection />
        <Divider />
        {chart}
        <Divider />
        {tabs}
        <div style={styles.bottomSpacer} />
      </div>
    );
  }

  return (
    <div style={styles.desktopWrap}>
      <Grid container stackable columns={2} divided>
        <GridRow>
          <GridColumn width={5}><SummarySection /></GridColumn>
          <GridColumn width={11}>{chart}</GridColumn>
        </GridRow>
      </Grid>
      <Divider />
      <Grid>
        <Grid.Row>
          <Grid.Column width={16} style={styles.tabsColumnDesktop}>
            {tabs}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

const styles = {
  segmentBase: { padding: "0.75rem" },
  sectionTitle: { margin: "0 0 0.5rem" },
  cellLabel: { width: "40%" },

  mobileSummaryTitle: { margin: "0 0 0.5rem" },
  kvList: { display: "grid", gridTemplateColumns: "1fr", gap: "6px" },
  kvRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
  },
  kvLabel: { fontSize: 13, opacity: 0.8, paddingRight: 10 },
  kvValue: { fontSize: 16, fontWeight: 600, justifySelf: "end" },

  mobileWrap: { padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" },
  pageTitle: { marginTop: 0, marginBottom: "0.5rem" },
  tabsMobile: { padding: "0.5rem", overflowY: "visible", maxHeight: "unset" },
  bottomSpacer: { height: 24 },

  desktopWrap: { maxHeight: "850px" },
  tabsDesktop: { padding: "0.5rem", overflowY: "auto", maxHeight: "600px" },
  tabsColumnDesktop: { maxHeight: "260px", overflowY: "auto" },
};

export default StationInput;
