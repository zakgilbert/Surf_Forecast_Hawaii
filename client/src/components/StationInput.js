import React, { useState, useEffect, useMemo } from "react";
import {
  Grid,
  GridColumn,
  GridRow,
  Segment,
  Popup,
  Header,
  Divider,
  Message,
} from "semantic-ui-react";
import { isMobile } from "react-device-detect";
import WaveEnergy from "./WaveEnergy";
import ArrowIndicator from "./ArrowIndicator";
import BuoyTabs from "./BuoyTabs";
import { formatDate, formatDateTime } from "../utility";

const StationInput = ({ id }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        setData(null);

        const res = await fetch(`/api/report/${id}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Buoy ${id} unavailable (${res.status})`);
        }

        const d = await res.json();

        if (!d || !d.cols || !d.rows || !Array.isArray(d.rows) || d.rows.length === 0) {
          throw new Error(`No data available for buoy ${id}`);
        }

        if (alive) {
          setData(d);
        }
      } catch (err) {
        // Ignore aborts caused by unmount / id change
        if (err.name === "AbortError") return;

        console.error(`Error loading buoy ${id}:`, err);

        if (alive) {
          setError(err.message || `Failed to load buoy ${id}`);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      alive = false;
      controller.abort();
    };
  }, [id]);

  const ready = !!(data && data.cols && data.rows && data.rows.length > 0);

  const summaryFields = useMemo(() => {
    if (!ready) return [];

    const base = data.cols.slice(1, 7).map((col, idx) => ({
      key: col.toolTip,
      value: data.rows[0][idx + 1],
      isDir: false,
    }));

    const dir =
      data.cols[10] && data.rows[0][10] !== undefined
        ? {
            key: data.cols[10].toolTip,
            value: data.rows[0][10],
            isDir: true,
          }
        : null;

    return dir ? [...base, dir] : base;
  }, [ready, data]);

  if (loading) {
    return (
      <Segment style={styles.segmentBase}>
        <Header as="h4" style={styles.sectionTitle}>
          Loading buoy {id}...
        </Header>
      </Segment>
    );
  }

  if (error) {
    return (
      <Segment style={styles.segmentBase}>
        <Message
          negative
          header={`Buoy ${id} unavailable`}
          content={error}
        />
      </Segment>
    );
  }

  if (!ready) {
    return (
      <Segment style={styles.segmentBase}>
        <Message
          warning
          header={`Buoy ${id} has no report data`}
          content="This buoy may be offline or temporarily unavailable."
        />
      </Segment>
    );
  }

  const SummarySection = () => (
    <Segment style={styles.segmentBase}>
      <Header as="h4" style={styles.sectionTitle}>
        {isMobile
          ? formatDateTime(data.rows[0][0])
          : formatDate(data.rows[0][0])}
      </Header>
      <div style={styles.kvList}>
        {summaryFields.map((row, i) => (
          <div key={i} style={styles.kvRow}>
            <div style={styles.kvLabel}>{row.key}:</div>
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

  const chart = (
    <Segment style={styles.segmentBase}>
      <Header as="h4" style={styles.sectionTitle}>
        Wave Energy
      </Header>
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
      <Header as="h4" style={styles.sectionTitle}>
        Buoy Details
      </Header>
      <BuoyTabs data={data} />
    </Segment>
  );

  if (isMobile) {
    return (
      <div style={styles.mobileWrap}>
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
          <GridColumn width={5}>
            <SummarySection />
          </GridColumn>
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
  sectionTitle: { margin: "0 0 0.5rem", textAlign: "center" },

  kvList: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "6px",
  },
  kvRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    padding: "4px 0",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
  },
  kvLabel: { fontSize: 13, opacity: 0.85, paddingRight: 10 },
  kvValue: { fontSize: 15, fontWeight: 600, justifySelf: "end" },

  mobileWrap: {
    padding: "0.75rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  pageTitle: { marginTop: 0, marginBottom: "0.5rem" },
  tabsMobile: { padding: "0.5rem", overflowY: "visible", maxHeight: "unset" },
  bottomSpacer: { height: 24 },

  desktopWrap: { maxHeight: "850px" },
  tabsDesktop: { padding: "0.5rem", overflowY: "auto", maxHeight: "600px" },
  tabsColumnDesktop: { maxHeight: "260px", overflowY: "auto" },
};

export default StationInput;