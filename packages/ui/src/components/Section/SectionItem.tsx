import classNames from "classnames";
import { Avatar, Box, Card, CardContent, Divider, Grid, Skeleton, Typography } from "@mui/material";
import { Element } from "react-scroll";

import ErrorBoundary from "../ErrorBoundary";
import SectionError from "./SectionError";
import sectionStyles from "./sectionStyles";
import { createShortName } from "../Summary/utils";
import PartnerLockIcon from "../PartnerLockIcon";
import SectionViewToggle from "./SectionViewToggle";
import { ReactNode, useEffect, useState } from "react";
import { VIEW } from "@ot/constants";
import { SummaryLoader } from "../PublicationsDrawer";

type definitionType = {
  id: string;
  name: string;
  shortName?: string;
  hasData: any;
  isPrivate?: boolean;
};

type SectionItemProps = {
  definition: definitionType;
  request: Record<string, unknown>;
  renderDescription: () => ReactNode;
  renderChart?: () => ReactNode;
  renderBody: () => ReactNode;
  // check tags
  tags: string[];
  chipText: string;
  entity: string;
  showEmptySection: boolean;
  // check use
  showContentLoading: boolean;
  loadingMessage: string;
  defaultView: string;
};

function SectionItem({
  definition,
  request,
  renderDescription,
  renderBody,
  chipText,
  entity,
  showEmptySection = false,
  showContentLoading = false,
  loadingMessage = "Loading data. This may take some time...",
  renderChart,
  defaultView = VIEW.table,
}: SectionItemProps): ReactNode {
  const classes = sectionStyles();
  const { loading, error, data } = request;
  const shortName = createShortName(definition);
  let hasData = false;
  const [selectedView, setSelectedView] = useState(defaultView);
  const [showDelayLoadingMessage, setShowDelayLoadingMessage] = useState(false);

  // TODO: refactor to avoid re-renders

  // useEffect(() => {
  //   const delayLoaderTimer = setTimeout(() => setShowDelayLoadingMessage(true), 5000);

  //   return () => {
  //     clearTimeout(delayLoaderTimer);
  //   };
  // }, []);

  if (data && entity && data[entity]) {
    hasData = definition.hasData(data[entity]);
  }

  if (!hasData && !showEmptySection && !loading) return null;

  function getSelectedView(): ReactNode {
    if (error) return <SectionError error={error} />;
    if (showContentLoading && loading)
      return (
        <>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {showDelayLoadingMessage && loadingMessage}
          </Box>
          <Skeleton sx={{ height: 390 }} variant="rectangular" />
        </>
      );
    if (selectedView === VIEW.table) return renderBody();
    if (selectedView === VIEW.chart && renderChart) return renderChart();
    // if (!loading && !hasData && showEmptySection)
    return <div className={classes.noData}> No data available for this {entity}. </div>;
  }

  return (
    <Grid item xs={12}>
      <section>
        <Element name={definition.id}>
          <Card elevation={0} variant="outlined">
            <ErrorBoundary>
              <Box className={classes.cardHeaderContainer}>
                {/* AVATAR */}
                <Avatar
                  className={classNames(classes.avatar, classes.avatarHasData, {
                    [classes.avatarError]: error,
                  })}
                >
                  {shortName}
                </Avatar>
                {/* HEADER, SUB-HEADER & CHIP */}
                <Box sx={{ flex: 1 }}>
                  <div
                    className={classNames(classes.title, classes.titleHasData, {
                      [classes.titleError]: error,
                    })}
                  >
                    {definition.name}
                    {definition.isPrivate && <PartnerLockIcon />}
                    {chipText && (
                      <Box sx={{ typography: "caption" }} className={classes.chip}>
                        {chipText}
                      </Box>
                    )}
                  </div>
                  <Typography
                    className={classNames(classes.description, classes.descriptionHasData, {
                      [classes.descriptionError]: error,
                    })}
                    variant="body2"
                  >
                    {renderDescription()}
                  </Typography>
                </Box>
                {/* CHART VIEW SWITCH */}
                <Box>
                  {renderChart && (
                    <SectionViewToggle defaultValue={defaultView} viewChange={setSelectedView} />
                  )}
                </Box>
              </Box>
              <Divider />
              <CardContent className={classes.cardContent}>{getSelectedView()}</CardContent>
            </ErrorBoundary>
          </Card>
        </Element>
      </section>
    </Grid>
  );
}

export default SectionItem;
