import { Typography } from "@mui/material";
import { ReactElement } from "react";

type ObsTooltipRowProps = {
  children: ReactElement;
  label?: string;
  valueWidth?: string;
  truncateValue?: boolean;
};

function ObsTooltipRow({ children, label, valueWidth, truncateValue = false }: ObsTooltipRowProps) {
  const truncateLine = truncateValue
    ? {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }
    : {};

  return (
    <tr style={{ verticalAlign: "top" }}>
      <td>
        <Typography
          variant="subtitle2"
          fontSize={13}
          style={{ lineHeight: 1.15, paddingRight: "0.2rem" }}
        >
          {label}:
        </Typography>
      </td>
      <td>
        <Typography
          variant="body2"
          component="div"
          fontSize={13}
          style={{ lineHeight: 1.15, ...truncateLine, width: valueWidth }}
        >
          {children}
        </Typography>
      </td>
    </tr>
  );
}

export default ObsTooltipRow;
