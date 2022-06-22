import React from 'react';
import { withStyles } from '@material-ui/core';

import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

import { particlesConfig } from '../../constants';

const styles = (theme) => ({
  splashContainer: {
    height: '100vh',
  },
  splash: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: theme.palette.primary.main,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
});

const Splash = ({ classes }) => {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div className={classes.splashContainer}>
      <Particles
        className={classes.splash}
        id="tsparticles"
        init={particlesInit}
        options={particlesConfig}
      />
    </div>
  );
};

export default withStyles(styles)(Splash);
