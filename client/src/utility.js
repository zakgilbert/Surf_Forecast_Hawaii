import StationInput from "./components/StationInput.js";
import Power from "./components/Power.js";
import Tide from "./components/Tide.js";
import Forecast from "./components/Forecast.js";
import MarineForecast from "./components/MarineForecast.js";
import AnimatedWaveModel from "./components/AnimatedWaveModel.js";
import Histogram from "./components/Histogram.js";
import HurricaneImage from "./components/Hurricane.js";
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

const componentMap = {
  buoy: ({ station }) => <StationInput id={station} />,
  power: ({ station }) => <Power id={station} />,
  tide: ({ station }) => {
    const { beginDate } = getTideBeginAndEndDates();
    return <Tide id={station} beginDate={beginDate} timeZone="LST" />;
  },
  forecast: ({ station }) => <Forecast id={station} />,
  "marine-forecast": ({ station }) => <MarineForecast id={station} />,
  "wave-model-period": ({ station }) => (
    <AnimatedWaveModel id={station} mode="per" />
  ),
  "wave-model-height": ({ station }) => (
    <AnimatedWaveModel id={station} mode="height" />
  ),
  histogram: ({ station }) => <Histogram id={station} />,
  hurricane: ({ station }) => {
    const [id, width, height] = station.split("-");
    return <HurricaneImage id={id} width={width} height={height} />;
  },
};

const handler = {
  get(target, prop) {
    return prop in target ? target[prop] : () => <></>; 
  },
};

const gridRenderer = new Proxy(componentMap, handler);

// Now use this in place of your original function
export const handleGridCall = (item) => {
  return gridRenderer[item.tag](item);
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
