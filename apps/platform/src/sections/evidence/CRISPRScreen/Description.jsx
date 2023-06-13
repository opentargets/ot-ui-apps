import React from 'react';
import Link from '../../../components/Link';

const Description = ({ symbol, name }) => (
  <>
    CRISPR knockout screens from public CRISPR datasources, associating <strong>{symbol}</strong> and CRISPR results.
    Sources:{' '}
    <Link external to="https://crisprbrain.org/">
      CRISPRBrain
    </Link>
  </>
);

export default Description;
