import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { BasePage, Header } from "ui";
import DataMetricsTotalCards from "./DataMetricsTotalCards";
import DownloadLink from "./DownloadLink";
import EvidenceDataMetricsSection from "./EvidenceDataMetricsSection";
import { DataMetricsPageProps, Metric } from "./types";

function parseCSV(text: string): Metric[] {
  if (!text) return [];
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const obj: Metric = {};
    headers.forEach((h, i) => {
      obj[h] = values[i];
    });
    return obj;
  });
}

function DataMetricsPage({
  currentRelease,
  previousRelease,
  currentMetricsFile,
  previousMetricsFile,
}: DataMetricsPageProps) {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [prevMetrics, setPrevMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    fetch(`./${currentMetricsFile}`)
      .then((response) => response.text())
      .then((text) => {
        const parsed = parseCSV(text);
        setMetrics(parsed);
      });
    fetch(`./${previousMetricsFile}`)
      .then((response) => response.text())
      .then((text) => {
        const parsed = parseCSV(text);
        setPrevMetrics(parsed);
      });
  }, [currentMetricsFile, previousMetricsFile]);

  return (
    <BasePage>
      <>
        <Header
          loading={false}
          title={"Data Metrics"}
          subtitle={`v${currentRelease}`}
          Icon={faMagnifyingGlass}
          externalLinks={
            <>
              <DownloadLink
                title={`Download Metrics v${currentRelease}`}
                file={currentMetricsFile}
              />
              <DownloadLink
                title={`Download Metrics v${previousRelease} (prev)`}
                file={previousMetricsFile}
              />
            </>
          }
        />
        <DataMetricsTotalCards metrics={metrics} prevMetrics={prevMetrics} />
        <EvidenceDataMetricsSection metrics={metrics} prevMetrics={prevMetrics} />
      </>
    </BasePage>
  );
}

export default DataMetricsPage;
