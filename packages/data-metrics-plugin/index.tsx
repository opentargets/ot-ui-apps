export { default as DataMetricsPage } from "./DataMetricsPage";

export const evidenceDefinition = {
	id: "dataMetrics",
	name: "Evidence Metrics",
	shortName: "EM",
	hasData: () => {
		return true;
	},
};
