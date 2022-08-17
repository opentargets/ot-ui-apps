import React from 'react';
import queryString from 'query-string';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';

import BasePage from '../BasePage';
import Header from './Header';

import ColocAnalysis from '../../sections/gene/ColocAnalysis/ColocAnalysis';
import L2Gpipeline from '../../sections/gene/L2Gpipeline/L2Gpipeline';

const styles = theme => {
  return {
    section: {
      height: '100%',
      padding: theme.sectionPadding,
    },
    geneSymbol: {
      display: 'inline-block',
    },
    locusLinkButton: {
      width: '248px',
      height: '60px',
    },
    locusIcon: {
      fill: 'white',
      width: '40px',
      height: '40px',
    },
    link: {
      textDecoration: 'none',
    },
    geneInfoItem: {
      width: '20%',
    },
    platformLink: {
      textAlign: 'center',
      textDecoration: 'none',
      color: '#5A5F5F',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    iconLink: {
      '&:hover': {
        fill: theme.palette.primary.dark,
      },
    },
  };
};

class GenePage extends React.Component {
  handleColocTraitFilter = newColocTraitFilterValue => {
    const { colocTraitFilter, ...rest } = this._parseQueryProps();
    const newQueryParams = {
      ...rest,
    };
    if (newColocTraitFilterValue && newColocTraitFilterValue.length > 0) {
      newQueryParams.colocTraitFilter = newColocTraitFilterValue.map(
        d => d.value
      );
    }
    this._stringifyQueryProps(newQueryParams);
  };
  handleTraitFilter = newTraitFilterValue => {
    const { traitFilter, ...rest } = this._parseQueryProps();
    const newQueryParams = {
      ...rest,
    };
    if (newTraitFilterValue && newTraitFilterValue.length > 0) {
      newQueryParams.traitFilter = newTraitFilterValue.map(d => d.value);
    }
    this._stringifyQueryProps(newQueryParams);
  };
  handleAuthorFilter = newFilterValue => {
    const { authorFilter, ...rest } = this._parseQueryProps();
    const newQueryParams = {
      ...rest,
    };
    if (newFilterValue && newFilterValue.length > 0) {
      newQueryParams.authorFilter = newFilterValue.map(d => d.value);
    }
    this._stringifyQueryProps(newQueryParams);
  };
  _parseQueryProps() {
    const { history } = this.props;
    const queryProps = queryString.parse(history.location.search);

    // single values need to be put in lists
    if (queryProps.colocTraitFilter) {
      queryProps.colocTraitFilter = Array.isArray(queryProps.colocTraitFilter)
        ? queryProps.colocTraitFilter
        : [queryProps.colocTraitFilter];
    }
    if (queryProps.traitFilter) {
      queryProps.traitFilter = Array.isArray(queryProps.traitFilter)
        ? queryProps.traitFilter
        : [queryProps.traitFilter];
    }
    if (queryProps.authorFilter) {
      queryProps.authorFilter = Array.isArray(queryProps.authorFilter)
        ? queryProps.authorFilter
        : [queryProps.authorFilter];
    }
    return queryProps;
  }
  _stringifyQueryProps(newQueryParams) {
    const { history } = this.props;
    history.replace({
      ...history.location,
      search: queryString.stringify(newQueryParams),
    });
  }
  render() {
    const { match } = this.props;
    const { geneId } = match.params;
    const {
      colocTraitFilter: colocTraitFilterUrl,
      traitFilter: traitFilterUrl,
      authorFilter: authorFilterUrl,
    } = this._parseQueryProps();
    return (
      <BasePage>
        <Header geneId={geneId} />
        <L2Gpipeline
          geneId={geneId}
          traitFilterUrl={traitFilterUrl}
          authorFilterUrl={authorFilterUrl}
          handleTraitFilter={this.handleTraitFilter}
          handleAuthorFilter={this.handleAuthorFilter}
        />
        <ColocAnalysis
          geneId={geneId}
          handleColocTraitFilter={this.handleColocTraitFilter}
          colocTraitFilterUrl={colocTraitFilterUrl}
        />
      </BasePage>
    );
  }
}

export default withStyles(styles)(GenePage);
