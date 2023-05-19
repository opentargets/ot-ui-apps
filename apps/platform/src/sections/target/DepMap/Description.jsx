import React from 'react';

import Link from '../../../components/Link';

function Description({ symbol }) {
  return (
    <>
      Cancer DepMap info for <strong>{symbol}</strong> -- TODO: description --. Source:{' '}
      <Link external to="#">
        -- TODO: SOURCE --
      </Link>
      .
    </>
  );
}

export default Description;
