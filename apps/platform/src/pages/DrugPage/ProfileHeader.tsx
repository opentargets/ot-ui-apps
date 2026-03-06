import {
  usePlatformApi,
  Link,
  ProfileChipList,
  ProfileDescription,
  Field,
  ProfileHeader as BaseProfileHeader,
} from "ui";
import { Fragment } from "react";
import { phaseMap } from "@ot/constants";

import Smiles from "./Smiles";

import DRUG_PROFILE_HEADER_FRAGMENT from "./ProfileHeader.gql";

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

const clinicalPhase = maximumClinicalStage
    ? phaseMap(maximumClinicalStage)
    : "Preclinical";

  return (
    <BaseProfileHeader>
      <>
        <ProfileDescription loading={loading}>{description}</ProfileDescription>
        <Field loading={loading} title="Molecule type">
          {drugType}
        </Field>
        <Field loading={loading} title="Max phase">
          {clinicalPhase}
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
          {synonyms}
        </ProfileChipList>
        <ProfileChipList title="Known trade names" inline loading={loading}>
          {tradeNames}
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
