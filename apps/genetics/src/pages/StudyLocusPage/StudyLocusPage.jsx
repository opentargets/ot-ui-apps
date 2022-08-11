import React from 'react';
import { Query } from '@apollo/client/react/components';
import gql from 'graphql-tag';
import { max} from 'd3';

import Header from './Header';
import BasePage from '../BasePage';

import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import {
  SectionHeading,
  PlotContainer,
  PlotContainerSection,
  significantFigures,
} from '../../ot-ui-components';

import ScrollToTop from '../../components/ScrollToTop';
import ErrorBoundary from '../../components/ErrorBoundary';
import CredibleSet from '../../components/CredibleSet';
import CredibleSetWithRegional from '../../components/CredibleSetWithRegional';
import CredibleSetsIntersectionTable from '../../components/CredibleSetsIntersectionTable';
import Slider from '../../components/Slider';

import {
  filterGwasColocalisation,
  filterQtlColocalisation,
  filterPageCredibleSet,
  buildCredibleGwasColocalisation,
  buildCredibleQtlColocalisation,
  filterCredibleSets,
  getCheckedCredibleSets,
  getVariantByCredibleSetsIntersection,
  sanitize
} from '../../utils';

import StudyLocusGenes from '../../sections/studyLocus/Genes/StudyLocusGenes';
import CredibleSetsGroup from '../../sections/studyLocus/CredibleSetsGroup';
import ColocGWASTable from '../../sections/studyLocus/ColocGWASTable';
import GenePrioritisationTabs from '../../sections/studyLocus/GenePrioritisationTabs';
import ColocL2GTable from '../../sections/studyLocus/ColocL2GTable';
import Summary from '../../sections/studyLocus/Summary';

import STUDY_LOCUS_HEADER_QUERY from './StudyLocusHeaderQuery.gql';
import STUDY_LOCUS_PAGE_QUERY from '../../queries/StudyLocusPageQuery.gql';
import GWAS_REGIONAL_QUERY from '../../queries/GWASRegionalQuery.gql';
import QTL_REGIONAL_QUERY from '../../queries/QTLRegionalQuery.gql';

const HALF_WINDOW = 250000;

const gwasCredibleSetQueryAliasedFragment = ({ study, indexVariant }) => `
gwasCredibleSet__${study.studyId}__${
  indexVariant.id
}: gwasCredibleSet(studyId: "${study.studyId}", variantId: "${
  indexVariant.id
}") {
  tagVariant {
    id
    rsId
    position
  }
  pval
  se
  beta
  postProb
  MultisignalMethod
  logABF
  is95
  is99
}
`;

const qtlCredibleSetQueryAliasedFragment = ({
  qtlStudyName,
  phenotypeId,
  tissue,
  indexVariant,
}) => {
  const tissueId = tissue.id.replaceAll('-', '_');
  const parseQTLStudyName = qtlStudyName.replaceAll('-', '_');
  const parsePhenotypeId = phenotypeId.replaceAll('-', '_');
  const sanitizedTissueId = sanitize(tissueId);
  const sanitizedPhenotypeId = sanitize(parsePhenotypeId);
  const sanitizedParseQTLStudyName = sanitize(parseQTLStudyName);
  return `
  qtlCredibleSet__${sanitizedParseQTLStudyName}__${sanitizedPhenotypeId}__${sanitizedTissueId}__${
    indexVariant.id
  }: qtlCredibleSet(studyId: "${parseQTLStudyName}", variantId: "${
    indexVariant.id
  }", phenotypeId: "${parsePhenotypeId}", bioFeature: "${tissueId}") {
    tagVariant {
      id
      rsId
      position
    }
    pval
    se
    beta
    postProb
    MultisignalMethod
    logABF
    is95
    is99
  }
  `;
};

const createCredibleSetsQuery = ({ gwasColocalisation, qtlColocalisation }) => {
  return gql(`query CredibleSetsQuery {
    ${gwasColocalisation.map(gwasCredibleSetQueryAliasedFragment).join('')}
    ${qtlColocalisation.map(qtlCredibleSetQueryAliasedFragment).join('')}
  }`);
};

const traitAuthorYear = s =>
  `${s.traitReported} (${s.pubAuthor}, ${new Date(s.pubDate).getFullYear()})`;


class StudyLocusPage extends React.Component {
  state = {
    gwasTabsValue: 'heatmap',
    credSet95Value: 'all',
    log2h4h3SliderValue: 1, // equivalent to H4 being double H3; suggested by Ed
    h4SliderValue: 0.95, // 95% default; suggested by Ed
    credibleSetIntersectionKeys: [],
  };
  handleGWASTabsChange = (_, gwasTabsValue) => {
    this.setState({ gwasTabsValue });
  };
  handleCredSet95Change = event => {
    this.setState({ credSet95Value: event.target.value });
  };
  handleLog2h4h3SliderChange = (_, log2h4h3SliderValue) => {
    this.setState({ log2h4h3SliderValue });
  };
  handleH4SliderChange = (_, h4SliderValue) => {
    this.setState({ h4SliderValue });
  };
  handleCredibleSetIntersectionKeysCheckboxClick = key => event => {
    const { credibleSetIntersectionKeys } = this.state;
    if (event.target.checked) {
      this.setState({
        credibleSetIntersectionKeys: [key, ...credibleSetIntersectionKeys],
      });
    } else {
      this.setState({
        credibleSetIntersectionKeys: credibleSetIntersectionKeys.filter(
          d => d !== key
        ),
      });
    }
  };
  componentDidMount() {
    const { match } = this.props;
    const { studyId, indexVariantId } = match.params;
    this.setState({
      credibleSetIntersectionKeys: [
        `gwasCredibleSet__${studyId}__${indexVariantId}`,
      ],
    });
  }
  componentDidUpdate(prevProps) {
    // page changed
    const { match } = this.props;
    const { studyId, indexVariantId } = match.params;
    if (
      prevProps.match.params.studyId !== studyId ||
      prevProps.match.params.indexVariantId !== indexVariantId
    ) {
      this.setState({
        credibleSetIntersectionKeys: [
          `gwasCredibleSet__${studyId}__${indexVariantId}`,
        ],
      });
    }
  }
  render() {
    const { credSet95Value } = this.state;
    const { match } = this.props;
    const { studyId, indexVariantId } = match.params;

    const [chromosome, positionStr] = indexVariantId.split('_');
    const position = parseInt(positionStr);
    const start = position - HALF_WINDOW;
    const end = position + HALF_WINDOW;

    return (
      <BasePage>
        {/* TODO: rescue Page title
        <Helmet>
          <title>{this.state.pageHeader}</title>
        </Helmet> */}
        <ScrollToTop />
        <ErrorBoundary>
          <Query
            query={STUDY_LOCUS_HEADER_QUERY}
            variables={{
              studyId,
              variantId: indexVariantId,
            }}
          >
            {({ loading: headerLoading, data: dataHeader }) => (
              <Header loading={headerLoading} data={dataHeader} />
            )}
          </Query>

          <Summary variantId={indexVariantId} studyId={studyId} />
          <ColocL2GTable variantId={indexVariantId} studyId={studyId} />
          <ColocGWASTable variantId={indexVariantId} studyId={studyId} />
          <GenePrioritisationTabs variantId={indexVariantId} studyId={studyId} />
          {/* TODO: separate unfinished component */}
          <CredibleSetsGroup variantId={indexVariantId} studyId={studyId} start={start} end={end} chromosome={chromosome}/>

          <Query
            query={STUDY_LOCUS_PAGE_QUERY}
            variables={{
              studyId,
              variantId: indexVariantId,
              chromosome,
              start,
              end,
            }}
          >
            {({ loading, error, data }) => {
              if (loading || error) {
                return null;
              }

              const {
                studyInfo,
                gwasColocalisation,
                qtlColocalisation,
                pageCredibleSet,
              } = data;

              const maxQTLLog2h4h3 = max(qtlColocalisation, d => d.log2h4h3);
              const maxGWASLog2h4h3 = max(
                gwasColocalisation,
                d => d.log2h4h3
              );
              const maxLog2h4h3 = max([maxQTLLog2h4h3, maxGWASLog2h4h3]);

              const shouldMakeColocalisationCredibleSetQuery =
                gwasColocalisation.length > 0 || qtlColocalisation.length > 0;
              const colocalisationCredibleSetQuery = shouldMakeColocalisationCredibleSetQuery
                ? createCredibleSetsQuery({
                    gwasColocalisation,
                    qtlColocalisation,
                  })
                : null;

              const gwasColocalisationFiltered = filterGwasColocalisation(
                gwasColocalisation,
                this.state
              );
              const qtlColocalisationFiltered = filterQtlColocalisation(
                qtlColocalisation,
                this.state
              );

              const pageCredibleSetAdjusted = filterPageCredibleSet(
                pageCredibleSet,
                credSet95Value
              );

              const pageCredibleSetKey = `gwasCredibleSet__${studyId}__${indexVariantId}`;

              return (
                <React.Fragment>

                  <SectionHeading
                    heading={`Credible Set Overlap`}
                    subheading={`Which variants at this locus are most likely causal?`}
                  />
                  <PlotContainer
                    center={
                      <Typography>
                        Showing credible sets for{' '}
                        <strong>{traitAuthorYear(studyInfo)}</strong> and GWAS
                        studies/QTLs in colocalisation. Expand the section to
                        see the underlying regional plot.
                      </Typography>
                    }
                  >
                    <PlotContainerSection>
                      <Grid container alignItems="center">
                        <Grid item>
                          <div style={{ padding: '0 20px' }}>
                            <Typography>Credible set variants</Typography>
                            <RadioGroup
                              style={{ padding: '0 16px' }}
                              row
                              aria-label="95% credible set"
                              name="credset95"
                              value={this.state.credSet95Value}
                              onChange={this.handleCredSet95Change}
                            >
                              <FormControlLabel
                                value="95"
                                control={<Radio />}
                                label="95%"
                              />
                              <FormControlLabel
                                value="all"
                                control={<Radio />}
                                label="PP > 0.1%"
                              />
                            </RadioGroup>
                          </div>
                        </Grid>
                        <Grid item>
                          <Slider
                            label={`log2(H4/H3): ${significantFigures(
                              this.state.log2h4h3SliderValue
                            )}`}
                            min={0}
                            max={Math.ceil(maxLog2h4h3)}
                            step={Math.ceil(maxLog2h4h3) / 50}
                            value={this.state.log2h4h3SliderValue}
                            onChange={this.handleLog2h4h3SliderChange}
                          />
                        </Grid>
                        <Grid item>
                          <Slider
                            label={`H4: ${significantFigures(
                              this.state.h4SliderValue
                            )}`}
                            min={0}
                            max={1}
                            step={0.02}
                            value={this.state.h4SliderValue}
                            onChange={this.handleH4SliderChange}
                          />
                        </Grid>
                      </Grid>
                    </PlotContainerSection>
                  </PlotContainer>

                  <CredibleSetWithRegional
                    checkboxProps={{
                      checked:
                        this.state.credibleSetIntersectionKeys.indexOf(
                          pageCredibleSetKey
                        ) >= 0,
                      onChange: this.handleCredibleSetIntersectionKeysCheckboxClick(
                        pageCredibleSetKey
                      ),
                      value: pageCredibleSetKey,
                    }}
                    credibleSetProps={{
                      label: traitAuthorYear(studyInfo),
                      start,
                      end,
                      data: pageCredibleSetAdjusted,
                    }}
                    regionalProps={{
                      title: null,
                      query: GWAS_REGIONAL_QUERY,
                      variables: {
                        studyId: studyInfo.studyId,
                        chromosome,
                        start,
                        end,
                      },
                      start,
                      end,
                    }}
                  />

                  {shouldMakeColocalisationCredibleSetQuery ? (
                    <Query
                      query={colocalisationCredibleSetQuery}
                      variables={{}}
                    >
                      {({ loading: loading2, error: error2, data: data2 }) => {
                        if (loading2 || error2 || data2 === undefined) {
                          return null;
                        }

                        // de-alias

                        const gwasColocalisationCredibleSetsFiltered = buildCredibleGwasColocalisation(
                          gwasColocalisationFiltered,
                          data2,
                          credSet95Value
                        );
                        const qtlColocalisationCredibleSetsFiltered = buildCredibleQtlColocalisation(
                          qtlColocalisationFiltered,
                          data2,
                          credSet95Value
                        );

                        // get the intersecting variants
                        const credibleSetsAll = [
                          {
                            key: pageCredibleSetKey,
                            credibleSet: pageCredibleSetAdjusted,
                          },
                          ...gwasColocalisationCredibleSetsFiltered.map(
                            ({ key, credibleSet }) => ({ key, credibleSet })
                          ),
                          ...qtlColocalisationCredibleSetsFiltered.map(
                            ({ key, credibleSet }) => ({ key, credibleSet })
                          ),
                        ];
                        const { credibleSetIntersectionKeys } = this.state;
                        const credibleSetsChecked = filterCredibleSets(
                          credibleSetsAll,
                          credibleSetIntersectionKeys
                        );
                        const variantsByCredibleSets = getCheckedCredibleSets(
                          credibleSetsChecked
                        );
                        const variantsByCredibleSetsIntersection = getVariantByCredibleSetsIntersection(
                          variantsByCredibleSets
                        );

                        return (
                          <React.Fragment>
                            <Typography style={{ paddingTop: '10px' }}>
                              <strong>GWAS</strong>
                            </Typography>
                            {gwasColocalisationCredibleSetsFiltered.length >
                            0 ? (
                              gwasColocalisationCredibleSetsFiltered.map(d => {
                                return (
                                  <CredibleSetWithRegional
                                    key={d.key}
                                    checkboxProps={{
                                      checked:
                                        this.state.credibleSetIntersectionKeys.indexOf(
                                          d.key
                                        ) >= 0,
                                      onChange: this.handleCredibleSetIntersectionKeysCheckboxClick(
                                        d.key
                                      ),
                                      value: d.key,
                                    }}
                                    credibleSetProps={{
                                      label: traitAuthorYear(d.study),
                                      start,
                                      end,
                                      h4: d.h4,
                                      logH4H3: d.log2h4h3,
                                      data: d.credibleSet,
                                    }}
                                    regionalProps={{
                                      title: null,
                                      query: GWAS_REGIONAL_QUERY,
                                      variables: {
                                        studyId: d.study.studyId,
                                        chromosome,
                                        start,
                                        end,
                                      },
                                      start,
                                      end,
                                    }}
                                  />
                                );
                              })
                            ) : (
                              <Typography align="center">
                                No GWAS studies satisfying the applied filters.
                              </Typography>
                            )}

                            <Typography style={{ paddingTop: '10px' }}>
                              <strong>QTL</strong>
                            </Typography>
                            {qtlColocalisationCredibleSetsFiltered.length >
                            0 ? (
                              qtlColocalisationCredibleSetsFiltered.map(d => {
                                return (
                                  <CredibleSetWithRegional
                                    key={d.key}
                                    checkboxProps={{
                                      checked:
                                        this.state.credibleSetIntersectionKeys.indexOf(
                                          d.key
                                        ) >= 0,
                                      onChange: this.handleCredibleSetIntersectionKeysCheckboxClick(
                                        d.key
                                      ),
                                      value: d.key,
                                    }}
                                    credibleSetProps={{
                                      label: `${d.qtlStudyName}: ${
                                        d.gene.symbol
                                      } in ${d.tissue.name}`,
                                      start,
                                      end,
                                      h4: d.h4,
                                      logH4H3: d.log2h4h3,
                                      data: d.credibleSet,
                                    }}
                                    regionalProps={{
                                      title: null,
                                      query: QTL_REGIONAL_QUERY,
                                      variables: {
                                        studyId: d.qtlStudyName,
                                        phenotypeId: d.phenotypeId,
                                        bioFeature: d.tissue.id,
                                        chromosome,
                                        start,
                                        end,
                                      },
                                      start,
                                      end,
                                    }}
                                  />
                                );
                              })
                            ) : (
                              <Typography align="center">
                                No QTL studies satisfying the applied filters.
                              </Typography>
                            )}

                            <Typography style={{ paddingTop: '10px' }}>
                              <strong>
                                Intersection of credible set variants
                              </strong>
                            </Typography>
                            <PlotContainer>
                              <PlotContainerSection>
                                <div style={{ paddingRight: '32px' }}>
                                  <CredibleSet
                                    label="Intersection Variants"
                                    start={start}
                                    end={end}
                                    data={variantsByCredibleSetsIntersection}
                                  />
                                </div>
                              </PlotContainerSection>
                            </PlotContainer>
                            <CredibleSetsIntersectionTable
                              data={variantsByCredibleSetsIntersection}
                              filenameStem={`${studyId}-${indexVariantId}-credset-intersection`}
                            />
                          </React.Fragment>
                        );
                      }}
                    </Query>
                  ) : null}

                </React.Fragment>
              );
            }}
          </Query>
          <StudyLocusGenes chromosome={chromosome} start={start} end={end} />
        </ErrorBoundary>
      </BasePage>
    );
  }
}

export default StudyLocusPage;
