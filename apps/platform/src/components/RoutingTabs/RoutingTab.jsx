import { Tab } from '@material-ui/core';
import { Link } from 'react-router-dom';

function RoutingTab({ component, ...props }) {
  return component ? (
    // TODO: review props spreading
    // eslint-disable-next-line
    <Tab component={Link} to={props.value} {...props} />
  ) : (
    // TODO: review props spreading
    // eslint-disable-next-line
    <Tab component="a" href={props.url} {...props} />
  );
}

export default RoutingTab;
