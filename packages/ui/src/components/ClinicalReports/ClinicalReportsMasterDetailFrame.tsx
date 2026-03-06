import { Box } from "@mui/material";

function ClinicalReportsMasterDetailFrame({ master, detail }: any) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "stretch",
        flexWrap: { xs: "wrap", md: "nowrap" },
        columnGap: { md: 3, lg: 6 },
        rowGap: 3,
        height: "100%",
        "& .MuiCardContent-root": {
          padding: "0 !important",
        },
      }}
    >
      <Box
        sx={{
          flex: "0 0 auto",
          width: {
            xs: "100% ",
            md: "clamp(270px, 30%, 300px)",
          },
          alignSelf: { md: "stretch" },
        }}
      >
        {master}
      </Box>

      <Box sx={{ flex: "1 1 auto", minWidth: 0 }}>{detail}</Box>
    </Box>
  );
}

export default ClinicalReportsMasterDetailFrame;
