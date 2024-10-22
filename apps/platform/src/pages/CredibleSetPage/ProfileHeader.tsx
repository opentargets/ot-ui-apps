import { Fragment } from "react";
import {
  usePlatformApi,
  Field,
  ProfileHeader as BaseProfileHeader,
  Link,
  ScientificNotation,
  Tooltip,
  PublicationsDrawer,
} from "ui";
import { Box, Typography } from "@mui/material";
import CREDIBLE_SET_PROFILE_HEADER_FRAGMENT from "./ProfileHeader.gql";
import { getStudyCategory } from "sections/src/utils/getStudyCategory";
import { epmcUrl } from "../../utils/urls";

type ProfileHeaderProps = {
  variantId: string;
};

function ProfileHeader({ variantId }: ProfileHeaderProps) {

  const { loading, error, data } = usePlatformApi();

  // TODO: Errors!
  if (error) return null;

  const credibleSet = data?.credibleSets?.[0];
  const study = credibleSet?.study;
  const studyCategory = study ? getStudyCategory(study.projectId) : null;
  const target = study?.target;
  const leadVariant = credibleSet?.locus?.find(loc => loc?.variant.id === variantId);
  const beta = leadVariant?.beta ?? credibleSet?.beta;
  const standardError = leadVariant?.standardError ?? credibleSet?.standardError;
  const { pValueMantissa, pValueExponent } =
    typeof leadVariant?.pValueMantissa === "number" &&
    typeof leadVariant?.pValueExponent === "number"
      ? leadVariant
      : credibleSet ?? {};

  return (
    <BaseProfileHeader>
        
      <Box>
        <Typography variant="subtitle1" mt={0}>Lead Variant</Typography>
        {typeof pValueMantissa === "number" && typeof pValueExponent === "number" &&
          <Field loading={loading} title="P-value">
            <ScientificNotation number={[pValueMantissa, pValueExponent]} />
          </Field>
        }
        {typeof beta === 'number' &&
          <Field
            loading={loading}
            title={
              <Tooltip
                title={
                  <Typography variant="caption">
                    Beta with respect to the ALT allele
                  </Typography>
                }
                showHelpIcon
              >
                Beta
              </Tooltip>
            }
          >
            {beta.toPrecision(3)}
          </Field>
        }
        {typeof standardError === 'number' &&
          <Field
            loading={loading}
            title={
              <Tooltip
                title={
                  <Typography variant="caption">
                    Standard error: Estimate of the standard deviation of the sampling distribution of the beta
                  </Typography>
                }
                showHelpIcon
              >
                Standard error
              </Tooltip>
            }
          >
            {standardError.toPrecision(3)}
          </Field>
        }
        {typeof credibleSet?.effectAlleleFrequencyFromSource === "number" &&
          <Field loading={loading} title="EAF">
            {credibleSet.effectAlleleFrequencyFromSource.toPrecision(3)}
          </Field>
        }
        {typeof leadVariant?.posteriorProbability === "number" &&
          <Field
            loading={loading}
            title={
              <Tooltip
                title={
                  <Typography variant="caption">
                    Posterior inclusion probability from fine-mapping that this variant is causal
                  </Typography>
                }
                showHelpIcon
              >
                Posterior probability
              </Tooltip>
            }
          >
            {leadVariant.posteriorProbability.toPrecision(3)}
          </Field>
        }
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
        {studyCategory !== "QTL" &&
          <>
            <Field loading={loading} title="Trait">
              {study?.traitFromSource}
            </Field>
            {study?.diseases?.length > 0 &&
              <Field loading={loading} title="Diseases">
                {study.diseases.map(({ id, name }, index) => (
                  <Fragment key={id}>
                    {index > 0 ? ", " : null}
                    <Link to={`../disease/${id}`}>{name}</Link>
                  </Fragment>
                ))}
              </Field>
            }
          </>
        }
        {studyCategory === "QTL" &&
          <>
            {target?.id &&
              <Field loading={loading} title="Affected gene">
                <Link to={`../target/${target.id}`}>
                  {target.approvedSymbol} 
                </Link>
              </Field>
            }
            { study?.biosample?.biosampleId &&
              <Field loading={loading} title="Affected cell/tissue">
                <Link external to={`https://www.ebi.ac.uk/ols4/search?q=${study.biosample.biosampleId}&ontology=uberon`}>
                  {study.biosample.biosampleId}
                </Link>
              </Field>
            }
          </>
        }
        <Field loading={loading} title="Journal">
          {study?.publicationJournal}
        </Field>
        {study?.pubmedId &&
          <Field loading={loading} title="PubMed">
            <PublicationsDrawer
              entries={[{ name: study.pubmedId, url: epmcUrl(study.pubmedId)}]}
            >
              {study.pubmedId}
            </PublicationsDrawer>
          </Field>
        }
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