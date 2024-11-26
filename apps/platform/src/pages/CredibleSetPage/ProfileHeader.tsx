import { Fragment } from "react";
import {
  usePlatformApi,
  Field,
  ProfileHeader as BaseProfileHeader,
  Link,
  ScientificNotation,
  Tooltip,
  PublicationsDrawer,
  ClinvarStars,
} from "ui";
import { Box, Typography } from "@mui/material";
import CREDIBLE_SET_PROFILE_HEADER_FRAGMENT from "./ProfileHeader.gql";
import { getStudyCategory } from "sections/src/utils/getStudyCategory";
import { epmcUrl } from "../../utils/urls";
import {
  credsetConfidenceMap,
} from "../../constants";

type ProfileHeaderProps = {
  variantId: string;
};

function ProfileHeader({ variantId }: ProfileHeaderProps) {
  const { loading, error, data } = usePlatformApi();

  // TODO: Errors!
  if (error) return null;

  const credibleSet = data?.credibleSet;
  const study = credibleSet?.study;
  const studyCategory = study ? getStudyCategory(study.projectId) : null;
  const target = study?.target;
  const leadVariant = credibleSet?.locus.rows[0];
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
        <Typography variant="subtitle1" mt={0}>
          Lead Variant
        </Typography>
        {typeof pValueMantissa === "number" && typeof pValueExponent === "number" && (
          <Field loading={loading} title="P-value">
            <ScientificNotation number={[pValueMantissa, pValueExponent]} />
          </Field>
        )}
        {typeof beta === "number" && (
          <Field
            loading={loading}
            title={
              <Tooltip
                title={
                  <Typography variant="caption">Beta with respect to the ALT allele</Typography>
                }
                showHelpIcon
              >
                Beta
              </Tooltip>
            }
          >
            {beta.toPrecision(3)}
          </Field>
        )}
        {typeof standardError === "number" && (
          <Field
            loading={loading}
            title={
              <Tooltip
                title={
                  <Typography variant="caption">
                    Standard error: Estimate of the standard deviation of the sampling distribution
                    of the beta
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
        )}
        {typeof credibleSet?.effectAlleleFrequencyFromSource === "number" && (
          <Field loading={loading} title={<Tooltip
            title={
              <Typography variant="caption">
              Frequency of the effect allele in studied population 
              </Typography>
            }
            showHelpIcon
          >
            Effective allele frequency
          </Tooltip>}>
            {credibleSet.effectAlleleFrequencyFromSource.toPrecision(3)}
          </Field>
        )}
        {typeof leadVariant?.posteriorProbability === "number" && (
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
        )}

        <Typography variant="subtitle1" mt={1}>
          Fine-mapping <Tooltip title={credibleSet?.confidence}>
            <span>
              <ClinvarStars num={credsetConfidenceMap[credibleSet?.confidence]} />
            </span>
          </Tooltip>
        </Typography>
        {
          credibleSet?.locusStart && (<Field loading={loading} title="Locus">
          {credibleSet?.variant?.chromosome}:{credibleSet?.locusStart}-{credibleSet?.locusEnd}
        </Field>)
        }
        <Field loading={loading} title="Method">
          {credibleSet?.finemappingMethod}
        </Field>
        <Field
          loading={loading}
          title={
          <Tooltip
            title={
              <Typography variant="caption">Minimum pairwise correlation (R<sup>2</sup>) observed between all variants in the credible set</Typography>
            }
            showHelpIcon
          >
            Minimum R<sup>2</sup>
          </Tooltip>
        }
        >
          {credibleSet?.purityMinR2?.toPrecision(3)}
        </Field>
      </Box>

      <Box>
        <Typography variant="subtitle1" mt={0}>
          Study
        </Typography>
        {studyCategory !== "QTL" && (
          <>
            <Field loading={loading} title="Reported trait">
              {study?.traitFromSource}
            </Field>
            {study?.diseases?.length > 0 && (
              <Field loading={loading} title="Disease or phenotype">
                {study.diseases.map(({ id, name }, index) => (
                  <Fragment key={id}>
                    {index > 0 ? ", " : null}
                    <Link to={`../disease/${id}`}>{name}</Link>
                  </Fragment>
                ))}
              </Field>
            )}
            {study?.backgroundTraits?.length > 0 && (
              <Field loading={loading} title="Background trait">
                {study.backgroundTraits.map(({ id, name }, index) => (
                  <Fragment key={id}>
                    {index > 0 ? ", " : null}
                    <Link to={`../disease/${id}`}>{name}</Link>
                  </Fragment>
                ))}
              </Field>
            )}
          </>
        )}
        {studyCategory === "QTL" && (
          <>
            {target?.id && (
              <Field loading={loading} title="Affected gene">
                <Link to={`../target/${target.id}`}>{target.approvedSymbol}</Link>
              </Field>
            )}
            {study?.biosample?.biosampleId && (
              <Field loading={loading} title="Affected cell/tissue">
                <Link
                  external
                  to={`https://www.ebi.ac.uk/ols4/search?q=${study.biosample.biosampleId}&ontology=uberon`}
                >
                  {study.biosample.biosampleId}
                </Link>
              </Field>
            )}
          </>
        )}
        <Field loading={loading} title="Sample size">
          {study?.nSamples.toLocaleString()}
        </Field>
        {study?.publicationFirstAuthor && (<Field loading={loading} title="Publication">
          {study?.publicationFirstAuthor} <i>et al.</i> {study?.publicationJournal} ({study?.publicationDate?.slice(0, 4)}) 
        </Field>)}
        {study?.pubmedId && (
          <Field loading={loading} title="PubMed">
            <PublicationsDrawer entries={[{ name: study.pubmedId, url: epmcUrl(study.pubmedId) }]}>
              {study.pubmedId}
            </PublicationsDrawer>
          </Field>
        )}
      </Box>
    </BaseProfileHeader>  
  );
}

ProfileHeader.fragments = {
  profileHeader: CREDIBLE_SET_PROFILE_HEADER_FRAGMENT,
};

export default ProfileHeader;
