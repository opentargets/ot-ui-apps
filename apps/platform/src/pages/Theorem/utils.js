import TARGET_PROFILE_QUERY from './TargetProfile.gql';
import EVIDENCE_PROFILE_QUERY from './EvidenceProfile.gql';

export const INIT_BLOCKS_STATE = [
  {
    id: 'target_ENSG00000169083',
    entity: 'target',
    inputs: ['ENSG00000169083'],
    sections: ['safety', 'bibliography'],
  },
  {
    id: 'target_ENSG00000196230',
    entity: 'target',
    inputs: ['ENSG00000196230'],
    sections: ['geneOntology', 'subcellularLocation'],
  },
  {
    id: 'evidence_ENSG00000196230_Orphanet_183506',
    entity: 'evidence',
    inputs: ['ENSG00000196230', 'Orphanet_183506'],
    sections: ['gene2phenotype', 'chembl'],
  },
  {
    id: 'target_ENSG00000087085',
    entity: 'target',
    inputs: ['ENSG00000087085'],
    sections: ['mousePhenotypes', 'bibliography'],
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
    case ENTITIES.EVIDENCE:
      return {
        query: EVIDENCE_PROFILE_QUERY,
        variables: { ensemblId: inputs[0], efoId: inputs[1] },
      };
    default:
      return 'Error';
  }
}
