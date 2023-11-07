import { useQuery } from "@apollo/client";
import { Link, SectionItem, Tooltip, DataTable, LabelChip, PublicationsDrawer } from "ui";

import { epmcUrl } from "../../utils/urls";
import { definition } from ".";
import Description from "./Description";
import PHARMACOGENOMICS_QUERY from "./Pharmacogenomics.gql";
import { naLabel, defaultRowsPerPageOptions } from "../../constants";

const columns = [
  {
    id: "gene",
    label: "Gene",
    renderCell: ({ targetFromSourceId }) =>
      targetFromSourceId ? (
        <Link
          tooltip="This gene may not be direct target of the drug."
          to={`/target/${targetFromSourceId}`}
        >
          <span>{targetFromSourceId}</span>
        </Link>
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
              <Link
                external
                to="https://github.com/apriltuesday/opentargets-pharmgkb/tree/issue-18#variant-coordinate-computation"
              >
                {" "}
                here{" "}
              </Link>
              for more details
            </>
          }
        >
          <span>{genotypeId}</span>
        </Tooltip>
      ) : (
        naLabel
      ),
  },
  {
    id: "variantFunctionalConsequence",
    label: "Variant Consequence",
    renderCell: ({ variantFunctionalConsequence }) => {
      if (variantFunctionalConsequence)
        return (
          <LabelChip
            label={variantFunctionalConsequence.id}
            value={variantFunctionalConsequence.label}
            tooltip="Ensembl variant effect predictor"
          />
        );
      return naLabel;
    },
  },
  {
    id: "drugResponse",
    label: "Drug Response",
    renderCell: ({ phenotypeText = naLabel, phenotypeFromSourceId, genotypeAnnotationText }) => {
      const phenotypeTextElement = phenotypeFromSourceId ? (
        <Link tooltip={genotypeAnnotationText} to={`/disease/${phenotypeFromSourceId}`}>
          {phenotypeText}
        </Link>
      ) : (
        <Tooltip title={genotypeAnnotationText}>{phenotypeText}</Tooltip>
      );
      return phenotypeTextElement;
    },
  },
  {
    id: "drugResponseCategory",
    label: "Drug Response Category",
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
              <Link external to={`https://www.pharmgkb.org/page/clinAnnLevels`}>
                {" "}
                PharmGKB ClinAnn Levels
              </Link>
            </>
          }
        >
          <span>{evidenceLevel}</span>
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
        <Link external to={`https://www.pharmgkb.org/clinicalAnnotation/${studyId}`}>
          PharmGKB-{studyId}
        </Link>
      ) : (
        naLabel
      ),
  },
  {
    id: "literature",
    label: "Literature",
    renderCell: ({ literature }) => {
      const literatureList =
        literature?.reduce((acc, id) => {
          if (id === "NA") return acc;

          return [
            ...acc,
            {
              name: id,
              url: epmcUrl(id),
              group: "literature",
            },
          ];
        }, []) || [];

      return <PublicationsDrawer entries={literatureList} />;
    },
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
