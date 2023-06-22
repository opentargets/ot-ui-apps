import { Fragment } from 'react';
import { Box } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faExclamationCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

import {
  ChipList,
  Description,
  Field,
  ProfileHeader as BaseProfileHeader,
} from '../../components/ProfileHeader';
import Link from '../../components/Link';
import Smiles from './Smiles';
import usePlatformApi from '../../hooks/usePlatformApi';

import DRUG_PROFILE_HEADER_FRAGMENT from './ProfileHeader.gql';
import { phaseMap } from '../../constants';

function ProfileHeader({ chemblId }) {
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
    yearOfFirstApproval,
    maximumClinicalTrialPhase,
    isApproved,
    hasBeenWithdrawn,
    blackBoxWarning,
  } = data?.drug || {};

  const clinicalPhase = maximumClinicalTrialPhase
    ? phaseMap(maximumClinicalTrialPhase)
    : 'Preclinical';

  return (
    <BaseProfileHeader>
      <>
        <Description loading={loading}>{description}</Description>
        <Field loading={loading} title="Molecule type">
          {drugType}
        </Field>
        <Field loading={loading} title="First approval">
          {yearOfFirstApproval || 'N/A'}
        </Field>
        <Field loading={loading} title="Max phase">
          {clinicalPhase}
        </Field>
        <Field loading={loading} title="Status">
          {isApproved ? (
            <Box component="span" mr={2}>
              <FontAwesomeIcon icon={faCheckCircle} /> Approved
            </Box>
          ) : null}
          {hasBeenWithdrawn ? (
            <Box component="span" mr={2}>
              <FontAwesomeIcon icon={faTimesCircle} /> Withdrawn
            </Box>
          ) : null}
          {blackBoxWarning ? (
            <Box component="span" mr={2}>
              <FontAwesomeIcon icon={faExclamationCircle} /> Black box warning
            </Box>
          ) : null}
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
              {i < childMolecules.length - 1 ? ', ' : null}
            </Fragment>
          ))}
        </Field>
        <ChipList title="Synonyms" inline loading={loading}>
          {synonyms}
        </ChipList>
        <ChipList title="Known trade names" inline loading={loading}>
          {tradeNames}
        </ChipList>
      </>
      <Smiles chemblId={chemblId} />
    </BaseProfileHeader>
  );
}

ProfileHeader.fragments = {
  profileHeader: DRUG_PROFILE_HEADER_FRAGMENT,
};

export default ProfileHeader;
