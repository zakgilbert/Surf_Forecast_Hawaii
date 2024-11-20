import StationInput from "./components/StationInput.js";
import Power from "./components/Power.js";
import Tide from "./components/Tide.js";
import Forecast from "./components/Forecast.js";
import MarineForecast from "./components/MarineForecast.js";
import AnimatedWaveModel from "./components/AnimatedWaveModel.js";
import Histogram from "./components/Histogram.js";
import { CONTENT_DATA } from "./constants.js";

const getFormattedDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

export const getTideBeginAndEndDates = () => {
  const today = new Date(); // Get today's date
  const beginDate = getFormattedDate(today); // Current date in YYYYMMDD format

  // Add 3 days to the current date
  const endDate = getFormattedDate(
    new Date(today.setDate(today.getDate() + 1))
  );
  return {
    beginDate: beginDate,
    endDate: endDate,
  };
};

export const isMobile = () => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

export const handleGridCall = (item) => {
  if (item.tag === "buoy") {
    return <StationInput id={item.station} />;
  }
  if (item.tag === "power") {
    return <Power id={item.station} />;
  }
  if (item.tag === "tide") {
    const beginAndEndDates = getTideBeginAndEndDates();
    return (
      <Tide
        id={item.station}
        beginDate={beginAndEndDates.beginDate}
        endDate={beginAndEndDates.endDate}
        timeZone={"LST"}
      />
    );
  }
  if (item.tag === "forecast") {
    return <Forecast id={item.station} />;
  }
  if (item.tag === "marine-forecast") {
    return <MarineForecast id={item.station} />;
  }
  if (item.tag === "wave-model-period") {
    return <AnimatedWaveModel id={item.station} mode={"per"}/>;
  }
  if (item.tag === "wave-model-height") {
    return <AnimatedWaveModel id={item.station} mode={"height"}/>;
  }
  if (item.tag === "histogram") {
    return <Histogram />;
  }
  return <></>;
};

export const groupedData = CONTENT_DATA.reduce((acc, item) => {
  if (!acc[item.tag]) {
    acc[item.tag] = [];
  }
  acc[item.tag].push(item);
  return acc;
}, {});

export const formatDate = (datetime) => {
  const date = new Date(datetime);
  return date.toLocaleString("en-US", {
    month: "short", // MMM
    day: "numeric", // D
    hour: "numeric", // h
    minute: "numeric", // mm
    hour12: true, // A (AM/PM)
  });
};
