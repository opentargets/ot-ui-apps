import { Chip } from "@mui/material";
import { credsetConfidenceMap, naLabel, table5HChunkSize } from "@ot/constants";
import { mantissaExponentComparator, variantComparator } from "@ot/utils";
import {
	ClinvarStars,
	DisplayVariantId,
	Link,
	Navigate,
	OtTable,
	ScientificNotation,
	SectionItem,
	Tooltip,
	useBatchQuery,
} from "ui";
import { definition } from ".";
import Description from "./Description";
import QTL_CREDIBLE_SETS_QUERY from "./QTLCredibleSetsQuery.gql";

function getColumns(): any[] {
	return [
		{
			id: "studyLocusId",
			label: "Credible set",
			enableHiding: false,
			sticky: true,
			renderCell: ({ studyLocusId }: any) => (
				<Navigate to={`/credible-set/${studyLocusId}`} />
			),
		},
		{
			id: "leadVariant",
			label: "Lead variant",
			enableHiding: false,
			comparator: variantComparator((d) => d.variant),
			sortable: true,
			filterValue: ({ variant: v }: any) =>
				`${v?.chromosome}_${v?.position}_${v?.referenceAllele}_${v?.alternateAllele}`,
			renderCell: ({ variant }: any) => {
				if (!variant) return naLabel;
				const { id: variantId, referenceAllele, alternateAllele } = variant;
				const displayElement = (
					<DisplayVariantId
						variantId={variantId}
						referenceAllele={referenceAllele}
						alternateAllele={alternateAllele}
						expand={false}
					/>
				);
				return (
					<Link asyncTooltip to={`/variant/${variantId}`}>
						{displayElement}
					</Link>
				);
			},
			exportValue: ({ variant }: any) => variant?.id,
		},
		{
			id: "studyId",
			label: "Study",
			renderCell: ({ study }: any) => {
				if (!study) return naLabel;
				return (
					<Link asyncTooltip to={`/study/${study.id}`}>
						{study.id}
					</Link>
				);
			},
		},
		{
			id: "study.studyType",
			label: "Type",
			renderCell: ({ study, isTransQtl }: any) => {
				const type = study?.studyType;
				if (!type) return naLabel;
				return (
					<>
						{`${type.slice(0, -3)}${type.slice(-3).toUpperCase()}`}{" "}
						{isTransQtl && (
							<Chip label="trans" variant="outlined" size="small" />
						)}
					</>
				);
			},
			exportValue: ({ study, isTrans }: any) => {
				const type = study?.studyType;
				if (!type) return null;
				return `${type.slice(0, -3)}${type.slice(-3).toUpperCase()}, isTrans:${isTrans}`;
			},
		},
		{
			id: "study",
			label: "Affected tissue/cell",
			renderCell: ({ study }: any) => {
				const biosampleId = study?.biosample?.biosampleId;
				if (!biosampleId) return naLabel;
				return (
					<Link
						external
						to={`https://www.ebi.ac.uk/ols4/search?q=${biosampleId}&ontology=uberon`}
					>
						{study?.biosample?.biosampleName}
					</Link>
				);
			},
			exportValue: ({ study }: any) => {
				return `[${study?.biosample?.biosampleId}]:${study?.biosample?.biosampleName}`;
			},
		},
		{
			id: "study.condition",
			label: "Condition",
			renderCell: ({ study }: any) => study?.condition || naLabel,
		},
		{
			id: "pValue",
			label: "P-value",
			numeric: true,
			comparator: (a: any, b: any) =>
				mantissaExponentComparator(
					a?.pValueMantissa,
					a?.pValueExponent,
					b?.pValueMantissa,
					b?.pValueExponent,
				),
			sortable: true,
			filterValue: false,
			renderCell: ({ pValueMantissa, pValueExponent }: any) => {
				if (
					typeof pValueMantissa !== "number" ||
					typeof pValueExponent !== "number"
				)
					return naLabel;
				return (
					<ScientificNotation
						number={[pValueMantissa, pValueExponent]}
						dp={2}
					/>
				);
			},
			exportValue: ({ pValueMantissa, pValueExponent }: any) => {
				if (
					typeof pValueMantissa !== "number" ||
					typeof pValueExponent !== "number"
				)
					return null;
				return `${pValueMantissa}x10${pValueExponent}`;
			},
		},
		{
			id: "beta",
			label: "Beta",
			numeric: true,
			filterValue: false,
			tooltip: "Beta with respect to the ALT allele",
			sortable: true,
			renderCell: ({ beta }: any) => {
				if (typeof beta !== "number") return naLabel;
				return beta.toPrecision(3);
			},
		},
		{
			id: "confidence",
			label: "Fine-mapping confidence",
			tooltip: (
				<>
					Fine-mapping confidence based on the suitability of the
					linkage-disequilibrium information and fine-mapping method. See{" "}
					<Link
						external
						to="https://platform-docs.opentargets.org/credible-set#credible-set-confidence"
					>
						here
					</Link>{" "}
					for more details.
				</>
			),
			sortable: true,
			renderCell: ({ confidence }: any) => {
				if (!confidence) return naLabel;
				return (
					<Tooltip title={confidence} style="">
						<ClinvarStars num={credsetConfidenceMap[confidence]} />
					</Tooltip>
				);
			},
			filterValue: ({ confidence }: any) => credsetConfidenceMap[confidence],
		},
		{
			id: "finemappingMethod",
			label: "Fine-mapping method",
		},
		{
			id: "credibleSetSize",
			label: "Credible set size",
			numeric: true,
			comparator: (a: any, b: any) => a.locus?.count - b.locus?.count,
			sortable: true,
			filterValue: false,
			renderCell: ({ locus }: any) => {
				return typeof locus?.count === "number"
					? locus.count.toLocaleString()
					: naLabel;
			},
			exportValue: ({ locus }: any) => locus?.count,
		},
	];
}

type BodyProps = {
	id: string;
	entity: string;
};

function Body({ id, entity }: BodyProps) {
	const variables = {
		ensemblId: id,
		size: table5HChunkSize,
		index: 0,
	};

	const request = useBatchQuery({
		query: QTL_CREDIBLE_SETS_QUERY,
		variables,
		dataPath: "target.qtlCredibleSets",
		size: table5HChunkSize,
	});

	return (
		<SectionItem
			definition={definition}
			entity={entity}
			request={request}
			showContentLoading
			loadingMessage="Loading data. This may take some time..."
			renderDescription={() => (
				<Description targetSymbol={request.data?.target?.approvedSymbol} />
			)}
			renderBody={() => {
				return (
					<OtTable
						dataDownloader
						dataDownloaderFileStem={`${id}-qtl-credible-sets-target`}
						showGlobalFilter
						sortBy="pValue"
						columns={getColumns()}
						rows={request.data?.target.qtlCredibleSets.rows}
						loading={request.loading}
						query={QTL_CREDIBLE_SETS_QUERY.loc.source.body}
						variables={variables}
					/>
				);
			}}
		/>
	);
}

export default Body;
