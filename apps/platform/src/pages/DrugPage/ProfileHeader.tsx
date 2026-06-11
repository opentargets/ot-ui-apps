import {
  usePlatformApi,
  Link,
  ProfileChipList,
  ProfileDescription,
  Field,
  ProfileHeader as BaseProfileHeader,
} from "ui";
import { Fragment } from "react";
import { clinicalStageCategories } from "@ot/constants";
import { parseSynonyms } from "@ot/utils";

import Smiles from "./Smiles";

import DRUG_PROFILE_HEADER_FRAGMENT from "./ProfileHeader.gql";

// Drug synonym/tradeName sources, in display order: ChEMBL first, then AACT
// (names mined from clinical trials). Sources are shown raw in the chip tooltip.
const DRUG_SYNONYM_SORT_ORDER = ["ChEMBL", "AACT"];

function ProfileHeader({ chemblId }: { chemblId: string }) {
  const { loading, error, data } = usePlatformApi();

  // TODO: Errors!
  if (error) return null;

  const {
    description,
    parentMolecule,
    childMolecules = [],
    synonyms,
    tradeNames,
    drugType,
    maximumClinicalStage
  } = data?.drug || {};

  const maxStage = clinicalStageCategories[maximumClinicalStage] ? clinicalStageCategories[maximumClinicalStage].label : "N/A";

  const parsedSynonyms = parseSynonyms(synonyms || [], { sortOrder: DRUG_SYNONYM_SORT_ORDER });
  const parsedTradeNames = parseSynonyms(tradeNames || [], { sortOrder: DRUG_SYNONYM_SORT_ORDER });

  return (
    <BaseProfileHeader>
      <>
        <ProfileDescription loading={loading}>{description}</ProfileDescription>
        <Field loading={loading} title="Molecule type">
          {drugType}
        </Field>
        <Field loading={loading} title="Max stage">
          {maxStage}
        </Field>
        <Field loading={loading} title="Parent molecule">
          {parentMolecule ? (
            <Link to={`/drug/${parentMolecule.id}`}>{parentMolecule.name}</Link>
          ) : null}
        </Field>
        <Field loading={loading} title="Child molecules">
          {childMolecules.map(({ id, name }, i) => (
            <Fragment key={id}>
              <Link to={`/drug/${id}`}>{name}</Link>
              {i < childMolecules.length - 1 ? ", " : null}
            </Fragment>
          ))}
        </Field>
        <ProfileChipList title="Synonyms" inline loading={loading}>
          {parsedSynonyms}
        </ProfileChipList>
        <ProfileChipList title="Known trade names" inline loading={loading}>
          {parsedTradeNames}
        </ProfileChipList>
      </>
      <Smiles chemblId={chemblId} />
    </BaseProfileHeader>
  );
}

ProfileHeader.fragments = {
  profileHeader: DRUG_PROFILE_HEADER_FRAGMENT,
};

export default ProfileHeader;
