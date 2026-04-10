import React, { useState, useEffect, useMemo, useRef } from "react";
import { Container, Message } from "semantic-ui-react";
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
import moment from "moment";
import { CHART_HEIGHT_NUM } from "../constants";
import { isMobile } from "react-device-detect";

const Power = ({ id }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activePoint, setActivePoint] = useState(null);
  const hideTimerRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    const loadPower = async () => {
      try {
        setLoading(true);
        setError(null);
        setData([]);
        setActivePoint(null);

        const res = await fetch(`/api/power/${id}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(
            `Power data unavailable for buoy ${id} (${res.status})`
          );
        }

        const d = await res.json();
        const safeData = Array.isArray(d) ? d : [];

        if (!safeData.length) {
          throw new Error(`No power data available for buoy ${id}`);
        }

        if (alive) {
          setData(safeData);
        }
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error(`Error loading power data for buoy ${id}:`, err);

        if (alive) {
          setError(err.message || `Failed to load power data for buoy ${id}`);
          setData([]);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    loadPower();

    return () => {
      alive = false;
      controller.abort();

      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [id]);

  const series = useMemo(
    () =>
      (data || []).map((pt) => ({
        ...pt,
        value: Number(pt?.value),
      })),
    [data]
  );

  const CustomTooltip = ({ active = true, payload = [], label }) => {
    if (!active || !payload || !payload.length) return null;

    const selectedPoint = payload[0]?.payload || {};
    const nested = Array.isArray(selectedPoint.values)
      ? selectedPoint.values
      : [];

    return (
      <div className="power-tooltip">
        <p className="power-tooltip-title">
          {moment(label).isValid()
            ? moment(label).format("MMM D, YYYY h:mm A")
            : String(label)}
        </p>

        <p className="power-tooltip-row">
          <strong>Energy Value: </strong>
          {selectedPoint.value}
        </p>

        {selectedPoint.frequency != null && (
          <p className="power-tooltip-row power-tooltip-row-spaced">
            <strong>Period: </strong>
            {(1 / Number(selectedPoint.frequency)).toFixed(2)} seconds
          </p>
        )}

        {nested.length > 0 && (
          <div className="power-tooltip-nested-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={nested}>
                <CartesianGrid strokeDasharray="3 3" vertical horizontal />
                <XAxis
                  dataKey="frequency"
                  label={{ value: "Frequency (Hz)", dy: 12 }}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  label={{ value: "m²/Hz", angle: -90 }}
                  tick={{ fontSize: 10 }}
                />
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="#82ca9d"
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Container textAlign="center" className="power-container">
        <Message info content={`Loading power data for buoy ${id}...`} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container textAlign="center" className="power-container">
        <Message
          warning
          header={`Buoy ${id} power data unavailable`}
          content={error}
        />
      </Container>
    );
  }

  if (!series || series.length === 0) {
    return (
      <Container textAlign="center" className="power-container">
        <Message
          warning
          header={`Buoy ${id} has no power data`}
          content="This buoy may be offline or temporarily unavailable."
        />
      </Container>
    );
  }

  if (!isMobile) {
    return (
      <Container textAlign="center" className="power-container">
        <ResponsiveContainer width="100%" height={CHART_HEIGHT_NUM}>
          <LineChart
            data={series}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical horizontal />
            <XAxis
              dataKey="dataTime"
              tickFormatter={(t) =>
                moment(t, "YYYY-MM-DD HH:mm").format("MMM D, h:mm A")
              }
            />
            <YAxis
              label={{
                value: "m²/Hz",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#9ca3af", strokeDasharray: "5 5" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </Container>
    );
  }

  const handleMouseMove = (state) => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      if (state && state.activePayload && state.activePayload.length) {
        setActivePoint({
          label: state.activeLabel,
          payload: state.activePayload[0].payload,
        });
      }
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    hideTimerRef.current = setTimeout(() => {
      setActivePoint(null);
    }, 150);
  };

  return (
    <Container textAlign="center" className="power-container">
      <div className="power-mobile-chart-wrap">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart
            data={series}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <CartesianGrid strokeDasharray="3 3" vertical horizontal />
            <XAxis
              dataKey="dataTime"
              tick={{ fontSize: 11 }}
              tickCount={6}
              interval="preserveStartEnd"
              tickFormatter={(t) =>
                moment(t, "YYYY-MM-DD HH:mm").format("MMM D, h a")
              }
            />
            <YAxis
              tick={{ fontSize: 11 }}
              label={{
                value: "m²/Hz",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />
            <Tooltip
              content={() => null}
              cursor={{ stroke: "#9ca3af", strokeDasharray: "5 5" }}
              wrapperStyle={{ display: "none" }}
              allowEscapeViewBox={{ x: true, y: true }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {activePoint && (
        <div className="power-mobile-tooltip-wrap">
          <CustomTooltip
            active={true}
            payload={[{ payload: activePoint.payload }]}
            label={activePoint.label}
          />
        </div>
      )}
    </Container>
  );
};

export default Power;