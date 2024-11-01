// import { useState, useEffect } from "react";
import {
  usePlatformApi,
  Field,
  ProfileHeader as BaseProfileHeader,
  Link,
  LongText,
} from "ui";
import { Box, Typography, Skeleton } from "@mui/material";
import { identifiersOrgLink } from "../../utils/global";

import VARIANT_PROFILE_HEADER_FRAGMENT from "./ProfileHeader.gql";


function ProfileHeader() {

  const { loading, error, data } = usePlatformApi();

  // TODO: Errors!
  if (error) return null;

  return (
    <BaseProfileHeader>
        
      <Box>
        <Typography variant="subtitle1" mt={0}>Location</Typography>
        <Field loading={loading} title="GRCh38">
          {data?.variant.chromosome}:{data?.variant.position}
        </Field>
        <Allele
          loading={loading}
          label="Reference allele"
          value={data?.variant.referenceAllele}
        />
        <Allele
          loading={loading}
          label="Alternative allele (effect allele)"
          value={data?.variant.alternateAllele}
        />
        <Typography variant="subtitle1" mt={1}>Variant Effect Predictor (VEP)</Typography>
        <Field loading={loading} title="Most severe consequence">
          <Link
            external
            to={identifiersOrgLink("SO", data?.variant.mostSevereConsequence.id.slice(3))}
          >
            {data?.variant.mostSevereConsequence.label.replace(/_/g, ' ')}        
          </Link>
        </Field>
      </Box>

      {data?.variant.alleleFrequencies.length > 0 &&
        <Box>
          <Typography variant="subtitle1" mt={0}>Population Allele Frequencies</Typography>
          <AlleleFrequencyPlot data={data.variant.alleleFrequencies} />
        </Box>
      } 

    </BaseProfileHeader>
  )
}

ProfileHeader.fragments = {
  profileHeader: VARIANT_PROFILE_HEADER_FRAGMENT,
};

export default ProfileHeader;


// ======
// allele
// ======

type AlleleProps = {
  loading: boolean;
  label: string;
  value: string;
};

function Allele({ loading, label, value }: AlleleProps) {
  
  if (loading) return <Skeleton />;
  
  return value?.length >= 15
    ? <>
        <Typography variant="subtitle2">{label}</Typography>
        <LongText lineLimit={2} variant="body2">
          <span style={{ textWrap: "wrap", wordWrap: "break-word" }}>
            {value}
          </span>
        </LongText>
      </>
    : <Field loading={loading} title={label}>
        {value}
      </Field>

}


// =====================
// allele frequency plot
// =====================

const populationLabels = {
  afr_adj: "African-American",
  amr_adj: "American Admixed/Latino",
  asj_adj: "Ashkenazi Jewish",
  eas_adj: "East Asian",
  fin_adj: "Finnish",
  nfe_adj: "Non-Finnish European",
  ami_adj: "Amish",           // from https://www.pharmgkb.org/variant/PA166175994
  mid_adj: "Middle Eastern",  // guessed from: https://gnomad.broadinstitute.org/variant/1-154453788-C-T?dataset=gnomad_r4
  sas_adj: "South Asian",     // from https://www.pharmgkb.org/variant/PA166175994
  remaining_adj: 'Other',
};


function AlleleFrequencyPlot({ data }) {

  let orderOfMag = -2;
  for (const { alleleFrequency } of data) {
    if (alleleFrequency > 0 && alleleFrequency < 1) {
      orderOfMag = Math.min(
        orderOfMag,
        Math.floor(Math.log10(alleleFrequency))
      )
    }
  }
  const dps = Math.min(6, -orderOfMag + 1);

  // sort rows alphabetically on population label - but put "other" last
  const rows = data.map(({ populationName, alleleFrequency }) => ({
    label: populationLabels[populationName],
    alleleFrequency,
  })).sort((a, b) => a.label < b.label ? -1 : 1);
  rows.push(rows.splice(rows.findIndex(r => r.label === 'Other'), 1)[0]);

  return(
    <Box display="flex" flexDirection="column" gap={0.25}>
      {rows.map(row => (
        <BarGroup dataRow={row} key={row.label} dps={dps}/>
      ))}
    </Box>
  );
}

function BarGroup({ dataRow: { label, alleleFrequency }, dps }) {
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
      <Typography width="60px" fontSize="12px" variant="body2" lineHeight={0.8}>
        { alleleFrequency === 0 ? 0 : alleleFrequency.toFixed(dps) }
      </Typography>
    </Box>
  );
}