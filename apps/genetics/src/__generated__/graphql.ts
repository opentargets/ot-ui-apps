/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Long` scalar type represents non-fractional signed whole numeric values. Long can represent values between -(2^63) and 2^63 - 1. */
  Long: number;
};

/** This element represents the tag variant with its associated statistics */
export type CredSetTagElement = {
  __typename?: 'CredSetTagElement';
  /** Multisignal Method */
  MultisignalMethod: Scalars['String'];
  /** beta */
  beta: Scalars['Float'];
  /** Is over 95 percentile */
  is95: Scalars['Boolean'];
  /** Is over 99 percentile */
  is99: Scalars['Boolean'];
  /** Log ABF */
  logABF: Scalars['Float'];
  /** Posterior Probability */
  postProb: Scalars['Float'];
  /** p-val */
  pval: Scalars['Float'];
  /** SE */
  se: Scalars['Float'];
  /** Tag Variant in the credibleset table */
  tagVariant: Variant;
};

/** A list of rows with each link */
export type DistanceElement = {
  __typename?: 'DistanceElement';
  aggregatedScore: Scalars['Float'];
  sourceId: Scalars['String'];
  tissues: Array<DistanceTissue>;
  typeId: Scalars['String'];
};

export type DistanceTissue = {
  __typename?: 'DistanceTissue';
  /** Distance to the canonical TSS */
  distance?: Maybe<Scalars['Long']>;
  /** Quantile of the score */
  quantile?: Maybe<Scalars['Float']>;
  /** Score 1 / Distance */
  score?: Maybe<Scalars['Float']>;
  tissue: Tissue;
};

export type FPredTissue = {
  __typename?: 'FPredTissue';
  maxEffectLabel?: Maybe<Scalars['String']>;
  maxEffectScore?: Maybe<Scalars['Float']>;
  tissue: Tissue;
};

/** A list of rows with each link */
export type FunctionalPredictionElement = {
  __typename?: 'FunctionalPredictionElement';
  aggregatedScore: Scalars['Float'];
  sourceId: Scalars['String'];
  tissues: Array<FPredTissue>;
  typeId: Scalars['String'];
};

/** A list of rows with each link */
export type G2VSchema = {
  __typename?: 'G2VSchema';
  /** Distance structure definition */
  distances: Array<G2VSchemaElement>;
  /** qtl structure definition */
  functionalPredictions: Array<G2VSchemaElement>;
  /** qtl structure definition */
  intervals: Array<G2VSchemaElement>;
  /** qtl structure definition */
  qtls: Array<G2VSchemaElement>;
};

/** A list of rows with each link */
export type G2VSchemaElement = {
  __typename?: 'G2VSchemaElement';
  id: Scalars['String'];
  /** PubmedID */
  pmid?: Maybe<Scalars['String']>;
  sourceDescriptionBreakdown?: Maybe<Scalars['String']>;
  sourceDescriptionOverview?: Maybe<Scalars['String']>;
  sourceId: Scalars['String'];
  sourceLabel?: Maybe<Scalars['String']>;
  tissues: Array<Tissue>;
};

export type GwasColocalisation = {
  __typename?: 'GWASColocalisation';
  /** Beta */
  beta?: Maybe<Scalars['Float']>;
  /** H3 */
  h3: Scalars['Float'];
  /** H4 */
  h4: Scalars['Float'];
  /** Tag variant ID as ex. 1_12345_A_T */
  indexVariant: Variant;
  /** Log2 H4/H3 */
  log2h4h3: Scalars['Float'];
  /** study ID */
  study: Study;
};

export type GwasColocalisationForQtlWithGene = {
  __typename?: 'GWASColocalisationForQTLWithGene';
  /** H3 */
  h3: Scalars['Float'];
  /** H4 */
  h4: Scalars['Float'];
  /** Tag variant ID as ex. 1_12345_A_T */
  leftVariant: Variant;
  /** Log2 H4/H3 */
  log2h4h3: Scalars['Float'];
  /** Phenotype ID */
  phenotypeId: Scalars['String'];
  /** QTL study ID */
  qtlStudyId: Scalars['String'];
  /** GWAS Study */
  study: Study;
  /** QTL bio-feature */
  tissue: Tissue;
};

export type GwaslrColocalisation = {
  __typename?: 'GWASLRColocalisation';
  /** H3 */
  h3: Scalars['Float'];
  /** H4 */
  h4: Scalars['Float'];
  /** study ID */
  leftStudy: Study;
  /** Tag variant ID as ex. 1_12345_A_T */
  leftVariant: Variant;
  /** Log2 H4/H3 */
  log2h4h3: Scalars['Float'];
  /** study ID */
  rightStudy: Study;
  /** Tag variant ID as ex. 1_12345_A_T */
  rightVariant: Variant;
};

export type Gecko = {
  __typename?: 'Gecko';
  geneTagVariants: Array<GeneTagVariant>;
  genes: Array<Gene>;
  indexVariants: Array<Variant>;
  studies: Array<Study>;
  tagVariantIndexVariantStudies: Array<TagVariantIndexVariantStudy>;
  tagVariants: Array<Variant>;
};

export type Gene = {
  __typename?: 'Gene';
  bioType?: Maybe<Scalars['String']>;
  chromosome?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  end?: Maybe<Scalars['Long']>;
  exons: Array<Scalars['Long']>;
  fwdStrand?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  start?: Maybe<Scalars['Long']>;
  symbol?: Maybe<Scalars['String']>;
  tss?: Maybe<Scalars['Long']>;
};

/** A list of rows with each link */
export type GeneForVariant = {
  __typename?: 'GeneForVariant';
  distances: Array<DistanceElement>;
  functionalPredictions: Array<FunctionalPredictionElement>;
  /** Associated scored gene */
  gene: Gene;
  intervals: Array<IntervalElement>;
  overallScore: Scalars['Float'];
  qtls: Array<QtlElement>;
  /** Associated scored variant */
  variant: Scalars['String'];
};

export type GeneTagVariant = {
  __typename?: 'GeneTagVariant';
  geneId: Scalars['String'];
  overallScore: Scalars['Float'];
  tagVariantId: Scalars['String'];
};

/** This object represent a link between a triple (study, trait, index_variant) and a tag variant via an expansion method (either ldExpansion or FineMapping) */
export type IndexVariantAssociation = {
  __typename?: 'IndexVariantAssociation';
  afr1000GProp?: Maybe<Scalars['Float']>;
  amr1000GProp?: Maybe<Scalars['Float']>;
  beta?: Maybe<Scalars['Float']>;
  betaCILower?: Maybe<Scalars['Float']>;
  betaCIUpper?: Maybe<Scalars['Float']>;
  direction?: Maybe<Scalars['String']>;
  eas1000GProp?: Maybe<Scalars['Float']>;
  eur1000GProp?: Maybe<Scalars['Float']>;
  log10Abf?: Maybe<Scalars['Float']>;
  /** n cases */
  nCases: Scalars['Long'];
  /** n total cases (n initial + n replication) */
  nTotal: Scalars['Long'];
  oddsRatio?: Maybe<Scalars['Float']>;
  oddsRatioCILower?: Maybe<Scalars['Float']>;
  oddsRatioCIUpper?: Maybe<Scalars['Float']>;
  /** study ID */
  overallR2?: Maybe<Scalars['Float']>;
  posteriorProbability?: Maybe<Scalars['Float']>;
  /** p-val between a study and an the provided index variant */
  pval: Scalars['Float'];
  /** p-val between a study and an the provided index variant */
  pvalExponent: Scalars['Long'];
  /** p-val between a study and an the provided index variant */
  pvalMantissa: Scalars['Float'];
  sas1000GProp?: Maybe<Scalars['Float']>;
  /** study ID */
  study: Study;
  /** Tag variant ID as ex. 1_12345_A_T */
  tagVariant: Variant;
};

/** A list of rows with each link */
export type IndexVariantsAndStudiesForTagVariant = {
  __typename?: 'IndexVariantsAndStudiesForTagVariant';
  /** A list of associations connected to a Index variant and a Study through some expansion methods */
  associations: Array<TagVariantAssociation>;
};

/** A list of rows with each link */
export type IntervalElement = {
  __typename?: 'IntervalElement';
  aggregatedScore: Scalars['Float'];
  sourceId: Scalars['String'];
  tissues: Array<IntervalTissue>;
  typeId: Scalars['String'];
};

export type IntervalTissue = {
  __typename?: 'IntervalTissue';
  quantile: Scalars['Float'];
  score?: Maybe<Scalars['Float']>;
  tissue: Tissue;
};

/** This element represents a Manhattan like plot */
export type Manhattan = {
  __typename?: 'Manhattan';
  /** A list of associations */
  associations: Array<ManhattanAssociation>;
  /** A list of overlapped studies */
  topOverlappedStudies?: Maybe<TopOverlappedStudies>;
};


/** This element represents a Manhattan like plot */
export type ManhattanTopOverlappedStudiesArgs = {
  pageIndex?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
};

export type ManhattanAssociation = {
  __typename?: 'ManhattanAssociation';
  /** A list of best genes associated */
  bestColocGenes: Array<ScoredGene>;
  /** A list of best genes associated */
  bestGenes: Array<ScoredGene>;
  /** A list of best L2G scored genes associated */
  bestLocus2Genes: Array<ScoredGene>;
  beta?: Maybe<Scalars['Float']>;
  betaCILower?: Maybe<Scalars['Float']>;
  betaCIUpper?: Maybe<Scalars['Float']>;
  /** The cardinal of the set defined as tag variants for an index variant coming from crediblesets */
  credibleSetSize?: Maybe<Scalars['Long']>;
  direction?: Maybe<Scalars['String']>;
  /** The cardinal of the set defined as tag variants for an index variant coming from ld expansion */
  ldSetSize?: Maybe<Scalars['Long']>;
  oddsRatio?: Maybe<Scalars['Float']>;
  oddsRatioCILower?: Maybe<Scalars['Float']>;
  oddsRatioCIUpper?: Maybe<Scalars['Float']>;
  /** Computed p-Value */
  pval: Scalars['Float'];
  pvalExponent: Scalars['Long'];
  pvalMantissa: Scalars['Float'];
  /** The cardinal of the set defined as tag variants for an index variant coming from any expansion */
  totalSetSize: Scalars['Long'];
  /** Index variant */
  variant: Variant;
};

export type Metadata = {
  __typename?: 'Metadata';
  apiVersion: Version;
  dataVersion: Version;
  name: Scalars['String'];
};

/** This element represents an overlap between two variants for two studies */
export type Overlap = {
  __typename?: 'Overlap';
  distinctA: Scalars['Long'];
  distinctB: Scalars['Long'];
  overlapAB: Scalars['Long'];
  variantIdA: Scalars['String'];
  variantIdB: Scalars['String'];
};

export type OverlappedInfoForStudy = {
  __typename?: 'OverlappedInfoForStudy';
  overlappedVariantsForStudies: Array<OverlappedVariantsStudies>;
  /** A study object */
  study?: Maybe<Study>;
  variantIntersectionSet: Array<Scalars['String']>;
};

/** This element represent a overlap between two stduies */
export type OverlappedStudy = {
  __typename?: 'OverlappedStudy';
  /** Orig variant id which is been used for computing the overlap with the referenced study */
  numOverlapLoci: Scalars['Int'];
  /** A study object */
  study?: Maybe<Study>;
  /** A study object */
  studyId: Scalars['String'];
};

/** This element represents an overlap between two studies */
export type OverlappedVariantsStudies = {
  __typename?: 'OverlappedVariantsStudies';
  /** Orig variant id which is been used for computing the overlap with the referenced study */
  overlaps: Array<Overlap>;
  /** A study object */
  study?: Maybe<Study>;
};

export type Pagination = {
  index: Scalars['Int'];
  size: Scalars['Int'];
};

/** This element represents a PheWAS like plot */
export type PheWas = {
  __typename?: 'PheWAS';
  /** A list of associations */
  associations: Array<PheWasAssociation>;
  /** A total number of unique GWAS studies in the summary stats table */
  totalGWASStudies: Scalars['Long'];
};

/** This element represents an association between a variant and a reported trait through a study */
export type PheWasAssociation = {
  __typename?: 'PheWASAssociation';
  beta?: Maybe<Scalars['Float']>;
  /** Effect Allele Frequency */
  eaf?: Maybe<Scalars['Float']>;
  nCases?: Maybe<Scalars['Long']>;
  /** Total sample size (variant level) */
  nTotal?: Maybe<Scalars['Long']>;
  /** Odds ratio (if case control) */
  oddsRatio?: Maybe<Scalars['Float']>;
  /** Computed p-Value */
  pval: Scalars['Float'];
  /** Standard error */
  se?: Maybe<Scalars['Float']>;
  /** Study Object */
  study?: Maybe<Study>;
  studyId: Scalars['String'];
};

export type QtlColocalisation = {
  __typename?: 'QTLColocalisation';
  /** Beta */
  beta?: Maybe<Scalars['Float']>;
  /** Gene */
  gene: Gene;
  /** H3 */
  h3: Scalars['Float'];
  /** H4 */
  h4: Scalars['Float'];
  /** Tag variant ID as ex. 1_12345_A_T */
  indexVariant: Variant;
  /** Log2 H4/H3 */
  log2h4h3: Scalars['Float'];
  /** QTL Phenotype ID */
  phenotypeId: Scalars['String'];
  /** QTL study ID */
  qtlStudyName: Scalars['String'];
  /** QTL bio-feature */
  tissue: Tissue;
};

/** A list of rows with each link */
export type QtlElement = {
  __typename?: 'QTLElement';
  aggregatedScore: Scalars['Float'];
  sourceId: Scalars['String'];
  tissues: Array<QtlTissue>;
  typeId: Scalars['String'];
};

export type QtlTissue = {
  __typename?: 'QTLTissue';
  beta?: Maybe<Scalars['Float']>;
  pval?: Maybe<Scalars['Float']>;
  quantile: Scalars['Float'];
  tissue: Tissue;
};

export type Query = {
  __typename?: 'Query';
  colocalisationsForGene: Array<GwasColocalisationForQtlWithGene>;
  gecko?: Maybe<Gecko>;
  geneInfo?: Maybe<Gene>;
  genes: Array<Gene>;
  genesForVariant: Array<GeneForVariant>;
  genesForVariantSchema: G2VSchema;
  gwasColocalisation: Array<GwasColocalisation>;
  gwasColocalisationForRegion: Array<GwaslrColocalisation>;
  gwasCredibleSet: Array<CredSetTagElement>;
  gwasRegional: Array<RegionalAssociation>;
  indexVariantsAndStudiesForTagVariant: IndexVariantsAndStudiesForTagVariant;
  manhattan: Manhattan;
  /** Return Open Targets Genetics API metadata */
  meta: Metadata;
  overlapInfoForStudy: OverlappedInfoForStudy;
  pheWAS: PheWas;
  qtlColocalisation: Array<QtlColocalisation>;
  qtlCredibleSet: Array<CredSetTagElement>;
  qtlRegional: Array<RegionalAssociation>;
  regionPlot?: Maybe<Gecko>;
  search: SearchResult;
  studiesAndLeadVariantsForGene: Array<StudiesAndLeadVariantsForGene>;
  studiesAndLeadVariantsForGeneByL2G: Array<V2Dl2GRowByGene>;
  studiesForGene: Array<StudyForGene>;
  studyAndLeadVariantInfo?: Maybe<StudiesAndLeadVariantsForGene>;
  studyInfo?: Maybe<Study>;
  studyLocus2GeneTable: SlgTable;
  tagVariantsAndStudiesForIndexVariant: TagVariantsAndStudiesForIndexVariant;
  topOverlappedStudies: TopOverlappedStudies;
  variantInfo?: Maybe<Variant>;
};


export type QueryColocalisationsForGeneArgs = {
  geneId: Scalars['String'];
};


export type QueryGeckoArgs = {
  chromosome: Scalars['String'];
  end: Scalars['Long'];
  start: Scalars['Long'];
};


export type QueryGeneInfoArgs = {
  geneId: Scalars['String'];
};


export type QueryGenesArgs = {
  chromosome: Scalars['String'];
  end: Scalars['Long'];
  start: Scalars['Long'];
};


export type QueryGenesForVariantArgs = {
  variantId: Scalars['String'];
};


export type QueryGwasColocalisationArgs = {
  studyId: Scalars['String'];
  variantId: Scalars['String'];
};


export type QueryGwasColocalisationForRegionArgs = {
  chromosome: Scalars['String'];
  end: Scalars['Long'];
  start: Scalars['Long'];
};


export type QueryGwasCredibleSetArgs = {
  studyId: Scalars['String'];
  variantId: Scalars['String'];
};


export type QueryGwasRegionalArgs = {
  chromosome: Scalars['String'];
  end: Scalars['Long'];
  start: Scalars['Long'];
  studyId: Scalars['String'];
};


export type QueryIndexVariantsAndStudiesForTagVariantArgs = {
  pageIndex?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  variantId: Scalars['String'];
};


export type QueryManhattanArgs = {
  pageIndex?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  studyId: Scalars['String'];
};


export type QueryOverlapInfoForStudyArgs = {
  studyId: Scalars['String'];
  studyIds: Array<Scalars['String']>;
};


export type QueryPheWasArgs = {
  pageIndex?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  variantId: Scalars['String'];
};


export type QueryQtlColocalisationArgs = {
  studyId: Scalars['String'];
  variantId: Scalars['String'];
};


export type QueryQtlCredibleSetArgs = {
  bioFeature: Scalars['String'];
  geneId: Scalars['String'];
  studyId: Scalars['String'];
  variantId: Scalars['String'];
};


export type QueryQtlRegionalArgs = {
  bioFeature: Scalars['String'];
  chromosome: Scalars['String'];
  end: Scalars['Long'];
  geneId: Scalars['String'];
  start: Scalars['Long'];
  studyId: Scalars['String'];
};


export type QueryRegionPlotArgs = {
  optionalGeneId?: InputMaybe<Scalars['String']>;
  optionalStudyId?: InputMaybe<Scalars['String']>;
  optionalVariantId?: InputMaybe<Scalars['String']>;
};


export type QuerySearchArgs = {
  page?: InputMaybe<Pagination>;
  queryString: Scalars['String'];
};


export type QueryStudiesAndLeadVariantsForGeneArgs = {
  geneId: Scalars['String'];
};


export type QueryStudiesAndLeadVariantsForGeneByL2GArgs = {
  geneId: Scalars['String'];
  pageIndex?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
};


export type QueryStudiesForGeneArgs = {
  geneId: Scalars['String'];
};


export type QueryStudyAndLeadVariantInfoArgs = {
  studyId: Scalars['String'];
  variantId: Scalars['String'];
};


export type QueryStudyInfoArgs = {
  studyId: Scalars['String'];
};


export type QueryStudyLocus2GeneTableArgs = {
  pageIndex?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  studyId: Scalars['String'];
  variantId: Scalars['String'];
};


export type QueryTagVariantsAndStudiesForIndexVariantArgs = {
  pageIndex?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  variantId: Scalars['String'];
};


export type QueryTopOverlappedStudiesArgs = {
  pageIndex?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  studyId: Scalars['String'];
};


export type QueryVariantInfoArgs = {
  variantId: Scalars['String'];
};

/** Variant with a p-val */
export type RegionalAssociation = {
  __typename?: 'RegionalAssociation';
  /** p-val */
  pval: Scalars['Float'];
  /** Summary Stats simple variant information */
  variant: Variant;
};

export type SlgRow = {
  __typename?: 'SLGRow';
  distanceToLocus: Scalars['Long'];
  /** Gene */
  gene: Gene;
  hasColoc: Scalars['Boolean'];
  yProbaDistance: Scalars['Float'];
  yProbaInteraction: Scalars['Float'];
  yProbaModel: Scalars['Float'];
  yProbaMolecularQTL: Scalars['Float'];
  yProbaPathogenicity: Scalars['Float'];
};

export type SlgTable = {
  __typename?: 'SLGTable';
  rows: Array<SlgRow>;
  /** Study */
  study?: Maybe<Study>;
  /** Variant */
  variant?: Maybe<Variant>;
};

/** This object link a Gene with a score */
export type ScoredGene = {
  __typename?: 'ScoredGene';
  /** Gene Info */
  gene: Gene;
  /** Score a Float number between [0. .. 1.] */
  score: Scalars['Float'];
};

/** Search data by a query string */
export type SearchResult = {
  __typename?: 'SearchResult';
  /** Gene search result list */
  genes: Array<Gene>;
  /** Study search result list */
  studies: Array<Study>;
  /** Total number of genes found */
  totalGenes: Scalars['Long'];
  /** Total number of studies found */
  totalStudies: Scalars['Long'];
  /** Total number of variants found */
  totalVariants: Scalars['Long'];
  /** Variant search result list */
  variants: Array<Variant>;
};

/** A list of Studies and Lead Variants for a Gene */
export type StudiesAndLeadVariantsForGene = {
  __typename?: 'StudiesAndLeadVariantsForGene';
  beta?: Maybe<Scalars['Float']>;
  betaCILower?: Maybe<Scalars['Float']>;
  betaCIUpper?: Maybe<Scalars['Float']>;
  direction?: Maybe<Scalars['String']>;
  /** Tag variant ID as ex. 1_12345_A_T */
  indexVariant: Variant;
  oddsRatio?: Maybe<Scalars['Float']>;
  oddsRatioCILower?: Maybe<Scalars['Float']>;
  oddsRatioCIUpper?: Maybe<Scalars['Float']>;
  /** p-val between a study and an the provided index variant */
  pval: Scalars['Float'];
  /** p-val between a study and an the provided index variant */
  pvalExponent: Scalars['Long'];
  /** p-val between a study and an the provided index variant */
  pvalMantissa: Scalars['Float'];
  /** study ID */
  study: Study;
};

export type Study = {
  __typename?: 'Study';
  ancestryInitial: Array<Scalars['String']>;
  ancestryReplication: Array<Scalars['String']>;
  /** Contains summary statistical information */
  hasSumstats?: Maybe<Scalars['Boolean']>;
  nCases?: Maybe<Scalars['Long']>;
  nInitial?: Maybe<Scalars['Long']>;
  nReplication?: Maybe<Scalars['Long']>;
  /** n total cases (n initial + n replication) */
  nTotal: Scalars['Long'];
  numAssocLoci?: Maybe<Scalars['Long']>;
  /** PubMed ID for the corresponding publication */
  pmid?: Maybe<Scalars['String']>;
  pubAuthor?: Maybe<Scalars['String']>;
  /** Publication Date as YYYY-MM-DD */
  pubDate?: Maybe<Scalars['String']>;
  /** Publication Journal name */
  pubJournal?: Maybe<Scalars['String']>;
  pubTitle?: Maybe<Scalars['String']>;
  /** Database or BioBank providing the study */
  source?: Maybe<Scalars['String']>;
  studyId: Scalars['String'];
  traitCategory?: Maybe<Scalars['String']>;
  /** A list of curated efo codes */
  traitEfos: Array<Scalars['String']>;
  /** Trait Label as reported on the publication */
  traitReported: Scalars['String'];
};

export type StudyForGene = {
  __typename?: 'StudyForGene';
  /** A study object */
  study: Study;
};

/** This object represent a link between a triple (study, trait, index_variant) and a tag variant via an expansion method (either ldExpansion or FineMapping) */
export type TagVariantAssociation = {
  __typename?: 'TagVariantAssociation';
  afr1000GProp?: Maybe<Scalars['Float']>;
  amr1000GProp?: Maybe<Scalars['Float']>;
  beta?: Maybe<Scalars['Float']>;
  betaCILower?: Maybe<Scalars['Float']>;
  betaCIUpper?: Maybe<Scalars['Float']>;
  direction?: Maybe<Scalars['String']>;
  eas1000GProp?: Maybe<Scalars['Float']>;
  eur1000GProp?: Maybe<Scalars['Float']>;
  /** Tag variant ID as ex. 1_12345_A_T */
  indexVariant: Variant;
  log10Abf?: Maybe<Scalars['Float']>;
  /** n cases */
  nCases: Scalars['Long'];
  /** n total cases (n initial + n replication) */
  nTotal: Scalars['Long'];
  oddsRatio?: Maybe<Scalars['Float']>;
  oddsRatioCILower?: Maybe<Scalars['Float']>;
  oddsRatioCIUpper?: Maybe<Scalars['Float']>;
  /** study ID */
  overallR2?: Maybe<Scalars['Float']>;
  posteriorProbability?: Maybe<Scalars['Float']>;
  /** p-val between a study and an the provided index variant */
  pval: Scalars['Float'];
  /** p-val between a study and an the provided index variant */
  pvalExponent: Scalars['Long'];
  /** p-val between a study and an the provided index variant */
  pvalMantissa: Scalars['Float'];
  sas1000GProp?: Maybe<Scalars['Float']>;
  /** study ID */
  study: Study;
};

export type TagVariantIndexVariantStudy = {
  __typename?: 'TagVariantIndexVariantStudy';
  beta?: Maybe<Scalars['Float']>;
  betaCILower?: Maybe<Scalars['Float']>;
  betaCIUpper?: Maybe<Scalars['Float']>;
  direction?: Maybe<Scalars['String']>;
  indexVariantId: Scalars['String'];
  oddsRatio?: Maybe<Scalars['Float']>;
  oddsRatioCILower?: Maybe<Scalars['Float']>;
  oddsRatioCIUpper?: Maybe<Scalars['Float']>;
  posteriorProbability?: Maybe<Scalars['Float']>;
  pval: Scalars['Float'];
  /** p-val between a study and an the provided index variant */
  pvalExponent: Scalars['Long'];
  /** p-val between a study and an the provided index variant */
  pvalMantissa: Scalars['Float'];
  r2?: Maybe<Scalars['Float']>;
  studyId: Scalars['String'];
  tagVariantId: Scalars['String'];
};

/** A list of rows with each link */
export type TagVariantsAndStudiesForIndexVariant = {
  __typename?: 'TagVariantsAndStudiesForIndexVariant';
  /** A list of associations connected to a Index variant and a Study through some expansion methods */
  associations: Array<IndexVariantAssociation>;
};

export type Tissue = {
  __typename?: 'Tissue';
  id: Scalars['String'];
  name: Scalars['String'];
};

/** This element represent a overlap between two stduies */
export type TopOverlappedStudies = {
  __typename?: 'TopOverlappedStudies';
  /** A study object */
  study?: Maybe<Study>;
  /** Top N studies ordered by loci overlap */
  topStudiesByLociOverlap: Array<OverlappedStudy>;
};

export type V2DBeta = {
  __typename?: 'V2DBeta';
  betaCI?: Maybe<Scalars['Float']>;
  betaCILower?: Maybe<Scalars['Float']>;
  betaCIUpper?: Maybe<Scalars['Float']>;
  direction?: Maybe<Scalars['String']>;
};

export type V2Dl2GRowByGene = {
  __typename?: 'V2DL2GRowByGene';
  beta: V2DBeta;
  odds: V2DOdds;
  pval: Scalars['Float'];
  pvalExponent: Scalars['Long'];
  pvalMantissa: Scalars['Float'];
  /** Study */
  study: Study;
  /** Variant */
  variant: Variant;
  yProbaDistance: Scalars['Float'];
  yProbaInteraction: Scalars['Float'];
  yProbaModel: Scalars['Float'];
  yProbaMolecularQTL: Scalars['Float'];
  yProbaPathogenicity: Scalars['Float'];
};

export type V2DOdds = {
  __typename?: 'V2DOdds';
  oddsCI?: Maybe<Scalars['Float']>;
  oddsCILower?: Maybe<Scalars['Float']>;
  oddsCIUpper?: Maybe<Scalars['Float']>;
};

export type Variant = {
  __typename?: 'Variant';
  altAllele: Scalars['String'];
  /** Combined Annotation Dependent Depletion - Scaled score */
  caddPhred?: Maybe<Scalars['Float']>;
  /** Combined Annotation Dependent Depletion - Raw score */
  caddRaw?: Maybe<Scalars['Float']>;
  /** Ensembl Gene ID of a gene */
  chromosome: Scalars['String'];
  /** chrom ID GRCH37 */
  chromosomeB37?: Maybe<Scalars['String']>;
  /** gnomAD Allele frequency (African/African-American population) */
  gnomadAFR?: Maybe<Scalars['Float']>;
  /** gnomAD Allele frequency (Latino/Admixed American population) */
  gnomadAMR?: Maybe<Scalars['Float']>;
  /** gnomAD Allele frequency (Ashkenazi Jewish population) */
  gnomadASJ?: Maybe<Scalars['Float']>;
  /** gnomAD Allele frequency (East Asian population) */
  gnomadEAS?: Maybe<Scalars['Float']>;
  /** gnomAD Allele frequency (Finnish population) */
  gnomadFIN?: Maybe<Scalars['Float']>;
  /** gnomAD Allele frequency (Non-Finnish European population) */
  gnomadNFE?: Maybe<Scalars['Float']>;
  /** gnomAD Allele frequency (Non-Finnish Eurpoean Estonian sub-population) */
  gnomadNFEEST?: Maybe<Scalars['Float']>;
  /** gnomAD Allele frequency (Non-Finnish Eurpoean North-Western European sub-population) */
  gnomadNFENWE?: Maybe<Scalars['Float']>;
  /** gnomAD Allele frequency (Non-Finnish Eurpoean Other non-Finnish European sub-population) */
  gnomadNFEONF?: Maybe<Scalars['Float']>;
  /** gnomAD Allele frequency (Non-Finnish Eurpoean Southern European sub-population) */
  gnomadNFESEU?: Maybe<Scalars['Float']>;
  /** gnomAD Allele frequency (Other (population not assigned) population) */
  gnomadOTH?: Maybe<Scalars['Float']>;
  /** Variant ID */
  id: Scalars['String'];
  /** Most severe consequence */
  mostSevereConsequence?: Maybe<Scalars['String']>;
  /** Nearest protein-coding gene */
  nearestCodingGene?: Maybe<Gene>;
  /** Distance to the nearest gene (protein-coding biotype) */
  nearestCodingGeneDistance?: Maybe<Scalars['Long']>;
  /** Nearest gene */
  nearestGene?: Maybe<Gene>;
  /** Distance to the nearest gene (any biotype) */
  nearestGeneDistance?: Maybe<Scalars['Long']>;
  /** Approved symbol name of a gene */
  position: Scalars['Long'];
  /** Approved symbol name of a gene */
  positionB37?: Maybe<Scalars['Long']>;
  refAllele: Scalars['String'];
  /** Approved symbol name of a gene */
  rsId?: Maybe<Scalars['String']>;
};

export type Version = {
  __typename?: 'Version';
  major: Scalars['Int'];
  minor: Scalars['Int'];
  patch: Scalars['Int'];
};

export type SearchQueryQueryVariables = Exact<{
  queryString: Scalars['String'];
}>;


export type SearchQueryQuery = { __typename?: 'Query', search: { __typename?: 'SearchResult', totalGenes: number, totalVariants: number, totalStudies: number, genes: Array<{ __typename?: 'Gene', id: string, symbol?: string | null, chromosome?: string | null, start?: number | null, end?: number | null }>, variants: Array<{ __typename?: 'Variant', id: string, rsId?: string | null, chromosome: string, position: number, refAllele: string, altAllele: string }>, studies: Array<{ __typename?: 'Study', studyId: string, traitReported: string, pmid?: string | null, pubAuthor?: string | null, pubDate?: string | null, pubJournal?: string | null, nInitial?: number | null, numAssocLoci?: number | null, hasSumstats?: boolean | null }> } };

export type GeneHeaderQueryQueryVariables = Exact<{
  geneId: Scalars['String'];
}>;


export type GeneHeaderQueryQuery = { __typename?: 'Query', geneInfo?: { __typename?: 'Gene', id: string, symbol?: string | null, chromosome?: string | null, start?: number | null, end?: number | null, bioType?: string | null, description?: string | null } | null };

export type StudyLocusHeaderQueryQueryVariables = Exact<{
  studyId: Scalars['String'];
  variantId: Scalars['String'];
}>;


export type StudyLocusHeaderQueryQuery = { __typename?: 'Query', studyInfo?: { __typename?: 'Study', studyId: string, traitReported: string, pubAuthor?: string | null, pubDate?: string | null, pubJournal?: string | null, pmid?: string | null, nInitial?: number | null, nReplication?: number | null, nCases?: number | null, hasSumstats?: boolean | null } | null, variantInfo?: { __typename?: 'Variant', rsId?: string | null, id: string } | null };

export type StudyHeaderQueryQueryVariables = Exact<{
  studyId: Scalars['String'];
}>;


export type StudyHeaderQueryQuery = { __typename?: 'Query', studyInfo?: { __typename?: 'Study', studyId: string, traitReported: string, pubAuthor?: string | null, pubDate?: string | null, pubJournal?: string | null, pmid?: string | null, nInitial?: number | null, nReplication?: number | null, nCases?: number | null, hasSumstats?: boolean | null } | null };

export type GwasLeadVariantsPageQueryQueryVariables = Exact<{
  variantId: Scalars['String'];
}>;


export type GwasLeadVariantsPageQueryQuery = { __typename?: 'Query', indexVariantsAndStudiesForTagVariant: { __typename?: 'IndexVariantsAndStudiesForTagVariant', associations: Array<{ __typename?: 'TagVariantAssociation', pval: number, nTotal: number, overallR2?: number | null, posteriorProbability?: number | null, oddsRatio?: number | null, oddsRatioCILower?: number | null, oddsRatioCIUpper?: number | null, beta?: number | null, betaCILower?: number | null, betaCIUpper?: number | null, direction?: string | null, indexVariant: { __typename?: 'Variant', id: string, rsId?: string | null }, study: { __typename?: 'Study', studyId: string, traitReported: string, pmid?: string | null, pubDate?: string | null, pubAuthor?: string | null, hasSumstats?: boolean | null } }> } };

export type GenesForVariantQueryQueryVariables = Exact<{
  variantId: Scalars['String'];
}>;


export type GenesForVariantQueryQuery = { __typename?: 'Query', genesForVariantSchema: { __typename?: 'G2VSchema', qtls: Array<{ __typename?: 'G2VSchemaElement', id: string, sourceId: string, sourceLabel?: string | null, sourceDescriptionOverview?: string | null, sourceDescriptionBreakdown?: string | null, pmid?: string | null, tissues: Array<{ __typename?: 'Tissue', id: string, name: string }> }>, intervals: Array<{ __typename?: 'G2VSchemaElement', sourceId: string, sourceLabel?: string | null, sourceDescriptionOverview?: string | null, sourceDescriptionBreakdown?: string | null, pmid?: string | null, tissues: Array<{ __typename?: 'Tissue', id: string, name: string }> }>, functionalPredictions: Array<{ __typename?: 'G2VSchemaElement', id: string, sourceId: string, sourceLabel?: string | null, sourceDescriptionOverview?: string | null, sourceDescriptionBreakdown?: string | null, pmid?: string | null, tissues: Array<{ __typename?: 'Tissue', id: string, name: string }> }>, distances: Array<{ __typename?: 'G2VSchemaElement', id: string, sourceId: string, sourceLabel?: string | null, sourceDescriptionOverview?: string | null, sourceDescriptionBreakdown?: string | null, pmid?: string | null, tissues: Array<{ __typename?: 'Tissue', id: string, name: string }> }> }, genesForVariant: Array<{ __typename?: 'GeneForVariant', overallScore: number, gene: { __typename?: 'Gene', id: string, symbol?: string | null }, qtls: Array<{ __typename?: 'QTLElement', sourceId: string, aggregatedScore: number, tissues: Array<{ __typename?: 'QTLTissue', quantile: number, beta?: number | null, pval?: number | null, tissue: { __typename?: 'Tissue', id: string, name: string } }> }>, intervals: Array<{ __typename?: 'IntervalElement', sourceId: string, aggregatedScore: number, tissues: Array<{ __typename?: 'IntervalTissue', quantile: number, score?: number | null, tissue: { __typename?: 'Tissue', id: string, name: string } }> }>, functionalPredictions: Array<{ __typename?: 'FunctionalPredictionElement', sourceId: string, aggregatedScore: number, tissues: Array<{ __typename?: 'FPredTissue', maxEffectLabel?: string | null, maxEffectScore?: number | null, tissue: { __typename?: 'Tissue', id: string, name: string } }> }>, distances: Array<{ __typename?: 'DistanceElement', typeId: string, sourceId: string, aggregatedScore: number, tissues: Array<{ __typename?: 'DistanceTissue', distance?: number | null, score?: number | null, quantile?: number | null, tissue: { __typename?: 'Tissue', id: string, name: string } }> }> }> };

export type TagVariantPageQueryQueryVariables = Exact<{
  variantId: Scalars['String'];
}>;


export type TagVariantPageQueryQuery = { __typename?: 'Query', tagVariantsAndStudiesForIndexVariant: { __typename?: 'TagVariantsAndStudiesForIndexVariant', associations: Array<{ __typename?: 'IndexVariantAssociation', pval: number, nTotal: number, overallR2?: number | null, posteriorProbability?: number | null, tagVariant: { __typename?: 'Variant', id: string, rsId?: string | null }, study: { __typename?: 'Study', studyId: string, traitReported: string, pmid?: string | null, pubDate?: string | null, pubAuthor?: string | null } }> } };

export type VariantHeaderQueryVariables = Exact<{
  variantId: Scalars['String'];
}>;


export type VariantHeaderQuery = { __typename?: 'Query', variantInfo?: { __typename?: 'Variant', rsId?: string | null, id: string, chromosomeB37?: string | null, positionB37?: number | null, refAllele: string, altAllele: string } | null };

export type GwasRegionalQueryQueryVariables = Exact<{
  studyId: Scalars['String'];
  chromosome: Scalars['String'];
  start: Scalars['Long'];
  end: Scalars['Long'];
}>;


export type GwasRegionalQueryQuery = { __typename?: 'Query', regional: Array<{ __typename?: 'RegionalAssociation', pval: number, variant: { __typename?: 'Variant', id: string, rsId?: string | null, position: number } }> };

export type LocusPageQueryQueryVariables = Exact<{
  optionalVariantId?: InputMaybe<Scalars['String']>;
  optionalGeneId?: InputMaybe<Scalars['String']>;
  optionalStudyId?: InputMaybe<Scalars['String']>;
  chromosome: Scalars['String'];
  start: Scalars['Long'];
  end: Scalars['Long'];
}>;


export type LocusPageQueryQuery = { __typename?: 'Query', genes: Array<{ __typename?: 'Gene', id: string, symbol?: string | null, tss?: number | null, start?: number | null, end?: number | null, exons: Array<number> }>, regionPlot?: { __typename?: 'Gecko', genes: Array<{ __typename?: 'Gene', id: string, symbol?: string | null, tss?: number | null, start?: number | null, end?: number | null, exons: Array<number> }>, tagVariants: Array<{ __typename?: 'Variant', id: string, rsId?: string | null, position: number }>, indexVariants: Array<{ __typename?: 'Variant', id: string, rsId?: string | null, position: number }>, studies: Array<{ __typename?: 'Study', studyId: string, traitReported: string, pubAuthor?: string | null, pubDate?: string | null, pubJournal?: string | null, pmid?: string | null, hasSumstats?: boolean | null }>, geneTagVariants: Array<{ __typename?: 'GeneTagVariant', geneId: string, tagVariantId: string, overallScore: number }>, tagVariantIndexVariantStudies: Array<{ __typename?: 'TagVariantIndexVariantStudy', tagVariantId: string, indexVariantId: string, studyId: string, r2?: number | null, pval: number, posteriorProbability?: number | null, oddsRatio?: number | null, oddsRatioCILower?: number | null, oddsRatioCIUpper?: number | null, beta?: number | null, betaCILower?: number | null, betaCIUpper?: number | null, direction?: string | null }> } | null };

export type PheWasQueryQueryVariables = Exact<{
  variantId: Scalars['String'];
}>;


export type PheWasQueryQuery = { __typename?: 'Query', pheWAS: { __typename?: 'PheWAS', totalGWASStudies: number, associations: Array<{ __typename?: 'PheWASAssociation', pval: number, beta?: number | null, oddsRatio?: number | null, nTotal?: number | null, nCases?: number | null, eaf?: number | null, se?: number | null, study?: { __typename?: 'Study', studyId: string, traitReported: string, traitCategory?: string | null, pmid?: string | null, pubDate?: string | null, pubAuthor?: string | null, source?: string | null, hasSumstats?: boolean | null } | null }> } };

export type QtlRegionalQueryQueryVariables = Exact<{
  studyId: Scalars['String'];
  bioFeature: Scalars['String'];
  geneId: Scalars['String'];
  chromosome: Scalars['String'];
  start: Scalars['Long'];
  end: Scalars['Long'];
}>;


export type QtlRegionalQueryQuery = { __typename?: 'Query', regional: Array<{ __typename?: 'RegionalAssociation', pval: number, variant: { __typename?: 'Variant', id: string, rsId?: string | null, position: number } }> };

export type TopOverlappedStudiesQueryQueryVariables = Exact<{
  studyId: Scalars['String'];
  studyIds: Array<Scalars['String']> | Scalars['String'];
}>;


export type TopOverlappedStudiesQueryQuery = { __typename?: 'Query', studyInfo?: { __typename?: 'Study', studyId: string, traitReported: string, pubAuthor?: string | null, pubDate?: string | null, pubJournal?: string | null, pmid?: string | null, nInitial?: number | null, nReplication?: number | null, nCases?: number | null } | null, manhattan: { __typename?: 'Manhattan', associations: Array<{ __typename?: 'ManhattanAssociation', pval: number, credibleSetSize?: number | null, ldSetSize?: number | null, variant: { __typename?: 'Variant', id: string, rsId?: string | null, chromosome: string, position: number }, bestGenes: Array<{ __typename?: 'ScoredGene', score: number, gene: { __typename?: 'Gene', id: string, symbol?: string | null } }> }> }, topOverlappedStudies: { __typename?: 'TopOverlappedStudies', study?: { __typename?: 'Study', studyId: string, traitReported: string, pubAuthor?: string | null, pubDate?: string | null, pubJournal?: string | null, pmid?: string | null, nInitial?: number | null, nReplication?: number | null, nCases?: number | null } | null, topStudiesByLociOverlap: Array<{ __typename?: 'OverlappedStudy', numOverlapLoci: number, study?: { __typename?: 'Study', studyId: string, traitReported: string, pubAuthor?: string | null, pubDate?: string | null, pubJournal?: string | null, pmid?: string | null, nInitial?: number | null, nReplication?: number | null, nCases?: number | null } | null }> }, overlapInfoForStudy: { __typename?: 'OverlappedInfoForStudy', variantIntersectionSet: Array<string>, study?: { __typename?: 'Study', studyId: string, traitReported: string, pubAuthor?: string | null, pubDate?: string | null, pubJournal?: string | null, pmid?: string | null, nInitial?: number | null, nReplication?: number | null, nCases?: number | null } | null, overlappedVariantsForStudies: Array<{ __typename?: 'OverlappedVariantsStudies', study?: { __typename?: 'Study', studyId: string, traitReported: string, pubAuthor?: string | null, pubDate?: string | null, pubJournal?: string | null, pmid?: string | null, nInitial?: number | null, nReplication?: number | null, nCases?: number | null } | null, overlaps: Array<{ __typename?: 'Overlap', variantIdA: string, variantIdB: string, overlapAB: number, distinctA: number, distinctB: number }> }> } };

export type StudyPageQueryQueryVariables = Exact<{
  studyId: Scalars['String'];
}>;


export type StudyPageQueryQuery = { __typename?: 'Query', manhattan: { __typename?: 'Manhattan', associations: Array<{ __typename?: 'ManhattanAssociation', pval: number, credibleSetSize?: number | null, ldSetSize?: number | null, oddsRatio?: number | null, oddsRatioCILower?: number | null, oddsRatioCIUpper?: number | null, beta?: number | null, betaCILower?: number | null, betaCIUpper?: number | null, direction?: string | null, variant: { __typename?: 'Variant', id: string, rsId?: string | null, chromosome: string, position: number, nearestCodingGeneDistance?: number | null, nearestCodingGene?: { __typename?: 'Gene', id: string, symbol?: string | null } | null }, bestGenes: Array<{ __typename?: 'ScoredGene', score: number, gene: { __typename?: 'Gene', id: string, symbol?: string | null } }>, bestColocGenes: Array<{ __typename?: 'ScoredGene', score: number, gene: { __typename?: 'Gene', id: string, symbol?: string | null } }>, bestLocus2Genes: Array<{ __typename?: 'ScoredGene', score: number, gene: { __typename?: 'Gene', id: string, symbol?: string | null } }> }> } };

export type Jak2colocQueryVariables = Exact<{ [key: string]: never; }>;


export type Jak2colocQuery = { __typename?: 'Query', colocalisationsForGene: Array<{ __typename: 'GWASColocalisationForQTLWithGene', qtlStudyId: string, phenotypeId: string, h3: number, h4: number, log2h4h3: number, leftVariant: { __typename: 'Variant', id: string, rsId?: string | null }, study: { __typename: 'Study', studyId: string, traitReported: string, pubAuthor?: string | null, pubDate?: string | null, pmid?: string | null, hasSumstats?: boolean | null }, tissue: { __typename: 'Tissue', id: string, name: string } }> };

export type StudyVariantsQueryVariables = Exact<{ [key: string]: never; }>;


export type StudyVariantsQuery = { __typename?: 'Query', manhattan: { __typename?: 'Manhattan', associations: Array<{ __typename?: 'ManhattanAssociation', pval: number, credibleSetSize?: number | null, ldSetSize?: number | null, oddsRatio?: number | null, oddsRatioCILower?: number | null, oddsRatioCIUpper?: number | null, beta?: number | null, betaCILower?: number | null, betaCIUpper?: number | null, direction?: string | null, variant: { __typename: 'Variant', id: string, rsId?: string | null, chromosome: string, position: number, nearestCodingGeneDistance?: number | null, nearestCodingGene?: { __typename: 'Gene', id: string, symbol?: string | null } | null }, bestGenes: Array<{ __typename: 'ScoredGene', score: number, gene: { __typename: 'Gene', id: string, symbol?: string | null } }> }> } };

export type Jak2variantsQueryVariables = Exact<{ [key: string]: never; }>;


export type Jak2variantsQuery = { __typename?: 'Query', studiesAndLeadVariantsForGene: Array<{ __typename?: 'StudiesAndLeadVariantsForGene', indexVariant: { __typename?: 'Variant', id: string }, study: { __typename?: 'Study', source?: string | null, pmid?: string | null, traitReported: string, pubDate?: string | null, pubTitle?: string | null, pubAuthor?: string | null, hasSumstats?: boolean | null, numAssocLoci?: number | null } }> };

export type StudyQueryVariables = Exact<{ [key: string]: never; }>;


export type StudyQuery = { __typename?: 'Query', studyInfo?: { __typename?: 'Study', studyId: string, traitReported: string, source?: string | null, traitEfos: Array<string>, pmid?: string | null, pubDate?: string | null, pubJournal?: string | null, pubTitle?: string | null, pubAuthor?: string | null, hasSumstats?: boolean | null, numAssocLoci?: number | null } | null };

export type StudyLocus2GeneQueryVariables = Exact<{ [key: string]: never; }>;


export type StudyLocus2GeneQuery = { __typename?: 'Query', studyLocus2GeneTable: { __typename: 'SLGTable', rows: Array<{ __typename: 'SLGRow', yProbaModel: number, yProbaDistance: number, yProbaInteraction: number, yProbaMolecularQTL: number, yProbaPathogenicity: number, hasColoc: boolean, distanceToLocus: number, gene: { __typename: 'Gene', symbol?: string | null, id: string } }> }, genes: Array<{ __typename: 'Gene', id: string, symbol?: string | null, tss?: number | null, start?: number | null, end?: number | null, exons: Array<number> }> };

export type VariantQueryVariables = Exact<{ [key: string]: never; }>;


export type VariantQuery = { __typename?: 'Query', tagVariantsAndStudiesForIndexVariant: { __typename: 'TagVariantsAndStudiesForIndexVariant', associations: Array<{ __typename: 'IndexVariantAssociation', pval: number, nTotal: number, overallR2?: number | null, posteriorProbability?: number | null, tagVariant: { __typename: 'Variant', id: string, rsId?: string | null }, study: { __typename: 'Study', studyId: string, traitReported: string, pmid?: string | null, pubDate?: string | null, pubAuthor?: string | null } }> } };

export type GenePageColocAnalysisQueryQueryVariables = Exact<{
  geneId: Scalars['String'];
}>;


export type GenePageColocAnalysisQueryQuery = { __typename?: 'Query', geneInfo?: { __typename?: 'Gene', id: string, symbol?: string | null, bioType?: string | null } | null, colocalisationsForGene: Array<{ __typename?: 'GWASColocalisationForQTLWithGene', qtlStudyId: string, phenotypeId: string, h3: number, h4: number, log2h4h3: number, leftVariant: { __typename?: 'Variant', id: string, rsId?: string | null }, study: { __typename?: 'Study', studyId: string, traitReported: string, pubAuthor?: string | null, pubDate?: string | null, pmid?: string | null, hasSumstats?: boolean | null }, tissue: { __typename?: 'Tissue', id: string, name: string } }> };

export type GenePageL2GPipelineQueryQueryVariables = Exact<{
  geneId: Scalars['String'];
}>;


export type GenePageL2GPipelineQueryQuery = { __typename?: 'Query', geneInfo?: { __typename?: 'Gene', id: string, symbol?: string | null, chromosome?: string | null, start?: number | null, end?: number | null, bioType?: string | null } | null, studiesAndLeadVariantsForGeneByL2G: Array<{ __typename?: 'V2DL2GRowByGene', pval: number, yProbaModel: number, study: { __typename?: 'Study', studyId: string, traitReported: string, pubAuthor?: string | null, pubDate?: string | null, pmid?: string | null, nInitial?: number | null, nReplication?: number | null, hasSumstats?: boolean | null, nCases?: number | null }, variant: { __typename?: 'Variant', rsId?: string | null, id: string }, odds: { __typename?: 'V2DOdds', oddsCI?: number | null, oddsCILower?: number | null, oddsCIUpper?: number | null }, beta: { __typename?: 'V2DBeta', betaCI?: number | null, betaCILower?: number | null, betaCIUpper?: number | null, direction?: string | null } }> };

export type StudySummaryQueryQueryVariables = Exact<{
  studyId: Scalars['String'];
}>;


export type StudySummaryQueryQuery = { __typename?: 'Query', studyInfo?: { __typename?: 'Study', studyId: string, traitReported: string, pubAuthor?: string | null, pubDate?: string | null, pubJournal?: string | null, pmid?: string | null, nInitial?: number | null, nReplication?: number | null, nCases?: number | null, hasSumstats?: boolean | null } | null };

export type StudyLocusColocGwasTableQueryQueryVariables = Exact<{
  variantId: Scalars['String'];
  studyId: Scalars['String'];
}>;


export type StudyLocusColocGwasTableQueryQuery = { __typename?: 'Query', gwasColocalisation: Array<{ __typename?: 'GWASColocalisation', beta?: number | null, h3: number, h4: number, log2h4h3: number, indexVariant: { __typename?: 'Variant', id: string, rsId?: string | null, chromosome: string, position: number, refAllele: string, altAllele: string }, study: { __typename?: 'Study', studyId: string, traitReported: string, pubAuthor?: string | null, pubDate?: string | null, pubJournal?: string | null, pmid?: string | null, hasSumstats?: boolean | null } }>, studyInfo?: { __typename?: 'Study', studyId: string, traitReported: string, pubAuthor?: string | null, pubDate?: string | null, pubJournal?: string | null, pmid?: string | null } | null };

export type StudyLocusColocL2GTableQueryQueryVariables = Exact<{
  variantId: Scalars['String'];
  studyId: Scalars['String'];
}>;


export type StudyLocusColocL2GTableQueryQuery = { __typename?: 'Query', studyLocus2GeneTable: { __typename?: 'SLGTable', rows: Array<{ __typename?: 'SLGRow', yProbaModel: number, yProbaDistance: number, yProbaInteraction: number, yProbaMolecularQTL: number, yProbaPathogenicity: number, hasColoc: boolean, distanceToLocus: number, gene: { __typename?: 'Gene', symbol?: string | null, id: string } }> } };

export type StudyLocusCredibleSetsGroupQueryQueryVariables = Exact<{
  studyId: Scalars['String'];
  variantId: Scalars['String'];
}>;


export type StudyLocusCredibleSetsGroupQueryQuery = { __typename?: 'Query', studyInfo?: { __typename?: 'Study', studyId: string, traitReported: string, pubAuthor?: string | null, pubDate?: string | null, pubJournal?: string | null, pmid?: string | null } | null, gwasColocalisation: Array<{ __typename?: 'GWASColocalisation', beta?: number | null, h3: number, h4: number, log2h4h3: number, indexVariant: { __typename?: 'Variant', id: string, rsId?: string | null, chromosome: string, position: number, refAllele: string, altAllele: string }, study: { __typename?: 'Study', studyId: string, traitReported: string, pubAuthor?: string | null, pubDate?: string | null, pubJournal?: string | null, pmid?: string | null, hasSumstats?: boolean | null } }>, qtlColocalisation: Array<{ __typename?: 'QTLColocalisation', phenotypeId: string, qtlStudyName: string, beta?: number | null, h3: number, h4: number, log2h4h3: number, indexVariant: { __typename?: 'Variant', id: string, rsId?: string | null, chromosome: string, position: number, refAllele: string, altAllele: string }, gene: { __typename?: 'Gene', id: string, symbol?: string | null, chromosome?: string | null, start?: number | null, end?: number | null, bioType?: string | null }, tissue: { __typename?: 'Tissue', id: string, name: string } }>, pageCredibleSet: Array<{ __typename?: 'CredSetTagElement', pval: number, se: number, beta: number, postProb: number, MultisignalMethod: string, logABF: number, is95: boolean, is99: boolean, tagVariant: { __typename?: 'Variant', id: string, rsId?: string | null, position: number } }> };

export type StudyLocusGenesPrioritisationQueryQueryVariables = Exact<{
  studyId: Scalars['String'];
  variantId: Scalars['String'];
}>;


export type StudyLocusGenesPrioritisationQueryQuery = { __typename?: 'Query', qtlColocalisation: Array<{ __typename?: 'QTLColocalisation', phenotypeId: string, qtlStudyName: string, beta?: number | null, h3: number, h4: number, log2h4h3: number, indexVariant: { __typename?: 'Variant', id: string, rsId?: string | null, chromosome: string, position: number, refAllele: string, altAllele: string }, gene: { __typename?: 'Gene', id: string, symbol?: string | null, chromosome?: string | null, start?: number | null, end?: number | null, bioType?: string | null }, tissue: { __typename?: 'Tissue', id: string, name: string } }>, studyInfo?: { __typename?: 'Study', studyId: string, traitReported: string, pubAuthor?: string | null, pubDate?: string | null, pubJournal?: string | null, pmid?: string | null } | null };

export type StudyLocusGenesQueryQueryVariables = Exact<{
  chromosome: Scalars['String'];
  start: Scalars['Long'];
  end: Scalars['Long'];
}>;


export type StudyLocusGenesQueryQuery = { __typename?: 'Query', genes: Array<{ __typename?: 'Gene', id: string, symbol?: string | null, tss?: number | null, start?: number | null, end?: number | null, exons: Array<number> }> };

export type StudyLocusSummaryQueryQueryVariables = Exact<{
  studyId: Scalars['String'];
  variantId: Scalars['String'];
}>;


export type StudyLocusSummaryQueryQuery = { __typename?: 'Query', variantInfo?: { __typename?: 'Variant', rsId?: string | null, chromosome: string, position: number, refAllele: string, altAllele: string, chromosomeB37?: string | null, positionB37?: number | null } | null, studyInfo?: { __typename?: 'Study', studyId: string, traitReported: string, pubAuthor?: string | null, pubDate?: string | null, pubJournal?: string | null, pmid?: string | null, hasSumstats?: boolean | null } | null, pageSummary?: { __typename?: 'StudiesAndLeadVariantsForGene', pvalMantissa: number, pvalExponent: number, oddsRatio?: number | null, oddsRatioCILower?: number | null, oddsRatioCIUpper?: number | null, beta?: number | null, direction?: string | null, betaCILower?: number | null, betaCIUpper?: number | null, indexVariant: { __typename?: 'Variant', rsId?: string | null }, study: { __typename?: 'Study', traitReported: string } } | null };

export type GwasLeadVariantsPheWasSectionQueryQueryVariables = Exact<{
  variantId: Scalars['String'];
}>;


export type GwasLeadVariantsPheWasSectionQueryQuery = { __typename?: 'Query', indexVariantsAndStudiesForTagVariant: { __typename?: 'IndexVariantsAndStudiesForTagVariant', associations: Array<{ __typename?: 'TagVariantAssociation', indexVariant: { __typename?: 'Variant', id: string, rsId?: string | null } }> } };

export type TagVariantPheWasSectionQueryQueryVariables = Exact<{
  variantId: Scalars['String'];
}>;


export type TagVariantPheWasSectionQueryQuery = { __typename?: 'Query', tagVariantsAndStudiesForIndexVariant: { __typename?: 'TagVariantsAndStudiesForIndexVariant', associations: Array<{ __typename?: 'IndexVariantAssociation', tagVariant: { __typename?: 'Variant', id: string, rsId?: string | null } }> } };

export type VariantSummaryQueryVariables = Exact<{
  variantId: Scalars['String'];
}>;


export type VariantSummaryQuery = { __typename?: 'Query', variantInfo?: { __typename?: 'Variant', rsId?: string | null, chromosome: string, position: number, chromosomeB37?: string | null, positionB37?: number | null, refAllele: string, altAllele: string, nearestGeneDistance?: number | null, nearestCodingGeneDistance?: number | null, mostSevereConsequence?: string | null, caddRaw?: number | null, caddPhred?: number | null, gnomadAFR?: number | null, gnomadAMR?: number | null, gnomadASJ?: number | null, gnomadEAS?: number | null, gnomadFIN?: number | null, gnomadNFE?: number | null, gnomadNFEEST?: number | null, gnomadNFENWE?: number | null, gnomadNFESEU?: number | null, gnomadOTH?: number | null, nearestGene?: { __typename?: 'Gene', id: string, symbol?: string | null } | null, nearestCodingGene?: { __typename?: 'Gene', id: string, symbol?: string | null } | null } | null };


export const SearchQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queryString"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"search"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"queryString"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queryString"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalGenes"}},{"kind":"Field","name":{"kind":"Name","value":"totalVariants"}},{"kind":"Field","name":{"kind":"Name","value":"totalStudies"}},{"kind":"Field","name":{"kind":"Name","value":"genes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"chromosome"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rsId"}},{"kind":"Field","name":{"kind":"Name","value":"chromosome"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"refAllele"}},{"kind":"Field","name":{"kind":"Name","value":"altAllele"}}]}},{"kind":"Field","name":{"kind":"Name","value":"studies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyId"}},{"kind":"Field","name":{"kind":"Name","value":"traitReported"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"pubAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"pubJournal"}},{"kind":"Field","name":{"kind":"Name","value":"nInitial"}},{"kind":"Field","name":{"kind":"Name","value":"numAssocLoci"}},{"kind":"Field","name":{"kind":"Name","value":"hasSumstats"}}]}}]}}]}}]} as unknown as DocumentNode<SearchQueryQuery, SearchQueryQueryVariables>;
export const GeneHeaderQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GeneHeaderQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"geneId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"geneInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"geneId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"geneId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"chromosome"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"bioType"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<GeneHeaderQueryQuery, GeneHeaderQueryQueryVariables>;
export const StudyLocusHeaderQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StudyLocusHeaderQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyId"}},{"kind":"Field","name":{"kind":"Name","value":"traitReported"}},{"kind":"Field","name":{"kind":"Name","value":"pubAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"pubJournal"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"nInitial"}},{"kind":"Field","name":{"kind":"Name","value":"nReplication"}},{"kind":"Field","name":{"kind":"Name","value":"nCases"}},{"kind":"Field","name":{"kind":"Name","value":"hasSumstats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variantInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"variantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rsId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<StudyLocusHeaderQueryQuery, StudyLocusHeaderQueryQueryVariables>;
export const StudyHeaderQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StudyHeaderQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyId"}},{"kind":"Field","name":{"kind":"Name","value":"traitReported"}},{"kind":"Field","name":{"kind":"Name","value":"pubAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"pubJournal"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"nInitial"}},{"kind":"Field","name":{"kind":"Name","value":"nReplication"}},{"kind":"Field","name":{"kind":"Name","value":"nCases"}},{"kind":"Field","name":{"kind":"Name","value":"hasSumstats"}}]}}]}}]} as unknown as DocumentNode<StudyHeaderQueryQuery, StudyHeaderQueryQueryVariables>;
export const GwasLeadVariantsPageQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GWASLeadVariantsPageQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"indexVariantsAndStudiesForTagVariant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"variantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"indexVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rsId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"study"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyId"}},{"kind":"Field","name":{"kind":"Name","value":"traitReported"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"pubAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"hasSumstats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pval"}},{"kind":"Field","name":{"kind":"Name","value":"nTotal"}},{"kind":"Field","name":{"kind":"Name","value":"overallR2"}},{"kind":"Field","name":{"kind":"Name","value":"posteriorProbability"}},{"kind":"Field","name":{"kind":"Name","value":"oddsRatio"}},{"kind":"Field","name":{"kind":"Name","value":"oddsRatioCILower"}},{"kind":"Field","name":{"kind":"Name","value":"oddsRatioCIUpper"}},{"kind":"Field","name":{"kind":"Name","value":"beta"}},{"kind":"Field","name":{"kind":"Name","value":"betaCILower"}},{"kind":"Field","name":{"kind":"Name","value":"betaCIUpper"}},{"kind":"Field","name":{"kind":"Name","value":"direction"}}]}}]}}]}}]} as unknown as DocumentNode<GwasLeadVariantsPageQueryQuery, GwasLeadVariantsPageQueryQueryVariables>;
export const GenesForVariantQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GenesForVariantQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"genesForVariantSchema"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"qtls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sourceId"}},{"kind":"Field","name":{"kind":"Name","value":"sourceLabel"}},{"kind":"Field","name":{"kind":"Name","value":"sourceDescriptionOverview"}},{"kind":"Field","name":{"kind":"Name","value":"sourceDescriptionBreakdown"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"tissues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"intervals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sourceId"}},{"kind":"Field","name":{"kind":"Name","value":"sourceLabel"}},{"kind":"Field","name":{"kind":"Name","value":"sourceDescriptionOverview"}},{"kind":"Field","name":{"kind":"Name","value":"sourceDescriptionBreakdown"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"tissues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"functionalPredictions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sourceId"}},{"kind":"Field","name":{"kind":"Name","value":"sourceLabel"}},{"kind":"Field","name":{"kind":"Name","value":"sourceDescriptionOverview"}},{"kind":"Field","name":{"kind":"Name","value":"sourceDescriptionBreakdown"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"tissues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"distances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sourceId"}},{"kind":"Field","name":{"kind":"Name","value":"sourceLabel"}},{"kind":"Field","name":{"kind":"Name","value":"sourceDescriptionOverview"}},{"kind":"Field","name":{"kind":"Name","value":"sourceDescriptionBreakdown"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"tissues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"genesForVariant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"variantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gene"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"overallScore"}},{"kind":"Field","name":{"kind":"Name","value":"qtls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sourceId"}},{"kind":"Field","name":{"kind":"Name","value":"aggregatedScore"}},{"kind":"Field","name":{"kind":"Name","value":"tissues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tissue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantile"}},{"kind":"Field","name":{"kind":"Name","value":"beta"}},{"kind":"Field","name":{"kind":"Name","value":"pval"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"intervals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sourceId"}},{"kind":"Field","name":{"kind":"Name","value":"aggregatedScore"}},{"kind":"Field","name":{"kind":"Name","value":"tissues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tissue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantile"}},{"kind":"Field","name":{"kind":"Name","value":"score"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"functionalPredictions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sourceId"}},{"kind":"Field","name":{"kind":"Name","value":"aggregatedScore"}},{"kind":"Field","name":{"kind":"Name","value":"tissues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tissue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"maxEffectLabel"}},{"kind":"Field","name":{"kind":"Name","value":"maxEffectScore"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"distances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"typeId"}},{"kind":"Field","name":{"kind":"Name","value":"sourceId"}},{"kind":"Field","name":{"kind":"Name","value":"aggregatedScore"}},{"kind":"Field","name":{"kind":"Name","value":"tissues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tissue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"distance"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"quantile"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GenesForVariantQueryQuery, GenesForVariantQueryQueryVariables>;
export const TagVariantPageQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TagVariantPageQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tagVariantsAndStudiesForIndexVariant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"variantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tagVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rsId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"study"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyId"}},{"kind":"Field","name":{"kind":"Name","value":"traitReported"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"pubAuthor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pval"}},{"kind":"Field","name":{"kind":"Name","value":"nTotal"}},{"kind":"Field","name":{"kind":"Name","value":"overallR2"}},{"kind":"Field","name":{"kind":"Name","value":"posteriorProbability"}}]}}]}}]}}]} as unknown as DocumentNode<TagVariantPageQueryQuery, TagVariantPageQueryQueryVariables>;
export const VariantHeaderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VariantHeader"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"variantInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"variantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rsId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chromosomeB37"}},{"kind":"Field","name":{"kind":"Name","value":"positionB37"}},{"kind":"Field","name":{"kind":"Name","value":"refAllele"}},{"kind":"Field","name":{"kind":"Name","value":"altAllele"}}]}}]}}]} as unknown as DocumentNode<VariantHeaderQuery, VariantHeaderQueryVariables>;
export const GwasRegionalQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GWASRegionalQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chromosome"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"start"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Long"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"end"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Long"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"regional"},"name":{"kind":"Name","value":"gwasRegional"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"chromosome"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chromosome"}}},{"kind":"Argument","name":{"kind":"Name","value":"start"},"value":{"kind":"Variable","name":{"kind":"Name","value":"start"}}},{"kind":"Argument","name":{"kind":"Name","value":"end"},"value":{"kind":"Variable","name":{"kind":"Name","value":"end"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"variant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rsId"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pval"}}]}}]}}]} as unknown as DocumentNode<GwasRegionalQueryQuery, GwasRegionalQueryQueryVariables>;
export const LocusPageQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LocusPageQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"optionalVariantId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"optionalGeneId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"optionalStudyId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chromosome"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"start"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Long"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"end"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Long"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"genes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chromosome"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chromosome"}}},{"kind":"Argument","name":{"kind":"Name","value":"start"},"value":{"kind":"Variable","name":{"kind":"Name","value":"start"}}},{"kind":"Argument","name":{"kind":"Name","value":"end"},"value":{"kind":"Variable","name":{"kind":"Name","value":"end"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"tss"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"exons"}}]}},{"kind":"Field","name":{"kind":"Name","value":"regionPlot"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"optionalVariantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"optionalVariantId"}}},{"kind":"Argument","name":{"kind":"Name","value":"optionalGeneId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"optionalGeneId"}}},{"kind":"Argument","name":{"kind":"Name","value":"optionalStudyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"optionalStudyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"genes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"tss"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"exons"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tagVariants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rsId"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}},{"kind":"Field","name":{"kind":"Name","value":"indexVariants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rsId"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}},{"kind":"Field","name":{"kind":"Name","value":"studies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyId"}},{"kind":"Field","name":{"kind":"Name","value":"traitReported"}},{"kind":"Field","name":{"kind":"Name","value":"pubAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"pubJournal"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"hasSumstats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"geneTagVariants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"geneId"}},{"kind":"Field","name":{"kind":"Name","value":"tagVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"overallScore"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tagVariantIndexVariantStudies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tagVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"indexVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"studyId"}},{"kind":"Field","name":{"kind":"Name","value":"r2"}},{"kind":"Field","name":{"kind":"Name","value":"pval"}},{"kind":"Field","name":{"kind":"Name","value":"posteriorProbability"}},{"kind":"Field","name":{"kind":"Name","value":"oddsRatio"}},{"kind":"Field","name":{"kind":"Name","value":"oddsRatioCILower"}},{"kind":"Field","name":{"kind":"Name","value":"oddsRatioCIUpper"}},{"kind":"Field","name":{"kind":"Name","value":"beta"}},{"kind":"Field","name":{"kind":"Name","value":"betaCILower"}},{"kind":"Field","name":{"kind":"Name","value":"betaCIUpper"}},{"kind":"Field","name":{"kind":"Name","value":"direction"}}]}}]}}]}}]} as unknown as DocumentNode<LocusPageQueryQuery, LocusPageQueryQueryVariables>;
export const PheWasQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PheWASQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pheWAS"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"variantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalGWASStudies"}},{"kind":"Field","name":{"kind":"Name","value":"associations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"study"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyId"}},{"kind":"Field","name":{"kind":"Name","value":"traitReported"}},{"kind":"Field","name":{"kind":"Name","value":"traitCategory"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"pubAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"hasSumstats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pval"}},{"kind":"Field","name":{"kind":"Name","value":"beta"}},{"kind":"Field","name":{"kind":"Name","value":"oddsRatio"}},{"kind":"Field","name":{"kind":"Name","value":"nTotal"}},{"kind":"Field","name":{"kind":"Name","value":"nCases"}},{"kind":"Field","name":{"kind":"Name","value":"eaf"}},{"kind":"Field","name":{"kind":"Name","value":"se"}}]}}]}}]}}]} as unknown as DocumentNode<PheWasQueryQuery, PheWasQueryQueryVariables>;
export const QtlRegionalQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"QTLRegionalQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bioFeature"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"geneId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chromosome"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"start"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Long"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"end"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Long"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"regional"},"name":{"kind":"Name","value":"qtlRegional"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"geneId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"geneId"}}},{"kind":"Argument","name":{"kind":"Name","value":"bioFeature"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bioFeature"}}},{"kind":"Argument","name":{"kind":"Name","value":"chromosome"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chromosome"}}},{"kind":"Argument","name":{"kind":"Name","value":"start"},"value":{"kind":"Variable","name":{"kind":"Name","value":"start"}}},{"kind":"Argument","name":{"kind":"Name","value":"end"},"value":{"kind":"Variable","name":{"kind":"Name","value":"end"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"variant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rsId"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pval"}}]}}]}}]} as unknown as DocumentNode<QtlRegionalQueryQuery, QtlRegionalQueryQueryVariables>;
export const TopOverlappedStudiesQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TopOverlappedStudiesQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"studyIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyId"}},{"kind":"Field","name":{"kind":"Name","value":"traitReported"}},{"kind":"Field","name":{"kind":"Name","value":"pubAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"pubJournal"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"nInitial"}},{"kind":"Field","name":{"kind":"Name","value":"nReplication"}},{"kind":"Field","name":{"kind":"Name","value":"nCases"}}]}},{"kind":"Field","name":{"kind":"Name","value":"manhattan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"variant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rsId"}},{"kind":"Field","name":{"kind":"Name","value":"chromosome"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pval"}},{"kind":"Field","name":{"kind":"Name","value":"credibleSetSize"}},{"kind":"Field","name":{"kind":"Name","value":"ldSetSize"}},{"kind":"Field","name":{"kind":"Name","value":"bestGenes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"gene"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"topOverlappedStudies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"study"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyId"}},{"kind":"Field","name":{"kind":"Name","value":"traitReported"}},{"kind":"Field","name":{"kind":"Name","value":"pubAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"pubJournal"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"nInitial"}},{"kind":"Field","name":{"kind":"Name","value":"nReplication"}},{"kind":"Field","name":{"kind":"Name","value":"nCases"}}]}},{"kind":"Field","name":{"kind":"Name","value":"topStudiesByLociOverlap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"study"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyId"}},{"kind":"Field","name":{"kind":"Name","value":"traitReported"}},{"kind":"Field","name":{"kind":"Name","value":"pubAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"pubJournal"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"nInitial"}},{"kind":"Field","name":{"kind":"Name","value":"nReplication"}},{"kind":"Field","name":{"kind":"Name","value":"nCases"}}]}},{"kind":"Field","name":{"kind":"Name","value":"numOverlapLoci"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"overlapInfoForStudy"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"studyIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studyIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"study"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyId"}},{"kind":"Field","name":{"kind":"Name","value":"traitReported"}},{"kind":"Field","name":{"kind":"Name","value":"pubAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"pubJournal"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"nInitial"}},{"kind":"Field","name":{"kind":"Name","value":"nReplication"}},{"kind":"Field","name":{"kind":"Name","value":"nCases"}}]}},{"kind":"Field","name":{"kind":"Name","value":"overlappedVariantsForStudies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"study"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyId"}},{"kind":"Field","name":{"kind":"Name","value":"traitReported"}},{"kind":"Field","name":{"kind":"Name","value":"pubAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"pubJournal"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"nInitial"}},{"kind":"Field","name":{"kind":"Name","value":"nReplication"}},{"kind":"Field","name":{"kind":"Name","value":"nCases"}}]}},{"kind":"Field","name":{"kind":"Name","value":"overlaps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"variantIdA"}},{"kind":"Field","name":{"kind":"Name","value":"variantIdB"}},{"kind":"Field","name":{"kind":"Name","value":"overlapAB"}},{"kind":"Field","name":{"kind":"Name","value":"distinctA"}},{"kind":"Field","name":{"kind":"Name","value":"distinctB"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"variantIntersectionSet"}}]}}]}}]} as unknown as DocumentNode<TopOverlappedStudiesQueryQuery, TopOverlappedStudiesQueryQueryVariables>;
export const StudyPageQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StudyPageQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"manhattan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"variant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rsId"}},{"kind":"Field","name":{"kind":"Name","value":"chromosome"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"nearestCodingGene"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nearestCodingGeneDistance"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pval"}},{"kind":"Field","name":{"kind":"Name","value":"credibleSetSize"}},{"kind":"Field","name":{"kind":"Name","value":"ldSetSize"}},{"kind":"Field","name":{"kind":"Name","value":"oddsRatio"}},{"kind":"Field","name":{"kind":"Name","value":"oddsRatioCILower"}},{"kind":"Field","name":{"kind":"Name","value":"oddsRatioCIUpper"}},{"kind":"Field","name":{"kind":"Name","value":"beta"}},{"kind":"Field","name":{"kind":"Name","value":"betaCILower"}},{"kind":"Field","name":{"kind":"Name","value":"betaCIUpper"}},{"kind":"Field","name":{"kind":"Name","value":"direction"}},{"kind":"Field","name":{"kind":"Name","value":"bestGenes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"gene"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"bestColocGenes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"gene"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"bestLocus2Genes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"gene"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<StudyPageQueryQuery, StudyPageQueryQueryVariables>;
export const Jak2colocDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Jak2coloc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"colocalisationsForGene"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"geneId"},"value":{"kind":"StringValue","value":"ENSG00000169174","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leftVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rsId"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"study"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyId"}},{"kind":"Field","name":{"kind":"Name","value":"traitReported"}},{"kind":"Field","name":{"kind":"Name","value":"pubAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"hasSumstats"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"qtlStudyId"}},{"kind":"Field","name":{"kind":"Name","value":"phenotypeId"}},{"kind":"Field","name":{"kind":"Name","value":"tissue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"h3"}},{"kind":"Field","name":{"kind":"Name","value":"h4"}},{"kind":"Field","name":{"kind":"Name","value":"log2h4h3"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]} as unknown as DocumentNode<Jak2colocQuery, Jak2colocQueryVariables>;
export const StudyVariantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StudyVariants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"manhattan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyId"},"value":{"kind":"StringValue","value":"GCST90002369","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"variant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rsId"}},{"kind":"Field","name":{"kind":"Name","value":"chromosome"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"nearestCodingGene"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nearestCodingGeneDistance"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pval"}},{"kind":"Field","name":{"kind":"Name","value":"credibleSetSize"}},{"kind":"Field","name":{"kind":"Name","value":"ldSetSize"}},{"kind":"Field","name":{"kind":"Name","value":"oddsRatio"}},{"kind":"Field","name":{"kind":"Name","value":"oddsRatioCILower"}},{"kind":"Field","name":{"kind":"Name","value":"oddsRatioCIUpper"}},{"kind":"Field","name":{"kind":"Name","value":"beta"}},{"kind":"Field","name":{"kind":"Name","value":"betaCILower"}},{"kind":"Field","name":{"kind":"Name","value":"betaCIUpper"}},{"kind":"Field","name":{"kind":"Name","value":"direction"}},{"kind":"Field","name":{"kind":"Name","value":"bestGenes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"gene"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]}}]}}]} as unknown as DocumentNode<StudyVariantsQuery, StudyVariantsQueryVariables>;
export const Jak2variantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Jak2variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studiesAndLeadVariantsForGene"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"geneId"},"value":{"kind":"StringValue","value":"ENSG00000096968","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"indexVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"study"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"traitReported"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"pubTitle"}},{"kind":"Field","name":{"kind":"Name","value":"pubAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"hasSumstats"}},{"kind":"Field","name":{"kind":"Name","value":"numAssocLoci"}}]}}]}}]}}]} as unknown as DocumentNode<Jak2variantsQuery, Jak2variantsQueryVariables>;
export const StudyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"study"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyId"},"value":{"kind":"StringValue","value":"SAIGE_740_1","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyId"}},{"kind":"Field","name":{"kind":"Name","value":"traitReported"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"traitEfos"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"pubJournal"}},{"kind":"Field","name":{"kind":"Name","value":"pubTitle"}},{"kind":"Field","name":{"kind":"Name","value":"pubAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"hasSumstats"}},{"kind":"Field","name":{"kind":"Name","value":"numAssocLoci"}}]}}]}}]} as unknown as DocumentNode<StudyQuery, StudyQueryVariables>;
export const StudyLocus2GeneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StudyLocus2Gene"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyLocus2GeneTable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyId"},"value":{"kind":"StringValue","value":"GCST009240_9","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"variantId"},"value":{"kind":"StringValue","value":"1_55052794_A_G","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gene"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yProbaModel"}},{"kind":"Field","name":{"kind":"Name","value":"yProbaDistance"}},{"kind":"Field","name":{"kind":"Name","value":"yProbaInteraction"}},{"kind":"Field","name":{"kind":"Name","value":"yProbaMolecularQTL"}},{"kind":"Field","name":{"kind":"Name","value":"yProbaPathogenicity"}},{"kind":"Field","name":{"kind":"Name","value":"hasColoc"}},{"kind":"Field","name":{"kind":"Name","value":"distanceToLocus"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"genes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chromosome"},"value":{"kind":"StringValue","value":"1","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"start"},"value":{"kind":"IntValue","value":"54802794"}},{"kind":"Argument","name":{"kind":"Name","value":"end"},"value":{"kind":"IntValue","value":"55302794"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"tss"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"exons"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]} as unknown as DocumentNode<StudyLocus2GeneQuery, StudyLocus2GeneQueryVariables>;
export const VariantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Variant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tagVariantsAndStudiesForIndexVariant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"variantId"},"value":{"kind":"StringValue","value":"1_55058182_G_A","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tagVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rsId"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"study"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyId"}},{"kind":"Field","name":{"kind":"Name","value":"traitReported"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"pubAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pval"}},{"kind":"Field","name":{"kind":"Name","value":"nTotal"}},{"kind":"Field","name":{"kind":"Name","value":"overallR2"}},{"kind":"Field","name":{"kind":"Name","value":"posteriorProbability"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]} as unknown as DocumentNode<VariantQuery, VariantQueryVariables>;
export const GenePageColocAnalysisQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GenePageColocAnalysisQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"geneId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"geneInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"geneId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"geneId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"bioType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"colocalisationsForGene"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"geneId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"geneId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leftVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rsId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"study"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyId"}},{"kind":"Field","name":{"kind":"Name","value":"traitReported"}},{"kind":"Field","name":{"kind":"Name","value":"pubAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"hasSumstats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"qtlStudyId"}},{"kind":"Field","name":{"kind":"Name","value":"phenotypeId"}},{"kind":"Field","name":{"kind":"Name","value":"tissue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"h3"}},{"kind":"Field","name":{"kind":"Name","value":"h4"}},{"kind":"Field","name":{"kind":"Name","value":"log2h4h3"}}]}}]}}]} as unknown as DocumentNode<GenePageColocAnalysisQueryQuery, GenePageColocAnalysisQueryQueryVariables>;
export const GenePageL2GPipelineQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GenePageL2GPipelineQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"geneId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"geneInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"geneId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"geneId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"chromosome"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"bioType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"studiesAndLeadVariantsForGeneByL2G"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"geneId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"geneId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pval"}},{"kind":"Field","name":{"kind":"Name","value":"yProbaModel"}},{"kind":"Field","name":{"kind":"Name","value":"study"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyId"}},{"kind":"Field","name":{"kind":"Name","value":"traitReported"}},{"kind":"Field","name":{"kind":"Name","value":"pubAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"nInitial"}},{"kind":"Field","name":{"kind":"Name","value":"nReplication"}},{"kind":"Field","name":{"kind":"Name","value":"hasSumstats"}},{"kind":"Field","name":{"kind":"Name","value":"nCases"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rsId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"odds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"oddsCI"}},{"kind":"Field","name":{"kind":"Name","value":"oddsCILower"}},{"kind":"Field","name":{"kind":"Name","value":"oddsCIUpper"}}]}},{"kind":"Field","name":{"kind":"Name","value":"beta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"betaCI"}},{"kind":"Field","name":{"kind":"Name","value":"betaCILower"}},{"kind":"Field","name":{"kind":"Name","value":"betaCIUpper"}},{"kind":"Field","name":{"kind":"Name","value":"direction"}}]}}]}}]}}]} as unknown as DocumentNode<GenePageL2GPipelineQueryQuery, GenePageL2GPipelineQueryQueryVariables>;
export const StudySummaryQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StudySummaryQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyId"}},{"kind":"Field","name":{"kind":"Name","value":"traitReported"}},{"kind":"Field","name":{"kind":"Name","value":"pubAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"pubJournal"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"nInitial"}},{"kind":"Field","name":{"kind":"Name","value":"nReplication"}},{"kind":"Field","name":{"kind":"Name","value":"nCases"}},{"kind":"Field","name":{"kind":"Name","value":"hasSumstats"}}]}}]}}]} as unknown as DocumentNode<StudySummaryQueryQuery, StudySummaryQueryQueryVariables>;
export const StudyLocusColocGwasTableQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StudyLocusColocGWASTableQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gwasColocalisation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"variantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"indexVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rsId"}},{"kind":"Field","name":{"kind":"Name","value":"chromosome"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"refAllele"}},{"kind":"Field","name":{"kind":"Name","value":"altAllele"}}]}},{"kind":"Field","name":{"kind":"Name","value":"study"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyId"}},{"kind":"Field","name":{"kind":"Name","value":"traitReported"}},{"kind":"Field","name":{"kind":"Name","value":"pubAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"pubJournal"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"hasSumstats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"beta"}},{"kind":"Field","name":{"kind":"Name","value":"h3"}},{"kind":"Field","name":{"kind":"Name","value":"h4"}},{"kind":"Field","name":{"kind":"Name","value":"log2h4h3"}}]}},{"kind":"Field","name":{"kind":"Name","value":"studyInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyId"}},{"kind":"Field","name":{"kind":"Name","value":"traitReported"}},{"kind":"Field","name":{"kind":"Name","value":"pubAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"pubJournal"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}}]}}]}}]} as unknown as DocumentNode<StudyLocusColocGwasTableQueryQuery, StudyLocusColocGwasTableQueryQueryVariables>;
export const StudyLocusColocL2GTableQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StudyLocusColocL2GTableQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyLocus2GeneTable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"variantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gene"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yProbaModel"}},{"kind":"Field","name":{"kind":"Name","value":"yProbaDistance"}},{"kind":"Field","name":{"kind":"Name","value":"yProbaInteraction"}},{"kind":"Field","name":{"kind":"Name","value":"yProbaMolecularQTL"}},{"kind":"Field","name":{"kind":"Name","value":"yProbaPathogenicity"}},{"kind":"Field","name":{"kind":"Name","value":"hasColoc"}},{"kind":"Field","name":{"kind":"Name","value":"distanceToLocus"}}]}}]}}]}}]} as unknown as DocumentNode<StudyLocusColocL2GTableQueryQuery, StudyLocusColocL2GTableQueryQueryVariables>;
export const StudyLocusCredibleSetsGroupQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StudyLocusCredibleSetsGroupQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyId"}},{"kind":"Field","name":{"kind":"Name","value":"traitReported"}},{"kind":"Field","name":{"kind":"Name","value":"pubAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"pubJournal"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gwasColocalisation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"variantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"indexVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rsId"}},{"kind":"Field","name":{"kind":"Name","value":"chromosome"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"refAllele"}},{"kind":"Field","name":{"kind":"Name","value":"altAllele"}}]}},{"kind":"Field","name":{"kind":"Name","value":"study"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyId"}},{"kind":"Field","name":{"kind":"Name","value":"traitReported"}},{"kind":"Field","name":{"kind":"Name","value":"pubAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"pubJournal"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"hasSumstats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"beta"}},{"kind":"Field","name":{"kind":"Name","value":"h3"}},{"kind":"Field","name":{"kind":"Name","value":"h4"}},{"kind":"Field","name":{"kind":"Name","value":"log2h4h3"}}]}},{"kind":"Field","name":{"kind":"Name","value":"qtlColocalisation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"variantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"indexVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rsId"}},{"kind":"Field","name":{"kind":"Name","value":"chromosome"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"refAllele"}},{"kind":"Field","name":{"kind":"Name","value":"altAllele"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gene"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"chromosome"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"bioType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phenotypeId"}},{"kind":"Field","name":{"kind":"Name","value":"tissue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"qtlStudyName"}},{"kind":"Field","name":{"kind":"Name","value":"beta"}},{"kind":"Field","name":{"kind":"Name","value":"h3"}},{"kind":"Field","name":{"kind":"Name","value":"h4"}},{"kind":"Field","name":{"kind":"Name","value":"log2h4h3"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"pageCredibleSet"},"name":{"kind":"Name","value":"gwasCredibleSet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"variantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tagVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rsId"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pval"}},{"kind":"Field","name":{"kind":"Name","value":"se"}},{"kind":"Field","name":{"kind":"Name","value":"beta"}},{"kind":"Field","name":{"kind":"Name","value":"postProb"}},{"kind":"Field","name":{"kind":"Name","value":"MultisignalMethod"}},{"kind":"Field","name":{"kind":"Name","value":"logABF"}},{"kind":"Field","name":{"kind":"Name","value":"is95"}},{"kind":"Field","name":{"kind":"Name","value":"is99"}}]}}]}}]} as unknown as DocumentNode<StudyLocusCredibleSetsGroupQueryQuery, StudyLocusCredibleSetsGroupQueryQueryVariables>;
export const StudyLocusGenesPrioritisationQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StudyLocusGenesPrioritisationQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"qtlColocalisation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"variantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"indexVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rsId"}},{"kind":"Field","name":{"kind":"Name","value":"chromosome"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"refAllele"}},{"kind":"Field","name":{"kind":"Name","value":"altAllele"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gene"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"chromosome"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"bioType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phenotypeId"}},{"kind":"Field","name":{"kind":"Name","value":"tissue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"qtlStudyName"}},{"kind":"Field","name":{"kind":"Name","value":"beta"}},{"kind":"Field","name":{"kind":"Name","value":"h3"}},{"kind":"Field","name":{"kind":"Name","value":"h4"}},{"kind":"Field","name":{"kind":"Name","value":"log2h4h3"}}]}},{"kind":"Field","name":{"kind":"Name","value":"studyInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyId"}},{"kind":"Field","name":{"kind":"Name","value":"traitReported"}},{"kind":"Field","name":{"kind":"Name","value":"pubAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"pubJournal"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}}]}}]}}]} as unknown as DocumentNode<StudyLocusGenesPrioritisationQueryQuery, StudyLocusGenesPrioritisationQueryQueryVariables>;
export const StudyLocusGenesQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StudyLocusGenesQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chromosome"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"start"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Long"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"end"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Long"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"genes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chromosome"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chromosome"}}},{"kind":"Argument","name":{"kind":"Name","value":"start"},"value":{"kind":"Variable","name":{"kind":"Name","value":"start"}}},{"kind":"Argument","name":{"kind":"Name","value":"end"},"value":{"kind":"Variable","name":{"kind":"Name","value":"end"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"tss"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"exons"}}]}}]}}]} as unknown as DocumentNode<StudyLocusGenesQueryQuery, StudyLocusGenesQueryQueryVariables>;
export const StudyLocusSummaryQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StudyLocusSummaryQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"variantInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"variantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rsId"}},{"kind":"Field","name":{"kind":"Name","value":"chromosome"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"refAllele"}},{"kind":"Field","name":{"kind":"Name","value":"altAllele"}},{"kind":"Field","name":{"kind":"Name","value":"chromosomeB37"}},{"kind":"Field","name":{"kind":"Name","value":"positionB37"}}]}},{"kind":"Field","name":{"kind":"Name","value":"studyInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyId"}},{"kind":"Field","name":{"kind":"Name","value":"traitReported"}},{"kind":"Field","name":{"kind":"Name","value":"pubAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"pubJournal"}},{"kind":"Field","name":{"kind":"Name","value":"pmid"}},{"kind":"Field","name":{"kind":"Name","value":"hasSumstats"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"pageSummary"},"name":{"kind":"Name","value":"studyAndLeadVariantInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"variantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"indexVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rsId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"study"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"traitReported"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pvalMantissa"}},{"kind":"Field","name":{"kind":"Name","value":"pvalExponent"}},{"kind":"Field","name":{"kind":"Name","value":"oddsRatio"}},{"kind":"Field","name":{"kind":"Name","value":"oddsRatioCILower"}},{"kind":"Field","name":{"kind":"Name","value":"oddsRatioCIUpper"}},{"kind":"Field","name":{"kind":"Name","value":"beta"}},{"kind":"Field","name":{"kind":"Name","value":"direction"}},{"kind":"Field","name":{"kind":"Name","value":"betaCILower"}},{"kind":"Field","name":{"kind":"Name","value":"betaCIUpper"}}]}}]}}]} as unknown as DocumentNode<StudyLocusSummaryQueryQuery, StudyLocusSummaryQueryQueryVariables>;
export const GwasLeadVariantsPheWasSectionQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GWASLeadVariantsPheWASSectionQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"indexVariantsAndStudiesForTagVariant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"variantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"indexVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rsId"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GwasLeadVariantsPheWasSectionQueryQuery, GwasLeadVariantsPheWasSectionQueryQueryVariables>;
export const TagVariantPheWasSectionQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TagVariantPheWASSectionQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tagVariantsAndStudiesForIndexVariant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"variantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tagVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rsId"}}]}}]}}]}}]}}]} as unknown as DocumentNode<TagVariantPheWasSectionQueryQuery, TagVariantPheWasSectionQueryQueryVariables>;
export const VariantSummaryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VariantSummary"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"variantInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"variantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"variantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rsId"}},{"kind":"Field","name":{"kind":"Name","value":"chromosome"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"chromosomeB37"}},{"kind":"Field","name":{"kind":"Name","value":"positionB37"}},{"kind":"Field","name":{"kind":"Name","value":"refAllele"}},{"kind":"Field","name":{"kind":"Name","value":"altAllele"}},{"kind":"Field","name":{"kind":"Name","value":"nearestGene"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nearestGeneDistance"}},{"kind":"Field","name":{"kind":"Name","value":"nearestCodingGene"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nearestCodingGeneDistance"}},{"kind":"Field","name":{"kind":"Name","value":"mostSevereConsequence"}},{"kind":"Field","name":{"kind":"Name","value":"caddRaw"}},{"kind":"Field","name":{"kind":"Name","value":"caddPhred"}},{"kind":"Field","name":{"kind":"Name","value":"gnomadAFR"}},{"kind":"Field","name":{"kind":"Name","value":"gnomadAMR"}},{"kind":"Field","name":{"kind":"Name","value":"gnomadASJ"}},{"kind":"Field","name":{"kind":"Name","value":"gnomadEAS"}},{"kind":"Field","name":{"kind":"Name","value":"gnomadFIN"}},{"kind":"Field","name":{"kind":"Name","value":"gnomadNFE"}},{"kind":"Field","name":{"kind":"Name","value":"gnomadNFEEST"}},{"kind":"Field","name":{"kind":"Name","value":"gnomadNFENWE"}},{"kind":"Field","name":{"kind":"Name","value":"gnomadNFESEU"}},{"kind":"Field","name":{"kind":"Name","value":"gnomadOTH"}}]}}]}}]} as unknown as DocumentNode<VariantSummaryQuery, VariantSummaryQueryVariables>;