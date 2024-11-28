
import { Box } from "@mui/material";
import Link from "./Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";

type NavigateProps = {
  to: string;
};

export default function Navigate({ to }: NavigateProps) {
  return (
    <Box display="flex" justifyContent="center">
      <Link to={to}>
        <FontAwesomeIcon icon={faArrowRightToBracket} />
      </Link>
    </Box>
  );
}