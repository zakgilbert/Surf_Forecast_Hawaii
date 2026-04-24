import React, { useState, useEffect } from "react";
import { CHART_HEIGHT_STR } from "../constants";
import { isMobile } from "react-device-detect";
import "./Forecast.css";

const Forecast = ({ id }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let alive = true;

    fetch(`/api/forecast/${id}`)
      .then((res) => res.json())
      .then((d) => {
        if (alive) setData(d);
      })
      .catch(() => {
        if (alive) setData(null);
      });

    return () => {
      alive = false;
    };
  }, [id]);

  if (!data?.forecast) return null;

  return !isMobile ? (
    <div
      className="forecast forecast-desktop"
      style={{ "--forecast-max-height": CHART_HEIGHT_STR }}
    >
      <pre className="forecast-pre forecast-pre-desktop">{data.forecast}</pre>
    </div>
  ) : (
    <div className="forecast forecast-mobile">
      <pre className="forecast-pre forecast-pre-mobile">{data.forecast}</pre>
    </div>
  );
};

export default Forecast;
