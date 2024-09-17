import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import { Link, Tooltip } from "ui";

function InfoTooltip() {
  return (
    <Tooltip
      title={
        <Box sx={{ p: 1 }}>
          <b>How Do Facet Filters Work?</b>
          <ul style={{ paddingLeft: "15px" }}>
            <li>Filters across categories use AND</li>
            <li>Filters within a category use OR</li>
          </ul>
          <ReadMoreLink />
        </Box>
      }
      placement="bottom"
      style=""
    >
      <Box sx={{ display: "flex", alignItems: "center", height: 1 }}>
        <FontAwesomeIcon icon={faCircleInfo} size="lg" />{" "}
      </Box>
    </Tooltip>
  );
}

function ReadMoreLink() {
  return (
    <Box sx={{ w: 1, display: "flex", justifyContent: "end" }}>
      <Link
        to="https://platform-docs.opentargets.org/web-interface/associations-on-the-fly#filtering-functionality"
        external
        footer={false}
      >
        Read more details here.
      </Link>
    </Box>
  );
}
export default InfoTooltip;
