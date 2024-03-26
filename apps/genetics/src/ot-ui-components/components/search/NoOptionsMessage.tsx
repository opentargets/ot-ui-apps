import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { GroupBase, NoticeProps } from "react-select";

const useStyles = makeStyles(theme => {
  return {
    noOptionsMessage: {
      padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    },
  };
});

const NoOptionsMessage = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>({
  innerProps,
  children,
}: Partial<NoticeProps<Option, IsMulti, Group>>) => {
  const classes = useStyles();
  // Parse out innerProps properties that are incompatible with Typography
  const { color, ref, ...restProps } = innerProps || {};
  return (
    <Typography
      color="textSecondary"
      className={classes.noOptionsMessage}
      {...restProps}
      // `react-select` NoticeProps innerProps is a `div` element, but `Typography` expects a `span` element
      ref={ref as React.RefObject<HTMLSpanElement>}
    >
      {children}
    </Typography>
  );
};

export default NoOptionsMessage;
