import React, { useState, useEffect } from "react";
import { CHART_HEIGHT_STR } from "../constants";
import { isMobile } from "react-device-detect";

const WeatherForecast = ({ id }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let alive = true;

    fetch(`/api/weather-forecast`)
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

  if (!data?.[id]) return null;

  return !isMobile ? (
    <div
      className="marine-forecast marine-forecast-desktop"
      style={{ "--forecast-max-height": CHART_HEIGHT_STR }}
    >
      <pre className="marine-forecast-pre marine-forecast-pre-desktop">
        {data[id]}
      </pre>
    </div>
  ) : (
    <div className="marine-forecast marine-forecast-mobile">
      <pre className="marine-forecast-pre marine-forecast-pre-mobile">
        {data[id]}
      </pre>
    </div>
  );
};

export default WeatherForecast;
