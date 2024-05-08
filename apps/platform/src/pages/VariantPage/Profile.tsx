
import { ProfileHeader as BaseProfileHeader, Field } from "ui";
import { Typography, Box } from "@mui/material";
import { MetadataType, InSilicoPredictorsType }
  from "./types";

type ProfileProps = {
  metadata: MetadataType
};

function Profile({ metadata }: ProfileProps) {
  
  // always set loading to false for now
  const loading = false;

  return (
    <BaseProfileHeader>
      
      <>
        <Typography variant="subtitle1" mt={0}>Location</Typography>
        <Field loading={loading} title="GRCh38">
          {`${metadata.chromosome}:${metadata.position}`}
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
        <Typography variant="subtitle1" mt={1}>Insilico predictors</Typography>
        {
          Object.keys(metadata.inSilicoPredictors).map(key => (
            key === 'cadd'
              ? <>
                  <Field key={key} loading={loading} title={key}>&nbsp;</Field>
                  <Box ml={2}>
                    <Field loading={loading} title="phred">
                      {metadata.inSilicoPredictors.cadd!.phred}
                    </Field>
                    <Field loading={loading} title="raw">
                      {metadata.inSilicoPredictors.cadd!.raw}
                    </Field>
                  </Box>
                </>
                // !! FIX WARNING BELOW - as keyof  is not working
              : <Field key={key} loading={loading} title={key}>
                  {String(metadata.inSilicoPredictors[key]) as keyof InSilicoPredictorsType}
                </Field>
          ))
        }
      </>
      
      <>
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
      </>

    </BaseProfileHeader>
  );
}

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

export default Profile;