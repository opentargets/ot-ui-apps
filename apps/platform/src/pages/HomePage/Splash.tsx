import { makeStyles } from "@mui/styles";

import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Engine } from "tsparticles-engine";
import { Theme } from "@mui/material";

import { particlesConfig } from "@ot/constants";
import { useRef, useState } from "react";

import html2canvas from "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.esm.js";

const useStyles = makeStyles((theme: Theme) => ({
  splashContainer: {
    height: "100vh",
  },
  splash: {
    position: "absolute",
    left: 0,
    top: 0,
    // backgroundColor: theme.palette.primary.dark,
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

  const [background, setBackground] = useState("#1A4565");

  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  const takeScreenshot = () => {
    if (!containerRef.current) return;

    try {
      setLoading(true);

      // Get the canvas element from the container
      const canvas = containerRef.current.querySelector("canvas");

      if (!canvas) {
        console.error("Canvas element not found");
        setLoading(false);
        return;
      }

      // Create a new canvas with proper background
      const newCanvas = document.createElement("canvas");
      newCanvas.width = canvas.width;
      newCanvas.height = canvas.height;

      const ctx = newCanvas.getContext("2d");

      // Draw background
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

      // Draw original canvas content on top
      ctx.drawImage(canvas, 0, 0);

      // Convert the new canvas to data URL
      const dataUrl = newCanvas.toDataURL("image/png");

      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "particle-screenshot.png";
      link.click();
    } catch (error) {
      console.error("Error taking screenshot:", error);
    } finally {
      setLoading(false);
    }
  };

  const onChangeInput = event => {
    event.preventDefault();
    setBackground(event.target.value);
  };

  return (
    <div className={classes.splashContainer}>
      <button onClick={takeScreenshot} disabled={loading}>
        Download
      </button>
      <input onChange={onChangeInput} type="color" value={background} />
      <div ref={containerRef}>
        <Particles
          canvasClassName="home_background"
          className={classes.splash}
          id="tsparticles"
          init={particlesInit}
          options={{ ...particlesConfig, background: { color: { value: background }, opacity: 1 } }}
        />
      </div>
    </div>
  );
}

export default Splash;
