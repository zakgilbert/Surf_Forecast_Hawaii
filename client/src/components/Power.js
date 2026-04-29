import React, { useState, useEffect, useMemo, useRef } from "react";
import { Message } from "semantic-ui-react";
import "./Power.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";
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
          throw new Error(`Power data unavailable for buoy ${id} (${res.status})`);
        }

        const responseData = await res.json();
        const safeData = Array.isArray(responseData) ? responseData : [];

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

  const series = useMemo(() => {
    return (data || [])
      .map((pt) => ({
        ...pt,
        value: Number(pt?.value),
      }))
      .filter((pt) => Number.isFinite(pt.value));
  }, [data]);

  const CustomTooltip = ({ active = true, payload = [], label }) => {
    if (!active || !payload.length) return null;

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
              <LineChart data={nested} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical horizontal />
                <XAxis
                  dataKey="frequency"
                  tick={{ fontSize: 10 }}
                  label={{
                    value: "Frequency (Hz)",
                    position: "insideBottom",
                    offset: -4,
                  }}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  label={{
                    value: "m²/Hz",
                    angle: -90,
                    position: "insideLeft",
                  }}
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
      <div className="power-container">
        <Message info content={`Loading power data for buoy ${id}...`} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="power-container">
        <Message
          warning
          header={`Buoy ${id} power data unavailable`}
          content={error}
        />
      </div>
    );
  }

  if (!series.length) {
    return (
      <div className="power-container">
        <Message
          warning
          header={`Buoy ${id} has no power data`}
          content="This buoy may be offline or temporarily unavailable."
        />
      </div>
    );
  }

  const handleMouseMove = (state) => {
    if (!isMobile) return;

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      if (state?.activePayload?.length) {
        setActivePoint({
          label: state.activeLabel,
          payload: state.activePayload[0].payload,
        });
      }
    });
  };

  const handleMouseLeave = () => {
    if (!isMobile) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    hideTimerRef.current = setTimeout(() => {
      setActivePoint(null);
    }, 150);
  };

  return (
    <div className="power-container">
      <div className="power-chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={series}
            margin={
              isMobile
                ? { top: 10, right: 10, left: 0, bottom: 12 }
                : { top: 10, right: 18, left: 12, bottom: 28 }
            }
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <CartesianGrid strokeDasharray="3 3" vertical horizontal />

            <XAxis
              dataKey="dataTime"
              tick={{ fontSize: isMobile ? 11 : 10 }}
              tickCount={isMobile ? 6 : 5}
              interval="preserveStartEnd"
              tickFormatter={(t) =>
                moment(t, "YYYY-MM-DD HH:mm").format(
                  isMobile ? "MMM D, h a" : "MMM D"
                )
              }
            />

            <YAxis
              width={42}
              tick={{ fontSize: isMobile ? 11 : 10 }}
              label={{
                value: "m²/Hz",
                angle: -90,
                position: "insideLeft",
                offset: 0,
                style: { textAnchor: "middle" },
              }}
            />

            <Tooltip
              content={isMobile ? () => null : <CustomTooltip />}
              cursor={{ stroke: "#9ca3af", strokeDasharray: "5 5" }}
              wrapperStyle={isMobile ? { display: "none" } : undefined}
              allowEscapeViewBox={{ x: true, y: true }}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: isMobile ? 3 : 2 }}
              activeDot={{ r: isMobile ? 6 : 5 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {isMobile && activePoint && (
        <div className="power-mobile-tooltip-wrap">
          <CustomTooltip
            active
            payload={[{ payload: activePoint.payload }]}
            label={activePoint.label}
          />
        </div>
      )}
    </div>
  );
};

export default Power;