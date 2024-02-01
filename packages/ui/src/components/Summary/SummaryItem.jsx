import classNames from "classnames";
import {
  Avatar,
  Card,
  CardHeader,
  Grid,
  LinearProgress,
  Skeleton,
  Typography,
} from "@mui/material";
import { scroller } from "react-scroll";

import summaryStyles from "./summaryStyles";
import { createShortName } from "./utils";
import PartnerLockIcon from "../PartnerLockIcon";

function SummaryItem({ definition, request, renderSummary, subText }) {
  const classes = summaryStyles();
  const { loading, error, data } = request;
  const shortName = createShortName(definition);
  const hasData = !loading && !error && data && definition.hasData(data);

  const handleClickSection = () => {
    scroller.scrollTo(definition.id, {
      duration: 500,
      delay: 100,
      smooth: true,
    });
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
      <Card
        className={classNames(classes.card, {
          [classes.cardHasData]: hasData,
          [classes.cardError]: error,
        })}
        onClick={handleClickSection}
        elevation={0}
        variant="outlined"
      >
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <Avatar
              className={classNames(classes.avatar, {
                [classes.avatarHasData]: hasData,
                [classes.avatarError]: error,
              })}
            >
              {shortName}
            </Avatar>
          }
          title={
            <>
              <Typography
                className={classNames(classes.title, {
                  [classes.titleHasData]: hasData,
                  [classes.titleError]: error,
                })}
                variant="body2"
              >
                {loading && <Skeleton width={100} />}
                {!loading && definition.name} {definition.isPrivate ? <PartnerLockIcon /> : null}
              </Typography>
              {subText ? (
                <Typography
                  className={classNames(classes.subtitle, {
                    [classes.subtitleHasData]: hasData,
                  })}
                  variant="caption"
                >
                  {subText}
                </Typography>
              ) : null}

              <Typography
                className={classNames(classes.subheader, {
                  [classes.subheaderHasData]: hasData,
                  [classes.subheaderError]: error,
                })}
              >
                {error && "An error occurred while loading this section"}
                {/* {!loading && data && !hasData && "no data"}
                {!loading && data && hasData && renderSummary(data)} */}
              </Typography>
            </>
          }
        />
        {loading && <LinearProgress />}
      </Card>
    </Grid>
  );
}

export default SummaryItem;
