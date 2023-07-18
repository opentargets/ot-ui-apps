import TARGET_PROFILE_QUERY from './TargetProfile.gql';
import EVIDENCE_PROFILE_QUERY from './EvidenceProfile.gql';
import DRUG_PROFILE_QUERY from './DrugProfile.gql';
import DISEASE_PROFILE_QUERY from './DiseaseProfile.gql';

export const INIT_BLOCKS_STATE = [
  {
    id: 'target_ENSG00000196230',
    entity: 'target',
    inputs: ['ENSG00000196230'],
    sections: ['geneOntology'],
  },
  {
    id: 'disease_EFO_0000756',
    entity: 'disease',
    inputs: ['EFO_0000756'],
    sections: ['phenotypes'],
  },
  {
    id: 'drug_CHEMBL2010601',
    entity: 'drug',
    inputs: ['CHEMBL2010601'],
    sections: ['indications'],
  },
  {
    id: 'evidence_ENSG00000196230_Orphanet_183506',
    entity: 'evidence',
    inputs: ['ENSG00000196230', 'Orphanet_183506'],
    sections: ['gene2phenotype', 'chembl'],
  },
];

export const ENTITIES = {
  TARGET: 'target',
  EVIDENCE: 'evidence',
  DISEASE: 'disease',
  DRUG: 'drug',
};

export function getBlockName({ entity, data }) {
  switch (entity) {
    case ENTITIES.TARGET:
      return data.target.approvedSymbol;
    case ENTITIES.DISEASE:
      return data.disease.name;
    case ENTITIES.DRUG:
      return data.drug.name;
    case ENTITIES.EVIDENCE:
      return `${data.target.approvedSymbol} - ${data.disease.name}`;
    default:
      return 'Error';
  }
}

export function getBlockProfileQuery({ entity, inputs }) {
  switch (entity) {
    case ENTITIES.TARGET:
      return {
        query: TARGET_PROFILE_QUERY,
        variables: { ensemblId: inputs[0] },
      };
    case ENTITIES.DISEASE:
      return {
        query: DISEASE_PROFILE_QUERY,
        variables: { efoId: inputs[0] },
      };
    case ENTITIES.DRUG:
      return {
        query: DRUG_PROFILE_QUERY,
        variables: { chemblId: inputs[0] },
      };
    case ENTITIES.EVIDENCE:
      return {
        query: EVIDENCE_PROFILE_QUERY,
        variables: { ensemblId: inputs[0], efoId: inputs[1] },
      };
    default:
      return 'Error';
  }
}
