import { type Theme, Typography, type TypographyProps } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { type PropsWithChildren, useLayoutEffect, useRef, useState } from "react";

const useStyles = makeStyles((theme: Theme) => ({
  textContainer: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  showMore: {
    color: theme.palette.primary.main,
    cursor: "pointer",
    textDecoration: "underline",
    background: "none",
    border: "none",
    padding: 0,
    font: "inherit",
  },
}));

type LongTextProps = {
  lineLimit: number;
  variant: TypographyProps["variant"];
};

const LongText = ({ lineLimit, variant = "body2", children }: PropsWithChildren<LongTextProps>) => {
  const classes = useStyles();
  const containerRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLInputElement>(null);
  const [showMore, setShowMore] = useState(false);
  const [numberOfLines, setNumberOfLines] = useState<number | null>();

  useLayoutEffect(() => {
    const container = containerRef.current;
    const el = textRef.current;
    if (!el || !container) return;
    const height = el.offsetHeight;
    const DOMLineHeight = document.defaultView
      ? document.defaultView.getComputedStyle(el, null).getPropertyValue("line-height")
      : "";
    const lineHeight = Number.parseInt(DOMLineHeight, 10);
    const numberOfLines = Math.round(height / lineHeight);
    container.style.height =
      numberOfLines <= lineLimit ? "auto" : showMore ? "auto" : `${lineLimit * lineHeight}px`;

    setNumberOfLines(numberOfLines);
  }, [lineLimit, showMore, children]);

  return (
    <Typography variant={variant}>
      <span ref={containerRef} className={classes.textContainer}>
        <span ref={textRef}>{children}</span>
      </span>
      {numberOfLines && numberOfLines > lineLimit && (
        <span>
          {showMore ? "" : "... "}[{" "}
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
            {showMore ? " hide" : " show more"}
          </button>{" "}
          ]
        </span>
      )}
    </Typography>
  );
};

export default LongText;
