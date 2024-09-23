import { CardContent, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";

import { Link, DisplayVariantId } from "ui";

function VariantDetail({ data }) {
  return (
    <CardContent>
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
      <Typography variant="subtitle1">
        Ensembl
      </Typography>
      <Typography variant="body2">
        {/* !!! get rsid from dbxref - always present? */}
      </Typography>
      <Typography variant="subtitle1">
        GRCh38
      </Typography>
      <Typography variant="body2">
        {data.chromosome}:{data.position}
      </Typography>
      {/* !!!! include expandable alt and ref alleles here similar to page metadata */}
    </CardContent>
  );
}

export default VariantDetail;
