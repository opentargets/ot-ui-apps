import { useQuery } from "@apollo/client";
import { Box } from "@mui/material";
import {
  GenTrackProvider
  GenTrack,
  SectionItem,
} from "ui";
import { definition } from ".";
import Description from "./Description";
import GEN_TRACK_TEST_QUERY from "./GenTrackTestQuery.gql";

type BodyProps = {
	id: string;
	entity: string;
};

function Body({ id: ensemblId, entity }: BodyProps) {
  const variables = { ensemblId };
  const request = useQuery(GEN_TRACK_TEST_QUERY, {
    variables,
  });

  // generate some fake data for now
  const data = [
    { x1: 500, x2: 900 },
    { x1: 300, x2: 700 },
  ];

	return (
		<SectionItem
			definition={definition}
			entity={entity}
			request={request}
			showContentLoading
			loadingMessage="Loading data. This may take some time..."
			renderDescription={() => (
				<Description />
			)}
			renderBody={() => {
				return (
          <GenTrackProvider data={data} xMin={0} xMax={1000} >
            <GenTrack
              tracks={tracks}            
            />
          </GenTrackProvider>
				);
			}}
		/>
	);
}

export default Body;
