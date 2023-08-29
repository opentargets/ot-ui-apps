import classNames from "classnames";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import { Element } from "react-scroll";

import ErrorBoundary from "../ErrorBoundary";
import Chip from "../Chip";
import SectionError from "./SectionError";
import sectionStyles from "./sectionStyles";
import { createShortName } from "../Summary/utils";
import PartnerLockIcon from "../PartnerLockIcon";

function SectionItem({
  definition,
  request,
  renderDescription,
  renderBody,
  tags,
  chipText,
  entity,
  showEmptySection = false,
}) {
  const classes = sectionStyles();
  const { loading, error, data } = request;
  const shortName = createShortName(definition);
  let hasData = false;

  if (data && entity && data[entity]) {
    hasData = definition.hasData(data[entity]);
  }

  if (!hasData && !showEmptySection) return null;

  return (
    <Grid item xs={12}>
      <Element name={definition.id}>
        <Card elevation={0}>
          <ErrorBoundary>
            <CardHeader
              classes={{
                root: classes.cardHeader,
                action: classes.cardHeaderAction,
              }}
              avatar={
                <Avatar
                  className={classNames(classes.avatar, classes.avatarHasData, {
                    [classes.avatarError]: error,
                  })}
                >
                  {shortName}
                </Avatar>
              }
              title={
                <Grid container justifyContent="space-between">
                  <Typography
                    className={classNames(classes.title, classes.titleHasData, {
                      [classes.titleError]: error,
                    })}
                  >
                    {definition.name}{" "}
                    {definition.isPrivate ? <PartnerLockIcon /> : null}
                  </Typography>
                  {chipText ? (
                    <Chip label={chipText} className={classes.chip} />
                  ) : null}
                </Grid>
              }
              subheader={
                <Typography
                  className={classNames(
                    classes.description,
                    classes.descriptionHasData,
                    {
                      [classes.descriptionError]: error,
                    }
                  )}
                >
                  {renderDescription(data)}
                </Typography>
              }
              action={tags}
            />
            {loading ? (
              <LinearProgress />
            ) : (
              <Box className={classes.loadingPlaceholder} />
            )}
            {error && <SectionError error={error} />}
            {!loading && hasData && (
              <CardContent className={classes.cardContent}>
                {renderBody(data)}
              </CardContent>
            )}
            {!loading && !hasData && showEmptySection && (
              <CardContent className={classes.cardContent}>
                <div className={classes.noData}>
                  {" "}
                  No data available for this {entity}.{" "}
                </div>
              </CardContent>
            )}
          </ErrorBoundary>
        </Card>
      </Element>
    </Grid>
  );
}

export default SectionItem;
