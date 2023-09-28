import { Box, CircularProgress, styled } from "@mui/material";

const StyledContainer = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  background: theme.palette.grey["100"],
  width: "auto",
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
  marginBottom: "15px",
}));

const LoadingContainer = styled("div")({
  margin: "10px 0",
  textAlign: "center",
});

function SummaryLoader() {
  return (
    <LoadingContainer>
      <StyledContainer>
        <CircularProgress color="inherit" />
      </StyledContainer>
      Summarising. This may take some time...
    </LoadingContainer>
  );
}

export default SummaryLoader;
