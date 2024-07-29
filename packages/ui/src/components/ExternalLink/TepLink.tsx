import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { makeStyles } from "@mui/styles";
import { Tooltip } from "@mui/material";
import { useQuery } from "@apollo/client";

import Link from "../Link";

import TEP_LINK_QUERY from "./TepLinkQuery.gql";

const useStyles = makeStyles(theme => ({
  helpIcon: {
    fontSize: "10px",
  },
  tepTooltip: {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.grey[300]}`,
    color: theme.palette.text.primary,
  },
}));

type TepLinkProps = {
  ensgId: string;
};

function TepLink({ ensgId }: TepLinkProps) {
  const classes = useStyles();

  const { loading, data } = useQuery(TEP_LINK_QUERY, {
    variables: { ensgId },
  });

  if (loading) return null;

  if (!data.target?.tep) return null;

  const {
    target: {
      tep: { name, uri },
    },
  } = data;

  return (
    <span>
      Target Enabling Package
      <Tooltip
        classes={{ tooltip: classes.tepTooltip }}
        title={
          <>
            <Link external to="https://www.thesgc.org">
              TEPs
            </Link>{" "}
            provide a critical mass of reagents and knowledge on a protein target to allow rapid
            biochemical and chemical exploration and characterisation of proteins with genetic
            linkage to key disease areas.
          </>
        }
        placement="top"
      >
        <sup>
          <FontAwesomeIcon icon={faCircleQuestion} className={classes.helpIcon} />
        </sup>
      </Tooltip>
      :{" "}
      <Link external to={uri}>
        {name}
      </Link>
    </span>
  );
}

export default TepLink;
