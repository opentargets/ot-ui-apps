import { makeStyles, styled } from "@mui/styles";
import { Typography, Chip } from "@mui/material";
import SearchRecentListItem from "./SearchRecentListItem";
import { commaSeparate } from "./utils/searchUtils";
import ArrowTurnDownLeft from "../../components/icons/ArrowTurnDownLeft";

const ListItem = styled("div")({
  cursor: "pointer",
  width: "100%",
});

const JustifyBetween = styled("div")({
  display: "flex",
  justifyContent: "space-between",
});

const TopHitItem = styled("span")(({ theme }) => ({
  // todo: separate color to conditional tophit item
  color: theme.palette.primary.main,
  textTransform: "capitalize",
  display: "flex",
  alignItems: "center",
}));

const ItemId = styled("span")({
  padding: "0.3rem 0 0 1rem ",
  fontStyle: "italic",
  overflowWrap: "break-word",
});

const FlexSpan = styled("span")({
  display: "flex",
});

export interface SearchResult {
  type: string;
  symbol: string;
  name: string;
  description: string;
  entity: string;
  id: string;
  rsId: string;
  hasSumstats: boolean;
  nInitial: number;
  pubJournal: string;
  chromosome: string;
  functionDescriptions: string[];
  position: string;
  pubAuthor: string;
  pubDate: string;
  numAssocLoci: number;
  end: number;
  start: number;
}

function SearchListItem({
  item,
  isTopHit = false,
  clearItem,
}: {
  item: any;
  isTopHit: boolean;
  clearItem: (item: SearchResult) => void;
}) {
  // const classes = useStyles();

  if (item.type === "recent") {
    return <SearchRecentListItem item={item} clearItem={clearItem} />;
  }

  const getSymbolHeader = () => {
    if (item.entity === "search") {
      return (
        <div className={classes.searchListItem}>
          <Typography className={classes.searchListItemText} variant="subtitle1">
            {item.symbol || item.name || item.id}
          </Typography>
          <ArrowTurnDownLeft />
        </div>
      );
    } else if (!(item.entity === "search") && item.symbol && item.name)
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
    else
      return (
        <>
          <Typography variant="subtitle1">
            {item.symbol || item.name || item.id}
          </Typography>
        </>
      );
  };

  return (
    <>
      <ListItem>
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
    </>
  );
}

export default SearchListItem;
