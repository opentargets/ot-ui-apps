import { useState, useEffect } from "react";
import { Field, ProfileHeader as BaseProfileHeader } from "ui";
import { Box, Typography } from "@mui/material";
import { InSilicoPredictorsType, MetadataType } from "./types";

type ProfileHeaderProps = {
  varId: string;
};

function ProfileHeader({ varId }: ProfileHeaderProps) {

  // temp: data will come from gql, fetch local json file for now
  const [metadata, setMetadata] =
    useState<MetadataType | "waiting" | undefined>("waiting");
  useEffect(() => {
    fetch("../data/variant-data-2.json")
      .then(response => response.json())
      .then((allData: MetadataType[]) =>
        setMetadata(allData.find(v => v.variantId === varId)));
  }, []);

  // temp: always set loading to false for now
  const loading = false;

  // temp: revisit this (use same as other pages) once using gql to get data
  if (!metadata) {
    return <b>Metadata not found!</b>
  } else if (metadata === "waiting") {
    return <b>Waiting</b>;
  }

  return (
    <BaseProfileHeader>
        
      <Box>
        <Typography variant="subtitle1" mt={0}>Location</Typography>
        <Field loading={loading} title="GRCh38">
          {metadata.chromosome}:{metadata.position}
        </Field>
        <Field loading={loading} title="Reference Allele">
          {metadata.referenceAllele}
        </Field>
        <Field loading={loading} title="Alternative Allele (effect allele)">
          {metadata.alternateAllele}
        </Field>
        <Typography variant="subtitle1" mt={1}>Variant Effect Predictor (VEP)</Typography>
        <Field loading={loading} title="most severe consequence">
          {metadata.vep.mostSevereConsequence.replace(/_/g, ' ')}
        </Field>
      </Box>

      <Box>
        <Typography variant="subtitle2">Population Allele Frequencies</Typography>
        <table>
          {metadata.alleleFrequencies
            .map(({populationName, alleleFrequency }) => (
              <tr key={populationName}>
                <td style={{padding: '0 2em 0 0'}}>
                  <Typography variant="body2" lineHeight={1.35}>
                    {populationLabels[populationName as keyof typeof populationLabels]}
                  </Typography>
                </td>
                <td style={{padding: 0}}>
                  <Typography variant="body2" align="right" lineHeight={1}>
                    {alleleFrequency.toFixed(3)}
                  </Typography>
                </td>
              </tr>
            ))
          }
        </table>
      </Box>

    </BaseProfileHeader>
  )
}

export default ProfileHeader;

// !! NEEDS CHECKED SINCE DIFFERENT KEYS TO THOSE USED ON CURRENT VARIANT PAGE
const populationLabels = {
  afr_adj: 'African/African-American',
  amr_adj: 'Latino/Admixed American',
  asj_adj: 'Ashkenazi Jewish',
  eas_adj: 'East Asian',
  fin_adj: 'Finnish',
  nfe_adj: 'Non-Finnish European',
  ami_adj: 'Non-Finnish European Estonian',
  mid_adj: 'Non-Finnish European North-Western European',
  sas_adj: 'Non-Finnish European Southern European',
  remaining_adj: 'Other (population not assigned)',
};