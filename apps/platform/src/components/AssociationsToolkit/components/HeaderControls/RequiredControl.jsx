import { useState, useEffect } from "react";
import { Checkbox } from "@mui/material";
import { styled } from "@mui/material/styles";
import useAotfContext from "../../hooks/useAotfContext";
import { checkBoxPayload, getControlChecked } from "../../utils";

const OTCheckbox = styled(Checkbox)`
  padding: 0;
`;

function RequiredControl({ id, aggregationId, handleChangeRequire }) {
  const [displayValue, setDisplayValue] = useState();

  const handleChange = (_, newValue) => {
    setDisplayValue(newValue);
    handleChangeRequire(newValue, id);
    // if (newValue) {
    //   const payload = checkBoxPayload(col.id, aggregationId);
    //   setDataSourcesRequired([...dataSourcesRequired, payload]);
    //   setDisplayValue(newValue);
    // } else {
    //   const indexToRemove = dataSourcesRequired.findIndex(element => element.col.id === col.id);
    //   const newRequiredElement = [
    //     ...dataSourcesRequired.slice(0, indexToRemove),
    //     ...dataSourcesRequired.slice(indexToRemove + 1),
    //   ];
    //   setDataSourcesRequired(newRequiredElement);
    //   setDisplayValue(newValue);
    // }
    // resetToInitialPagination();
  };

  return <OTCheckbox checked={displayValue} color="primary" onChange={handleChange} name={id} />;
}

export default RequiredControl;
