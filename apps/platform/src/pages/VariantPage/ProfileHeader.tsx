import { useState, useEffect } from "react";
import { Field, ProfileHeader as BaseProfileHeader } from "ui";
import { Box, Typography, Grid } from "@mui/material";

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
        <HorizontalBarchart data={metadata.alleleFrequencies} alignLabels="right" />
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
  nwe_adj: "Northwestern European",
  seu_adj: "Southeastern European",
  // add in missing from above - 
  ami_adj: "Amish",           // from https://www.pharmgkb.org/variant/PA166175994
  mid_adj: "Middle Eastern",  // guessed from: https://gnomad.broadinstitute.org/variant/1-154453788-C-T?dataset=gnomad_r4
  sas_adj: "South Asian",     // from https://www.pharmgkb.org/variant/PA166175994
  remaining_adj: 'Other',
};


function HorizontalBarchart({ data, alignLabels = "right" }) {

  const faintBar = "#ddd"; 
  const boldBar = "rgb(52, 137, 202)";

  return(
    <Grid container spacing={0.5} alignItems="center">
      {data.map(dataRow => (
        <BarGroup dataRow={dataRow} key={data.populationName} alignLabels={alignLabels}/>
      ))}
    </Grid>
  );

  // bars grow slightly with screen width, but 
  function BarGroup({ dataRow: { populationName, alleleFrequency }, alignLabels }) {
    return (
      <>
        <Grid md="auto" item display="flex" justifyContent="end">
          <Typography width={170} variant="body2" textAlign={alignLabels}>
            {populationLabels[populationName]}
          </Typography>
        </Grid>          
        <Grid item md={5} xl={4}>
          <Box sx={{background: faintBar, height: "9px"}}>
            <Box
              sx={{
                width: `${+alleleFrequency * 100}%`,
                height: "100%",
                background: boldBar,
              }}
            />
          </Box>
        </Grid>
        <Grid item md={1} lg={2} xl={4}>
          <Typography fontSize="12px" variant="body2" lineHeight={0.8}>
            {alleleFrequency.toFixed(3)}
          </Typography>
        </Grid>
      </>
    );
  }
  
}