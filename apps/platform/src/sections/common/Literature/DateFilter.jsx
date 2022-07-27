import React, { useEffect, useState } from 'react';
import {
  FormControl,
  FormGroup,
  InputLabel,
  Slider,
  withStyles,
} from '@material-ui/core';
import {
  fetchSimilarEntities,
  literatureState,
  loadingEntitiesState,
  updateLiteratureState,
} from './atoms';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

const monthsBtwnDates = (startDate, endDate) => {
  return Math.max(
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth()),
    0
  );
};

export const DateFilter = () => {
  const [filterDate, setFilterDate] = useState([0, 100]);
  const [numberOfMonths, setNumberOfMonths] = useState(0);
  const setLiteratureUpdate = useSetRecoilState(updateLiteratureState);
  const [loadingEntities, setLoadingEntities] = useRecoilState(
    loadingEntitiesState
  );
  const {
    query,
    id,
    category,
    startYear,
    startMonth,
    endYear,
    endMonth,
    earliestPubYear,
    selectedEntities,
    globalEntity,
    cursor,
  } = useRecoilValue(literatureState);

  useEffect(
    () => {
      let limit = monthsBtwnDates(
        new Date(`${earliestPubYear}-01-01`),
        new Date()
      );
      setNumberOfMonths(limit);
      setFilterDate([0, limit]);
    },
    [earliestPubYear]
  );

  useEffect(() => {
    setFilterDate([0, numberOfMonths]);
  }, []);

  const handleChange = async values => {
    setLoadingEntities(true);
    const request = await fetchSimilarEntities({
      query,
      id,
      category,
      entities: selectedEntities,
      cursor,
      startYear,
      startMonth,
      endYear,
      endMonth,
      ...values,
    });
    const data = request.data[globalEntity];
    const update = {
      entities: data.similarEntities,
      loadingEntities: false,
      category,
      startYear,
      startMonth,
      endYear,
      endMonth,
      litsIds: data.literatureOcurrences?.rows?.map(({ pmid }) => ({
        id: pmid,
        status: 'ready',
        publication: null,
      })),
      litsCount: data.literatureOcurrences?.count,
      earliestPubYear: data.literatureOcurrences?.earliestPubYear,
      ...values,
    };
    setLiteratureUpdate(update);
  };

  const selectedDate = value => {
    let from = new Date(earliestPubYear, 0, 1, 1, 1, 1, 1);
    return new Date(from.setMonth(from.getMonth() + value));
  };

  function valueLabelFormat(value) {
    if (earliestPubYear) {
      const labelDate = selectedDate(value);
      return `${labelDate.getFullYear()}-${labelDate.getMonth() + 1}`;
    } else {
      return value;
    }
  }

  const handleDateRangeChange = (event, newValue) => {
    setFilterDate(newValue);
  };

  const handleDateRangeChangeCommited = (event, newValue) => {
    const startDate = selectedDate(newValue[0]);
    const endDate = selectedDate(newValue[1]);
    handleChange({
      startYear: startDate.getFullYear(),
      startMonth: startDate.getMonth() + 1,
      endYear: endDate.getFullYear(),
      endMonth: endDate.getMonth() + 1,
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <InputLabel id="date-filter-demo">Date Filter:</InputLabel>
      <FormGroup>
        <FormControl style={{ marginLeft: 35, flex: 1 }}>
          <IOSSlider
            style={{ width: 400 }}
            value={filterDate}
            valueLabelDisplay="on"
            onChange={handleDateRangeChange}
            onChangeCommitted={handleDateRangeChangeCommited}
            aria-labelledby="range-slider"
            max={numberOfMonths - 1}
            onsel
            valueLabelFormat={valueLabelFormat}
          />
        </FormControl>
      </FormGroup>
    </div>
  );
};

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const IOSSlider = withStyles(theme => ({
  root: {
    color: theme.palette.primary.main,
    height: 2,
    padding: '15px 0',
  },
  thumb: {
    height: 20,
    width: 20,
    backgroundColor: theme.palette.primary.main,
    boxShadow: iOSBoxShadow,
    marginTop: -10,
    marginLeft: -14,
    '&:focus, &:hover, &$active': {
      boxShadow:
        '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
      },
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
    top: -22,
    whiteSpace: 'nowrap',
    '& *': {
      background: 'transparent',
      color: theme.palette.text.primary,
    },
  },
  track: {
    height: 2,
  },
  rail: {
    height: 2,
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
  mark: {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    marginTop: -3,
  },
  markActive: {
    opacity: 1,
    backgroundColor: 'currentColor',
  },
}))(Slider);
