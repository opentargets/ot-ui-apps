import { CardContent, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";

import { Link, DisplayVariantId } from "ui";

function VariantDetail({ data }) {
  return (
    <CardContent

    >
      <Typography color="primary" variant="h5"
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        <Link to={`/variant/${data.id}`}>
          <DisplayVariantId
            variantId={data.id}
            referenceAllele={data.referenceAllele}
            alternateAllele={data.alternateAllele}
            expand={false}
          />
        </Link>
      </Typography>
      <Typography color="primary">
        <FontAwesomeIcon icon={faMapPin} /> Variant
      </Typography>
    </CardContent>
  );
}

export default VariantDetail;
