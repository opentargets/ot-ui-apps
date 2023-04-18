import React from 'react';
import { Tab } from '@material-ui/core';
import { Link } from 'react-router-dom';

function RoutingTab({ component, icon, ...props }) {
  return component ? (
    <Tab
      icon={icon}
      iconPosition="start"
      component={Link}
      to={props.value}
      {...props}
    />
  ) : (
    <Tab icon={icon} component="a" href={props.url} {...props} />
  );
}

export default RoutingTab;
