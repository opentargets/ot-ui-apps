# Open Targets GraphQL schema diff

- Old: `https://dev.opentargets.xyz/api/v4/graphql`
- New: `https://ng.opentargets.org:8080/latest/graphql`
- Source: read-only GraphQL introspection snapshots

## Summary

- Old named types: 150
- New named types: 180
- Removed types: 66
- Changed types: 49
- Added types: 96

## Removed types

- `APIVersion`
- `AdverseEvents`
- `AggregationTypeEnum`
- `AssociatedDisease`
- `AssociatedDiseases`
- `AssociatedTarget`
- `AssociatedTargets`
- `AssociationTimeSeries`
- `AssociationTimeSeriesResults`
- `BaselineExpressionRow`
- `CancerHallmark`
- `ChemicalProbeUrl`
- `ClinRepDrugListItem`
- `ClinicalIndicationFromDisease`
- `ClinicalIndicationFromDrug`
- `ClinicalReportType`
- `ClinicalTargetFromTarget`
- `Colocalisations`
- `CredibleSets`
- `DataVersion`
- `DatasourceSettings`
- `DatasourceSettingsInput`
- `DiseaseHPO`
- `DiseaseHPOEvidences`
- `DiseaseHPOs`
- `DiseaseSynonyms`
- `EnhancerToGenes`
- `EntityUnionType`
- `EvidenceSource`
- `Evidences`
- `GeneOntologyTerm`
- `HPO`
- `HallmarkAttribute`
- `Hallmarks`
- `InteractionEvidencePDM`
- `InteractionResources`
- `InteractionSourceEnum`
- `InteractionSpecies`
- `Interactions`
- `KeyValuePair`
- `L2GFeature`
- `L2GPrediction`
- `L2GPredictions`
- `LabelAndSource`
- `LdSet`
- `Loci`
- `Long`
- `MappingResult`
- `MappingResults`
- `OtarProject`
- `Pagination`
- `ProteinCodingCoordinate`
- `Publications`
- `SafetyBiosample`
- `SafetyStudy`
- `ScoredComponent`
- `SearchFacetsResult`
- `Studies`
- `StudyTypeEnum`
- `ValidationReadouts`
- `assays`
- `biomarkers`
- `clinicalIndicationsFromDiseaseImp`
- `clinicalIndicationsFromDrugImp`
- `clinicalTargets`
- `geneticVariation`

## Added types

- `AdverseEventPage`
- `AdverseEventStats`
- `AggregationType`
- `Assay`
- `AssociationSort`
- `AssociationTimeseries`
- `AssociationTimeseriesPage`
- `Attributes`
- `BaselineExpressionPage`
- `Biomarkers`
- `CancerHallmarks`
- `Category`
- `Chromosome`
- `ClinicalIndication`
- `ClinicalIndicationPage`
- `ClinicalReportDrugListItem`
- `ClinicalSideEffectListItem`
- `ClinicalStage`
- `ColocalisationFilter`
- `ColocalisationPage`
- `CredibleSetFilter`
- `CredibleSetPage`
- `DatasourcePolicy`
- `DatasourcePolicyOverride`
- `DepMapEssentialityPage`
- `DiseaseAssociation`
- `DiseaseAssociationPage`
- `DiseasePage`
- `DiseasePhenotype`
- `DiseasePhenotypePage`
- `DiseaseSort`
- `DiseaseSortField`
- `DiseaseSynonym`
- `DrugPage`
- `DrugWarningPage`
- `EnhancerToGenePage`
- `EntityObject`
- `EvidencePage`
- `Flavor`
- `GeneOntologyAnnotation`
- `GeneticVariation`
- `Hallmark`
- `Hpo`
- `ID`
- `IntFilter`
- `InteractionPage`
- `InteractionSourceDatabase`
- `InteractionSpeciesA`
- `InteractionSpeciesB`
- `KeywordRelevance`
- `L2GPredictionPage`
- `L2Gfeature`
- `L2Gprediction`
- `LabelSource`
- `Ldset`
- `LocusFilter`
- `LocusPage`
- `MousePhenotypePage`
- `NaiveDate`
- `OptBoolBucket`
- `Origin`
- `Page`
- `ParticipantDetectionMethod`
- `PharmacogenomicsPage`
- `PhenotypeEvidence`
- `ProteinCodingCoordinateDatasource`
- `ProteinCodingCoordinatesPage`
- `Provider`
- `PublicationPage`
- `PublicationStats`
- `SafetyBiosamples`
- `SafetyStudies`
- `Score`
- `SearchFacetResult`
- `SimilarEntityPage`
- `SimilarityUnion`
- `SortDirection`
- `StringFilter`
- `StudyFilter`
- `StudyPage`
- `StudySort`
- `StudySortField`
- `StudyStats`
- `StudyType`
- `StudyTypeBucket`
- `Sumstats`
- `TargetAssociation`
- `TargetAssociationPage`
- `TargetPage`
- `TargetPrioritisations`
- `TranscriptConsequenceSort`
- `TranscriptConsequenceSortField`
- `TrialStudyType`
- `Url`
- `VariantPage`
- `Version`

## Changed types

### `AdverseEvent`

- Changed field `count`: `Long!` → `Int!`
- Changed field `meddraCode`: `String` → `String!`

### `BaselineExpression`

- Removed field `count: Long!`
- Removed field `rows: [BaselineExpressionRow!]!`
- Added field `celltypeBiosample: Biosample`
- Added field `celltypeBiosampleFromSource: String`
- Added field `celltypeBiosampleParent: Biosample`
- Added field `datasourceId: String!`
- Added field `datatypeId: String!`
- Added field `distributionScore: Float!`
- Added field `max: Float`
- Added field `median: Float`
- Added field `min: Float`
- Added field `q1: Float`
- Added field `q3: Float`
- Added field `qualityControls: [String!]!`
- Added field `specificityScore: Float`
- Added field `targetFromSourceId: String`
- Added field `targetId: String!`
- Added field `tissueBiosample: Biosample`
- Added field `tissueBiosampleFromSource: String`
- Added field `tissueBiosampleParent: Biosample`
- Added field `unit: String!`

### `BiologicalModels`

- Changed field `literature`: `[String!]` → `[String!]!`

### `BiomarkerGeneExpression`

- Changed field `id`: `GeneOntologyTerm` → `GeneOntology`

### `Biosample`

- Changed field `ancestors`: `[String!]` → `[String!]!`
- Changed field `children`: `[String!]` → `[String!]!`
- Changed field `descendants`: `[String!]` → `[String!]!`
- Changed field `parents`: `[String!]` → `[String!]!`
- Changed field `synonyms`: `[String!]` → `[String!]!`
- Changed field `xrefs`: `[String!]` → `[String!]!`

### `CanonicalTranscript`

- Changed field `end`: `Long!` → `Int!`
- Changed field `start`: `Long!` → `Int!`

### `ChemicalProbe`

- Changed field `mechanismOfAction`: `[String!]` → `[String!]!`
- Changed field `origin`: `[String!]` → `[String!]!`
- Changed field `urls`: `[ChemicalProbeUrl!]!` → `[Url!]!`

### `ClinicalDiseaseListItem`

- Changed field `disease`: `Disease` → `Disease!`
- Changed field `diseaseFromSource`: `String` → `String!`

### `ClinicalReport`

- Removed field `type: ClinicalReportType`
- Added field `evidenceType: String`
- Changed field `clinicalStage`: `String!` → `ClinicalStage!`
- Changed field `drugs`: `[ClinRepDrugListItem!]!` → `[ClinicalReportDrugListItem!]!`
- Changed field `origin`: `String!` → `Origin!`
- Changed field `provider`: `String!` → `Provider!`
- Changed field `sideEffects`: `[ClinicalDiseaseListItem!]!` → `[ClinicalSideEffectListItem!]!`
- Changed field `trialSponsor`: `TrialSponsor` → `TrialSponsor!`
- Changed field `trialStartDate`: `String` → `NaiveDate`
- Changed field `trialStudyType`: `String` → `TrialStudyType`

### `Colocalisation`

- Added field `otherStudyLocusId: String!`
- Changed field `betaRatioSignAverage`: `Float` → `Float!`
- Changed field `chromosome`: `String!` → `Chromosome!`
- Changed field `clpp`: `Float` → `Float!`
- Changed field `h3`: `Float` → `Float!`
- Changed field `h4`: `Float` → `Float!`
- Changed field `numberColocalisingVariants`: `Long!` → `Int!`
- Changed field `rightStudyType`: `String!` → `StudyType!`

### `Constraint`

- Changed field `obs`: `Long` → `Int`
- Changed field `upperBin`: `Long` → `Int`
- Changed field `upperBin6`: `Long` → `Int`
- Changed field `upperRank`: `Long` → `Int`

### `CredibleSet`

- Changed field `chromosome`: `String!` → `Chromosome!`
- Changed field `colocalisation`: `Colocalisations!(studyTypes: [StudyTypeEnum!], page: Pagination)` → `ColocalisationPage!(filter: ColocalisationFilter!, page: Page!)`
- Changed field `confidence`: `String` → `String!`
- Changed field `finemappingMethod`: `String` → `String!`
- Changed field `l2GPredictions`: `L2GPredictions!(page: Pagination)` → `L2GPredictionPage!(page: Page!)`
- Changed field `ldSet`: `[LdSet!]` → `[Ldset!]!`
- Changed field `locus`: `Loci!(variantIds: [String!], page: Pagination)` → `LocusPage!(filter: LocusFilter, page: Page!)`
- Changed field `qualityControls`: `[String!]` → `[String!]!`
- Changed field `studyType`: `StudyTypeEnum` → `StudyType!`

### `Datasource`

- Kind: `GraphQLObjectType` → `GraphQLEnumType`

### `Disease`

- Removed field `directLocations: [Disease!]!`
- Removed field `indirectLocations: [Disease!]!`
- Removed field `otarProjects: [OtarProject!]!`
- Removed field `resolvedAncestors: [Disease!]!`
- Added field `indirectStudyIds: [String!]!`
- Added field `studyIds: [String!]!`
- Changed field `associatedTargets`: `AssociatedTargets!(Bs: [String!], enableIndirect: Boolean, datasources: [DatasourceSettingsInput!], facetFilters: [String!], BFilter: String, orderByScore: String, page: Pagination)` → `TargetAssociationPage!(Bs: [String!]!, BFilter: String, facetFilters: [String!]!, datasourcePolicyOverrides: [DatasourcePolicyOverride!]!, sort: AssociationSort!, page: Page!)`
- Changed field `associationTimeSeries`: `AssociationTimeSeriesResults!(ensemblId: String!, isDirect: Boolean!, aggregationTypes: [AggregationTypeEnum!], startYear: Int, endYear: Int, page: Pagination)` → `AssociationTimeseriesPage!(ensemblId: String!, isDirect: Boolean!, aggregationTypes: [AggregationType!], startYear: Int, endYear: Int, page: Page!)`
- Changed field `directLocationIds`: `[String!]` → `[String!]!`
- Changed field `drugAndClinicalCandidates`: `clinicalIndicationsFromDiseaseImp!` → `ClinicalIndicationPage!(page: Page!)`
- Changed field `evidences`: `Evidences!(ensemblIds: [String!]!, enableIndirect: Boolean, datasourceIds: [String!], size: Int, cursor: String)` → `EvidencePage!(ensemblIds: [String!]!, datasourceIds: [Datasource!]!, page: Page!)`
- Changed field `indirectLocationIds`: `[String!]` → `[String!]!`
- Changed field `literatureOcurrences`: `Publications!(additionalIds: [String!], startYear: Int, startMonth: Int, endYear: Int, endMonth: Int, cursor: String)` → `PublicationPage!(additionalIds: [String!], startYear: Int, startMonth: Int, endYear: Int, endMonth: Int, page: Page!)`
- Changed field `phenotypes`: `DiseaseHPOs!(page: Pagination)` → `DiseasePhenotypePage!(page: Page!)`
- Changed field `similarEntities`: `[Similarity!]!(additionalIds: [String!], entityNames: [String!], threshold: Float, size: Int)` → `SimilarEntityPage!(additionalIds: [String!], entityNames: [String!], threshold: Float, page: Page!)`
- Changed field `synonyms`: `[DiseaseSynonyms!]` → `[DiseaseSynonym!]!`
- Changed field `therapeuticAreas`: `[Disease!]!` → `[String!]!`

### `Drug`

- Changed field `adverseEvents`: `AdverseEvents!(page: Pagination)` → `AdverseEventPage(page: Page!)`
- Changed field `crossReferences`: `[DrugReferences!]` → `[DrugReferences!]!`
- Changed field `drugWarnings`: `[DrugWarning!]!` → `DrugWarningPage!(page: Page!)`
- Changed field `indications`: `clinicalIndicationsFromDrugImp!` → `ClinicalIndicationPage!(page: Page!)`
- Changed field `literatureOcurrences`: `Publications!(additionalIds: [String!], startYear: Int, startMonth: Int, endYear: Int, endMonth: Int, cursor: String)` → `PublicationPage!(additionalIds: [String!], startYear: Int, startMonth: Int, endYear: Int, endMonth: Int, page: Page!)`
- Changed field `pharmacogenomics`: `[Pharmacogenomics!]!` → `PharmacogenomicsPage!(page: Page!)`
- Changed field `similarEntities`: `[Similarity!]!(additionalIds: [String!], entityNames: [String!], threshold: Float, size: Int)` → `SimilarEntityPage!(additionalIds: [String!], entityNames: [String!], threshold: Float, page: Page!)`

### `DrugWarning`

- Changed field `chemblIds`: `[String!]` → `[String!]!`
- Changed field `id`: `Long` → `Int`
- Changed field `references`: `[DrugWarningReference!]` → `[DrugWarningReference!]!`

### `DrugWithIdentifiers`

- Changed field `drugFromSource`: `String` → `String!`
- Changed field `drugId`: `String` → `String!`

### `EnhancerToGene`

- Removed field `meta_total: Long!`
- Changed field `chromosome`: `String!` → `Chromosome!`
- Changed field `qualityControls`: `[String!]` → `[String!]!`
- Changed field `target`: `Target!` → `Target`

### `Evidence`

- Removed field `credibleSet: CredibleSet`
- Removed field `geneticInteractionFDR: Float`
- Removed field `metaTotal: Int!`
- Removed field `pubMedCentralIds: [String!]`
- Removed field `validationReadouts: [ValidationReadouts!]`
- Removed field `variant: Variant`
- Removed field `variantFunctionalConsequenceFromQtlId: SequenceOntologyTerm`
- Added field `variantFunctionalConsequenceFromQtl: SequenceOntologyTerm`
- Changed field `alleleOrigins`: `[String!]` → `[String!]!`
- Changed field `allelicRequirements`: `[String!]` → `[String!]!`
- Changed field `assays`: `[assays!]` → `[Assay!]!`
- Changed field `assessments`: `[String!]` → `[String!]!`
- Changed field `biomarkerList`: `[NameDescription!]` → `[NameDescription!]!`
- Changed field `biomarkers`: `biomarkers` → `Biomarkers!`
- Changed field `biosamplesFromSource`: `[String!]` → `[String!]!`
- Changed field `clinicalSignificances`: `[String!]` → `[String!]!`
- Changed field `cohortPhenotypes`: `[String!]` → `[String!]!`
- Changed field `disease`: `Disease!` → `Disease`
- Changed field `diseaseCellLines`: `[DiseaseCellLine!]` → `[DiseaseCellLine!]!`
- Changed field `diseaseModelAssociatedHumanPhenotypes`: `[LabelledElement!]` → `[LabelledElement!]!`
- Changed field `diseaseModelAssociatedModelPhenotypes`: `[LabelledElement!]` → `[LabelledElement!]!`
- Changed field `drugResponse`: `Disease` → `Drug`
- Changed field `literature`: `[String!]` → `[String!]!`
- Changed field `log2FoldChangePercentileRank`: `Long` → `Int`
- Changed field `mutatedSamples`: `[EvidenceVariation!]` → `[EvidenceVariation!]!`
- Changed field `pValueExponent`: `Long` → `Int`
- Changed field `pathways`: `[Pathway!]` → `[Pathway!]!`
- Changed field `publicationYear`: `Long` → `Int`
- Changed field `significantDriverMethods`: `[String!]` → `[String!]!`
- Changed field `studyCases`: `Long` → `Int`
- Changed field `studyCasesWithQualifyingVariants`: `Long` → `Int`
- Changed field `studySampleSize`: `Long` → `Int`
- Changed field `target`: `Target!` → `Target`
- Changed field `textMiningSentences`: `[EvidenceTextMiningSentence!]` → `[EvidenceTextMiningSentence!]!`
- Changed field `trialStopReasonCategories`: `[String!]` → `[String!]!`
- Changed field `urls`: `[LabelledUri!]` → `[LabelledUri!]!`
- Changed field `variantAminoacidDescriptions`: `[String!]` → `[String!]!`

### `EvidenceTextMiningSentence`

- Changed field `dEnd`: `Long!` → `Int!`
- Changed field `dStart`: `Long!` → `Int!`
- Changed field `tEnd`: `Long!` → `Int!`
- Changed field `tStart`: `Long!` → `Int!`

### `EvidenceVariation`

- Changed field `numberMutatedSamples`: `Long` → `Int`
- Changed field `numberSamplesTested`: `Long` → `Int`
- Changed field `numberSamplesWithMutationType`: `Long` → `Int`

### `GeneOntology`

- Removed field `aspect: String!`
- Removed field `evidence: String!`
- Removed field `geneProduct: String!`
- Removed field `source: String!`
- Removed field `term: GeneOntologyTerm!`
- Added field `id: String!`
- Added field `label: String!`

### `GenomicLocation`

- Changed field `end`: `Long!` → `Int!`
- Changed field `start`: `Long!` → `Int!`

### `Interaction`

- Changed field `count`: `Long!` → `Int!`
- Changed field `sourceDatabase`: `String!` → `InteractionSourceDatabase!`
- Changed field `speciesA`: `InteractionSpecies` → `InteractionSpeciesA!`
- Changed field `speciesB`: `InteractionSpecies` → `InteractionSpeciesB!`

### `InteractionEvidence`

- Changed field `hostOrganismTaxId`: `Long` → `Int`
- Changed field `participantDetectionMethodA`: `[InteractionEvidencePDM!]` → `[ParticipantDetectionMethod!]!`
- Changed field `participantDetectionMethodB`: `[InteractionEvidencePDM!]` → `[ParticipantDetectionMethod!]!`

### `MechanismOfActionRow`

- Changed field `references`: `[Reference!]` → `[Reference!]!`

### `Meta`

- Removed field `dataPrefix: String!`
- Removed field `enableDataReleasePrefix: Boolean!`
- Added field `dataNamespace: String!`
- Changed field `apiVersion`: `APIVersion!` → `Version!`
- Changed field `dataVersion`: `DataVersion!` → `Version!`
- Changed field `product`: `String!` → `Flavor!`

### `Pathway`

- Changed field `name`: `String!` → `String`

### `Pharmacogenomics`

- Changed field `datasourceId`: `String` → `String!`
- Changed field `datatypeId`: `String` → `String!`
- Changed field `evidenceLevel`: `String` → `String!`
- Changed field `literature`: `[String!]` → `[String!]!`
- Changed field `pgxCategory`: `String` → `String!`
- Changed field `variantAnnotation`: `[VariantAnnotation!]` → `[VariantAnnotation!]!`

### `ProteinCodingCoordinates`

- Removed field `count: Long!`
- Removed field `id: String!`
- Removed field `rows: [ProteinCodingCoordinate!]!`
- Added field `alternateAminoAcid: String!`
- Added field `aminoAcidPosition: Int!`
- Added field `datasources: [ProteinCodingCoordinateDatasource!]!`
- Added field `diseases: [Disease!]!`
- Added field `referenceAminoAcid: String!`
- Added field `target: Target`
- Added field `therapeuticAreas: [String!]!`
- Added field `uniprotAccessions: [String!]!`
- Added field `variant: Variant`
- Added field `variantConsequences: [SequenceOntologyTerm!]!`
- Added field `variantEffect: Float`
- Added field `variantFunctionalConsequenceIds: [String!]!`

### `Publication`

- Added field `relevances: [KeywordRelevance!]!`

### `Query`

- Removed field `associationDatasources: [EvidenceSource!]!`
- Removed field `geneOntologyTerms: [GeneOntologyTerm]!(goIds: [String!]!)`
- Removed field `interactionResources: [InteractionResources!]!`
- Removed field `mapIds: MappingResults!(queryTerms: [String!]!, entityNames: [String!])`
- Added field `variants: VariantPage!(variantIds: [String!]!, page: Page!)`
- Changed field `credibleSets`: `CredibleSets!(page: Pagination, studyLocusIds: [String!], studyIds: [String!], variantIds: [String!], studyTypes: [StudyTypeEnum!], regions: [String!])` → `CredibleSetPage!(studyLocusIds: [String!]!, page: Page!)`
- Changed field `diseases`: `[Disease!]!(efoIds: [String!]!)` → `DiseasePage!(efoIds: [String!]!, search: String, sort: [DiseaseSort!]!, page: Page!)`
- Changed field `drugs`: `[Drug!]!(chemblIds: [String!]!)` → `DrugPage!(chemblIds: [String!]!, page: Page!)`
- Changed field `facets`: `SearchFacetsResults!(queryString: String, entityNames: [String!], category: String, page: Pagination)` → `SearchFacetsResults!(queryString: String!, entityNames: [String!], category: String, page: Page!)`
- Changed field `search`: `SearchResults!(queryString: String!, entityNames: [String!], page: Pagination)` → `SearchResults!(queryString: String!, entityNames: [String!], page: Page!)`
- Changed field `studies`: `Studies!(page: Pagination, studyId: String, diseaseIds: [String!], enableIndirect: Boolean)` → `StudyPage!(studyIds: [String!], diseaseIds: [String!], enableIndirect: Boolean!, search: String, filter: StudyFilter, sort: [StudySort!]!, page: Page!)`
- Changed field `study`: `Study(studyId: String)` → `Study(studyId: String!)`
- Changed field `targets`: `[Target!]!(ensemblIds: [String!]!)` → `TargetPage!(ensemblIds: [String!]!, page: Page!)`

### `Reference`

- Changed field `ids`: `[String!]` → `[String!]!`
- Changed field `urls`: `[String!]` → `[String!]!`

### `SafetyLiability`

- Changed field `biosamples`: `[SafetyBiosample!]` → `[SafetyBiosamples!]!`
- Changed field `effects`: `[SafetyEffects!]` → `[SafetyEffects!]!`
- Changed field `studies`: `[SafetyStudy!]` → `[SafetyStudies!]!`

### `SearchFacetsCategory`

- Changed field `total`: `Long!` → `Int!`

### `SearchFacetsResults`

- Changed field `hits`: `[SearchFacetsResult!]!` → `[SearchFacetResult!]!`
- Changed field `total`: `Long!` → `Int!`

### `SearchResult`

- Changed field `keywords`: `[String!]` → `[String!]!`
- Changed field `ngrams`: `[String!]` → `[String!]!`
- Changed field `object`: `EntityUnionType` → `EntityObject`
- Changed field `prefixes`: `[String!]` → `[String!]!`

### `SearchResultAggCategory`

- Changed field `total`: `Long!` → `Int!`

### `SearchResultAggEntity`

- Changed field `total`: `Long!` → `Int!`

### `SearchResultAggs`

- Changed field `total`: `Long!` → `Int!`

### `SearchResults`

- Changed field `total`: `Long!` → `Int!`

### `Similarity`

- Changed field `category`: `String!` → `Category!`
- Changed field `object`: `EntityUnionType` → `SimilarityUnion`

### `Study`

- Removed field `backgroundTraits: [Disease!]`
- Removed field `biosample: Biosample`
- Removed field `sumstatQCValues: [SumStatQC!]`
- Removed field `target: Target`
- Added field `SumstatQCValues: [SumStatQC!]!`
- Added field `publicationAuthorDate: String`
- Changed field `analysisFlags`: `[String!]` → `[String!]!`
- Changed field `cohorts`: `[String!]` → `[String!]!`
- Changed field `credibleSets`: `CredibleSets!(page: Pagination)` → `CredibleSetPage!(page: Page!)`
- Changed field `discoverySamples`: `[Sample!]` → `[Sample!]!`
- Changed field `diseases`: `[Disease!]` → `[Disease!]!`
- Changed field `ldPopulationStructure`: `[LdPopulationStructure!]` → `[LdPopulationStructure!]!`
- Changed field `qualityControls`: `[String!]` → `[String!]!`
- Changed field `replicationSamples`: `[Sample!]` → `[Sample!]!`
- Changed field `studyType`: `StudyTypeEnum` → `StudyType!`
- Changed field `traitFromSourceMappedIds`: `[String!]` → `[String!]!`

### `Target`

- Removed field `drugAndClinicalCandidates: clinicalTargets!`
- Removed field `proteinCodingCoordinates: ProteinCodingCoordinates!(page: Pagination)`
- Changed field `associatedDiseases`: `AssociatedDiseases!(Bs: [String!], enableIndirect: Boolean, datasources: [DatasourceSettingsInput!], includeMeasurements: Boolean, facetFilters: [String!], BFilter: String, orderByScore: String, page: Pagination)` → `DiseaseAssociationPage!(Bs: [String!]!, BFilter: String, facetFilters: [String!]!, includeMeasurements: Boolean!, datasourcePolicyOverrides: [DatasourcePolicyOverride!]!, sort: AssociationSort!, page: Page!)`
- Changed field `associationTimeSeries`: `AssociationTimeSeriesResults!(efoId: String!, isDirect: Boolean!, aggregationTypes: [AggregationTypeEnum!], startYear: Int, endYear: Int, page: Pagination)` → `AssociationTimeseriesPage!(efoId: String!, isDirect: Boolean!, aggregationTypes: [AggregationType!], startYear: Int, endYear: Int, page: Page!)`
- Changed field `baselineExpression`: `BaselineExpression!(page: Pagination)` → `BaselineExpressionPage!(page: Page!)`
- Changed field `canonicalTranscript`: `CanonicalTranscript` → `CanonicalTranscript!`
- Changed field `credibleSets`: `CredibleSets!(page: Pagination)` → `CredibleSetPage!(page: Page!)`
- Changed field `depMapEssentiality`: `[DepMapEssentiality!]` → `DepMapEssentialityPage!(page: Page!)`
- Changed field `evidences`: `Evidences!(efoIds: [String!]!, datasourceIds: [String!], size: Int, cursor: String)` → `EvidencePage!(efoIds: [String!]!, datasourceIds: [Datasource!]!, page: Page!)`
- Changed field `geneOntology`: `[GeneOntology!]!` → `[GeneOntologyAnnotation!]!`
- Changed field `hallmarks`: `Hallmarks` → `Hallmark!`
- Changed field `interactions`: `Interactions(scoreThreshold: Float, sourceDatabase: InteractionSourceEnum, page: Pagination)` → `InteractionPage!(scoreThreshold: Float, sourceDatabase: InteractionSourceDatabase, page: Page!)`
- Changed field `literatureOcurrences`: `Publications!(additionalIds: [String!], startYear: Int, startMonth: Int, endYear: Int, endMonth: Int, cursor: String)` → `PublicationPage!(additionalIds: [String!], startYear: Int, startMonth: Int, endYear: Int, endMonth: Int, page: Page!)`
- Changed field `mousePhenotypes`: `[MousePhenotype!]!` → `MousePhenotypePage!(page: Page!)`
- Changed field `nameSynonyms`: `[LabelAndSource!]!` → `[LabelSource!]!`
- Changed field `obsoleteNames`: `[LabelAndSource!]!` → `[LabelSource!]!`
- Changed field `obsoleteSymbols`: `[LabelAndSource!]!` → `[LabelSource!]!`
- Changed field `pharmacogenomics`: `[Pharmacogenomics!]!` → `PharmacogenomicsPage!(page: Page!)`
- Changed field `prioritisation`: `TargetPrioritisation` → `TargetPrioritisations!`
- Changed field `similarEntities`: `[Similarity!]!(additionalIds: [String!], entityNames: [String!], threshold: Float, size: Int)` → `SimilarEntityPage!(additionalIds: [String!], entityNames: [String!], threshold: Float, page: Page!)`
- Changed field `symbolSynonyms`: `[LabelAndSource!]!` → `[LabelSource!]!`
- Changed field `synonyms`: `[LabelAndSource!]!` → `[LabelSource!]!`

### `TargetClass`

- Changed field `id`: `Long!` → `Int!`

### `TargetPrioritisation`

- Removed field `items: [KeyValuePair!]!`
- Added field `key: String!`
- Added field `value: String!`

### `TranscriptConsequence`

- Changed field `transcriptIndex`: `Long!` → `Int!`
- Changed field `uniprotAccessions`: `[String!]` → `[String!]!`

### `TrialLiterature`

- Removed field `type: String!`
- Added field `referenceType: String!`

### `Variant`

- Removed field `enhancerToGenes: EnhancerToGenes!(page: Pagination)`
- Removed field `evidences: Evidences!(datasourceIds: [String!], size: Int, cursor: String)`
- Removed field `id: String!`
- Added field `enhancerToGene: EnhancerToGenePage!(page: Page!)`
- Added field `variantId: String!`
- Changed field `alleleFrequencies`: `[AlleleFrequency!]` → `[AlleleFrequency!]!`
- Changed field `chromosome`: `String!` → `Chromosome!`
- Changed field `credibleSets`: `CredibleSets!(page: Pagination, studyTypes: [StudyTypeEnum!])` → `CredibleSetPage!(filter: CredibleSetFilter, page: Page!)`
- Changed field `dbXrefs`: `[DbXref!]` → `[DbXref!]!`
- Changed field `pharmacogenomics`: `[Pharmacogenomics!]!` → `PharmacogenomicsPage!(page: Page!)`
- Changed field `proteinCodingCoordinates`: `ProteinCodingCoordinates!(page: Pagination)` → `ProteinCodingCoordinatesPage!(page: Page!)`
- Changed field `rsIds`: `[String!]` → `[String!]!`
- Changed field `transcriptConsequences`: `[TranscriptConsequence!]` → `[TranscriptConsequence!]!(sort: [TranscriptConsequenceSort!]!)`
- Changed field `variantEffect`: `[VariantEffect!]` → `[VariantEffect!]!`

