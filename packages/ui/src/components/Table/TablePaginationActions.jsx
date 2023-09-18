import { IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faForwardStep,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles({
  root: { flexShrink: 0 },
});

export function PaginationActionsComplete({
  count,
  page,
  rowsPerPage,
  onPageChange,
}) {
  const classes = useStyles();

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0}>
        <FontAwesomeIcon icon={faBackwardStep} />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <FontAwesomeIcon icon={faForwardStep} />
      </IconButton>
    </div>
  );
}
