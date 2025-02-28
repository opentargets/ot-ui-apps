import { faChartLine, faTableColumns } from "@fortawesome/free-solid-svg-icons";
import { ToggleButtonGroup, ToggleButton, styled } from "@mui/material";
import { ReactElement, useState, MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { VIEW } from "@ot/constants";

type SectionViewToggleProps = {
  defaultValue: string;
  viewChange: (s: string) => void;
};

const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
  padding: 0;
`;

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
}));

function SectionViewToggle({
  defaultValue = VIEW.table,
  viewChange,
}: SectionViewToggleProps): ReactElement {
  const [sectionView, setView] = useState(defaultValue);

  const handleViewChange = (event: MouseEvent) => {
    event.preventDefault();
    if (event.target.value) {
      setView(event.target.value);
      if (viewChange) viewChange(event.target.value);
    }
  };

  return (
    <StyledToggleButtonGroup
      sx={{ typography: "body2" }}
      value={sectionView}
      onChange={handleViewChange}
    >
      <StyledToggleButton aria-label="Switch to table view" value={VIEW.table}>
        <FontAwesomeIcon icon={faTableColumns} />
        {VIEW.table} view
      </StyledToggleButton>
      <StyledToggleButton aria-label="Switch to chartn view" value={VIEW.chart}>
        <FontAwesomeIcon icon={faChartLine} />
        {VIEW.chart}
      </StyledToggleButton>
    </StyledToggleButtonGroup>
  );
}
export default SectionViewToggle;
