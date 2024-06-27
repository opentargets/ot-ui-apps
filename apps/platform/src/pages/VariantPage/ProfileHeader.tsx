import { useState, useEffect } from "react";
import { Field, ProfileHeader as BaseProfileHeader } from "ui";
import { Box, Typography } from "@mui/material";

type ProfileHeaderProps = {
  varId: string;
};

function ProfileHeader({ varId }: ProfileHeaderProps) {

  // temp: data will come from gql, fetch local json file for now
  const [metadata, setMetadata] =
    useState<MetadataType | "waiting" | undefined>("waiting");
  useEffect(() => {
    fetch("../data/variant-data-fake.json")
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
        <Typography variant="subtitle1" mt={0}>Population Allele Frequencies</Typography>
        <AlleleFrequencyPlot data={metadata.alleleFrequencies} />
      </Box>

    </BaseProfileHeader>
  )
}

export default ProfileHeader;

// THESE NEED CHECKED!!
const populationLabels = {
  // from AB (orig from YT)
  afr_adj: "African-American",
  amr_adj: "American Admixed/Latino",
  asj_adj: "Ashkenazi Jewish",
  eas_adj: "East Asian",
  fin_adj: "Finnish",
  nfe_adj: "Non-Finnish European",
  // nwe_adj: "Northwestern European",
  // seu_adj: "Southeastern European",
  // add in missing from above - 
  ami_adj: "Amish",           // from https://www.pharmgkb.org/variant/PA166175994
  mid_adj: "Middle Eastern",  // guessed from: https://gnomad.broadinstitute.org/variant/1-154453788-C-T?dataset=gnomad_r4
  sas_adj: "South Asian",     // from https://www.pharmgkb.org/variant/PA166175994
  remaining_adj: 'Other',
};

function AlleleFrequencyPlot({ data }) {
  
  // sort rows alphabetically on population label - but put "other" last
  const rows = data.map(({ populationName, alleleFrequency }) => ({
    label: populationLabels[populationName],
    alleleFrequency,
  })).sort((a, b) => a.label < b.label ? -1 : 1);
  rows.push(rows.splice(rows.findIndex(r => r.label === 'Other'), 1)[0]);

  return(
    <Box display="flex" flexDirection="column" gap={0.25}>
      {rows.map(row => (
        <BarGroup dataRow={row} key={row.label}/>
      ))}
    </Box>
  );
}

function BarGroup({ dataRow: { label, alleleFrequency } }) {
  return (
    <Box display="flex" gap={1} alignItems="center" width="100%">
      <Typography width={170} fontSize="13.5px" variant="body2" textAlign="right">
        {label}
      </Typography>         
      <Box sx={{
        flexGrow: 2,
        maxWidth: "200px",
        background: theme => theme.palette.grey[300],
        height: "9px"
      }}>
        <Box
          sx={{
            width: `${+alleleFrequency * 100}%`,
            height: "100%",
            backgroundColor: "primary.main",
          }}
        />
      </Box>
      <Typography width={40} fontSize="12px" variant="body2" lineHeight={0.8}>
        {alleleFrequency.toFixed(3)}
      </Typography>
    </Box>
  );
}