import React, { useState } from 'react';
import { withStyles } from '@material-ui/core';

import Link from '../Link';

const styles = theme => ({
  showMore: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
  }
});

function XRefLinks({ classes, label, urlStem, ids, limit }) {
  const [showMore, setShowMore] = useState(false);

  const displayNone= {
    display: "none"
  }

  return (
    <span>
      {label}:{' '}
      {ids.map((id, i) => (
        <span key={id} style={(i > limit - 1 && !showMore) ? displayNone : {}}>
          <Link
            external
            to={`${urlStem}${id}`}
          >
            {id}
          {i < ids.length - 1 ? ', ' : ''}
          </Link>
        </span>
      ))}
      {ids.length > limit ? (
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
      ) : null}
    </span>
  );
}

export default withStyles(styles)(XRefLinks);