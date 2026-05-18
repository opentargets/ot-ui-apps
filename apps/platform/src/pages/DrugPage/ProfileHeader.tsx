import {
  usePlatformApi,
  Link,
  ProfileChipList,
  ProfileDescription,
  Field,
  ProfileHeader as BaseProfileHeader,
} from "ui";
import { Paper } from "@mui/material";
import { Fragment, useState } from "react";
import { clinicalStageCategories } from "@ot/constants";

import DRUG_PROFILE_HEADER_FRAGMENT from "./ProfileHeader.gql";

function ProfileHeader({ chemblId }: { chemblId: string }) {
  const { loading, error, data } = usePlatformApi();
  const [imgState, setImgState] = useState<'loading' | 'loaded' | 'error'>('loading');

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
          {synonyms}
        </ProfileChipList>
        <ProfileChipList title="Known trade names" inline loading={loading}>
          {tradeNames}
        </ProfileChipList>
      </>
      <Paper
        variant="outlined"
        elevation={0}
        sx={{
          width: '340px',
          height: '340px',
          marginLeft: 'auto',
          visibility: imgState === 'loaded' ? 'visible' : 'hidden',
          display: imgState === 'error' ? 'none' : 'block',
        }}
      >
        <img 
          src={`https://www.ebi.ac.uk/chembl/api/data/image/${chemblId}.svg`}
          style={{width: "100%", height: "100%" }}
          onLoad={() => setImgState('loaded')}
          onError={() => setImgState('error')}
        />
      </Paper>
    </BaseProfileHeader>
  );
}

ProfileHeader.fragments = {
  profileHeader: DRUG_PROFILE_HEADER_FRAGMENT,
};

export default ProfileHeader;
