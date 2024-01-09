import { useEffect, useState } from "react";
import { FormControl, FormGroup, InputLabel, Slider } from "@mui/material";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  fetchSimilarEntities,
  literatureState,
  loadingEntitiesState,
  updateLiteratureState,
} from "./atoms";

const monthsBtwnDates = (startDate: Date, endDate: Date) =>
  Math.max(
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth()),
    0
  );

export function DateFilter() {
  const [filterDate, setFilterDate] = useState<number | number[]>([0, 100]);
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
    cursor,
    litsIds,
    page,
    pageSize,
    litsCount,
    loadingEntities,
  } = useRecoilValue(literatureState);

  useEffect(() => {
    if (earliestPubYear) {
      const limit = monthsBtwnDates(new Date(`${earliestPubYear}-01-01`), new Date());
      setNumberOfMonths(limit);
      setFilterDate([0, limit]);
    }
  }, [earliestPubYear]);

  useEffect(() => {
    setFilterDate([0, numberOfMonths]);
  }, []);

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
      cursor,
      earliestPubYear,
      globalEntity,
      selectedEntities,
      litsIds,
      page,
      pageSize,
      litsCount,
      loadingEntities,
      ...values,
    });
    const data = request.data[globalEntity];
    const update = {
      id,
      cursor,
      query,
      entities: data.similarEntities,
      loadingEntities: false,
      category,
      litsIds: data.literatureOcurrences?.rows?.map(({ pmid }: { pmid: any }) => ({
        id: pmid,
        status: "ready",
        publication: null,
      })),
      litsCount: data.literatureOcurrences?.count,
      earliestPubYear: data.literatureOcurrences?.earliestPubYear,
      globalEntity,
      selectedEntities,
      page,
      pageSize,
      ...values,
    };
    setLiteratureUpdate(update);
  };

  const selectedDate = (value: number) => {
    const from = new Date(earliestPubYear, 0, 1, 1, 1, 1, 1);
    return new Date(from.setMonth(from.getMonth() + value));
  };

  const valueLabelFormat = (value: number) => {
    if (earliestPubYear) {
      const labelDate = selectedDate(value);
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

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 50,
      }}
    >
      <InputLabel id="date-filter-demo">Date Filter:</InputLabel>
      <FormGroup>
        <FormControl style={{ marginLeft: 35, flex: 1 }}>
          <Slider
            style={{ width: 400 }}
            value={filterDate}
            valueLabelDisplay="on"
            onChange={handleDateRangeChange}
            onChangeCommitted={handleDateRangeChangeCommitted}
            aria-labelledby="range-slider"
            max={numberOfMonths - 1}
            sx={{
              "& .MuiSlider-thumb:nth-of-type(odd) [aria-hidden]": {
                transform: "translate(0%, 120%)",
              },
              "& .MuiSlider-valueLabel:before": {
                backgroundColor: "transparent",
              },
              "& .MuiSlider-valueLabel:after": {
                backgroundColor: "transparent",
              },
            }}
            valueLabelFormat={valueLabelFormat}
          />
        </FormControl>
      </FormGroup>
    </div>
  );
}
