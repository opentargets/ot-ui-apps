import { useState, useLayoutEffect, useRef } from 'react';
import { v1 } from 'uuid';
import { Typography, withStyles } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

const styles = theme => ({
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    '& span:not(:last-child)': { marginBottom: '12px' },
  },
  showMore: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
  },
});

const getStyleHeight = ({
  newNumberOfLines,
  lineLimit,
  showMore,
  lineHeight,
}) => {
  if (newNumberOfLines <= lineLimit) return 'auto';
  if (showMore) return 'auto';
  return `${lineLimit * lineHeight}px`;
};

function LongText({
  classes,
  lineLimit,
  children,
  variant = 'body2',
  descriptions,
  targetId,
}) {
  const containerRef = useRef();
  const [showMore, setShowMore] = useState(false);
  const [numberOfLines, setNumberOfLines] = useState();

  useLayoutEffect(() => {
    const container = containerRef.current;
    const el = containerRef.current;
    const height = el.offsetHeight;
    const lineHeight = Number.parseInt(
      document.defaultView
        .getComputedStyle(el, null)
        .getPropertyValue('line-height'),
      10
    );
    const newNumberOfLines = Math.round(height / lineHeight);

    container.style.height = getStyleHeight({
      newNumberOfLines,
      lineHeight,
      lineLimit,
      showMore,
    });

    setNumberOfLines(newNumberOfLines);
  }, [lineLimit, showMore, children]);

  function createDescriptionMarkup(desc) {
    return { __html: desc };
  }

  return (
    <Typography variant={variant}>
      <span ref={containerRef} className={classes.textContainer}>
        {descriptions.map((desc, i) => (
          <span
            key={`${targetId}-${v1()}`}
            dangerouslySetInnerHTML={createDescriptionMarkup(desc)}
          />
        ))}
      </span>
      {numberOfLines >= lineLimit && (
        <span>
          {showMore ? '' : '... '}[{' '}
          <span
            className={classes.showMore}
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? ' hide' : ' show more'}
          </span>{' '}
          ]
        </span>
      )}
    </Typography>
  );
}

const StyledLongText = withStyles(styles)(LongText);

function TargetDescription({
  descriptions,
  loading = false,
  showLabel = true,
  targetId,
  lineLimit = 3,
}) {
  let content;

  if (!descriptions || descriptions.length < 1) {
    content = 'No description available';
  } else {
    content = (
      <StyledLongText
        lineLimit={lineLimit}
        descriptions={descriptions}
        targetId={targetId}
      />
    );
  }

  return (
    <>
      {showLabel && <Typography variant="subtitle2">Description</Typography>}
      {loading ? <Skeleton /> : content}
    </>
  );
}

export default TargetDescription;
