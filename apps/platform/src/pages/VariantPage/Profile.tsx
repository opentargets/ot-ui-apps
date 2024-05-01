
import { ProfileHeader as BaseProfileHeader, Field } from "ui";
import { Typography} from "@mui/material";

function Profile({ data }) {
  
  // always set loading to false for now
  const loading = false;

  return (
    <BaseProfileHeader>
      <>
        <Typography variant="subtitle2">Location</Typography>
        <Field loading={loading} title="GRCh38">
          {`${data.chromosome}:${data.position}`}
        </Field>
        <Field loading={loading} title="GRCh37">
          {`${data.chromosomeB37}:${data.positionB37}`}
        </Field>
        <Field loading={loading} title="Reference Allele">
          {data.referenceAllele}
        </Field>
        <Field loading={loading} title="Alternative Allele (effect allele)">
          {data.alternateAllele}
        </Field>
        <Typography variant="subtitle2">Insilico predictors</Typography>
        <Field loading={loading} title="cadd">
          {JSON.stringify(data.inSilicoPredictors.cadd, null, 2)}
        </Field>
        <Field loading={loading} title="pangolinLargestDs">
          {JSON.stringify(data.inSilicoPredictors.pangolinLargestDs, null, 2)}
        </Field>
        <Field loading={loading} title="phylop">
          {JSON.stringify(data.inSilicoPredictors.phylop, null, 2)}
        </Field>
      </>
    </BaseProfileHeader>
  );
}