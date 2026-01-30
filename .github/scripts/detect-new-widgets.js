#!/usr/bin/env node

/**
 * Detect New Widgets Script
 *
 * This script detects new widgets/sections added in a PR by comparing
 * the current branch with the main branch.
 *
 * It looks for new directories in:
 * - packages/sections/src/<entity>/<WidgetName>/
 * - apps/platform/src/pages/<PageName>/
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const SECTIONS_PATH = "packages/sections/src";
const PAGES_PATH = "apps/platform/src/pages";
const ENTITY_TYPES = ["target", "disease", "drug", "evidence", "variant", "study", "credibleSet"];

/**
 * Execute a shell command and return the output
 */
function exec(command) {
  try {
    return execSync(command, { encoding: "utf-8" }).trim();
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    return "";
  }
}

/**
 * Get the list of new/added files in the PR compared to main
 */
function getNewFiles() {
  const baseBranch = process.env.GITHUB_BASE_REF || "main";
  const diffOutput = exec(`git diff --name-status ${baseBranch}...HEAD`);

  if (!diffOutput) {
    return { added: [], modified: [] };
  }

  const lines = diffOutput.split("\n").filter(Boolean);
  const added = [];
  const modified = [];

  for (const line of lines) {
    const [status, ...fileParts] = line.split("\t");
    const filePath = fileParts.join("\t");

    if (status === "A") {
      added.push(filePath);
    } else if (status === "M") {
      modified.push(filePath);
    }
  }

  return { added, modified };
}

/**
 * Detect new widget sections from the diff
 */
function detectNewWidgets(addedFiles) {
  const newWidgets = [];
  const detectedWidgetPaths = new Set();

  for (const file of addedFiles) {
    // Check if file is in sections path
    if (file.startsWith(SECTIONS_PATH)) {
      const relativePath = file.replace(`${SECTIONS_PATH}/`, "");
      const parts = relativePath.split("/");

      // Expected structure: <entity>/<WidgetName>/<file>
      if (parts.length >= 3) {
        const entity = parts[0];
        const widgetName = parts[1];
        const widgetPath = `${SECTIONS_PATH}/${entity}/${widgetName}`;

        // Only process if entity is valid and we haven't already detected this widget
        if (ENTITY_TYPES.includes(entity) && !detectedWidgetPaths.has(widgetPath)) {
          // Check if this is a new directory (not just a file in existing widget)
          const indexExists =
            fs.existsSync(path.join(widgetPath, "index.ts")) ||
            fs.existsSync(path.join(widgetPath, "index.tsx"));

          if (indexExists) {
            detectedWidgetPaths.add(widgetPath);

            // Read the widget definition from index file
            const widgetInfo = extractWidgetInfo(widgetPath);

            newWidgets.push({
              type: "widget",
              entity,
              name: widgetName,
              path: widgetPath,
              ...widgetInfo,
            });
          }
        }
      }
    }
  }

  return newWidgets;
}

/**
 * Detect new pages from the diff
 */
function detectNewPages(addedFiles) {
  const newPages = [];
  const detectedPagePaths = new Set();

  for (const file of addedFiles) {
    // Check if file is in pages path
    if (file.startsWith(PAGES_PATH)) {
      const relativePath = file.replace(`${PAGES_PATH}/`, "");
      const parts = relativePath.split("/");

      // Check for new page directories
      if (parts.length >= 2) {
        const pageName = parts[0];
        const pagePath = `${PAGES_PATH}/${pageName}`;

        if (!detectedPagePaths.has(pagePath) && fs.existsSync(pagePath)) {
          detectedPagePaths.add(pagePath);

          newPages.push({
            type: "page",
            name: pageName,
            path: pagePath,
          });
        }
      }
    }
  }

  return newPages;
}

/**
 * Extract widget information from its index file
 */
function extractWidgetInfo(widgetPath) {
  const indexPath = fs.existsSync(path.join(widgetPath, "index.ts"))
    ? path.join(widgetPath, "index.ts")
    : path.join(widgetPath, "index.tsx");

  if (!fs.existsSync(indexPath)) {
    return { id: null, displayName: null };
  }

  const content = fs.readFileSync(indexPath, "utf-8");

  // Extract id from definition
  const idMatch = content.match(/id:\s*['"]([^'"]+)['"]/);
  const nameMatch = content.match(/name:\s*['"]([^'"]+)['"]/);

  return {
    id: idMatch ? idMatch[1] : null,
    displayName: nameMatch ? nameMatch[1] : null,
  };
}

/**
 * Check if tests already exist for a widget
 */
function testsExist(widget) {
  const interactorPath = `packages/platform-test/POM/objects/widgets/${widget.name}`;
  const testPath = `packages/platform-test/e2e/pages/${widget.entity}/${widget.name.toLowerCase()}.spec.ts`;

  return fs.existsSync(interactorPath) || fs.existsSync(testPath);
}

/**
 * Read widget source files for LLM context
 */
function readWidgetSources(widget) {
  const sources = {};
  const extensions = [".ts", ".tsx", ".js", ".jsx"];
  const files = ["index", "Body", "Summary", "Description"];

  for (const file of files) {
    for (const ext of extensions) {
      const filePath = path.join(widget.path, `${file}${ext}`);
      if (fs.existsSync(filePath)) {
        sources[file] = fs.readFileSync(filePath, "utf-8");
        break;
      }
    }
  }

  // Also read any GraphQL files
  const gqlFiles = fs.readdirSync(widget.path).filter((f) => f.endsWith(".gql"));
  for (const gqlFile of gqlFiles) {
    sources[gqlFile] = fs.readFileSync(path.join(widget.path, gqlFile), "utf-8");
  }

  return sources;
}

/**
 * Main execution
 */
function main() {
  console.log("🔍 Detecting new widgets and pages...\n");

  const { added } = getNewFiles();

  if (added.length === 0) {
    console.log("No new files detected in this PR.");
    console.log("::set-output name=has_new_widgets::false");
    return;
  }

  console.log(`Found ${added.length} new files in PR:\n`);
  added.forEach((f) => console.log(`  + ${f}`));
  console.log("");

  // Detect new widgets
  const newWidgets = detectNewWidgets(added);
  const newPages = detectNewPages(added);

  // Filter out widgets that already have tests
  const widgetsNeedingTests = newWidgets.filter((w) => !testsExist(w));

  // Add source code to each widget for LLM context
  for (const widget of widgetsNeedingTests) {
    widget.sources = readWidgetSources(widget);
  }

  const allNew = [...widgetsNeedingTests, ...newPages];

  if (allNew.length === 0) {
    console.log("No new widgets or pages need test generation.");
    console.log("::set-output name=has_new_widgets::false");
    return;
  }

  console.log(`\n✅ Detected ${allNew.length} new widgets/pages needing tests:\n`);
  allNew.forEach((item) => {
    if (item.type === "widget") {
      console.log(`  📦 Widget: ${item.name} (${item.entity}) - ID: ${item.id || "unknown"}`);
    } else {
      console.log(`  📄 Page: ${item.name}`);
    }
  });

  // Output for GitHub Actions
  const outputJson = JSON.stringify(allNew);

  // Write to GitHub Actions output
  const outputFile = process.env.GITHUB_OUTPUT;
  if (outputFile) {
    fs.appendFileSync(outputFile, `has_new_widgets=true\n`);
    fs.appendFileSync(outputFile, `new_widgets=${outputJson}\n`);
  } else {
    // Fallback for local testing
    console.log("\n::set-output name=has_new_widgets::true");
    console.log(`::set-output name=new_widgets::${outputJson}`);
  }

  // Also write to a temp file for the next script
  fs.writeFileSync(".github/scripts/.detected-widgets.json", outputJson);

  console.log("\n✅ Detection complete!");
}

main();
