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
// utility.js
const TZ_ABBREV = {
  UTC: "+00:00", GMT: "+00:00",
  HST: "-10:00", HDT: "-09:00",
  PST: "-08:00", PDT: "-07:00",
  MST: "-07:00", MDT: "-06:00",
  CST: "-06:00", CDT: "-05:00",
  EST: "-05:00", EDT: "-04:00",
};

function normalizeTzAbbrev(s) {
  // match trailing timezone token like "... 10:40 HST" or "(HST)"
  const m = s.match(/\s(?:\(|)([A-Z]{2,4})(?:\)|)\s*$/);
  if (m && TZ_ABBREV[m[1]]) {
    return s.replace(m[0], "") + TZ_ABBREV[m[1]];
  }
  return s;
}

export function parseDateSafe(val) {
  if (val == null) return null;

  // numbers or numeric strings => epoch (sec or ms)
  if (typeof val === "number" || /^\d+$/.test(String(val).trim())) {
    const n = Number(val);
    return new Date(n < 1e12 ? n * 1000 : n); // seconds -> ms
  }

  let s = String(val).trim();

  // common “YYYY-MM-DD HH:mm[:ss]” -> ISO + assume UTC if no tz
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(s)) {
    s = s.replace(" ", "T") + "Z";
    const d = new Date(s);
    if (!isNaN(d)) return d;
  }

  // normalize timezone abbreviations (HST, PDT, etc.)
  s = normalizeTzAbbrev(s);

  // try as-is
  let d = new Date(s);
  if (!isNaN(d)) return d;

  // try inserting T between date and time
  d = new Date(s.replace(" ", "T"));
  if (!isNaN(d)) return d;

  // last resort: assume UTC if no zone
  if (!/[Z\+\-]\d{2}:?\d{2}$/.test(s)) {
    d = new Date(s + "Z");
    if (!isNaN(d)) return d;
  }

  return null;
}

// Consistent formatting helpers (default to Honolulu time to match your users)
const HONO = "Pacific/Honolulu";

export function formatTimeMobile(val, opts = {}) {
  const d = parseDateSafe(val);
  if (!d) return String(val);
  const { timeZone = HONO } = opts;
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  }).format(d);
}

export function formatDateTime(val, opts = {}) {
  const d = parseDateSafe(val);
  if (!d) return String(val);
  const { timeZone = HONO } = opts;
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  }).format(d);
}

export function formatDateOnly(val, opts = {}) {
  const d = parseDateSafe(val);
  if (!d) return String(val);
  const { timeZone = HONO } = opts;
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone,
  }).format(d);
}
