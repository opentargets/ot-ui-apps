import { ReactElement, useEffect, useState } from "react";
import FilterComponent from "../../FilterComponent";
import dataSourcesAssoc from "../static_datasets/dataSourcesAssoc";
import { isPartnerPreview, defaultDataSourcesFilter, getWightSourceDefault } from "../utils";
import useAotfContext from "../hooks/useAotfContext";
import { DataSource, columnAdvanceControl } from "../types";

export default function DataSourcesFilter(): ReactElement {
  const [alertVisibility, setAlertVisibility] = useState(false);
  const {
    dataSourcesFilter,
    setDataSourcesFilter,
    dataSourcesWeights,
    updateDataSourceControls,
    filterAffectOverallScore,
    setFilterAffectOverallScore,
    displayedTable,
  } = useAotfContext();

  const dataSources = dataSourcesAssoc.filter(
    (e: DataSource) => !e.isPrivate || (e.isPrivate && e.isPrivate === isPartnerPreview)
  );

  useEffect(() => {
    if (filterAffectOverallScore) {
      dataSourcesWeights.map((dw: columnAdvanceControl) => {
        const newDw = JSON.parse(JSON.stringify(dw));
        if (dataSources.map((ds: DataSource) => ds.id).includes(dw.id)) {
          if (!dataSourcesFilter.map((ds: DataSource) => ds.id).includes(dw.id)) {
            newDw.weight = 0;
          } else {
            newDw.weight = dw.weight === 0 ? getWightSourceDefault(dw.id) : dw.weight;
          }
          updateDataSourceControls(newDw.id, newDw.weight, newDw.required, newDw.aggregation);
        }
      });
    } else {
      dataSourcesWeights.map((dw: columnAdvanceControl) => {
        const newDw = JSON.parse(JSON.stringify(dw));
        if (dw.weight === 0) {
          updateDataSourceControls(
            newDw.id,
            getWightSourceDefault(dw.id),
            newDw.required,
            newDw.aggregation
          );
        }
        return newDw;
      });
    }
  }, [dataSourcesFilter.length, filterAffectOverallScore]);

  return (
    <FilterComponent
      filterItems={dataSources}
      selectedItems={dataSourcesFilter}
      setSelectedItems={setDataSourcesFilter}
      defaultItems={defaultDataSourcesFilter}
      alertVisibility={alertVisibility}
      setAlertVisibility={setAlertVisibility}
      title="Filter data sources"
      label="label"
      isAssociations
      isPrioritisation={displayedTable === "prioritisations"}
      filterAffectOverallScore={filterAffectOverallScore}
      setFilterAffectOverallScore={setFilterAffectOverallScore}
    />
  );
}
