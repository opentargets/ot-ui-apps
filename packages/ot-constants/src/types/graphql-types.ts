// Auto-generated GraphQL types from Open Targets Platform API
// Generated on: 2025-07-07T21:08:10.130Z
// Source: https://api.platform.dev.opentargets.xyz/api/v4/graphql

export interface APIVersion {
  z: string;
  y: string;
  x: string;
}

export interface AdverseEvent {
  /** Log-likelihood ratio */
  logLR: number;
  /** 8 digit unique meddra identification number */
  meddraCode?: string;
  /** Number of reports mentioning drug and adverse event */
  count: any;
  /** Meddra term on adverse event */
  name: string;
}

export interface AdverseEvents {
  /** Significant adverse event entries */
  rows: AdverseEvent[];
  /** LLR critical value to define significance */
  criticalValue: number;
  /** Total significant adverse events */
  count: any;
}

export interface AlleleFrequency {
  alleleFrequency?: number;
  populationName?: string;
}

export interface AssociatedDisease {
  datasourceScores: ScoredComponent[];
  score: number;
  datatypeScores: ScoredComponent[];
  /** Disease */
  disease: Disease;
}

export interface AssociatedDiseases {
  count: any;
  datasources: DatasourceSettings[];
  /** Associated Targets using (On the fly method) */
  rows: AssociatedDisease[];
}

export interface AssociatedTarget {
  datasourceScores: ScoredComponent[];
  score: number;
  datatypeScores: ScoredComponent[];
  /** Target */
  target: Target;
}

export interface AssociatedTargets {
  count: any;
  datasources: DatasourceSettings[];
  /** Associated Targets using (On the fly method) */
  rows: AssociatedTarget[];
}

export interface BiologicalModels {
  literature?: string[];
  id?: string;
  geneticBackground: string;
  allelicComposition: string;
}

export interface BiomarkerGeneExpression {
  name?: string;
  id?: GeneOntologyTerm;
}

export interface Biosample {
  biosampleId: string;
  description?: string;
  biosampleName: string;
  parents?: string[];
  ancestors?: string[];
  synonyms?: string[];
  children?: string[];
  xrefs?: string[];
  descendants?: string[];
}

export interface CancerHallmark {
  description: string;
  pmid: any;
  label: string;
  impact?: string;
}

export interface CellType {
  reliability: boolean;
  level: number;
  name: string;
}

export interface ChemicalProbe {
  origin?: string[];
  isHighQuality: boolean;
  probesDrugsScore?: number;
  targetFromSourceId: string;
  scoreInOrganisms?: number;
  scoreInCells?: number;
  id: string;
  control?: string;
  drugId?: string;
  mechanismOfAction?: string[];
  urls: ChemicalProbeUrl[];
  probeMinerScore?: number;
}

export interface ChemicalProbeUrl {
  url?: string;
  niceName: string;
}

export interface Colocalisation {
  numberColocalisingVariants: any;
  rightStudyType: string;
  betaRatioSignAverage?: number;
  colocalisationMethod: string;
  clpp?: number;
  h3?: number;
  chromosome: string;
  h4?: number;
  /** Credible set */
  otherStudyLocus?: CredibleSet;
}

export interface Colocalisations {
  count: any;
  rows: Colocalisation[];
}

export interface Constraint {
  exp?: number;
  oeLower?: number;
  upperBin6?: any;
  score?: number;
  obs?: any;
  upperRank?: any;
  oe?: number;
  constraintType: string;
  upperBin?: any;
  oeUpper?: number;
}

export interface CredibleSet {
  purityMinR2?: number;
  credibleSetlog10BF?: number;
  position?: number;
  credibleSetIndex?: number;
  qtlGeneId?: string;
  isTransQtl?: boolean;
  finemappingMethod?: string;
  zScore?: number;
  pValueExponent?: number;
  qualityControls?: string[];
  standardError?: number;
  sampleSize?: number;
  region?: string;
  purityMeanR2?: number;
  studyId?: string;
  beta?: number;
  locusEnd?: number;
  chromosome?: string;
  pValueMantissa?: number;
  studyLocusId: string;
  effectAlleleFrequencyFromSource?: number;
  ldSet?: LdSet[];
  confidence?: string;
  subStudyDescription?: string;
  locusStart?: number;
  variant?: Variant;
  studyType?: StudyTypeEnum;
  l2GPredictions: L2GPredictions;
  locus: Loci;
  colocalisation: Colocalisations;
  /** Gwas study */
  study?: Study;
}

export interface CredibleSets {
  count: any;
  rows: CredibleSet[];
}

export interface DataVersion {
  year: string;
  month: string;
  iteration: string;
}

export interface Datasource {
  datasourceId: string;
  datasourceCount: number;
  datasourceNiceName: string;
}

export interface DatasourceSettings {
  required: boolean;
  id: string;
  weight: number;
  propagate: boolean;
}

export interface DatasourceSettingsInput {
  id: string;
  weight: number;
  propagate: boolean;
  required?: boolean;
}

export interface DbXref {
  id?: string;
  source?: string;
}

export interface DepMapEssentiality {
  tissueName?: string;
  tissueId?: string;
  screens: GeneEssentialityScreen[];
}

export interface Disease {
  /** Disease description */
  description?: string;
  /** Open Targets disease id */
  id: string;
  /** List of obsolete diseases */
  obsoleteTerms?: string[];
  /** List of direct location Disease terms */
  directLocationIds?: string[];
  ancestors: string[];
  /** List of external cross reference IDs */
  dbXRefs?: string[];
  /** Disease synonyms */
  synonyms?: DiseaseSynonyms[];
  /** List of indirect location Disease terms */
  indirectLocationIds?: string[];
  descendants: string[];
  /** Disease name */
  name: string;
  /** Ancestor therapeutic area disease entities in ontology */
  therapeuticAreas: Disease[];
  /** Disease parents entities in ontology */
  parents: Disease[];
  /** Disease children entities in ontology */
  children: Disease[];
  /** Direct Location disease terms */
  directLocations: Disease[];
  /** Indirect Location disease terms */
  indirectLocations: Disease[];
  /** Return similar labels using a model Word2CVec trained with PubMed */
  similarEntities: Similarity[];
  /** Return the list of publications that mention the main entity, alone or in combination with other entities */
  literatureOcurrences: Publications;
  /** Is disease a therapeutic area itself */
  isTherapeuticArea: boolean;
  /** Phenotype from HPO index */
  phenotypes?: DiseaseHPOs;
  /** The complete list of all possible datasources */
  evidences: Evidences;
  /** RNA and Protein baseline expression */
  otarProjects: OtarProject[];
  /** Clinical precedence for investigational or approved drugs indicated for disease and curated mechanism of action */
  knownDrugs?: KnownDrugs;
  /** associations on the fly */
  associatedTargets: AssociatedTargets;
  /** All parent diseases in the hierarchy from the term up to a therapeutic area. */
  resolvedAncestors: Disease[];
}

export interface DiseaseCellLine {
  tissueId?: string;
  tissue?: string;
  id?: string;
  name?: string;
}

export interface DiseaseHPO {
  /** List of phenotype annotations. */
  evidence: DiseaseHPOEvidences[];
  /** Phenotype entity */
  phenotypeHPO?: HPO;
  /** Disease Entity */
  phenotypeEFO?: Disease;
}

export interface DiseaseHPOEvidences {
  /** Possible source mapping: HPO or MONDO */
  resource: string;
  /** This field refers to the database and database identifier. EG. OMIM */
  diseaseFromSourceId: string;
  /** A term-id from the HPO-sub-ontology */
  frequency?: string;
  /** Related name from the field diseaseFromSourceId */
  diseaseFromSource: string;
  /** This field indicates the source of the information used for the annotation (phenotype.hpoa) */
  references: string[];
  /** This field contains the strings MALE or FEMALE if the annotation in question is limited to males or females. */
  sex?: string;
  /** This field indicates the level of evidence supporting the annotation. */
  evidenceType?: string;
  /** One of P (Phenotypic abnormality), I (inheritance), C (onset and clinical course). Might be null (MONDO) */
  aspect?: string;
  /** This optional field can be used to qualify the annotation. Values: [True or False] */
  qualifierNot: boolean;
  /** This refers to the center or user making the annotation and the date on which the annotation was made */
  bioCuration?: string;
  /** HP terms from the Clinical modifier subontology */
  modifiers: HPO[];
  /** A term-id from the HPO-sub-ontology below the term Age of onset. */
  onset: HPO[];
  /** HPO Entity */
  frequencyHPO?: HPO;
}

export interface DiseaseHPOs {
  /** List of Disease and phenotypes annotations */
  rows: DiseaseHPO[];
  /** Number of entries */
  count: any;
}

export interface DiseaseSynonyms {
  terms: string[];
  relation: string;
}

export interface Drug {
  /** Drug description */
  description?: string;
  /** Drug modality */
  drugType: string;
  /** Open Targets molecule id */
  id: string;
  /** Drug trade names */
  tradeNames: string[];
  /** Alias for maximumClinicalTrialPhase == 4 */
  isApproved?: boolean;
  /** Has drug been withdrawn from the market */
  hasBeenWithdrawn: boolean;
  /** Maximum phase observed in clinical trial records and post-marketing package inserts */
  maximumClinicalTrialPhase?: number;
  crossReferences?: DrugReferences[];
  /** Molecule synonyms */
  synonyms: string[];
  /** Alert on life-threteaning drug side effects provided by FDA */
  blackBoxWarning: boolean;
  /** Molecule preferred name */
  name: string;
  /** ChEMBL ID of parent molecule */
  parentMolecule?: Drug;
  /** Chembl IDs of molecules that descend from current molecule. */
  childMolecules: Drug[];
  /** Indications for which there is a phase IV clinical trial */
  approvedIndications?: string[];
  /** Warnings present on drug as identified by ChEMBL. */
  drugWarnings: DrugWarning[];
  /** Return similar labels using a model Word2CVec trained with PubMed */
  similarEntities: Similarity[];
  /** Return the list of publications that mention the main entity, alone or in combination with other entities */
  literatureOcurrences: Publications;
  /** Mechanisms of action to produce intended pharmacological effects. Curated from scientific literature and post-marketing package inserts */
  mechanismsOfAction?: MechanismsOfAction;
  /** Investigational and approved indications curated from clinical trial records and post-marketing package inserts */
  indications?: Indications;
  /** Curated Clinical trial records and and post-marketing package inserts with a known mechanism of action */
  knownDrugs?: KnownDrugs;
  /** Significant adverse events inferred from FAERS reports */
  adverseEvents?: AdverseEvents;
  /** Pharmoacogenomics */
  pharmacogenomics: Pharmacogenomics[];
  /** Therapeutic indications for drug based on clinical trial data or post-marketed drugs, when mechanism of action is known" */
  linkedDiseases?: LinkedDiseases;
  /** Molecule targets based on drug mechanism of action */
  linkedTargets?: LinkedTargets;
}

export interface DrugReferences {
  ids: string[];
  source: string;
}

export interface DrugWarning {
  /** Year of withdrawal */
  year?: number;
  /** Either 'black box warning' or 'withdrawn' */
  warningType: string;
  /**  label of the curated EFO term that represents the adverse outcome */
  efoTerm?: string;
  /** ID of the curated EFO term that represents the high level warning class */
  efoIdForWarningClass?: string;
  /** Reason for withdrawal */
  description?: string;
  id?: any;
  /** High level toxicity category by Meddra System Organ Class */
  toxicityClass?: string;
  /** Source of withdrawal information */
  references?: DrugWarningReference[];
  /** Country issuing warning */
  country?: string;
  chemblIds?: string[];
  /** ID of the curated EFO term that represents the adverse outcome */
  efoId?: string;
}

export interface DrugWarningReference {
  id: string;
  url: string;
  source: string;
}

export interface DrugWithIdentifiers {
  drugFromSource?: string;
  drugId?: string;
  /** Drug entity */
  drug?: Drug;
}

export interface Evidence {
  cohortDescription?: string;
  biologicalModelGeneticBackground?: string;
  /** Sample size */
  studySampleSize?: any;
  /** Variant effect */
  variantEffect?: string;
  biologicalModelId?: string;
  biomarkerName?: string;
  diseaseFromSourceMappedId?: string;
  drugFromSource?: string;
  targetFromSourceId?: string;
  /** Evidence score */
  score: number;
  interactingTargetFromSourceId?: string;
  log2FoldChangeValue?: number;
  diseaseFromSourceId?: string;
  datasourceId: string;
  /** Primary Project Hit */
  primaryProjectHit?: boolean;
  allelicRequirements?: string[];
  studyOverview?: string;
  /** Confidence interval lower-bound */
  oddsRatioConfidenceIntervalLower?: number;
  /** Overview of the statistical method used to calculate the association */
  statisticalMethodOverview?: string;
  reactionName?: string;
  targetRole?: string;
  oddsRatio?: number;
  diseaseModelAssociatedHumanPhenotypes?: LabelledElement[];
  /** Predicted reason(s) why the study has been stopped based on studyStopReason */
  studyStopReasonCategories?: string[];
  mutatedSamples?: EvidenceVariation[];
  clinicalPhase?: number;
  biomarkers?: biomarkers;
  /** The statistical method used to calculate the association */
  statisticalMethod?: string;
  alleleOrigins?: string[];
  /** Evidence identifier */
  id: string;
  interactingTargetRole?: string;
  diseaseFromSource?: string;
  cellLineBackground?: string;
  biomarkerList?: NameDescription[];
  phenotypicConsequenceLogFoldChange?: number;
  targetFromSource?: string;
  diseaseModelAssociatedModelPhenotypes?: LabelledElement[];
  datatypeId: string;
  pValueExponent?: any;
  textMiningSentences?: EvidenceTextMiningSentence[];
  geneticInteractionPValue?: number;
  cohortShortName?: string;
  /** Primary Project Id */
  primaryProjectId?: string;
  cohortId?: string;
  biosamplesFromSource?: string[];
  /** Release date */
  releaseDate?: string;
  publicationYear?: any;
  cohortPhenotypes?: string[];
  geneticInteractionFDR?: number;
  betaConfidenceIntervalLower?: number;
  clinicalSignificances?: string[];
  resourceScore?: number;
  phenotypicConsequencePValue?: number;
  /** Direction On Trait */
  directionOnTrait?: string;
  pathways?: Pathway[];
  studyId?: string;
  beta?: number;
  /** Variant dbSNP identifier */
  variantRsId?: string;
  projectDescription?: string;
  studyStartDate?: string;
  contrast?: string;
  /** list of pub med publications ids */
  literature?: string[];
  studyStopReason?: string;
  statisticalTestTail?: string;
  projectId?: string;
  betaConfidenceIntervalUpper?: number;
  targetModulation?: string;
  oddsRatioConfidenceIntervalUpper?: number;
  publicationFirstAuthor?: string;
  pValueMantissa?: number;
  studyCases?: any;
  targetInModel?: string;
  variantAminoacidDescriptions?: string[];
  geneticInteractionScore?: number;
  phenotypicConsequenceFDR?: number;
  geneInteractionType?: string;
  diseaseCellLines?: DiseaseCellLine[];
  significantDriverMethods?: string[];
  /** Identifier of the ancestry in the HANCESTRO ontology */
  ancestryId?: string;
  cellType?: string;
  /** Warning message */
  warningMessage?: string;
  reactionId?: string;
  crisprScreenLibrary?: string;
  biologicalModelAllelicComposition?: string;
  urls?: LabelledUri[];
  confidence?: string;
  /** Assessments */
  assessments?: string[];
  /** Release version */
  releaseVersion?: string;
  /** Genetic origin of a population */
  ancestry?: string;
  /** Number of cases in a case-control study that carry at least one allele of the qualifying variant */
  studyCasesWithQualifyingVariants?: any;
  log2FoldChangePercentileRank?: any;
  assays?: assays[];
  clinicalStatus?: string;
  /** Target evidence */
  target: Target;
  /** Disease evidence */
  disease: Disease;
  credibleSet?: CredibleSet;
  variant?: Variant;
  drug?: Drug;
  drugResponse?: Disease;
  variantFunctionalConsequence?: SequenceOntologyTerm;
  variantFunctionalConsequenceFromQtlId?: SequenceOntologyTerm;
  /** list of central pub med publications ids */
  pubMedCentralIds?: string[];
}

export interface EvidenceSource {
  datatype: string;
  datasource: string;
}

export interface EvidenceTextMiningSentence {
  tStart: any;
  section: string;
  tEnd: any;
  dEnd: any;
  text: string;
  dStart: any;
}

export interface EvidenceVariation {
  numberSamplesWithMutationType?: any;
  numberMutatedSamples?: any;
  numberSamplesTested?: any;
  functionalConsequence?: SequenceOntologyTerm;
}

export interface Evidences {
  count: any;
  cursor?: string;
  rows: Evidence[];
}

export interface Expression {
  protein: ProteinExpression;
  tissue: Tissue;
  rna: RNAExpression;
}

export interface GeneEssentialityScreen {
  geneEffect?: number;
  diseaseFromSource?: string;
  mutation?: string;
  depmapId?: string;
  diseaseCellLineId?: string;
  expression?: number;
  cellLineName?: string;
}

export interface GeneOntology {
  geneProduct: string;
  aspect: string;
  evidence: string;
  source: string;
  /** Gene ontology term */
  term: GeneOntologyTerm;
}

export interface GeneOntologyTerm {
  id: string;
  name: string;
}

export interface GenomicLocation {
  strand: number;
  start: any;
  end: any;
  chromosome: string;
}

export interface HPO {
  /** Phenotype description */
  description?: string;
  /** Open Targets hpo id */
  id: string;
  /** namespace */
  namespace?: string[];
  /** Phenotype name */
  name: string;
}

export interface HallmarkAttribute {
  pmid?: any;
  description: string;
  name: string;
}

export interface Hallmarks {
  cancerHallmarks: CancerHallmark[];
  attributes: HallmarkAttribute[];
}

export interface Homologue {
  targetPercentageIdentity: number;
  targetGeneId: string;
  queryPercentageIdentity: number;
  homologyType: string;
  targetGeneSymbol: string;
  isHighConfidence?: string;
  speciesId: string;
  speciesName: string;
}

export interface IdAndSource {
  id: string;
  source: string;
}

export interface IndicationReference {
  ids?: string[];
  source: string;
}

export interface IndicationRow {
  references?: IndicationReference[];
  maxPhaseForIndication: number;
  /** Disease */
  disease: Disease;
}

export interface Indications {
  count: any;
  rows: IndicationRow[];
  approvedIndications?: string[];
}

export interface Interaction {
  intBBiologicalRole: string;
  intB: string;
  speciesA?: InteractionSpecies;
  intABiologicalRole: string;
  count: any;
  intA: string;
  score?: number;
  sourceDatabase: string;
  speciesB?: InteractionSpecies;
  targetA?: Target;
  targetB?: Target;
  /** List of evidences for this interaction */
  evidences: InteractionEvidence[];
}

export interface InteractionEvidence {
  expansionMethodMiIdentifier?: string;
  interactionDetectionMethodShortName: string;
  interactionTypeMiIdentifier?: string;
  hostOrganismScientificName?: string;
  interactionTypeShortName?: string;
  participantDetectionMethodB?: InteractionEvidencePDM[];
  evidenceScore?: number;
  pubmedId?: string;
  expansionMethodShortName?: string;
  hostOrganismTaxId?: any;
  interactionIdentifier?: string;
  participantDetectionMethodA?: InteractionEvidencePDM[];
  intBSource: string;
  intASource: string;
  interactionDetectionMethodMiIdentifier: string;
}

export interface InteractionEvidencePDM {
  miIdentifier?: string;
  shortName?: string;
}

export interface InteractionResources {
  sourceDatabase: string;
  databaseVersion: string;
}

export interface InteractionSpecies {
  mnemonic?: string;
  taxonId?: any;
  scientificName?: string;
}

export interface Interactions {
  count: any;
  rows: Interaction[];
}

export interface KeyValue {
  key: string;
  value: string;
}

export interface KeyValueArray {
  items: KeyValue[];
}

export interface KnownDrug {
  /** Clinicaltrials.gov identifiers on entry trials */
  ctIds: string[];
  /** Drug target class based on curated mechanism of action */
  targetClass: string[];
  /** Trial status */
  status?: string;
  /** Drug target approved symbol based on curated mechanism of action */
  approvedSymbol: string;
  /** Drug modality */
  drugType: string;
  /** Curated disease indication */
  label: string;
  /** Source urls for FDA or package inserts */
  references: KnownDrugReference[];
  /** Drug name */
  prefName: string;
  /** Drug target Open Targets id based on curated mechanism of action */
  targetId: string;
  /** Open Targets drug id */
  drugId: string;
  approvedName: string;
  /** Mechanism of Action description */
  mechanismOfAction: string;
  /** Clinical Trial phase */
  phase: number;
  /** Curated disease indication Open Targets id */
  diseaseId: string;
  /** Source urls from clinical trials */
  urls: URL[];
  /** Curated disease indication entity */
  disease?: Disease;
  /** Drug target entity based on curated mechanism of action */
  target?: Target;
  /** Curated drug entity */
  drug?: Drug;
}

export interface KnownDrugReference {
  ids: string[];
  urls: string[];
  source: string;
}

export interface KnownDrugs {
  /** Clinical precedence entries with known mechanism of action */
  rows: KnownDrug[];
  cursor?: string;
  /** Total number of entries */
  count: any;
  /** Total unique drugs/molecules */
  uniqueDrugs: any;
  /** Total unique known mechanism of action targetsTotal unique known mechanism of action targets */
  uniqueTargets: any;
  /** Total unique diseases or phenotypes */
  uniqueDiseases: any;
}

export interface L2GFeature {
  shapValue: number;
  value: number;
  name: string;
}

export interface L2GPrediction {
  score: number;
  features?: L2GFeature[];
  shapBaseValue: number;
  studyLocusId: string;
  /** Target */
  target?: Target;
}

export interface L2GPredictions {
  rows: L2GPrediction[];
  count: any;
  id: string;
}

export interface LabelAndSource {
  label: string;
  source: string;
}

export interface LabelledElement {
  label: string;
  id: string;
}

export interface LabelledUri {
  url: string;
  niceName?: string;
}

export interface LdPopulationStructure {
  ldPopulation?: string;
  relativeSampleSize?: number;
}

export interface LdSet {
  r2Overall?: number;
  tagVariantId?: string;
}

export interface LinkedDiseases {
  count: number;
  /** Disease List */
  rows: Disease[];
}

export interface LinkedTargets {
  count: number;
  /** Target List */
  rows: Target[];
}

export interface LocationAndSource {
  location: string;
  termSL?: string;
  labelSL?: string;
  source: string;
}

export interface Loci {
  rows?: Locus[];
  count: any;
}

export interface Locus {
  is95CredibleSet?: boolean;
  is99CredibleSet?: boolean;
  r2Overall?: number;
  pValueExponent?: number;
  posteriorProbability?: number;
  standardError?: number;
  logBF?: number;
  beta?: number;
  pValueMantissa?: number;
  variant?: Variant;
}

export interface MappingResult {
  term: string;
  hits?: SearchResult[];
}

export interface MappingResults {
  aggregations?: SearchResultAggs;
  total: any;
  /** Mappings */
  mappings: MappingResult[];
}

export interface Match {
  mappedId: string;
  matchedLabel: string;
  sectionStart?: any;
  sectionEnd?: any;
  startInSentence: any;
  endInSentence: any;
  /** Type of the matched label */
  matchedType: string;
}

export interface MechanismOfActionRow {
  actionType?: string;
  references?: Reference[];
  targetName?: string;
  mechanismOfAction: string;
  /** Target List */
  targets: Target[];
}

export interface MechanismsOfAction {
  rows: MechanismOfActionRow[];
  uniqueTargetTypes: string[];
  uniqueActionTypes: string[];
}

export interface Meta {
  dataVersion: DataVersion;
  apiVersion: APIVersion;
  name: string;
  /** Return Open Targets downloads information */
  downloads?: string;
}

export interface ModelPhenotypeClasses {
  label: string;
  id: string;
}

export interface MousePhenotype {
  targetInModelMgiId: string;
  targetInModelEnsemblId?: string;
  biologicalModels: BiologicalModels[];
  modelPhenotypeClasses: ModelPhenotypeClasses[];
  modelPhenotypeLabel: string;
  modelPhenotypeId: string;
  targetInModel: string;
}

export interface NameDescription {
  description: string;
  name: string;
}

export interface OtarProject {
  projectName?: string;
  integratesInPPP?: boolean;
  reference: string;
  status?: string;
  otarCode: string;
}

export interface Pagination {
  index: number;
  size: number;
}

export interface Pathway {
  id?: string;
  name: string;
}

export interface Pharmacogenomics {
  isDirectTarget: boolean;
  targetFromSourceId?: string;
  datasourceId?: string;
  haplotypeId?: string;
  genotype?: string;
  variantFunctionalConsequenceId?: string;
  datatypeId?: string;
  variantAnnotation?: VariantAnnotation[];
  studyId?: string;
  phenotypeText?: string;
  variantRsId?: string;
  literature?: string[];
  phenotypeFromSourceId?: string;
  genotypeId?: string;
  haplotypeFromSourceId?: string;
  variantId?: string;
  evidenceLevel?: string;
  genotypeAnnotationText?: string;
  pgxCategory?: string;
  variantFunctionalConsequence?: SequenceOntologyTerm;
  /** Target entity */
  target?: Target;
  /** Drug List */
  drugs: DrugWithIdentifiers[];
}

export interface ProteinCodingCoordinate {
  variantEffect?: number;
  referenceAminoAcid: string;
  therapeuticAreas: string[];
  aminoAcidPosition: number;
  uniprotAccessions: string[];
  alternateAminoAcid: string;
  datasources: Datasource[];
  /** Diseases */
  diseases: Disease[];
  /** Target */
  target?: Target;
  /** Variant */
  variant?: Variant;
  /** Most severe consequence sequence ontology */
  variantConsequences: SequenceOntologyTerm[];
}

export interface ProteinCodingCoordinates {
  rows: ProteinCodingCoordinate[];
  count: any;
}

export interface ProteinExpression {
  reliability: boolean;
  level: number;
  cellType: CellType[];
}

export interface Publication {
  pmid: string;
  pmcid?: string;
  /** Publication Date */
  publicationDate?: string;
  /** Unique counts per matched keyword */
  sentences?: Sentence[];
}

export interface Publications {
  count: any;
  filteredCount: any;
  /** Earliest publication year. */
  earliestPubYear: number;
  cursor?: string;
  rows: Publication[];
}

export interface RNAExpression {
  zscore: any;
  unit: string;
  level: number;
  value: number;
}

export interface ReactomePathway {
  topLevelTerm: string;
  pathwayId: string;
  pathway: string;
}

export interface Reference {
  ids?: string[];
  urls?: string[];
  source: string;
}

export interface SafetyBiosample {
  cellId?: string;
  tissueId?: string;
  cellFormat?: string;
  tissueLabel?: string;
  cellLabel?: string;
}

export interface SafetyEffects {
  dosing?: string;
  direction: string;
}

export interface SafetyLiability {
  event?: string;
  biosamples?: SafetyBiosample[];
  studies?: SafetyStudy[];
  effects?: SafetyEffects[];
  datasource: string;
  eventId?: string;
  literature?: string;
  url?: string;
}

export interface SafetyStudy {
  description?: string;
  type?: string;
  name?: string;
}

export interface Sample {
  sampleSize?: number;
  ancestry?: string;
}

export interface ScoredComponent {
  score: number;
  id: string;
}

export interface SearchFacetsCategory {
  total: any;
  name: string;
}

export interface SearchFacetsResult {
  score: number;
  label: string;
  highlights: string[];
  datasourceId?: string;
  entityIds?: string[];
  id: string;
  category: string;
}

export interface SearchFacetsResults {
  /** Return combined */
  hits: SearchFacetsResult[];
  /** Total number or results given a entity filter */
  total: any;
  /** Categories */
  categories: SearchFacetsCategory[];
}

export interface SearchResult {
  prefixes?: string[];
  highlights: string[];
  score: number;
  description?: string;
  id: string;
  keywords?: string[];
  entity: string;
  multiplier: number;
  category: string[];
  ngrams?: string[];
  name: string;
  /** Associations for a fixed target */
  object?: EntityUnionType;
}

export interface SearchResultAggCategory {
  total: any;
  name: string;
}

export interface SearchResultAggEntity {
  categories: SearchResultAggCategory[];
  total: any;
  name: string;
}

export interface SearchResultAggs {
  total: any;
  entities: SearchResultAggEntity[];
}

export interface SearchResults {
  /** Aggregations */
  aggregations?: SearchResultAggs;
  /** Return combined */
  hits: SearchResult[];
  /** Total number or results given a entity filter */
  total: any;
}

export interface Sentence {
  /** Section of the publication (either title or abstract) */
  section: string;
  /** List of matches */
  matches: Match[];
}

export interface SequenceOntologyTerm {
  label: string;
  id: string;
}

export interface Similarity {
  score: number;
  id: string;
  category: string;
  /** Similarity label optionally resolved into an entity */
  object?: EntityUnionType;
}

export interface Studies {
  count: any;
  rows: Study[];
}

export interface Study {
  summarystatsLocation?: string;
  traitFromSourceMappedIds?: string[];
  sumstatQCValues?: SumStatQC[];
  nSamples?: number;
  /** Condition */
  condition?: string;
  cohorts?: string[];
  traitFromSource?: string;
  qualityControls?: string[];
  discoverySamples?: Sample[];
  hasSumstats?: boolean;
  analysisFlags?: string[];
  pubmedId?: string;
  replicationSamples?: Sample[];
  initialSampleSize?: string;
  ldPopulationStructure?: LdPopulationStructure[];
  publicationFirstAuthor?: string;
  /** The project identifier */
  projectId?: string;
  publicationTitle?: string;
  publicationDate?: string;
  nCases?: number;
  nControls?: number;
  publicationJournal?: string;
  /** The study identifier */
  id: string;
  /** The study type */
  studyType?: StudyTypeEnum;
  /** Target */
  target?: Target;
  /** biosample */
  biosample?: Biosample;
  diseases?: Disease[];
  backgroundTraits?: Disease[];
  /** Credible sets */
  credibleSets: CredibleSets;
}

export interface SumStatQC {
  QCCheckName: string;
  QCCheckValue: number;
}

export interface Target {
  /** Ensembl transcript IDs */
  transcriptIds: string[];
  /** Location of ... */
  subcellularLocations: LocationAndSource[];
  targetClass: TargetClass[];
  /** ... */
  functionDescriptions: string[];
  /** Gene Ontology annotations */
  geneOntology: GeneOntology[];
  /** HGNC approved symbol */
  approvedSymbol: string;
  /** Gene homologues */
  homologues: Homologue[];
  /** Open Targets target id */
  id: string;
  /** Alternative symbols */
  symbolSynonyms: LabelAndSource[];
  /** Symbol synonyms */
  geneticConstraint: Constraint[];
  /** Database cross references */
  dbXrefs: IdAndSource[];
  /** Obsolete names */
  obsoleteNames: LabelAndSource[];
  /** Known target safety effects and target safety risk information */
  safetyLiabilities: SafetyLiability[];
  /** Reactome pathways */
  pathways: ReactomePathway[];
  /** Target-modulated essential alterations in cell physiology that dictate malignant growth */
  hallmarks?: Hallmarks;
  alternativeGenes: string[];
  /** Chromosomic location */
  genomicLocation: GenomicLocation;
  /** Target Enabling Package (TEP) */
  tep?: Tep;
  chemicalProbes: ChemicalProbe[];
  /** Obsolete symbols */
  obsoleteSymbols: LabelAndSource[];
  /** Approved gene name */
  approvedName: string;
  /** Target druggability assessment */
  tractability: Tractability[];
  /** Alternative names and symbols */
  synonyms: LabelAndSource[];
  /** Related protein IDs */
  proteinIds: IdAndSource[];
  /** Molecule biotype */
  biotype: string;
  /** Alternative names */
  nameSynonyms: LabelAndSource[];
  /** Return similar labels using a model Word2CVec trained with PubMed */
  similarEntities: Similarity[];
  /** Return the list of publications that mention the main entity, alone or in combination with other entities */
  literatureOcurrences: Publications;
  /** The complete list of all possible datasources */
  evidences: Evidences;
  /** Biological pathway membership from Reactome */
  interactions?: Interactions;
  /** Biological pathway membership from Reactome */
  mousePhenotypes: MousePhenotype[];
  /** RNA and Protein baseline expression */
  expressions: Expression[];
  /** Clinical precedence for drugs with investigational or approved indications targeting gene products according to their curated mechanism of action */
  knownDrugs?: KnownDrugs;
  /** associations on the fly */
  associatedDiseases: AssociatedDiseases;
  /** Factors influencing target-specific properties informative in a target prioritisation strategy. Values range from -1 (deprioritised) to 1 (prioritised). */
  prioritisation?: KeyValueArray;
  /** isEssential */
  isEssential?: boolean;
  /** depMapEssentiality */
  depMapEssentiality?: DepMapEssentiality[];
  /** Pharmoacogenomics */
  pharmacogenomics: Pharmacogenomics[];
  /** Protein coding coordinates */
  proteinCodingCoordinates: ProteinCodingCoordinates;
}

export interface TargetClass {
  label: string;
  id: any;
  level: string;
}

export interface Tep {
  name: string;
  description: string;
  uri: string;
  therapeuticArea: string;
}

export interface Tissue {
  /** UBERON tissue label */
  label: string;
  /** Organs membership */
  organs: string[];
  /** UBERON id */
  id: string;
  /** Anatomical systems membership */
  anatomicalSystems: string[];
}

export interface Tractability {
  label: string;
  modality: string;
  value: boolean;
}

export interface TranscriptConsequence {
  polyphenPrediction?: number;
  siftPrediction?: number;
  aminoAcidChange?: string;
  transcriptIndex: any;
  distanceFromFootprint: number;
  distanceFromTss: number;
  isEnsemblCanonical: boolean;
  uniprotAccessions?: string[];
  impact?: string;
  transcriptId?: string;
  consequenceScore: number;
  codons?: string;
  lofteePrediction?: string;
  /** Target */
  target?: Target;
  /** Most severe consequence sequence ontology */
  variantConsequences: SequenceOntologyTerm[];
}

export interface URL {
  /** resource url */
  url: string;
  /** resource name */
  name: string;
}

export interface Variant {
  variantEffect?: VariantEffect[];
  rsIds?: string[];
  variantDescription: string;
  transcriptConsequences?: TranscriptConsequence[];
  position: number;
  alternateAllele: string;
  dbXrefs?: DbXref[];
  hgvsId?: string;
  chromosome: string;
  alleleFrequencies?: AlleleFrequency[];
  referenceAllele: string;
  id: string;
  /** Most severe consequence sequence ontology */
  mostSevereConsequence?: SequenceOntologyTerm;
  /** Credible sets */
  credibleSets: CredibleSets;
  /** Pharmoacogenomics */
  pharmacogenomics: Pharmacogenomics[];
  /** The complete list of all possible datasources */
  evidences: Evidences;
  /** Protein coding coordinates */
  proteinCodingCoordinates: ProteinCodingCoordinates;
}

export interface VariantAnnotation {
  /** Allele directionality of the effect. */
  directionality?: string;
  /** Allele observed effect. */
  effect?: string;
  /** Summary of the impact of the allele on the drug response. */
  effectDescription?: string;
  /** Allele or genotype in the comparison case. */
  comparisonAlleleOrGenotype?: string;
  /** Entity affected by the effect. */
  entity?: string;
  /** PMID of the supporting publication. */
  literature?: string;
  /** Type of effect. */
  effectType?: string;
  /** Allele or genotype in the base case. */
  baseAlleleOrGenotype?: string;
}

export interface VariantEffect {
  score?: number;
  normalisedScore?: number;
  assessmentFlag?: string;
  assessment?: string;
  method?: string;
  /** Target */
  target?: Target;
}

export interface assays {
  shortName?: string;
  description?: string;
  isHit?: boolean;
}

export interface biomarkers {
  geneExpression?: BiomarkerGeneExpression[];
  geneticVariation?: geneticVariation[];
}

export interface geneticVariation {
  id?: string;
  name?: string;
  functionalConsequenceId?: SequenceOntologyTerm;
}

export enum StudyTypeEnum {
  eqtl = "eqtl",
  gwas = "gwas",
  pqtl = "pqtl",
  sceqtl = "sceqtl",
  scpqtl = "scpqtl",
  scsqtl = "scsqtl",
  sctuqtl = "sctuqtl",
  sqtl = "sqtl",
  tuqtl = "tuqtl",
}

export type EntityUnionType = Target | Drug | Disease | Variant | Study;
