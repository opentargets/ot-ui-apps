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
  width: 65,
});

const monthsBtwnDates = (startDate: Date, endDate: Date) =>
  Math.max(
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth()),
    0
  );

export function DateFilter() {
  const [filterDate, setFilterDate] = useState<number | number[]>([0, 0]);
  const [numberOfMonths, setNumberOfMonths] = useState(0);
  const setLiteratureUpdate = useSetRecoilState(updateLiteratureState);
  const [_, setLoadingEntities] = useRecoilState(loadingEntitiesState);
  const {
    query,
    id,
    category,
    earliestPubYear,
    selectedEntities,
    globalEntity,
    litsIds,
    pageSize,
    litsCount,
    loadingEntities,
  } = useRecoilValue(literatureState);

  useEffect(() => {
    if (earliestPubYear) {
      console.log("update earliest pub year " + earliestPubYear);
      const earliestYearMonth = `${earliestPubYear}-01-01`;
      const limit = monthsBtwnDates(new Date(earliestYearMonth), new Date());
      setNumberOfMonths(limit);
      setFilterDate([0, limit]);
    }
  }, [earliestPubYear]);

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
      cursor: null,
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

  const selectedDate = (value: number) => {
    const from = new Date(earliestPubYear, 0, 1, 1, 1, 1, 1);
    return new Date(from.setMonth(from.getMonth() + value));
  };

  const valueLabelFormat = (value: number | number[]) => {
    if (earliestPubYear) {
      const labelDate = selectedDate(value as number);
      return `${labelDate.getFullYear()}-${labelDate.getMonth() + 1}`;
    }
    return value;
  };

  const handleDateRangeChange = (_event: Event, value: number[] | number, _activeThumb: number) => {
    setFilterDate(value);
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

  const castedFilter = filterDate as number[];

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
          <DateIndicator>{valueLabelFormat(castedFilter[0])}</DateIndicator>
          <OTSlider
            size="small"
            style={{ width: 275 }}
            value={filterDate}
            valueLabelDisplay="auto"
            onChange={handleDateRangeChange}
            onChangeCommitted={handleDateRangeChangeCommitted}
            aria-labelledby="range-slider"
            max={numberOfMonths - 1}
            valueLabelFormat={valueLabelFormat}
          />
          <DateIndicator>{valueLabelFormat(castedFilter[1])}</DateIndicator>
        </FormControl>
      </FormGroup>
    </div>
  );
}
