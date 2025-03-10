import { Box } from "@mui/material";
import Link from "./Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowRightToBracket,
  faCaretRight,
  faChevronRight,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";

type NavigateProps = {
  to: string;
};

export default function Navigate({ to }: NavigateProps) {
  return (
    <Link to={to}>
      <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
        View
        <FontAwesomeIcon size="sm" icon={faArrowRightToBracket} />
      </Box>
    </Link>
  );
}
