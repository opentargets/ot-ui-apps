import React from 'react';
import { Tab } from '@mui/material';
import { Link } from 'react-router-dom';

function RoutingTab({ component, ...props }) {
  return component ? (
    <Tab component={Link} to={props.value} {...props} />
  ) : (
    <Tab component="a" href={props.url} {...props} />
  );
}

export default RoutingTab;
