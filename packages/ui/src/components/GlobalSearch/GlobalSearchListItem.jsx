import { memo } from "react";
import { styled } from "@mui/styles";
import { Typography, Chip, Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faClockRotateLeft, faArrowTrendUp } from "@fortawesome/free-solid-svg-icons";

import { clearRecentItem } from "./utils/searchUtils";
import DisplayVariantId from "../DisplayVariantId";

const ListItem = styled("li")(({ theme }) => ({
  cursor: "pointer",
  width: "100%",
  listStyle: "none",
  padding: `${theme.spacing(1.5)}`,
  borderRadius: theme.spacing(0.5),
  color: theme.palette.grey["900"],
  "&:hover": {
    background: theme.palette.grey["200"],
  },
}));

const JustifyBetween = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
});

const ListItemDisplayName = styled("span")(({ theme }) => ({
  textTransform: "capitalize",
  display: "flex",
  alignItems: "center",
  width: "100%",
}));

const ItemId = styled("span")({
  padding: "0.3rem 0 0 1rem ",
  fontStyle: "italic",
});

const FlexSpan = styled("span")({
  display: "flex",
});

const RecentItemContainer = styled("li")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  cursor: "pointer",
  width: "100%",
  padding: `${theme.spacing(1.5)}`,
  borderRadius: theme.spacing(1),
  color: theme.palette.grey["700"],
  "&:hover": {
    background: theme.palette.grey["200"],
  },
}));

const RecentIconContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

const TopHitItem = styled("li")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  cursor: "pointer",
  width: "100%",
  padding: `${theme.spacing(1.5)}`,
  borderRadius: theme.spacing(1),
  color: theme.palette.grey["900"],
  "&:hover": {
    background: theme.palette.grey["200"],
  },
}));

const TopHitItemContainer = styled("div")(({ theme }) => ({
  cursor: "pointer",
  width: "100%",
  padding: `${theme.spacing(1.5)} 0`,
  borderRadius: theme.spacing(1),
}));

function symbolNameOrId(item) {
  if (item.entity === "variant") {
    return item.referenceAllele ? (
      <DisplayVariantId
        variantId={item.id}
        referenceAllele={item.referenceAllele}
        alternateAllele={item.alternateAllele}
        expand={false}
      />
    ) : (
      item.id
    );
  }
  return item.symbol || item.name || item.id;
}

function SuggestionListItem({ item, onItemClick }) {
  return (
    <RecentItemContainer
      className="search-list-item"
      role="menuitem"
      tabIndex="0"
      data-item-details={JSON.stringify(item)}
      onClick={() => {
        onItemClick(item);
      }}
    >
      <RecentIconContainer>
        <FontAwesomeIcon icon={faArrowTrendUp} />
        <Typography variant="subtitle2">{symbolNameOrId(item)}</Typography>
      </RecentIconContainer>
    </RecentItemContainer>
  );
}

function RecentListItem({ item, onItemClick }) {
  return (
    <RecentItemContainer
      className="search-list-item"
      role="menuitem"
      tabIndex="0"
      data-item-details={JSON.stringify(item)}
      onClick={() => {
        onItemClick(item);
      }}
    >
      <RecentIconContainer>
        <FontAwesomeIcon icon={faClockRotateLeft} />
        <Typography variant="subtitle2">{symbolNameOrId(item)}</Typography>
      </RecentIconContainer>

      <FontAwesomeIcon
        icon={faXmark}
        onClick={event => {
          event.preventDefault();
          event.stopPropagation();
          clearRecentItem(item);
          // update view for deleted item
        }}
      />
    </RecentItemContainer>
  );
}

function TopHitListItem({ item, onItemClick }) {
  return (
    <TopHitItem
      className="search-list-item"
      role="menuitem"
      data-item-details={JSON.stringify(item)}
      tabIndex="0"
      onClick={() => {
        onItemClick(item);
      }}
    >
      <TopHitItemContainer>
        <JustifyBetween>
          <Typography variant="h6">
            <ListItemDisplayName>
              <Box
                sx={{
                  fontWeight: "bold",
                  color: theme => theme.palette.primary.main,
                }}
              >
                {symbolNameOrId(item)}
              </Box>
            </ListItemDisplayName>
          </Typography>

          <Typography
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            variant="caption"
            noWrap
          >
            {!!item.id && (
              <ItemId>
                {item.entity === "variant" ? (
                  <DisplayVariantId
                    variantId={item.id}
                    referenceAllele={item.referenceAllele}
                    alternateAllele={item.alternateAllele}
                    expand={false}
                  />
                ) : (
                  item.id
                )}
              </ItemId>
            )}
          </Typography>
        </JustifyBetween>

        {item.entity === "variant" ? (
          <>
            {item.rsIds.length > 0 && (
              <Box sx={{ fontWeight: "500", letterSpacing: 1 }}>
                <Typography variant="subtitle1">{item.rsIds.join(", ")}</Typography>
              </Box>
            )}
            <Box sx={{ fontWeight: "light", fontStyle: "oblique" }}>
              <Typography variant="body2">
                {`${item.variantDescription.substring(0, 180)}${
                  item.variantDescription.length > 180 ? "..." : ""
                }`}
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ fontWeight: "500", letterSpacing: 1 }}>
              <Typography variant="subtitle1">{item.symbol && item.name}</Typography>
            </Box>
            <JustifyBetween>
              <Box sx={{ fontWeight: "light", fontStyle: "oblique" }}>
                <Typography variant="body2">
                  {item.description && `${item.description.substring(0, 180)}...`}
                </Typography>
                <Typography variant="body2">
                  {item.credibleSetsCount > -1 && (
                    <>Credible sets count: {item.credibleSetsCount}</>
                  )}
                  {item.nSamples && <> • N Study: {item.nSamples}</>}
                </Typography>
                <Typography variant="caption">
                  {item.publicationFirstAuthor && <>{item.publicationFirstAuthor}</>}
                  {item.publicationDate && <>({item.publicationDate})</>}
                </Typography>
              </Box>
              {item.hasSumstats && (
                <Chip
                  style={{
                    height: "16px",
                    fontSize: "0.8rem",
                    margin: "0",
                  }}
                  label="summary statistics"
                />
              )}
            </JustifyBetween>
          </>
        )}
      </TopHitItemContainer>
    </TopHitItem>
  );
}

function GlobalSearchListItem({ item, isTopHit = false, onItemClick }) {
  const getSymbolHeader = () => {
    if (item.symbol && item.name)
      return (
        <>
          <Typography variant="subtitle1">{item.symbol}</Typography>-
          <Typography variant="subtitle2">{item.name}</Typography>
        </>
      );
    return (
      <>
        <Typography variant="subtitle1">{symbolNameOrId(item)}</Typography>
      </>
    );
  };

  function getVariantRsIds() {
    if (item.entity === "variant" && item.rsIds.length > 0) return item.rsIds.join(", ");
  }

  if (item.type === "recent") {
    return <RecentListItem item={item} onItemClick={onItemClick} />;
  }

  if (item.type === "suggestion") {
    return <SuggestionListItem item={item} onItemClick={onItemClick} />;
  }

  if (isTopHit) {
    return <TopHitListItem item={item} onItemClick={onItemClick} />;
  }

  return (
    <ListItem
      className="search-list-item"
      role="menuitem"
      tabIndex="0"
      data-item-details={JSON.stringify(item)}
      onClick={() => {
        onItemClick(item);
      }}
    >
      <JustifyBetween>
        <Typography>
          <ListItemDisplayName>{getSymbolHeader()}</ListItemDisplayName>
        </Typography>
        <Typography
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            minWidth: "20%",
            textAlign: "end",
          }}
          variant="caption"
          noWrap
        >
          {!!item.id && (
            <ItemId>
              {item.entity === "variant" ? (
                <DisplayVariantId
                  variantId={item.id}
                  referenceAllele={item.referenceAllele}
                  alternateAllele={item.alternateAllele}
                  expand={false}
                />
              ) : (
                item.id
              )}
            </ItemId>
          )}
        </Typography>
      </JustifyBetween>

      {/* <JustifyBetween>
        <Typography variant="caption">
          <FlexSpan>
            {item.pubAuthor && item.pubAuthor}
            {item.pubDate && ` ( ${item.pubDate.substring(0, 4)} )`}
          </FlexSpan>
          <FlexSpan>
            {item.position &&
              item.chromosome &&
              `GRCh38: ${item.chromosome} : ${commaSeparate(Number(item.position))}`}
          </FlexSpan>
        </Typography>
        <Typography variant="caption">{item.pubJournal && item.pubJournal}</Typography>
      </JustifyBetween> */}

      {/* {item.rsId && (
        <Typography variant="caption">
          <strong>
            <div className="loci"> Ensembl: {item.rsId}</div>
          </strong>
        </Typography>
      )} */}

      <JustifyBetween>
        <Typography variant="caption">
          {item.credibleSetsCount > -1 && <>Credible sets count: {item.credibleSetsCount}</>}
          {item.nSamples && <> • N Study: {item.nSamples}</>}
          {getVariantRsIds()}
        </Typography>

        {/* {item.hasSumstats && (
          <Chip
            style={{
              height: "16px",
              fontSize: "0.8rem",
              margin: "0",
            }}
            label="summary statistics"
          />
        )} */}
      </JustifyBetween>

      {/* {item.nInitial && <Typography variant="caption">N Study: {item.nInitial}</Typography>} */}

      {/* <div className="numbers">
        <Typography variant="caption">
          {item.start} {item.start && item.end && `-`} {item.end}
        </Typography>
      </div> */}
    </ListItem>
  );
}

export default memo(GlobalSearchListItem);
