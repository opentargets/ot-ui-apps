import { gql } from "@apollo/client";

export function createSummaryFragment(sections, entity, fragmentName) {
  const sectionFragments = [];
  const sectionFragmentNames = [];
  const fragmentNameStr = fragmentName || `${entity}ProfileSummaryFragment`;

  sections.forEach(Summary => {
    if (!Summary.fragments) return;

    const sectionFragmentName = Object.keys(Summary.fragments)[0];

    sectionFragmentNames.push(sectionFragmentName);
    sectionFragments.push(Summary.fragments[sectionFragmentName]);
  });

  // const idLookup = {
  //   Gwas: "studyId",
  //   credibleSet: "studyLocusId",
  // };

  return gql`
    fragment ${fragmentNameStr} on ${entity} {
      ${
        sectionFragmentNames.length ? sectionFragmentNames.map(sfn => `...${sfn}`).join("\n") : "id"
      }
    }
    ${sectionFragments.reduce(
      (acc, fragment) => gql`
        ${acc}
        ${fragment}
      `,
      ""
    )}
  `;

  // return gql`
  //   fragment ${fragmentNameStr} on ${entity} {
  //     ${
  //       sectionFragmentNames.length
  //         ? sectionFragmentNames.map(sfn => `...${sfn}`).join("\n")
  //         : idLookup[entity] || "id"
  //     }
  //   }
  //   ${sectionFragments.reduce(
  //     (acc, fragment) => gql`
  //       ${acc}
  //       ${fragment}
  //     `,
  //     ""
  //   )}
  // `;
}

export function createShortName(definition) {
  return (
    definition.shortName ||
    definition.name
      .split(" ")
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join("")
  );
}
