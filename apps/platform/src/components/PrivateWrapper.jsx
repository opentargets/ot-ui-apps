import React from 'react';
import usePermissions from '../hooks/usePermissions';

function PrivateWrapper (props) {
  const isPartnerPreview = usePermissions();

  if (isPartnerPreview) return <>{props.children}</>;
  else return <></>;
};

export default PrivateWrapper;
