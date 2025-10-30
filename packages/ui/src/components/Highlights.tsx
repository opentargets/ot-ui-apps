import { type Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { type ReactNode, useState } from "react";

const useStyles = makeStyles((theme: Theme) => ({
  showMore: {
    cursor: "pointer",
    color: theme.palette.primary.main,
    textDecoration: "underline",
    background: "none",
    border: "none",
    padding: 0,
    font: "inherit",
  },
  matches: {
    marginTop: "4px",
  },
}));

type HighlightItem = string | TrustedHTML;

type HighlightsProps = {
  highlights: HighlightItem[];
};

// Helper function to safely convert TrustedHTML to string
const trustedHTMLToString = (item: HighlightItem): string => {
  if (typeof item === "string") {
    return item;
  }
  // Convert TrustedHTML to string safely
  return String(item);
};

function Highlights({ highlights }: HighlightsProps): ReactNode {
  const classes = useStyles();
  const [showMore, setShowMore] = useState(false);

  if (highlights.length === 0) return null;

  // Convert all highlights to strings for safe HTML rendering
  const highlightStrings = highlights.map(trustedHTMLToString);
  const htmlContent = showMore
    ? highlightStrings.join('<span class="separator"> | </span>')
    : highlightStrings[0];

  return (
    <div className={classes.matches}>
      <Typography component="span" display="inline" variant="subtitle2">
        Matches:
      </Typography>{" "}
      <Typography
        display="inline"
        variant="caption"
        className="highlights"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML content is needed for highlights
        dangerouslySetInnerHTML={{
          __html: htmlContent,
        }}
      />
      {highlights.length > 1 && (
        <>
          {" "}
          <Typography variant="body2" display="inline">
            [{" "}
            <button
              type="button"
              className={classes.showMore}
              onClick={() => setShowMore(!showMore)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setShowMore(!showMore);
                }
              }}
            >
              {showMore ? "hide" : "more"}
            </button>{" "}
            ]
          </Typography>
        </>
      )}
    </div>
  );
}

export default Highlights;
