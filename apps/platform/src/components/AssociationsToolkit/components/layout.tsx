import { styled } from "@mui/material";
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

const boxShadow = "0px 3px 15px -3px rgba(0,0,0,0.1)";

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
});

export const RowsContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
});

type RowContainerProps = {
  rowExpanded: boolean;
  isSubRow: boolean;
};

export const RowContainer = styled("div", {
  shouldForwardProp: prop => prop !== "rowExpanded" && prop !== "isSubRow",
})<RowContainerProps>(({ rowExpanded, isSubRow }) => ({
  top: "148px",
  position: rowExpanded ? "sticky" : "initial",
  padding: rowExpanded ? "0.1em 0 0.1em 0" : "0.1em 0 0.1em 0",
  zIndex: rowExpanded ? "90 !important" : "initial",
  backgroundColor: rowExpanded ? "var(--row-hover-color)" : "initial",
  display: "flex",
  alignItems: "center",
  width: "100%",
  boxSizing: "content-box",
  boxShadow: rowExpanded ? boxShadow : "none",
  border: rowExpanded ? "0.7px solid #666" : "0.7px solid #fafafa",
  "&:hover": {
    backgroundColor: "var(--row-hover-color)",
    border: "0.7px solid #666",
    ".PinnedContainer": {
      opacity: 1,
      cursor: "pointer",
    },
  },
}));

export const ControlsSection = styled("section")`
  margin-top: 30px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

export const OptionsControlls = styled("div")`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;
