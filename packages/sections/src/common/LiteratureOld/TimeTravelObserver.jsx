import { useState, useEffect } from "react";
import { List, ListItem, Drawer, Box, Link as MUILink, Button } from "@mui/material";
import { useRecoilSnapshot, useGotoRecoilSnapshot } from "recoil";

export default function TimeTravelObserver() {
  const [snapshots, setSnapshots] = useState([]);
  const [open, setOpen] = useState(false);

  const snapshot = useRecoilSnapshot();

  const toggleDrawer = event => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  useEffect(
    () => {
      if (snapshots.every(s => s.getID() !== snapshot.getID())) {
        setSnapshots([...snapshots, snapshot]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [snapshot]
  );

  const gotoSnapshot = useGotoRecoilSnapshot();

  return (
    <>
      <MUILink onClick={toggleDrawer}>Time Travel Observer</MUILink>
      <Drawer anchor="right" open={open} onClose={closeDrawer}>
        <Box>
          <List style={{ width: "250px" }}>
            {snapshots.map((snapshotItem, i) => (
              <ListItem key={snapshotItem.getID()}>
                Snapshot {i}
                <Button onClick={() => gotoSnapshot(snapshotItem)}>Restore</Button>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
