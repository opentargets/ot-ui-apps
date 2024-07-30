import React from "react";
import { Helmet } from "react-helmet";

import { Footer, GlobalSearch, Page, NavBar } from "ui";

import { externalLinks, mainMenuItems } from "../constants";

const BasePage = ({ children }) => (
  <Page
    header={<NavBar name="Genetics" items={mainMenuItems} search={<GlobalSearch />} />}
    footer={<Footer externalLinks={externalLinks} />}
  >
    <Helmet defaultTitle="Open Targets Genetics" titleTemplate="%s | Open Targets Genetics" />
    {children}
  </Page>
);

export default BasePage;
