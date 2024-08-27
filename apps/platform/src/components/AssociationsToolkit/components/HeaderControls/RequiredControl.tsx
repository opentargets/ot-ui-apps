import { ChangeEvent, ReactElement, useState } from "react";
import { Checkbox } from "@mui/material";
import { styled } from "@mui/material/styles";

const OTCheckbox = styled(Checkbox)`
  padding: 0;
`;

type RequiredControlProps = {
  id: string;
  handleChangeRequire: (newValue: boolean, id: string) => void;
};

function RequiredControl({ id, handleChangeRequire }: RequiredControlProps): ReactElement {
  const [displayValue, setDisplayValue] = useState<boolean>();

  const handleChange = (_: ChangeEvent<HTMLInputElement>, newValue: boolean) => {
    setDisplayValue(newValue);
    handleChangeRequire(newValue, id);
  };

  return <OTCheckbox checked={displayValue} color="primary" onChange={handleChange} name={id} />;
}

export default RequiredControl;
