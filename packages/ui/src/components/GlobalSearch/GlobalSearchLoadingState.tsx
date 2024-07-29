import { Grid, Grow, Skeleton } from "@mui/material";

function GlobalSearchLoadingState() {
  const listItemsToShow = new Array<number>(4).fill(0);
  return (
    <Grow appear in>
      <div>
        <Grid container justifyContent="flex-start" alignItems="center" style={{ padding: 20 }}>
          <Grid
            container
            justifyContent="flex-start"
            alignItems="center"
            style={{
              marginBottom: "1rem",
            }}
          >
            <Skeleton animation="wave" variant="circular" width="2rem" height="2rem" />
            <Skeleton variant="text" animation="wave" width="10vw" height="3vh" />
          </Grid>
          {listItemsToShow.map((_item, index) => (
            <Grid
              key={index}
              container
              justifyContent="flex-start"
              alignItems="center"
              style={{
                borderTop: "0.1px solid #60606033",
                padding: "1rem",
              }}
            >
              <Grid container justifyContent="space-between" className="name-container">
                <Skeleton animation="wave" width="20vw" height="2vh" />
                <Skeleton animation="wave" width="6vw" height="1vh" />
              </Grid>
              <Grid className="author-container">
                <Skeleton animation="wave" width="15vw" height="2vh" />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </div>
    </Grow>
  );
}

export default GlobalSearchLoadingState;
