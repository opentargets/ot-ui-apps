import { makeStyles, styled } from "@mui/styles";
import { Typography, Chip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";

import { clearRecentItem, commaSeparate } from "./utils/searchUtils";
import ArrowTurnDownLeft from "../../components/icons/ArrowTurnDownLeft";
import useListOption from "../../hooks/useListOption";

const ListItem = styled("li")(({theme})=>({
  cursor: "pointer",
  width: "100%",
  listStyle: 'none',
  paddingLeft: theme.spacing(2)
}));

const JustifyBetween = styled("div")({
  display: "flex",
  justifyContent: "space-between",
});

const TopHitItem = styled("span")(({ theme }) => ({
  textTransform: "capitalize",
  display: "flex",
  alignItems: "center",
  width: "100%",
}));

const ItemId = styled("span")({
  padding: "0.3rem 0 0 1rem ",
  fontStyle: "italic",
  overflowWrap: "break-word",
});

const FlexSpan = styled("span")({
  display: "flex",
});

const SearchListItemContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  cursor: "pointer",
  width: "100%",
  wordBreak: "break-word",
  paddingRight: "0.2rem",
});

const SearchListItemText = styled("span")({
  maxWidth: "90%",
});

const RecentItemContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  cursor: "pointer",
  width: "100%",
});

const RecentIconContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

function RecentListItem({ item }) {
  return (
    <RecentItemContainer className="search-list-item">
      <RecentIconContainer>
        <FontAwesomeIcon icon={faClockRotateLeft} />
        <Typography variant="subtitle2">
          {item.symbol || item.name || item.id}
        </Typography>
      </RecentIconContainer>

      <FontAwesomeIcon
        icon={faXmark}
        onClick={(event) => {
          event.stopPropagation();
          clearRecentItem(item);
        }}
      />
    </RecentItemContainer>
  );
}

function GlobalSearchListItem({ item, isTopHit = false }) {
  if (item.type === "recent") {
    return <RecentListItem item={item} />;
  }

  const [openListItem] = useListOption();

  const getSymbolHeader = () => {
    if (item.entity === "search") {
      return (
        <SearchListItemContainer>
          <SearchListItemText>
            <Typography variant="subtitle1">
              {item.symbol || item.name || item.id}
            </Typography>
          </SearchListItemText>
          <ArrowTurnDownLeft />
        </SearchListItemContainer>
      );
    }
    if (!(item.entity === "search") && item.symbol && item.name)
      return (
        <>
          <Typography variant={isTopHit ? "h6" : "subtitle1"}>
            {item.symbol}
          </Typography>
          -
          <Typography variant={isTopHit ? "subtitle1" : "subtitle2"}>
            {item.name}
          </Typography>
        </>
      );

    return (
      <Typography variant="subtitle1">
        {item.symbol || item.name || item.id}
      </Typography>
    );
  };

  return (
    <ListItem
      className="search-list-item"
      role="menuitem"
      onClick={() => {
        openListItem(item);
      }}
    >
      <JustifyBetween>
        <TopHitItem>{getSymbolHeader()}</TopHitItem>
        <Typography variant="caption">
          <ItemId>{item.id}</ItemId>
        </Typography>
      </JustifyBetween>
      {isTopHit && item.description && (
        <div className="functionDescription">
          <Typography variant="subtitle1">
            {item.description.substring(0, 180)} ...{" "}
          </Typography>
        </div>
      )}

      <JustifyBetween>
        <Typography variant="caption">
          <FlexSpan>
            {item.pubAuthor && item.pubAuthor}
            {item.pubDate && ` (` + item.pubDate.substring(0, 4) + `)`}
          </FlexSpan>
          <FlexSpan>
            {item.position &&
              item.chromosome &&
              `GRCh38:` +
                item.chromosome +
                `:` +
                commaSeparate(Number(item.position))}
          </FlexSpan>
        </Typography>
        <Typography variant="caption">
          {item.pubJournal && item.pubJournal}
        </Typography>
      </JustifyBetween>

      {item.rsId && (
        <Typography variant="caption">
          <strong>
            <div className="loci"> Ensembl: {item.rsId}</div>
          </strong>
        </Typography>
      )}

      <JustifyBetween>
        <Typography variant="caption">
          {item.numAssocLoci > -1 && (
            <strong>{item.numAssocLoci} associated loci</strong>
          )}
        </Typography>

        {item.hasSumstats && (
          <Chip
            style={{
              height: "16px",
              fontSize: "0.8rem",
              margin: "0",
            }}
            color="primary"
            label="summary statistics"
          />
        )}
      </JustifyBetween>

      {item.nInitial && (
        <Typography variant="caption">N Study: {item.nInitial}</Typography>
      )}

      <div className="numbers">
        <Typography variant="caption">
          {item.start} {item.start && item.end && `-`} {item.end}
        </Typography>
      </div>
    </ListItem>
  );
}

export default GlobalSearchListItem;
