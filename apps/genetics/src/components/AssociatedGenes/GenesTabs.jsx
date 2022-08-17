import React from 'react';
import { Tabs, Tab } from '../../ot-ui-components';
import { OVERVIEW, isDisabledColumn } from './utils';
import theme from '../theme';

export const GenesTabs = ({ schemas, value, dataAll, handleChange }) => {
  return (
    <Tabs variant="scrollable" value={value} onChange={handleChange}>
      <Tab label="Summary" value={OVERVIEW} />
      {schemas.map(schema => {
        return (
          <Tab
            key={schema.sourceId}
            value={schema.sourceId}
            label={schema.sourceLabel}
            style={{ color: theme.grey[900] }}
            disabled={isDisabledColumn(dataAll, schema.sourceId)}
          />
        );
      })}
    </Tabs>
  );
};
