import * as ReactDOMClient from "react-dom/client";
import TagManager from "react-gtm-module";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

import App from "./App";
import config from "./config";

import "typeface-inter";
import "typeface-roboto-mono";
import "./index.scss";

if (import.meta.env.MODE) {
  loadDevMessages();
  loadErrorMessages();
}

if (config.googleTagManagerID) {
  TagManager.initialize({ gtmId: config.googleTagManagerID });
}

const root = ReactDOMClient.createRoot(document.getElementById("root"));
root.render(<App />);
