import { Box } from "@mui/material";
import { useMeasure } from "@uidotdev/usehooks";
import { PropsWithChildren, ReactElement } from "react";

type WrapperProps = {
  data: any;
};

function Wrapper({ data, children }: PropsWithChildren<WrapperProps>): ReactElement {
  const [ref, { width }] = useMeasure();
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "95%" }} ref={ref}>
        {children}
      </div>
    </Box>
  );
}

export default Wrapper;
