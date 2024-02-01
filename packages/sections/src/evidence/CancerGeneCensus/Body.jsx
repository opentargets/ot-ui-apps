import { useQuery } from "@apollo/client";
import { Box, List, ListItem, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { v1 } from "uuid";

import { ChipList, Link, SectionItem, PublicationsDrawer, DataTable } from "ui";

import { naLabel, defaultRowsPerPageOptions, sectionsBaseSizeQuery } from "../../constants";
import { dataTypesMap } from "../../dataTypes";
import Description from "./Description";
import { epmcUrl } from "../../utils/urls";
import { identifiersOrgLink, sentenceCase } from "../../utils/global";

import { definition } from ".";

import CANCER_GENE_CENSUS_QUERY from "./sectionQuery.gql";

const samplePercent = item => (item.numberSamplesWithMutationType / item.numberSamplesTested) * 100;

const getMaxPercent = row => Math.max(...row.mutatedSamples.map(item => samplePercent(item)));

const getColumns = label => [
  {
    id: "disease.name",
    label: "Disease/phenotype",
    renderCell: ({ disease }) => <Link to={`/disease/${disease.id}`}>{disease.name}</Link>,
  },
  {
    id: "mutationType",
    propertyPath: "mutatedSamples.functionalConsequence",
    label: "Mutation type",
    renderCell: ({ mutatedSamples }) => {
      if (!mutatedSamples) return naLabel;
      const sortedMutatedSamples = mutatedSamples
        .slice()
        .sort((a, b) => samplePercent(b) - samplePercent(a));
      return (
        <List style={{ padding: 0 }}>
          {sortedMutatedSamples.map(mutatedSample => (
            <ListItem key={mutatedSample.functionalConsequence.id} style={{ padding: ".25rem 0" }}>
              <Link
                external
                to={identifiersOrgLink("SO", mutatedSample.functionalConsequence.id.slice(3))}
              >
                {sentenceCase(mutatedSample.functionalConsequence.label)}
              </Link>
            </ListItem>
          ))}
        </List>
      );
    },
    filterValue: ({ mutatedSamples }) =>
      (mutatedSamples || [])
        .map(mutatedSample => sentenceCase(mutatedSample.functionalConsequence.label))
        .join(),
  },
  {
    id: "mutatedSamples",
    propertyPath: "mutatedSamples.numberSamplesWithMutationType",
    label: "Mutated / Total samples",
    renderCell: ({ mutatedSamples }) => {
      if (!mutatedSamples) return naLabel;
      const sortedMutatedSamples = mutatedSamples
        .slice()
        .sort((a, b) => samplePercent(b) - samplePercent(a));
      return (
        <List style={{ padding: 0 }}>
          {sortedMutatedSamples.map(item => {
            const percent = samplePercent(item);

            return (
              <ListItem key={v1()} style={{ padding: ".25rem 0" }}>
                {percent < 5 ? parseFloat(percent.toFixed(2)).toString() : Math.round(percent)}%
                <Typography variant="caption" style={{ marginLeft: ".33rem" }}>
                  ({item.numberSamplesWithMutationType}/{item.numberSamplesTested})
                </Typography>
              </ListItem>
            );
          })}
        </List>
      );
    },
    comparator: (a, b) => getMaxPercent(a) - getMaxPercent(b),
  },
  {
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

      return (
        <PublicationsDrawer entries={literatureList} symbol={label.symbol} name={label.name} />
      );
    },
  },
];

const useStyles = makeStyles({
  roleInCancerBox: {
    display: "flex",
    alignItems: "center",
    marginBottom: "2rem",
  },
  roleInCancerTitle: { marginRight: ".5rem !important" },
});

function Body({ id, label, entity }) {
  const classes = useStyles();
  const { ensgId, efoId } = id;

  const variables = {
    ensemblId: ensgId,
    efoId,
    size: sectionsBaseSizeQuery,
  };

  const request = useQuery(CANCER_GENE_CENSUS_QUERY, {
    variables,
  });

  const columns = getColumns(label);

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.somatic_mutation}
      request={request}
      entity={entity}
      renderDescription={() => <Description symbol={label.symbol} diseaseName={label.name} />}
      renderBody={({
        disease: {
          cancerGeneCensusSummary: { rows },
        },
        target: { hallmarks },
      }) => {
        const roleInCancerItems =
          hallmarks && hallmarks.attributes.length > 0
            ? hallmarks.attributes
                .filter(attribute => attribute.name === "role in cancer")
                .map(attribute => ({
                  label: attribute.description,
                  url: epmcUrl(attribute.pmid),
                }))
            : [{ label: "Unknown" }];

        return (
          <>
            <Box className={classes.roleInCancerBox}>
              <Typography className={classes.roleInCancerTitle}>
                <b>{label.symbol}</b> role in cancer:
              </Typography>
              <ChipList items={roleInCancerItems} />
            </Box>
            <DataTable
              columns={columns}
              dataDownloader
              order="desc"
              rows={rows}
              rowsPerPageOptions={defaultRowsPerPageOptions}
              showGlobalFilter
              sortBy="mutatedSamples"
              query={CANCER_GENE_CENSUS_QUERY.loc.source.body}
              variables={variables}
            />
          </>
        );
      }}
    />
  );
}

export default Body;
