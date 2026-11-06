import fs from "node:fs";
import path from "node:path";
import { source } from "./data-utils.mjs";

fs.mkdirSync(path.join(process.cwd(), "public"), { recursive: true });
if (source === "data") {
  for (const [from, to] of [
    ["data/SOURCES.md", "public/SOURCES.md"],
    ["data/COVERAGE.md", "public/COVERAGE.md"],
    ["data/METHODOLOGY.md", "public/METHODOLOGY.md"],
  ]) {
    if (fs.existsSync(from)) fs.copyFileSync(from, to);
  }
}

fs.writeFileSync(
  path.join(process.cwd(), "public", "build-info.json"),
  JSON.stringify({ dataSource: source }) + "\n",
);
