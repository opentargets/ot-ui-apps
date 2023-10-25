import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useQuery } from '@apollo/client';
import { Skeleton } from '@material-ui/lab';
import { Link, Typography, SectionHeading } from '../../../ot-ui-components';
import { safeCommaSeparate, variantPopulations } from '../../../utils';
import {
  VariantSummaryQuery,
  VariantSummaryQueryVariables,
} from '../../../__generated__/graphql';
import { Fragment } from 'react';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import VARIANT_SUMMARY_QUERY from './VariantSummary.gql';

const styles = () => ({
  value: {
    paddingLeft: '0.6rem',
    paddingRight: '1rem',
  },
});

type VariantSummaryProps = {
  classes: ClassNameMap<'value'>;
  variantId: string;
};
function Summary({ classes, variantId }: VariantSummaryProps) {
  const { loading, data: queryResult } = useQuery<
    VariantSummaryQuery,
    VariantSummaryQueryVariables
  >(VARIANT_SUMMARY_QUERY, {
    variables: { variantId },
  });
  const data = queryResult?.variantInfo;
  return (
    <>
      <SectionHeading
        heading="Variant summary"
        entities={[
          {
            type: 'variant',
            fixed: true,
          },
        ]}
      />
      <Grid container justifyContent="space-between">
        <Grid item xs={12} sm={6} md={8}>
          <Typography variant="subtitle1">Location</Typography>
          <Typography variant="subtitle2">
            {loading ? (
              <Skeleton width="50vw" />
            ) : (
              <>
                <strong>GRCh38:</strong> {data?.chromosome}:
                {safeCommaSeparate(data?.position)}
              </>
            )}
          </Typography>
          <Typography variant="subtitle2">
            {loading ? (
              <Skeleton width="50vw" />
            ) : (
              <>
                <strong>GRCh37:</strong> {data?.chromosomeB37}:
                {safeCommaSeparate(data?.positionB37)}
              </>
            )}
          </Typography>
          <Typography variant="subtitle2">
            {loading ? (
              <Skeleton width="50vw" />
            ) : (
              <>
                <strong>Reference allele:</strong> {data?.refAllele}
              </>
            )}
          </Typography>
          <Typography variant="subtitle2">
            {loading ? (
              <Skeleton width="50vw" />
            ) : (
              <>
                <strong>Alternative allele (effect allele):</strong>{' '}
                {data?.altAllele}
              </>
            )}
          </Typography>

          <br />

          <Typography variant="subtitle1">Neighbourhood</Typography>
          {loading && (
            <>
              <Skeleton width="50vw" />
              <Skeleton width="50vw" />
            </>
          )}
          {!loading && data?.nearestGene ? (
            <Typography variant="subtitle2">
              <strong>
                Nearest gene (
                {data && data.nearestGeneDistance
                  ? safeCommaSeparate(data.nearestGeneDistance)
                  : ''}{' '}
                bp to canonical TSS):
              </strong>{' '}
              <Link to={`/gene/${data.nearestGene.id}`}>
                {data.nearestGene.symbol}
              </Link>
            </Typography>
          ) : (
            <Typography variant="subtitle2">
              <strong>Nearest gene:</strong> N/A
            </Typography>
          )}
          {!loading && data?.nearestCodingGene ? (
            <Typography variant="subtitle2">
              <strong>
                Nearest coding gene (
                {safeCommaSeparate(data.nearestCodingGeneDistance)} bp to
                canonical TSS):
              </strong>{' '}
              <Link to={`/gene/${data.nearestCodingGene.id}`}>
                {data.nearestCodingGene.symbol}
              </Link>
            </Typography>
          ) : (
            <Typography variant="subtitle2">
              <strong>Nearest coding gene:</strong> N/A
            </Typography>
          )}
          <br />

          <Typography variant="subtitle1">
            Variant Effect Predictor (
            <Link
              external
              to="https://www.ensembl.org/info/docs/tools/vep/index.html"
            >
              VEP
            </Link>
            )
          </Typography>

          <Typography variant="subtitle2">
            {loading ? (
              <Skeleton width="50vw" />
            ) : (
              <>
                <strong>Most severe consequence:</strong>{' '}
                {data?.mostSevereConsequence
                  ? data.mostSevereConsequence.replace(/_/g, ' ')
                  : 'N/A'}
              </>
            )}
          </Typography>
          <br />

          <Typography variant="subtitle1">
            Combined Annotation Dependent Depletion (
            <Link external to="https://cadd.gs.washington.edu/">
              CADD
            </Link>
            )
          </Typography>
          <Typography variant="subtitle2">
            <strong>raw: </strong>
            <span className={classes.value}>
              {data?.caddRaw ? data.caddRaw.toPrecision(3) : 'N/A'}
            </span>
            <strong>scaled: </strong>
            <span className={classes.value}>
              {data?.caddPhred ? data.caddPhred.toPrecision(3) : 'N/A'}
            </span>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle1">
            Population allele frequencies
          </Typography>
          <Grid container>
            {!loading &&
              variantPopulations.map(p => {
                const property = `gnomad${p.code}` as keyof typeof data;
                const value =
                  data && data[property]
                    ? (data[property] as number).toPrecision(3)
                    : 'N/A';
                return (
                  <Fragment key={p.code}>
                    <Grid item xs={9}>
                      <Typography variant="subtitle2">
                        {p.description}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle2" align="right">
                        {value}
                      </Typography>
                    </Grid>
                  </Fragment>
                );
              })}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default withStyles(styles)(Summary);
