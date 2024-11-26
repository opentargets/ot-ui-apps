import { Typography } from "@mui/material";

export default function TooltipRow({
  children,
  label,
  data,
  labelMinWidth,
  truncateValue,
}) {

  const truncateLine = truncateValue
    ? {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }
    : {};

  return (
    <tr style={{ verticalAlign: 'top' }}>
      <td width={labelMinWidth}>
        <Typography variant="subtitle2" fontSize={13} style={{ lineHeight: 1.3, paddingRight: "0.2rem" }}>
          {label}:
        </Typography>
      </td>
      <td>
        <Typography variant="body2" fontSize={13} style={{ lineHeight: 1.3, ...truncateLine }}>
          {children}
        </Typography>
      </td>
    </tr>
  );
}