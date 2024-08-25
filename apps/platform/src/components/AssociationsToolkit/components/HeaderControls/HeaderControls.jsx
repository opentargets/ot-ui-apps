import { Box, Collapse, Grid, Typography } from "@mui/material";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { styled } from "@mui/material/styles";
import dataSources from "../../static_datasets/dataSourcesAssoc";

import Slider from "./SliderControl";
import Required from "./RequiredControl";
import { GridContainer } from "../layout";

import useAotfContext from "../../hooks/useAotfContext";
import { useReducer } from "react";
import { aotfReducer } from "../../context/aotfReducer";

const CloseContainer = styled("div")({
  position: "absolute",
  left: "10px",
  top: "10px",
  cursor: "pointer",
  zIndex: 10,
});

const WeightsControllsContainer = styled("div")({
  backgroundColor: "var(--colums-controls-color)",
  position: "relative",
  boxSizing: "content-box",
  padding: "20px 0 15px",
});

// function getSliderValue(values, id) {
//   const value = values.find(val => val.id === id).weight;
//   return value;
// }

// function getRequiredValue(values, id) {
//   const value = values.find(val => val.id === id).required;
//   return value;
// }

function getColumnObject(values, id) {
  return values.find(val => val.id === id);
}

function HeaderControls({ cols = [] }) {
  const {
    activeHeadersControlls,
    setActiveHeadersControlls,
    displayedTable,
    updateDataSourceControls,
    dataSourcesWeights,
  } = useAotfContext();

  if (displayedTable === "prioritisations") return null;

  const handleClose = () => {
    setActiveHeadersControlls(false);
  };

  function handleChangeSliderCommitted(newValue, id) {
    const currentColumnValue = getColumnObject(dataSourcesWeights, id);
    updateDataSourceControls(
      id,
      newValue,
      currentColumnValue.weight,
      currentColumnValue.aggregation
    );
  }

  function handleChangeRequire(newValue, id) {
    const currentColumnValue = getColumnObject(dataSourcesWeights, id);
    updateDataSourceControls(
      id,
      currentColumnValue.required,
      newValue,
      currentColumnValue.aggregation
    );
  }

  return (
    <Collapse in={activeHeadersControlls}>
      <WeightsControllsContainer className="weights-controlls">
        <Grid container direction="row" wrap="nowrap">
          <CloseContainer onClick={handleClose}>
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </CloseContainer>
          <Grid
            item
            container
            direction="column"
            className="header-controls-labels"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="subtitle2">Weight</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">Require</Typography>
            </Box>
          </Grid>
          <GridContainer columnsCount={cols.length} className="controlls-wrapper">
            {cols.map(({ id }) => (
              <div key={id} className="colum-control">
                <Grid className="control-container" key={id}>
                  <Slider id={id} handleChangeSliderCommitted={handleChangeSliderCommitted} />
                </Grid>
                <div className="required-container">
                  <Required
                    id={id}
                    aggregationId={(dataSources.find(el => el.id === id).aggregationId, id)}
                    handleChangeRequire={handleChangeRequire}
                  />
                </div>
              </div>
            ))}
          </GridContainer>
        </Grid>
      </WeightsControllsContainer>
    </Collapse>
  );
}

export default HeaderControls;
