import { useState, useEffect } from "react";
import { Field, ProfileHeader as BaseProfileHeader } from "ui";
import { Box, Typography } from "@mui/material";
import { InSilicoPredictorsType, MetadataType } from "./types";
import { interpolateHsl } from "d3";

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

        <Box>
          <Typography variant="subtitle2">Population Allele Frequencies</Typography>
          <table>
            <tbody>
              {metadata.alleleFrequencies
                .map(({populationName, alleleFrequency }) => (
                  <tr key={populationName}>
                    <td style={{padding: '0 4em 0 0'}}>
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
              </tbody>
          </table>
        </Box>

        <Box mt={6}>
          <ThinUnderBars data={metadata.alleleFrequencies} />
        </Box>

        <Box mt={6}>
          <HorizontalBarchart data={metadata.alleleFrequencies} />
        </Box>

        <Box mt={6}>
          <HorizontalBarchart data={metadata.alleleFrequencies} alignLabels="left"/>
        </Box>

        <Box mt={6}>
          <ColoredBoxes data={metadata.alleleFrequencies} />
        </Box>

        <Box mt={6}>
          <FullWidthColoredBoxes data={metadata.alleleFrequencies} alignLabels="left" />
        </Box>

      </Box>
          



    </BaseProfileHeader>
  )
}

export default ProfileHeader;

// // !! NEEDS CHECKED SINCE DIFFERENT KEYS TO THOSE USED ON CURRENT VARIANT PAGE
// const populationLabels = {
//   afr_adj: 'African/African-American',
//   amr_adj: 'Latino/Admixed American',
//   asj_adj: 'Ashkenazi Jewish',
//   eas_adj: 'East Asian',
//   fin_adj: 'Finnish',
//   nfe_adj: 'Non-Finnish European',

//   ami_adj: 'Non-Finnish European Estonian',
//   mid_adj: 'Non-Finnish European North-Western European',
//   sas_adj: 'Non-Finnish European Southern European',
//   remaining_adj: 'Other (population not assigned)',
// };

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


// =============================================================================
// SHARED PLOT STYLES
// =============================================================================
const faintBar = "#ddd"; 
// const boldBar = "#888";
const boldBar = "steelblue";


// =============================================================================
// THIN BARS UNDER TEXT
// =============================================================================

function ThinUnderBars({ data }) {
  
  return(
    <Box display="flex" flexDirection="column" gap={1}>
      {data.map(dataRow => (
        <BarGroup dataRow={dataRow} key={data.populationName}/>
      ))}
    </Box>
  );

  function BarGroup({ dataRow: {populationName, alleleFrequency} }) {
    return (
      <Box>
        <Typography variant="body2">
          {populationLabels[populationName]}
        </Typography>
        <Box display="flex" gap={1} alignItems="center">
          <Bar frequency={alleleFrequency} />
          <Typography fontSize="12.5px" variant="body2" lineHeight={0.8}>
            {alleleFrequency.toFixed(3)}
          </Typography>
        </Box>
      </Box>
    );
  }
  
  function Bar({ frequency }) {
    const barwidth = 250;
    return (
      <Box height={5} width={barwidth} mt={0.3} bgcolor={faintBar}>  
        <Box
          sx={{width: `${+frequency * barwidth}px`, height: '5px'}}
          bgcolor={boldBar}
        />
      </Box>
    );
  }

}

// =============================================================================
// HORIZONTAL BARCHART
// =============================================================================

function HorizontalBarchart({ data, alignLabels = "right" }) {

  return(
    <Box display="flex" flexDirection="column" gap={0.5}>
      {data.map(dataRow => (
        <BarGroup dataRow={dataRow} key={data.populationName} alignLabels={alignLabels}/>
      ))}
    </Box>
  );

  function BarGroup({ dataRow: {populationName, alleleFrequency}, alignLabels}) {
    return (
      <Box display="flex" gap={1}>
        <Typography width={170} variant="body2" textAlign={alignLabels}>
          {populationLabels[populationName]}
        </Typography>
        <Box display="flex" gap={1} alignItems="center">
          <Bar frequency={alleleFrequency} />
          <Typography fontSize="12px" variant="body2" lineHeight={0.8}>
            {alleleFrequency.toFixed(3)}
          </Typography>
        </Box>
      </Box>
    );
  }

  function Bar({ frequency }) {
    const barwidth = 200;
    const barHeight = 11;
    return (
      <Box width={barwidth} mt={0.3} bgcolor={faintBar} height={barHeight}>  
        <Box
          sx={{width: `${+frequency * barwidth}px`, height: barHeight}}
          bgcolor={boldBar}
        />
      </Box>
    );
  }
  
}

// =============================================================================
// COLORED BOXES
// =============================================================================

function ColoredBoxes({ data, alignLabels = "right" }) {

  return(
    <Box display="flex" flexDirection="column" gap={0.5}>
      {data.map(dataRow => (
        <BarGroup dataRow={dataRow} key={data.populationName} alignLabels={alignLabels}/>
      ))}
    </Box>
  );

  function BarGroup({ dataRow: {populationName, alleleFrequency}, alignLabels}) {
    return (
      <Box display="flex" gap={1}>
        <Typography width={170} variant="body2" textAlign={alignLabels}>
          {populationLabels[populationName]}
        </Typography>
        <Box display="flex" gap={1} alignItems="center">
          <Bar frequency={alleleFrequency} />
        </Box>
      </Box>
    );
  }

  function Bar({ frequency }) {
    const barwidth = 70;
    const barHeight = 20;
    return (
      <Box
        width={barwidth}
        bgcolor={getBoxColor(frequency)}
        height={barHeight}
        display="flex"
        justifyContent="center"
        alignItems="center"
        borderRadius={0.75}
      >  
        <Typography fontSize="12px" variant="body2" lineHeight={0.8} color="#000">
          {frequency.toFixed(3)}
        </Typography>
      </Box>
    );
  }
  
}

// =============================================================================
// FULL WIDTH COLORED BOXES
// =============================================================================

function FullWidthColoredBoxes({ data, alignLabels = "right" }) {

  return(
    <Box color="#000" display="inline-flex" flexDirection="column" gap={0.5}>
      {data.map(dataRow => (
        <BarGroup dataRow={dataRow} key={data.populationName} alignLabels={alignLabels}/>
      ))}
    </Box>
  );

  function BarGroup({ dataRow: {populationName, alleleFrequency}, alignLabels}) {
    return (
      <Box display="flex" gap={1} bgcolor={getBoxColor(alleleFrequency)} borderRadius={0.6} px={1} py={0.25}>
        <Typography width={170} variant="body2" fontSize={13} textAlign={alignLabels}>
          {populationLabels[populationName]}
        </Typography>
        <Box display="flex" gap={1} alignItems="center">
          <Bar frequency={alleleFrequency} />
        </Box>
      </Box>
    );
  }

  function Bar({ frequency }) {
    return (
      <Box
        bgcolor={getBoxColor(frequency)}
        width={70}
        textAlign="right"
      >  
        <Typography fontSize="12px" variant="body2" lineHeight={0.8}>
          {frequency.toFixed(3)}
        </Typography>
      </Box>
    );
  }
  
}



// -----------------------------------------------------------------------------



function getBoxColor(v) {
  return interpolateHsl('#e1ecf5', '#70a2cc')(v);
}