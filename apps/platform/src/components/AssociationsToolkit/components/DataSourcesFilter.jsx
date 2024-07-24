import FilterComponent from "../../FilterComponent";
import dataSourcesAssoc from "../static_datasets/dataSourcesAssoc";
import { isPartnerPreview, defaultDataSourcesFilter, getWightSourceDefault } from "../utils";
import useAotfContext from "../hooks/useAotfContext";
import { useEffect, useState } from "react";

export default function DataSourcesFilter() {
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

  useEffect(() => {
    if (filterAffectOverallScore) {
      dataSourcesWeights.map(dw => {
        const newDw = JSON.parse(JSON.stringify(dw));
        // only update the weight if the data source is part of the options
        if (dataSources.map(ds => ds.id).includes(dw.id)) {
          if (!dataSourcesFilter.map(ds => ds.id).includes(dw.id)) {
            // set weight to 0 if the data source is not selected
            newDw.weight = 0;
          } else {
            // set weight to the default value if the data source is selected and the value is 0 (meaning previously filtered out)
            newDw.weight = dw.weight === 0 ? getWightSourceDefault(dw.id) : dw.weight;
          }
          updateDataSourceControls(newDw.id, newDw.weight, newDw.required, newDw.aggregation);
        }
      });
    } else {
      // set all weights back to default value when filter is not affecting overall score anymore
      dataSourcesWeights.map(dw => {
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

  const dataSources = dataSourcesAssoc.filter(
    e => !e.isPrivate || (e.isPrivate && e.isPrivate === isPartnerPreview)
  );

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
