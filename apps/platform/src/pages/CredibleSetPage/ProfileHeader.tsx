import { Fragment, useState } from "react";
import {
  usePlatformApi,
  Field,
  ProfileHeader as BaseProfileHeader,
  Link,
  ScientificNotation,
  Tooltip,
  PublicationsDrawer,
  ClinvarStars,
  LabelChip,
} from "ui";
import { Box, Typography, Popover } from "@mui/material";
import CREDIBLE_SET_PROFILE_HEADER_FRAGMENT from "./ProfileHeader.gql";
import { getStudyCategory } from "sections/src/utils/getStudyCategory";
import { epmcUrl } from "../../utils/urls";
import { credsetConfidenceMap, poulationMap } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { v1 } from "uuid";

type ProfileHeaderProps = {
  variantId: string;
};

const dicSummary = [
  { id: "n_variants", label: "Total variants", tooltip: "Number of harmonised variants" },
  { id: "n_variants_sig", label: "Significant variants", tooltip: "P-value significant variants" },
  { id: "mean_beta", label: "Mean beta", tooltip: "Mean effect size across all variants" },
  {
    id: "gc_lambda",
    label: "GC lambda",
    tooltip: "Additive Genomic Control (GC) lambda indicating GWAS inflation",
  },
  {
    id: "mean_diff_pz",
    label: "Mean diff P-Z",
    tooltip: "Mean difference between reported and calculated log p-values",
  },
  {
    id: "se_diff_pz",
    label: "SD diff P-Z",
    tooltip: "Standard deviation of the difference between reported and calculated log p-values",
  },
];

function SummaryStatisticsField({ sumstatQCValues }: any) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  if (!sumstatQCValues) return null;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Fragment>
      <Typography
        sx={{ cursor: "pointer", mr: 0.5, fontWeight: 600, color: "secondary.main" }}
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
      >
        Available <FontAwesomeIcon icon={faCaretDown} />
      </Typography>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        elevation={1}
        disableScrollLock
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, my: 1 }} variant="subtitle2">
            Harmonised summary statistics
          </Typography>
          <table>
            <tbody>
              {dicSummary.map((sumstat: any) => {
                const summStatValue = sumstatQCValues.find(
                  (v: any) => v.QCCheckName === sumstat.id
                ).QCCheckValue;
                return (
                  <tr key={v1()}>
                    <td>
                      <Tooltip title={sumstat.tooltip} showHelpIcon>
                        {sumstat.label}
                      </Tooltip>
                    </td>
                    <Typography sx={{ textAlign: "right" }} component="td" variant="body2">
                      {summStatValue}
                    </Typography>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
      </Popover>
    </Fragment>
  );
}

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
          <Field
            loading={loading}
            title={
              <Tooltip
                title={
                  <Typography variant="caption">
                    Frequency of the effect allele in studied population
                  </Typography>
                }
                showHelpIcon
              >
                Effective allele frequency
              </Tooltip>
            }
          >
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
          Fine-mapping
        </Typography>
        {credibleSet?.locusStart && (
          <Field loading={loading} title="Locus">
            {credibleSet?.variant?.chromosome}:{credibleSet?.locusStart}-{credibleSet?.locusEnd}
          </Field>
        )}
        <Field loading={loading} title="Method">
          {credibleSet?.finemappingMethod}
        </Field>
        <Field
          loading={loading}
          title={
            <Tooltip
              title="Fine-mapping confidence based on the quality of the linkage-desequilibrium information available and fine-mapping method"
              showHelpIcon
            >
              Confidence
            </Tooltip>
          }
        >
          <Tooltip title={credibleSet?.confidence}>
            <span>
              <ClinvarStars num={credsetConfidenceMap[credibleSet?.confidence]} />
            </span>
          </Tooltip>
        </Field>
        <Field
          loading={loading}
          title={
            <Tooltip
              title={
                <Typography variant="caption">
                  Minimum pairwise correlation (R<sup>2</sup>) observed between all variants in the
                  credible set
                </Typography>
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
          {study?.studyType.replace(/(qtl|gwas)/gi, match => match.toUpperCase())} Study
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
                  to={`https://www.ebi.ac.uk/ols4/search?q=${study.biosample.biosampleId}`}
                >
                  {study.biosample.biosampleName}
                </Link>
              </Field>
            )}
          </>
        )}
        {study?.publicationFirstAuthor && (
          <Field loading={loading} title="Publication">
            {study?.publicationFirstAuthor} <i>et al.</i> {study?.publicationJournal} (
            {study?.publicationDate?.slice(0, 4)})
          </Field>
        )}
        {study?.pubmedId && (
          <Field loading={loading} title="PubMed">
            <PublicationsDrawer entries={[{ name: study.pubmedId, url: epmcUrl(study.pubmedId) }]}>
              {study.pubmedId}
            </PublicationsDrawer>
          </Field>
        )}
        {study?.analysisFlags && (
          <Field
            loading={loading}
            title={
              <Tooltip title="Type of analysis" showHelpIcon>
                Analysis
              </Tooltip>
            }
          >
            {study?.analysisFlags ? study.analysisFlags : "Not Available"}
          </Field>
        )}
        {study?.hasSumstats && (
          <Field loading={loading} title="Summary statistics">
            <SummaryStatisticsField
              hasSumstats={study?.hasSumstats}
              sumstatQCValues={study?.sumstatQCValues}
            />
          </Field>
        )}
        <Field loading={loading} title="Sample size">
          {study?.nSamples.toLocaleString()}
        </Field>
        <Box display="flex" sx={{ gap: 1 }}>
          {/* LD Ancestries */}
          {study?.ldPopulationStructure?.length > 0 &&
            study.ldPopulationStructure.map(({ ldPopulation, relativeSampleSize }, index) => (
              <LabelChip
                key={ldPopulation}
                label={ldPopulation.toUpperCase()}
                value={`${(relativeSampleSize * 100).toFixed(0)}%`}
                tooltip={`LD reference population: ${poulationMap[ldPopulation]}`}
              />
            ))}
          {/* Quality controls */}
          {study?.qualityControls?.length > 0 && (
            <Tooltip title={study?.qualityControls.join(", ")} arrow>
              <LabelChip
                label={<FontAwesomeIcon size="1x" icon={faTriangleExclamation} />}
                value={study?.qualityControls.length + " issue"}
                tooltip={study?.qualityControls.join("; ")}
                color="orange"
              />
            </Tooltip>
          )}
        </Box>
      </Box>
    </BaseProfileHeader>
  );
}

ProfileHeader.fragments = {
  profileHeader: CREDIBLE_SET_PROFILE_HEADER_FRAGMENT,
};

export default ProfileHeader;
