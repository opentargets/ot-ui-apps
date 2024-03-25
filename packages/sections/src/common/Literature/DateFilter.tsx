import { useEffect, useState } from "react";
import { FormControl, FormGroup, InputLabel, Slider } from "@mui/material";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  fetchSimilarEntities,
  literatureState,
  loadingEntitiesState,
  updateLiteratureState,
} from "./atoms";
import { styled } from "@mui/material/styles";

const OTSlider = styled(Slider)({
  root: {
    padding: "0 10px !important",
  },
  mark: {
    backgroundColor: "#b8b8b8",
    width: 10,
    height: 1,
    marginLeft: -4,
  },
  valueLabel: {
    zIndex: "9999",
  },
});

const DateIndicator = styled("span")({
  minWidth: 65,
  maxWidth: 80,
});

const monthsBtwnDates = (startDate: Date, endDate: Date) =>
  Math.max(
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth()),
    0
  );

export function DateFilter() {
  const [filterDate, setFilterDate] = useState<number[]>([0, 0]);
  const [numberOfMonths, setNumberOfMonths] = useState(0);
  const [pubYear, setPubYear] = useState(0);
  const setLiteratureUpdate = useSetRecoilState(updateLiteratureState);
  const [_, setLoadingEntities] = useRecoilState(loadingEntitiesState);
  const {
    query,
    id,
    category,
    earliestPubYear,
    selectedEntities,
    cursor,
    globalEntity,
    litsIds,
    pageSize,
    litsCount,
    loadingEntities,
  } = useRecoilValue(literatureState);

  function getDateFromYear(year: number) {
    return new Date(year, 0, 1, 1, 1, 1, 1);
  }

  const sumMonthsSinceYear = (year: number) => (value: number) => {
    const from = getDateFromYear(year);
    const date = new Date(from.setMonth(from.getMonth() + value));
    return date;
  };

  const selectedDate = sumMonthsSinceYear(earliestPubYear);
  const oldSelectedDate = sumMonthsSinceYear(pubYear);

  useEffect(() => {
    // the publication year has changed
    if (earliestPubYear && earliestPubYear !== pubYear) {
      const earliestDate = getDateFromYear(earliestPubYear);
      const limit = monthsBtwnDates(earliestDate, new Date());

      const lowerLimit = getLowerLimit(earliestDate);

      const higherLimit = getHigherLimit(earliestDate, limit);

      setFilterDate([lowerLimit, higherLimit]);
      setNumberOfMonths(limit);
      setPubYear(earliestPubYear);
    } else {
      setPubYear(0);
      setNumberOfMonths(0);
      setFilterDate([0, 0]);
    }
  }, [earliestPubYear]);

  function getHigherLimit(earliestDate: Date, limit: number) {
    const oldHigherDate = oldSelectedDate(filterDate[1]);
    const newHighFilter = monthsBtwnDates(earliestDate, oldHigherDate);
    const higherLimit =
      filterDate[1] > 0 && newHighFilter > 0 && newHighFilter < limit ? newHighFilter : limit;
    return higherLimit;
  }

  function getLowerLimit(earliestDate: Date) {
    if (filterDate[0] == 0) return 0;
    const oldLowerDate = oldSelectedDate(filterDate[0]);
    const newLowerFilter = monthsBtwnDates(earliestDate, oldLowerDate);
    const lowerLimit = newLowerFilter > 0 ? newLowerFilter : 0;
    return lowerLimit;
  }

  const handleChange = async (values: {
    startYear: number;
    startMonth: number;
    endYear: number;
    endMonth: number;
  }) => {
    setLoadingEntities(true);
    const entities = selectedEntities as any[];
    const request = await fetchSimilarEntities({
      query,
      id,
      category,
      entities,
      cursor: null,
      earliestPubYear,
      globalEntity,
      selectedEntities,
      litsIds,
      page: 0,
      pageSize,
      litsCount,
      loadingEntities,
      ...values,
    });
    const data = request.data[globalEntity];
    const update = {
      id,
      cursor: data.literatureOcurrences?.cursor,
      query,
      entities: data.similarEntities,
      loadingEntities: false,
      category,
      litsIds: data.literatureOcurrences?.rows?.map(({ pmid }: { pmid: any }) => ({
        id: pmid,
        status: "ready",
        publication: null,
      })),
      litsCount: data.literatureOcurrences?.filteredCount,
      earliestPubYear: data.literatureOcurrences?.earliestPubYear,
      globalEntity,
      selectedEntities,
      page: 0,
      pageSize,
      ...values,
    };
    setLiteratureUpdate(update);
  };

  const valueLabelFormat = (value: number | number[]) => {
    if (earliestPubYear) {
      const labelDate = selectedDate(value as number);
      return `${labelDate.getFullYear()}-${labelDate.getMonth() + 1}`;
    }
    return "YYYY-MM";
  };

  const handleDateRangeChange = (_event: Event, value: number[] | number, _activeThumb: number) => {
    setFilterDate(value as number[]);
  };

  const handleDateRangeChangeCommitted = (
    _event: Event | React.SyntheticEvent<Element, Event>,
    value: number | number[]
  ) => {
    if (Array.isArray(value)) {
      const startDate = selectedDate(value[0]);
      const endDate = selectedDate(value[1]);
      handleChange({
        startYear: startDate.getFullYear(),
        startMonth: startDate.getMonth() + 1,
        endYear: endDate.getFullYear(),
        endMonth: endDate.getMonth() + 1,
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        marginBottom: 20,
      }}
    >
      <InputLabel id="date-filter-demo">Date Filter:</InputLabel>
      <FormGroup>
        <FormControl
          style={{
            marginLeft: 20,
            flex: 1,
            display: "flex",
            flexDirection: "row",
            gap: 12,
            alignItems: "center",
          }}
        >
          <DateIndicator>{valueLabelFormat(filterDate[0])}</DateIndicator>
          <OTSlider
            size="small"
            style={{ width: 275 }}
            value={filterDate}
            valueLabelDisplay="auto"
            onChange={handleDateRangeChange}
            onChangeCommitted={handleDateRangeChangeCommitted}
            getAriaLabel={() => "date-range-slider"}
            max={numberOfMonths}
            valueLabelFormat={valueLabelFormat}
          />
          <DateIndicator>{valueLabelFormat(filterDate[1])}</DateIndicator>
        </FormControl>
      </FormGroup>
    </div>
  );
}
