import { useState } from "react";
import { Card, CardContent, Grid, Typography, Box, Alert } from "@mui/material";
import { useQuery } from "@apollo/client";

import ClassicAssociationsTable from "./ClassicAssociationsTable";
import { Facets } from "../../components/Facets";

import DISEASE_FACETS_QUERY from "./DiseaseFacets.gql";
import { Link } from "ui";

function ClassicAssociations({ efoId }) {
  const [aggregationFilters, setAggregationFilters] = useState([]);
  const { loading, data } = useQuery(DISEASE_FACETS_QUERY, {
    variables: { efoId, aggregationFilters },
  });

  const handleChangeFilters = newFilters => {
    setAggregationFilters(newFilters);
  };

  const facetData = data?.disease?.associatedTargets.aggregations.aggs;

  return (
    <Grid style={{ marginTop: "8px" }} container spacing={2}>
      <Box sx={{ width: "100%" }}>
        <Alert severity="warning">
          <Typography variant="caption">
            We plan to deprecate this page soon and it is currently out of maintenance. See{" "}
            <Link
              aria-label="Documentation about associations on the fly"
              to="https://platform-docs.opentargets.org/web-interface/associations-on-the-fly-beta"
              external
            >
              here
            </Link>{" "}
            for more info
          </Typography>
        </Alert>
      </Box>
      <Grid item xs={12}>
        <Typography variant="h6">
          {data ? (
            <>
              <strong>{data.disease.associatedTargets.count} targets</strong> associated with{" "}
              <strong>{data.disease.name}</strong>
            </>
          ) : (
            <strong>Loading...</strong>
          )}
        </Typography>
      </Grid>
      <Grid item xs={12} lg={3}>
        <Card elevation={0}>
          <CardContent>
            <Facets
              loading={loading}
              data={facetData}
              onChange={handleChangeFilters}
              type="target"
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} lg={9}>
        <Card elevation={0} style={{ overflow: "visible" }}>
          <CardContent>
            <ClassicAssociationsTable efoId={efoId} aggregationFilters={aggregationFilters} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default ClassicAssociations;
