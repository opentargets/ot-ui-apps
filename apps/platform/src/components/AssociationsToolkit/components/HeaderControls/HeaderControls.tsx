import { Box, Collapse, Grid, Typography } from "@mui/material";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { styled } from "@mui/material/styles";

import Slider from "./SliderControl";
import Required from "./RequiredControl";
import { GridContainer } from "../layout";

import useAotfContext from "../../hooks/useAotfContext";
import { Tooltip } from "ui";
import { ReactNode } from "react";

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

type HeaderControlsProps = {
  cols: Record<string, string | number | boolean>[];
};

function getColumnObject(values: Record<string, string | number | boolean>[], id: string) {
  return values.find(val => val.id === id);
}

function HeaderControls({ cols = [] }: HeaderControlsProps): ReactNode {
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

  function handleChangeSliderCommitted(newValue: number | number[], id: string) {
    const currentColumnValue = getColumnObject(dataSourcesWeights, id);
    updateDataSourceControls(
      id,
      newValue,
      currentColumnValue.weight,
      currentColumnValue.aggregation
    );
  }

  function handleChangeRequire(newValue: boolean, id: string) {
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
              <Typography variant="subtitle2">
                <Tooltip
                  title="Enabling this will return either of the selected data sources."
                  showHelpIcon
                  style={null}
                >
                  Include
                </Tooltip>
              </Typography>
            </Box>
          </Grid>
          <GridContainer columnsCount={cols.length} className="controlls-wrapper">
            {cols.map(({ id }) => (
              <div key={id} className="colum-control">
                <Grid className="control-container" key={id}>
                  <Slider id={id} handleChangeSliderCommitted={handleChangeSliderCommitted} />
                </Grid>
                <div className="required-container">
                  <Required id={id} handleChangeRequire={handleChangeRequire} />
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
