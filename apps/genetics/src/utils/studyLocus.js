import { generateComparator } from './common';

export function filterGwasColocalisation(data, state) {
  return data
    .filter(d => d.log2h4h3 >= state.log2h4h3SliderValue)
    .filter(d => d.h4 >= state.h4SliderValue)
    .sort(log2h4h3Comparator)
    .reverse();
}

export function filterQtlColocalisation(data, state) {
  return data
    .filter(d => d.log2h4h3 >= state.log2h4h3SliderValue)
    .filter(d => d.h4 >= state.h4SliderValue)
    .sort(log2h4h3Comparator)
    .reverse();
}

export function filterPageCredibleSet(data, credSet95Value) {
  return data
    .map(flattenPosition)
    .filter(d => (credSet95Value === '95' ? d.is95CredibleSet : true));
}

export function buildCredibleGwasColocalisation(
  gwasColocalisationFiltered,
  data,
  credSet95Value
) {
  return gwasColocalisationFiltered.map(({ study, indexVariant, ...rest }) => ({
    key: `gwasCredibleSet__${study.studyId}__${indexVariant.id}`,
    study,
    indexVariant,
    credibleSet: buildCredibleSet(data, study, indexVariant, credSet95Value),
    ...rest,
  }));
}

export function buildCredibleQtlColocalisation(
  qtlColocalisationFiltered,
  data,
  credSet95Value
) {
  return qtlColocalisationFiltered.map(
    ({ qtlStudyName, phenotypeId, tissue, indexVariant, ...rest }) => {
      const key = `qtlCredibleSet__${qtlStudyName}__${phenotypeId}__${
        tissue.id
      }__${indexVariant.id}`;
      return {
        key,
        qtlStudyName,
        phenotypeId,
        tissue,
        indexVariant,
        credibleSet: data[key]
          ? data[key]
              .map(flattenPosition)
              .filter(d => (credSet95Value === '95' ? d.is95CredibleSet : true))
          : [],
        ...rest,
      };
    }
  );
}

export function filterCredibleSets(data, credibleSetIntersectionKeys) {
  return data.filter(d => credibleSetIntersectionKeys.indexOf(d.key) >= 0);
}

export function getCheckedCredibleSets(credibleSetsChecked) {
  return credibleSetsChecked.map(d =>
    d.credibleSet.map(({ tagVariant, ...rest }) => ({
      statsFields: rest,
      ...tagVariant,
    }))
  );
}

export function getVariantByCredibleSetsIntersection(variantsByCredibleSets) {
  let variantIdsInCredibleSetsIntersection = variantsByCredibleSets.reduce(
    (acc, vs, i) => {
      vs.forEach(v => {
        const { statsFields, ...variantFields } = v;
        if (acc[v.id]) {
          acc[v.id].posteriorProbabilityProd *=
            statsFields.posteriorProbability;
          acc[v.id].posteriorProbabilityMax = Math.max(
            acc[v.id].posteriorProbabilityMax,
            statsFields.posteriorProbability
          );
          acc[v.id].appearsInCount += 1;
        } else {
          acc[v.id] = {
            ...variantFields,
            posteriorProbabilityMax: statsFields.posteriorProbability,
            posteriorProbabilityProd: statsFields.posteriorProbability,
            appearsInCount: 1,
          };
        }
      });
      return acc;
    },
    {}
  );

  let variantsByCredibleSetsIntersection = Object.values(
    variantIdsInCredibleSetsIntersection
  )
    .filter(v => v.appearsInCount === variantsByCredibleSets.length)
    .map(v => ({
      ...v,
      posteriorProbability: v.posteriorProbabilityProd, // aliased for colouring on plot
    }));
  return variantsByCredibleSetsIntersection;
}

const log2h4h3Comparator = generateComparator(d => d.log2h4h3);

const buildCredibleSet = (data, study, indexVariant, credSet95Value) => {
  const selection =
    data[`gwasCredibleSet__${study.studyId}__${indexVariant.id}`];
  if (selection === undefined) return [];
  return selection
    .map(flattenPosition)
    .filter(d => (credSet95Value === '95' ? d.is95CredibleSet : true));
};

const flattenPosition = ({ tagVariant, postProb, is95, is99, ...rest }) => {
  return {
    tagVariant,
    position: tagVariant.position,
    posteriorProbability: postProb,
    is95CredibleSet: is95,
    is99CredibleSet: is99,
    ...rest,
  };
};
