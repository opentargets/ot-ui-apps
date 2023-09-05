import { makeStyles } from "@mui/styles";
import { ReactNode } from "react";

const useStyles = makeStyles((theme) => ({
  mainIcon: {
    width: "1em",
    display: "flex",
  },
}));

function BrokenSearchIcon(): ReactNode {
  const classes = useStyles();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="Layer_2"
      viewBox="0 0 423.4 832"
      className={classes.mainIcon}
    >
      <defs>
        <style>
          {
            ".cls-1{fill:none;stroke:#3489ca;stroke-linecap:round;stroke-miterlimit:10;stroke-width:23px}"
          }
        </style>
      </defs>
      <g id="Layer_4">
        <path
          d="M220.5 14.5c0 36-15 72-68 108-51.45 34.95-69 68-68 107 .59 23.01 3 62 68 110 55.18 40.75 69.22 80.01 70 109 1 37-16.35 67.58-70.5 112.5-64.5 53.5-69.5 82.5-67.5 118.5 2.54 45.65 28.75 74.39 69.5 103.5 17.5 12.5 25.5 17.5 43.5 35.5"
          className="cls-1"
        />
        <path
          d="M109.5 820.5c16-15 12.08-11.88 44-37 25.21-19.84 39.05-33.24 51-54 9.03-15.69 23.08-40.1 15-63-8.45-23.93-36.7-33.83-60-42-53.1-18.62-88.77-14.69-101-35-8.2-13.62-4.97-33.16 3-44 18.37-24.97 66.03-13.49 81-9 30 9 38.87 18.02 81 27 20.57 4.39 47.21 10.06 75 1 43.54-14.2 64.5-56.29 71-71M82.5 11.5c1 43 18.99 68.32 24 76 15 23 32 31 46 35 10.96 3.13 18 5 36 5 11.05 0 30-4 30-4 18-3 30 6 30 20 0 18-9 29-24 36-24.04 11.22-37 9-57 8-44.89-2.24-71.32-18.78-99-34-20-11-37 0-45 12-6.78 10.17-7.83 17.99 7 56 16 41 14.2 35.51 22 55 8 20 13 47 1 57-5.7 4.75-26 13-42-20M34.35 165.21l47.07 42.17M184.85 191.11l18.02 87.77M36.77 224.64l43.58 22.79M67.99 302.74l31.76-6.82M72.55 559.46l36.05 24M113.04 539.09l19.12 30.36M221.3 573.33l-9.46 42.26M275.51 579.96l12.35 63.71M339.76 436.41l-58.15 28.81M323.25 565.44l42.97 45.62M52.92 417.82l55.63 28.86M357.57 383.62l54.33 31.25M358.89 524.86l26.19 4.69M288.81 329.57l24.35-10.74M242.66 170.5l70.51 66.68M247.09 127.94l81.93-19.43M90.53 32.02h123.14M106.9 72.02h87.3M85.23 658.3h120.54M93.53 695.02h123.14M109.9 735.02h87.3"
          className="cls-1"
        />
      </g>
    </svg>
  );
}

export default BrokenSearchIcon;
