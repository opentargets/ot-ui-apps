import { Typography } from "@mui/material";

export default function TooltipRow({ children, label, data }) {
  return (
    <tr>
      <td>
        <Typography variant="subtitle2" style={{ lineHeight: 1.35, paddingRight: "0.2rem" }}>
          {label}:
        </Typography>
      </td>
      <td>
        <Typography variant="body2" style={{ lineHeight: 1.35 }}>
          {children}
        </Typography>
      </td>
    </tr>
  );
}