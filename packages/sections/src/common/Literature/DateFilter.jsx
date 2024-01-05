import { useEffect, useState } from "react";
import { FormControl, FormGroup, InputLabel, Slider } from "@mui/material";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  fetchSimilarEntities,
  literatureState,
  loadingEntitiesState,
  updateLiteratureState,
} from "./atoms";

const iOSBoxShadow =
  "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)";

const monthsBtwnDates = (startDate, endDate) =>
  Math.max(
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth()),
    0
  );

export function DateFilter() {
  const [filterDate, setFilterDate] = useState([0, 100]);
  const [numberOfMonths, setNumberOfMonths] = useState(0);
  const setLiteratureUpdate = useSetRecoilState(updateLiteratureState);
  const [_, setLoadingEntities] = useRecoilState(loadingEntitiesState);
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
        status: "ready",
        publication: null,
      })),
      litsCount: data.literatureOcurrences?.count,
      earliestPubYear: data.literatureOcurrences?.earliestPubYear,
      ...values,
    };
    setLiteratureUpdate(update);
  };

  const selectedDate = value => {
    const from = new Date(earliestPubYear, 0, 1, 1, 1, 1, 1);
    return new Date(from.setMonth(from.getMonth() + value));
  };

  const valueLabelFormat = value => {
    if (earliestPubYear) {
      const labelDate = selectedDate(value);
      return `${labelDate.getFullYear()}-${labelDate.getMonth() + 1}`;
    }
    return value;
  };

  const handleDateRangeChange = (event, newValue) => {
    setFilterDate(newValue);
  };

  const handleDateRangeChangeCommitted = (event, newValue) => {
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
            onsel
            valueLabelFormat={valueLabelFormat}
          />
        </FormControl>
      </FormGroup>
    </div>
  );
}
