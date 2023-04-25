import { Tab } from '@material-ui/core';
import { Link } from 'react-router-dom';
import usePermissions from '../../hooks/usePermissions';

function PrivateRoutingTab({ component, ...props }) {
  const { isPartnerPreview } = usePermissions();
  if (!isPartnerPreview) return null;
  return component ? (
    <Tab component={Link} to={props.value} {...props} />
  ) : (
    <Tab component="a" href={props.url} {...props} />
  );
}

export default PrivateRoutingTab;
