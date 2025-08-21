// utility.js
import StationInput from "./components/StationInput.js";
import Power from "./components/Power.js";
import Tide from "./components/Tide.js";
import Forecast from "./components/Forecast.js";
import MarineForecast from "./components/MarineForecast.js";
import AnimatedWaveModel from "./components/AnimatedWaveModel.js";
import Histogram from "./components/Histogram.js";
import HurricaneImage from "./components/Hurricane.js";
import { CONTENT_DATA } from "./constants.js";

/* ---------------- Date helpers ---------------- */

const getFormattedDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

// Today to +1 day (as your existing code does)
export const getTideBeginAndEndDates = () => {
  const today = new Date();
  const beginDate = getFormattedDate(today);
  const endDate = getFormattedDate(new Date(today.setDate(today.getDate() + 1)));
  return { beginDate, endDate };
};

// Friendly date for desktop tables, etc.
export const formatDate = (datetime) => {
  const date = new Date(datetime);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

/* ---- Robust parsing: handles ISO, "YYYY-MM-DD HH:mm", "YYYY-MM-DD hh:mm AM", epochs, TZ abbrevs ---- */

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
  if (m && TZ_ABBREV[m[1]]) return s.replace(m[0], "") + TZ_ABBREV[m[1]];
  return s;
}

export function parseDateSafe(val) {
  if (val == null) return null;

  // numbers / numeric strings => epoch (sec or ms)
  if (typeof val === "number" || /^\d+$/.test(String(val).trim())) {
    const n = Number(val);
    return new Date(n < 1e12 ? n * 1000 : n);
  }

  let s = String(val).trim();

  // 24h: "YYYY-MM-DD HH:mm[:ss]" -> ISO UTC
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(s)) {
    const isoUtc = s.replace(" ", "T") + "Z";
    const d = new Date(isoUtc);
    if (!isNaN(d)) return d;
  }

  // 12h with AM/PM: "YYYY-MM-DD hh:mm[:ss] AM/PM" -> build UTC
  const m12 = s.match(
    /^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i
  );
  if (m12) {
    const [, Y, M, D, hh, mm, ss = "0", ap] = m12;
    let h = parseInt(hh, 10);
    if (/PM/i.test(ap) && h < 12) h += 12;
    if (/AM/i.test(ap) && h === 12) h = 0;
    const d = new Date(Date.UTC(
      parseInt(Y, 10),
      parseInt(M, 10) - 1,
      parseInt(D, 10),
      h,
      parseInt(mm, 10),
      parseInt(ss, 10)
    ));
    if (!isNaN(d)) return d;
  }

  // Normalize timezone abbreviations (HST, PDT, etc.)
  s = normalizeTzAbbrev(s);

  // Try native
  let d = new Date(s);
  if (!isNaN(d)) return d;

  // Try inserting 'T'
  d = new Date(s.replace(" ", "T"));
  if (!isNaN(d)) return d;

  // Assume UTC if no zone
  if (!/[Z+\-]\d{2}:?\d{2}$/.test(s)) {
    d = new Date(s + "Z");
    if (!isNaN(d)) return d;
  }

  return null;
}

/* ---- Consistent formatting (defaults to Honolulu time) ---- */

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

/* ---------------- Misc ---------------- */

export const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

/* ---- Component router for grid ---- */

const componentMap = {
  buoy: ({ station }) => <StationInput id={station} />,
  power: ({ station }) => <Power id={station} />,
  tide: ({ station }) => {
    const { beginDate } = getTideBeginAndEndDates();
    return <Tide id={station} beginDate={beginDate} timeZone="LST" />;
  },
  forecast: ({ station }) => <Forecast id={station} />,
  "marine-forecast": ({ station }) => <MarineForecast id={station} />,
  "wave-model-period": ({ station }) => <AnimatedWaveModel id={station} mode="per" />,
  "wave-model-height": ({ station }) => <AnimatedWaveModel id={station} mode="height" />,
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

export const handleGridCall = (item) => gridRenderer[item.tag](item);

export const groupedData = CONTENT_DATA.reduce((acc, item) => {
  (acc[item.tag] ||= []).push(item);
  return acc;
}, {});
