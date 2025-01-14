import { Typography } from "@mui/material";
import { ReactElement } from "react";

type PlotTooltipTableProps = {
  children: ReactElement;
  label?: string;
  labelWidth?: number;
  valueWidth?: number;
  truncateValue?: boolean;
};

export default function PlotTooltipRow({
  children,
  label,
  labelWidth,
  valueWidth,
  truncateValue = false,
}: PlotTooltipTableProps) {
  const truncateLine = truncateValue
    ? {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }
    : {};

  return (
    <tr style={{ verticalAlign: "top" }}>
      <td width={labelWidth}>
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
