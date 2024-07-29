import { useState, useEffect } from "react";
import { Checkbox } from "@mui/material";
import { styled } from "@mui/material/styles";
import useAotfContext from "../../hooks/useAotfContext";
import { checkBoxPayload, getControlChecked } from "../../utils";

const OTCheckbox = styled(Checkbox)`
  padding: 0;
`;

function RequiredControl({ id, aggregationId }) {
  const { dataSourcesRequired, setDataSourcesRequired, loading, resetToInitialPagination } =
    useAotfContext();

  const [displayValue, setDisplayValue] = useState(getControlChecked(dataSourcesRequired, id));

  useEffect(() => {
    if (loading) return;
    const newValue = getControlChecked(dataSourcesRequired, id);
    if (newValue !== displayValue) setDisplayValue(newValue);
  }, [dataSourcesRequired]);

  const handleChange = (_, newValue) => {
    if (newValue) {
      const payload = checkBoxPayload(id, aggregationId);
      setDataSourcesRequired([...dataSourcesRequired, payload]);
      setDisplayValue(newValue);
    } else {
      const indexToRemove = dataSourcesRequired.findIndex(element => element.id === id);
      const newRequiredElement = [
        ...dataSourcesRequired.slice(0, indexToRemove),
        ...dataSourcesRequired.slice(indexToRemove + 1),
      ];
      setDataSourcesRequired(newRequiredElement);
      setDisplayValue(newValue);
    }
    resetToInitialPagination();
  };

  return <OTCheckbox checked={displayValue} color="primary" onChange={handleChange} name={id} />;
}

export default RequiredControl;
