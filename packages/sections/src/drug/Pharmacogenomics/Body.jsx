import { useQuery } from "@apollo/client";
import { Link, SectionItem, Tooltip, DataTable, TableDrawer, LabelChip } from "ui";

import { definition } from ".";
import Description from "./Description";
import PHARMACOGENOMICS_QUERY from "./Pharmacogenomics.gql";
import { naLabel, defaultRowsPerPageOptions } from "../../constants";

const replaceSemicolonWithUnderscore = id => id.replace(":", "_");

const columns = [
  {
    id: "gene",
    label: "Gene",
    renderCell: ({ targetFromSourceId }) =>
      targetFromSourceId ? (
        <Tooltip title={`This gene may not be direct target of the drug.`}>
          <>
            <Link to={`https://platform.opentargets.org/target/${targetFromSourceId}`}>
              {targetFromSourceId}
            </Link>
          </>
        </Tooltip>
      ) : (
        naLabel
      ),
  },
  {
    id: "rsId",
    label: "RsID",
    renderCell: ({ variantRsId }) => variantRsId || naLabel,
  },
  {
    id: "genotypeId",
    label: "Genotype ID",
    renderCell: ({ genotypeId }) =>
      genotypeId ? (
        <Tooltip
          title={
            <>
              VCF-style(chr_pos_ref_allele1,allele2). See
              <Link external to="google.com">
                here
              </Link>
              for more details
            </>
          }
        >
          <>{genotypeId}</>
        </Tooltip>
      ) : (
        naLabel
      ),
  },
  {
    // todo: check the value of label and value
    id: "variantFunctionalConsequenceId",
    label: "Variant Consequence",
    renderCell: ({ variantFunctionalConsequenceId }) =>
      variantFunctionalConsequenceId ? (
        <LabelChip
          label={variantFunctionalConsequenceId}
          value={variantFunctionalConsequenceId}
          tooltip={"Ensembl variant effect predictor"}
        />
      ) : (
        naLabel
      ),
  },
  {
    id: "adverseOutcome",
    label: "Adverse Outcome",
    renderCell: ({ phenotypeText }) =>
      phenotypeText ? (
        <Tooltip title={`Genotypennotationtext`}>
          <>
            <Link>{phenotypeText}</Link>
          </>
        </Tooltip>
      ) : (
        naLabel
      ),
  },
  {
    id: "adverseOutcomeCategory",
    label: "Adverse Outcome Category",
    renderCell: ({ pgxCategory }) => pgxCategory || naLabel,
  },
  {
    id: "confidenceLevel",
    label: "Confidence (Level)",
    renderCell: ({ evidenceLevel }) =>
      evidenceLevel ? (
        <Tooltip
          title={
            <>
              As defined by
              <Link to={`https://www.pharmgkb.org/page/clinAnnLevels`}>
                {" "}
                PharmGKB ClinAnn Levels
              </Link>
            </>
          }
        >
          <>{evidenceLevel}</>
        </Tooltip>
      ) : (
        naLabel
      ),
  },
  {
    id: "source",
    label: "Source",
    renderCell: ({ studyId }) =>
      studyId ? (
        <Link to={`https://www.pharmgkb.org/clinicalAnnotations/${studyId}`}> {studyId}</Link>
      ) : (
        naLabel
      ),
  },
  {
    id: "literature",
    label: "Literature",
    renderCell: ({ literature }) => <Link> {literature}</Link>,
  },
];

function Body({ id: chemblId, label: name, entity }) {
  const variables = { chemblId };
  const request = useQuery(PHARMACOGENOMICS_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      request={request}
      entity={entity}
      renderDescription={() => <Description name={name} />}
      renderBody={({ drug }) => (
        <DataTable
          showGlobalFilter
          dataDownloader
          columns={columns}
          rows={drug.pharmacogenomics}
          rowsPerPageOptions={defaultRowsPerPageOptions}
          query={PHARMACOGENOMICS_QUERY.loc.source.body}
          variables={variables}
        />
      )}
    />
  );
}

export default Body;
