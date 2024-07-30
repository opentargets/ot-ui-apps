import { ButtonProps, default as MuiButton } from "@mui/material/Button";

const Button = ({ children, color, variant, ...rest }: ButtonProps) => (
  <MuiButton
    color={"primary"}
    variant="contained"
    sx={{ border: "none", color: "white" }}
    disableElevation
    {...rest}
  >
    {children}
  </MuiButton>
);

export default Button;
