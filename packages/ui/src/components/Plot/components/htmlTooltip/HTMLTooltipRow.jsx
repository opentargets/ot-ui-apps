import { Typography } from "@mui/material";

export default function TooltipRow({
  children,
  label,
  data,
  labelWidth,
  valueWidth,
  truncateValue,
}) {
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
