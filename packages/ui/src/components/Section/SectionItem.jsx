import classNames from "classnames";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import { Element } from "react-scroll";

import ErrorBoundary from "../ErrorBoundary";
import SectionError from "./SectionError";
import sectionStyles from "./sectionStyles";
import { createShortName } from "../Summary/utils";
import PartnerLockIcon from "../PartnerLockIcon";
import SectionViewToggle from "./SectionViewToggle";
import { useState } from "react";
import { VIEW } from "../../constants";

function SectionItem({
  definition,
  request,
  renderDescription,
  renderBody,
  tags,
  chipText,
  entity,
  showEmptySection = false,
  showContentLoading = false,
  renderChart,
}) {
  const classes = sectionStyles();
  const { loading, error, data } = request;
  const shortName = createShortName(definition);
  let hasData = false;
  const [selectedView, setSelectedView] = useState(VIEW.table);

  if (data && entity && data[entity]) {
    hasData = definition.hasData(data[entity]);
  }

  if (!hasData && !showEmptySection && !loading) return null;

  function getSelectedView() {
    if (selectedView === VIEW.table) return renderBody(data);
    return renderChart(data);
  }

  return (
    <Grid item xs={12}>
      <section>
        <Element name={definition.id}>
          <Card elevation={0} variant="outlined">
            <ErrorBoundary>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  p: 2,
                }}
              >
                <Box>
                  {" "}
                  <Avatar
                    className={classNames(classes.avatar, classes.avatarHasData, {
                      [classes.avatarError]: error,
                    })}
                  >
                    {shortName}
                  </Avatar>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box>
                    <Box
                      className={classNames(classes.title, classes.titleHasData, {
                        [classes.titleError]: error,
                      })}
                      sx={{ display: "flex", gap: 2, alignItems: "center", h: 1 }}
                    >
                      {definition.isPrivate && <PartnerLockIcon />} {definition.name}
                      {chipText && (
                        <Box sx={{ typography: "caption" }} className={classes.chip}>
                          {chipText}
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <Box>
                    <Typography
                      className={classNames(classes.description, classes.descriptionHasData, {
                        [classes.descriptionError]: error,
                      })}
                      variant="body2"
                    >
                      {renderDescription(data)}
                    </Typography>
                  </Box>
                </Box>
                <Box>{renderChart && <SectionViewToggle viewChange={setSelectedView} />}</Box>
              </Box>
              <Divider />
              <CardContent className={classes.cardContent}>
                {/* {loading && (
                  <LinearProgress
                    aria-describedby="section loading progress bar"
                    aria-busy={loading}
                  />
                )} */}
                {error && <SectionError error={error} />}
                {!loading && hasData && getSelectedView()}
                {!loading && !hasData && showEmptySection && (
                  <div className={classes.noData}> No data available for this {entity}. </div>
                )}
              </CardContent>
            </ErrorBoundary>
          </Card>
        </Element>
      </section>
    </Grid>
  );
}

export default SectionItem;
