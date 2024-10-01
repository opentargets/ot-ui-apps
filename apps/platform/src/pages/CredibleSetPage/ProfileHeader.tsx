import { Fragment } from "react";
import {
  usePlatformApi,
  Field,
  ProfileHeader as BaseProfileHeader,
  Link,
  ScientificNotation,
} from "ui";
import { Box, Typography } from "@mui/material";
import CREDIBLE_SET_PROFILE_HEADER_FRAGMENT from "./ProfileHeader.gql";
import { getStudyCategory } from "sections/src/utils/getStudyCategory";

type ProfileHeaderProps = {
  variantId: string;
};

function ProfileHeader({ variantId }: ProfileHeaderProps) {

  const { loading, error, data } = usePlatformApi();

  // TODO: Errors!
  if (error) return null;

  const credibleSet = data?.credibleSets?.[0];
  const study = credibleSet?.study;
  const studyCategory = study ? getStudyCategory(study) : null;
  const target = study?.target;
  const posteriorProbability =
    credibleSet?.locus?.find(loc => loc?.variant.id === variantId)?.posteriorProbability;

  return (
    <BaseProfileHeader>
        
      <Box>
        <Typography variant="subtitle1" mt={0}>Lead Variant</Typography>
        <Field loading={loading} title="P-value">
          <ScientificNotation number={[credibleSet?.pValueMantissa, credibleSet?.pValueExponent]} />
        </Field>
        <Field loading={loading} title="Beta">
          {credibleSet?.beta?.toPrecision(3)}
        </Field>
        <Field loading={loading} title="Standard error">
          {credibleSet?.standardError?.toPrecision(3)}
        </Field>
        <Field loading={loading} title="EAF">
          {credibleSet?.effectAlleleFrequencyFromSource?.toPrecision(3)}
        </Field>
        <Field loading={loading} title="Posterior probability">
          {posteriorProbability?.toPrecision(3)}
        </Field>
        <Field loading={loading} title="GRCh38">
          {credibleSet?.variant &&
            `${credibleSet.variant.chromosome}:${credibleSet.variant.position}`
          }
        </Field>
        {
          credibleSet?.variant?.rsIds.length > 0 &&
            <Field loading={loading} title="Ensembl">
              {
                credibleSet.variant.rsIds.map((rsid, index) => (
                  <Fragment key={rsid}>
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

        <Typography variant="subtitle1" mt={1}>Credible Set</Typography>
        <Field loading={loading} title="Finemapping method">
          {credibleSet?.finemappingMethod}
        </Field>
        <Field loading={loading} title="Credible set index">
          {credibleSet?.credibleSetIndex}
        </Field>
        <Field loading={loading} title="Purity min">
          {credibleSet?.purityMinR2?.toPrecision(3)}
        </Field>
        <Field loading={loading} title="Start">
          {credibleSet?.locusStart}
        </Field>
        <Field loading={loading} title="End">
          {credibleSet?.locusEnd}
        </Field>
      </Box>

      <Box>
        <Typography variant="subtitle1" mt={0}>Study</Typography>
        <Field loading={loading} title="Author">
          {study?.publicationFirstAuthor}
        </Field>
        <Field loading={loading} title="Date">
          {study?.publicationDate?.slice(0, 4)}
        </Field>
        <Field loading={loading} title="Trait">
          {study?.traitFromSource}
        </Field>
        {studyCategory === "QTL" &&
          <>
            {target?.id &&
              <Field loading={loading} title="Affected gene">
                <Link to={`../target/${target.id}`}>
                  target.approvedSymbol
                </Link>
              </Field>
            }
            <Field loading={loading} title="Affected cell/tissue">
              {study?.biosample?.biosampleId}
            </Field>
          </>
        }
        <Field loading={loading} title="Journal">
          {study?.publicationJournal}
        </Field>
        <Field loading={loading} title="PubMed">
          {study?.pubmedId}
        </Field>
        <Field loading={loading} title="Sample size">
          {study?.nSamples}
        </Field>
      </Box>

    </BaseProfileHeader>
  );
}

ProfileHeader.fragments = {
  profileHeader: CREDIBLE_SET_PROFILE_HEADER_FRAGMENT,
};

export default ProfileHeader;