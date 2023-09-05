import { Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDna,
  faPrescriptionBottleAlt,
  faStethoscope,
} from "@fortawesome/free-solid-svg-icons";

function Search({ data }) {
  return <Typography>Search for: {data.name}</Typography>;
}

function TopHitDisease({ data }) {
  return (
    <>
      <Typography variant="h4" color="primary">
        <FontAwesomeIcon icon={faStethoscope} size="xs" /> {data.name}
      </Typography>
      <Typography variant="caption" display="block" noWrap>
        {data.description}
      </Typography>
    </>
  );
}

function TopHitDrug({ data }) {
  return (
    <>
      <Typography variant="h4" color="primary">
        <FontAwesomeIcon icon={faPrescriptionBottleAlt} size="xs" /> {data.name}
      </Typography>
      {data.mechanismsOfAction ? (
        <Typography variant="caption" display="block" noWrap>
          {data.mechanismsOfAction.rows
            .map((row) => row.mechanismOfAction)
            .join(", ")}
        </Typography>
      ) : null}
    </>
  );
}

function TopHitTarget({ data }) {
  return (
    <>
      <Typography variant="h4" color="primary">
        <FontAwesomeIcon icon={faDna} size="xs" /> {data.approvedSymbol}
      </Typography>{" "}
      <Typography display="block" noWrap>
        {data.approvedName}
      </Typography>
      <Typography variant="caption" display="block" noWrap>
        {data.functionDescriptions[0]}
      </Typography>
    </>
  );
}

function Disease({ data }) {
  return (
    <Typography variant="subtitle2" display="inline">
      {data.name}
    </Typography>
  );
}

function Drug({ data }) {
  return (
    <Typography variant="subtitle2" display="inline">
      {data.name}
    </Typography>
  );
}

function Target({ data }) {
  return (
    <>
      <Typography variant="subtitle2" display="inline">
        {data.approvedSymbol}
      </Typography>{" "}
      <Typography variant="caption" color="textSecondary" display="inline">
        {data.approvedName}
      </Typography>
    </>
  );
}

const optionTypes = {
  search: { any: Search },
  topHit: { disease: TopHitDisease, drug: TopHitDrug, target: TopHitTarget },
  normal: { disease: Disease, drug: Drug, target: Target },
};

function Option({ data }) {
  const OptionType = optionTypes[data.type][data.entity];

  return <OptionType data={data} />;
}

export default Option;
