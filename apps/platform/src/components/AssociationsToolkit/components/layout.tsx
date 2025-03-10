import { styled } from "@mui/material";
import { grey } from "@mui/material/colors";
import { LoadingBackdrop } from "ui";

const LoadingContainer = styled("div")({
  height: "1100px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gap: "15px",
});

export const AotFLoader: React.FC = () => (
  <LoadingContainer>
    <LoadingBackdrop />
    Loading associations
  </LoadingContainer>
);

const baseGridContainerStyles = {
  display: "grid",
  gridTemplateRows: "1fr",
  gridColumnGap: "2px",
  gridRowGap: "0px",
  justifyItems: "center",
  width: "100%",
};

type GridContainerProps = {
  columnsCount: number;
};

export const GridContainer = styled("div", {
  shouldForwardProp: prop => prop !== "columnsCount",
})<GridContainerProps>(({ columnsCount }) => ({
  ...baseGridContainerStyles,
  gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
}));

export const TableBodyContent = styled("div")({
  display: "flex",
  flexDirection: "column",
  margin: "0",
  minHeight: "300px",
});

export const RowsContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
});

type RowContainerProps = {
  rowExpanded: boolean;
  interactors: boolean;
};

export const RowContainer = styled("div", {
  shouldForwardProp: prop => prop !== "rowExpanded" && prop !== "interactors",
})<RowContainerProps>(({ rowExpanded, interactors }) => ({
  top: interactors ? 0 : "148px",
  width: "100%",
  display: "flex",
  alignItems: "center",
  boxSizing: "border-box",
  transition: "background 75ms ease-out",
  // boxShadow: rowExpanded ? boxShadow : "none",
  position: rowExpanded ? "sticky" : "initial",
  padding: rowExpanded ? "0.1em 0 0.1em 0" : "0.1em 0 0.1em 0",
  zIndex: rowExpanded ? "99 !important" : "initial",
  backgroundColor: rowExpanded ? grey[300] : "initial",
  border: rowExpanded ? `1px solid ${grey[400]}` : "none",
  borderBottom: rowExpanded ? `none` : "none",
  "&:hover": {
    backgroundColor: grey[300],
  },
}));

export const OptionsControlls = styled("div")`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;
