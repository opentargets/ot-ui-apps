import { makeStyles } from "@mui/styles";

import type { Theme } from "@mui/material";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Engine } from "tsparticles-engine";

import { particlesConfig } from "@ot/constants";

const useStyles = makeStyles((theme: Theme) => ({
  splashContainer: {
    height: "100vh",
  },
  splash: {
    position: "absolute",
    left: 0,
    top: 0,
    backgroundColor: theme.palette.primary.dark,
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
}));

function Splash(): JSX.Element {
  const classes = useStyles();

  const particlesInit = async (main: Engine): Promise<void> => {
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
}

export default Splash;
