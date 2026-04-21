import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const constantsPath = path.resolve(__dirname, "../src/constants.js");
const outputPath = path.resolve(__dirname, "../src/generatedLookup.js");

const toKey = (value) =>
  String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " AND ")
    .replace(/'/g, "")
    .replace(/\//g, " ")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_")
    .toUpperCase();

const extractContentData = (source) => {
  const marker = "export const CONTENT_DATA =";
  const start = source.indexOf(marker);

  if (start === -1) {
    throw new Error(
      "Could not find `export const CONTENT_DATA =` in constants.js",
    );
  }

  const arrayStart = source.indexOf("[", start);
  if (arrayStart === -1) {
    throw new Error("Could not find start of CONTENT_DATA array");
  }

  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let escaped = false;
  let arrayEnd = -1;

  for (let i = arrayStart; i < source.length; i += 1) {
    const ch = source[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (ch === "\\") {
      escaped = true;
      continue;
    }

    if (!inDouble && !inTemplate && ch === "'" && source[i - 1] !== "\\") {
      inSingle = !inSingle;
      continue;
    }

    if (!inSingle && !inTemplate && ch === '"' && source[i - 1] !== "\\") {
      inDouble = !inDouble;
      continue;
    }

    if (!inSingle && !inDouble && ch === "`" && source[i - 1] !== "\\") {
      inTemplate = !inTemplate;
      continue;
    }

    if (inSingle || inDouble || inTemplate) {
      continue;
    }

    if (ch === "[") depth += 1;
    if (ch === "]") depth -= 1;

    if (depth === 0) {
      arrayEnd = i;
      break;
    }
  }

  if (arrayEnd === -1) {
    throw new Error("Could not find end of CONTENT_DATA array");
  }

  return source.slice(arrayStart, arrayEnd + 1);
};

const loadContentData = () => {
  const source = fs.readFileSync(constantsPath, "utf8");
  const arrayLiteral = extractContentData(source);

  const sandbox = {};
  const script = new vm.Script(`CONTENT_DATA = ${arrayLiteral};`);
  vm.createContext(sandbox);
  script.runInContext(sandbox);

  if (!Array.isArray(sandbox.CONTENT_DATA)) {
    throw new Error("Parsed CONTENT_DATA is not an array");
  }

  return sandbox.CONTENT_DATA;
};

const buildLookup = (contentData) => {
  const lookup = {};

  for (const item of contentData) {
    const tagKey = toKey(item.tag);
    let nameKey = toKey(item.name);

    if (!lookup[tagKey]) {
      lookup[tagKey] = {};
    }

    if (lookup[tagKey][nameKey] !== undefined) {
      const stationKey = toKey(item.station);
      nameKey = `${nameKey}_${stationKey}`;
    }

    lookup[tagKey][nameKey] = item.id;
  }

  return lookup;
};

const sortObject = (obj) =>
  Object.fromEntries(
    Object.entries(obj)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => [
        key,
        value && typeof value === "object" && !Array.isArray(value)
          ? sortObject(value)
          : value,
      ]),
  );

const generateFileContents = (lookup) => `// AUTO-GENERATED FILE
// Run: npm run generate:lookup
// Do not edit by hand.

export const LOOKUP = ${JSON.stringify(sortObject(lookup), null, 2)};
`;

const main = () => {
  const contentData = loadContentData();
  const lookup = buildLookup(contentData);
  const fileContents = generateFileContents(lookup);

  fs.writeFileSync(outputPath, fileContents, "utf8");
  console.log(`Generated ${outputPath}`);
};

try {
  main();
} catch (err) {
  console.error(err);
  process.exit(1);
}
