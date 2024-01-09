import { useState, useEffect } from "react";
import { faXmark, faSearchPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SmilesDrawer from "smiles-drawer";

const useStyles = makeStyles(theme => ({
  container: {
    background: "none !important",
    cursor: "pointer",
    height: "240px",
    marginLeft: "auto",
    width: "fit-content",
    "& .seeDetailsIcon": {
      visibility: "hidden",
    },
    "&:hover .seeDetailsIcon": {
      visibility: "visible",
    },
  },
  modal: {
    width: "800px",
    margin: "130px auto 0 auto",
  },
  modalCanvas: {
    display: "block",
    margin: "0 auto",
  },
  close: {
    cursor: "pointer",
    float: "right",
    fill: theme.palette.grey[800],
  },
}));

const drawSmiles = (smiles, chemblId, config) => {
  const smilesDrawer = new SmilesDrawer.Drawer(config);
  SmilesDrawer.parse(
    smiles,
    tree => {
      smilesDrawer.draw(tree, chemblId);
    },
    () => {
      console.error("error parsing smiles");
    }
  );
};

function SmilesHelper({ smiles, chemblId }) {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      drawSmiles(smiles, `${chemblId}-modal`, {
        width: 750,
        height: 440,
        padding: 10,
      });
    } else
      drawSmiles(smiles, chemblId, {
        width: 450,
        height: 240,
        padding: 10,
      });
  });

  return (
    <>
      <Paper className={classes.container} elevation={0} onClick={toggleModal}>
        <canvas id={chemblId} />
        <FontAwesomeIcon icon={faSearchPlus} className="seeDetailsIcon" />
      </Paper>
      <Modal open={isOpen} onClose={toggleModal} keepMounted>
        <Paper className={classes.modal}>
          <FontAwesomeIcon icon={faXmark} className={classes.close} onClick={toggleModal} />
          <canvas id={`${chemblId}-modal`} className={classes.modalCanvas} />
        </Paper>
      </Modal>
    </>
  );
}

export default SmilesHelper;
