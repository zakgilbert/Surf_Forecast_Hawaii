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

        if (
          !d ||
          !d.cols ||
          !d.rows ||
          !Array.isArray(d.rows) ||
          d.rows.length === 0
        ) {
          throw new Error(`No data available for buoy ${id}`);
        }

        if (alive) {
          setData(d);
        }
      } catch (err) {
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
      <Segment className="station-input-segment">
        <Header as="h4" className="station-input-section-title">
          Loading buoy {id}...
        </Header>
      </Segment>
    );
  }

  if (error) {
    return (
      <Segment className="station-input-segment">
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
      <Segment className="station-input-segment">
        <Message
          warning
          header={`Buoy ${id} has no report data`}
          content="This buoy may be offline or temporarily unavailable."
        />
      </Segment>
    );
  }

  const SummarySection = () => (
    <Segment className="station-input-segment">
      <Header as="h4" className="station-input-section-title">
        {isMobile
          ? formatDateTime(data.rows[0][0])
          : formatDate(data.rows[0][0])}
      </Header>
      <div className="station-input-kv-list">
        {summaryFields.map((row, i) => (
          <div key={i} className="station-input-kv-row">
            <div className="station-input-kv-label">{row.key}:</div>
            <div className="station-input-kv-value">
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
    <Segment className="station-input-segment">
      <Header as="h4" className="station-input-section-title">
        Wave Energy
      </Header>
      <WaveEnergy id={id} />
    </Segment>
  );

  const tabs = (
    <Segment
      className={`station-input-segment ${
        isMobile ? "station-input-tabs-mobile" : "station-input-tabs-desktop"
      }`}
    >
      <Header as="h4" className="station-input-section-title">
        Buoy Details
      </Header>
      <BuoyTabs data={data} />
    </Segment>
  );

  if (isMobile) {
    return (
      <div className="station-input-mobile-wrap">
        <SummarySection />
        <Divider />
        {chart}
        <Divider />
        {tabs}
        <div className="station-input-bottom-spacer" />
      </div>
    );
  }

  return (
    <div className="station-input-desktop-wrap">
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
          <Grid.Column width={16} className="station-input-tabs-column-desktop">
            {tabs}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default StationInput;