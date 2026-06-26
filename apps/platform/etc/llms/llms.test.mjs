// Dependency-free drift guard for the two static llms.txt files.
// Run: node apps/platform/etc/llms/llms.test.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(here, "../../public");
const platform = readFileSync(resolve(publicDir, "llms.txt"), "utf8");
const ppp = readFileSync(resolve(publicDir, "llms.ppp.txt"), "utf8");

const REQUIRED_SECTIONS = [
  "## Overview",
  "## Documentation",
  "## API",
  "## Data downloads",
  "## Community",
  "## Source & citation",
  "## Optional",
];

for (const [name, out] of [["llms.txt", platform], ["llms.ppp.txt", ppp]]) {
  assert.ok(out.startsWith("# Open Targets"), `${name}: must start with an H1 title`);
  assert.ok(out.includes("\n> "), `${name}: must contain a blockquote summary`);
  for (const h of REQUIRED_SECTIONS) {
    assert.ok(out.includes(h), `${name}: missing section ${h}`);
  }
  // representative verified links present in both files
  for (const url of [
    "https://platform-docs.opentargets.org",
    "https://platform.opentargets.org/downloads",
    "s3://open-targets-public-data-releases/platform/",
    "bigquery-public-data.open_targets_platform",
    "https://community.opentargets.org/c/feature-requests/16",
    "https://github.com/opentargets/issues",
    "https://github.com/opentargets/ot-snapshot",
    "https://platform-docs.opentargets.org/citation#latest-publication",
    "https://blog.opentargets.org",
  ]) {
    assert.ok(out.includes(url), `${name}: missing link ${url}`);
  }
}

// per-flavor GraphQL host
assert.ok(
  platform.includes("https://api.platform.opentargets.org/api/v4/graphql"),
  "llms.txt: must use the public GraphQL host"
);
assert.ok(!platform.includes("partner-platform"), "llms.txt: must not reference the partner host");
assert.ok(
  ppp.includes("https://api.partner-platform.opentargets.org/api/v4/graphql"),
  "llms.ppp.txt: must use the partner GraphQL host"
);

// support email only in PPP
assert.ok(ppp.includes("partner-support@opentargets.org"), "llms.ppp.txt: must include support email");
assert.ok(
  !platform.includes("partner-support@opentargets.org"),
  "llms.txt: must omit the support email"
);

console.log("OK: llms.txt drift-guard tests passed");
