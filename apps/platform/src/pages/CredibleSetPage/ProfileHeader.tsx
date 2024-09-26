import { Fragment } from "react";
import {
  usePlatformApi,
  Field,
  ProfileHeader as BaseProfileHeader,
  Link,
  ScientificNotation,
} from "ui";
import { Box, Typography, Skeleton } from "@mui/material";
import { identifiersOrgLink } from "../../utils/global";
import CREDIBLE_SET_PROFILE_HEADER_FRAGMENT from "./ProfileHeader.gql";

function ProfileHeader() {

  const { loading, error, data } = usePlatformApi();

  // TODO: Errors!
  if (error) return null;

  return (
    <BaseProfileHeader>
        
      <Box>

        <Typography variant="subtitle1" mt={0}>Lead Variant</Typography>
        <Field loading={loading} title="P-value">
          <ScientificNotation number={[data?.pValueMantissa, data?.pValueExponent]} />
        </Field>
        <Field loading={loading} title="Beta">
          data?.beta.toPrecision(3);
        </Field>
        <Field loading={loading} title="Standard Error">
          data?.standardError.toPrecision(3);
        </Field>
        <Field loading={loading} title="EAF">
          data?.effectAlleleFrequencyFromSource.toPrecision(3);
        </Field>
        <Field loading={loading} title="Posterior Probability">
          data?.posteriorProbability.toPrecision(3);
        </Field>
        <Field loading={loading} title="GRCh38">
          {data?.variant.chromosome}:{data?.variant.position}
        </Field>
        {
          data?.variant?.rsIds.length > 0 &&
            <Field loading={loading} title="Ensembl">
              {
                data.variant.rsIds.map((rsid, index) => (
                  <Fragment key={rsis}>
                    {index > 0 && ", "}
                    <Link
                      external
                      to={`https://www.ensembl.org/Homo_sapiens/Variation/Explore?v=${rsid}`}
                    >
                      {rsid}
                    </Link>
                  </Fragment>
                ))
              }
            </Field>
        }


        <Typography variant="subtitle1" mt={0}>Credible Set</Typography>
        <Field loading={loading} title="Finemapping Method">
          {data?.finemappingMethod}
        </Field>
        <Field loading={loading} title="Credible Set Index">
          {data?.credibleSetIndex}
        </Field>
        <Field loading={loading} title="Purity Min">
          {data?.purityMinR2.toPrecision(3)}
        </Field>
        <Field loading={loading} title="Start">
          {data?.locusStart}
        </Field>
        <Field loading={loading} title="End">
          {data?.locusEnd}
        </Field>

      </Box>

      <Box>
        <Typography variant="subtitle1" mt={0}>Study</Typography>
        <Field loading={loading} title="Author">
          {data?.study?.publicationFirstAuthor}
        </Field>
        <Field loading={loading} title="Date">
          {data?.study?.publicationFirstAuthor?.slice(0, 4)}
        </Field>
      </Box>

    </BaseProfileHeader>
  )
}

ProfileHeader.fragments = {
  profileHeader: CREDIBLE_SET_PROFILE_HEADER_FRAGMENT,
};

export default ProfileHeader;