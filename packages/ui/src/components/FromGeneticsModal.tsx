import { Modal, Box, Typography } from "@mui/material";
import { useState } from "react";

interface FromGeneticsModalProps {
  title: string;
  text: string;
}

const FromGeneticsModal = ({ title, text }: FromGeneticsModalProps) => {
  const [open, setOpen] = useState(true);

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1">{text}</Typography>
      </Box>
    </Modal>
  );
};

export default FromGeneticsModal;
