import { Typography } from "@mui/material";

export default function TooltipRow({ children, label, data }) {
  return (
    <tr style={{ verticalAlign: 'top' }}>
      <td>
        <Typography variant="subtitle2" fontSize={13} style={{ lineHeight: 1.3, paddingRight: "0.2rem" }}>
          {label}:
        </Typography>
      </td>
      <td>
        <Typography variant="body2" fontSize={13} style={{ lineHeight: 1.3 }}>
          {children}
        </Typography>
      </td>
    </tr>
  );
}