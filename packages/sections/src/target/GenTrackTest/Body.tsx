import { useQuery } from "@apollo/client";
import { Box } from "@mui/material";
import {
  GenTrack,
  SectionItem
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
					<GenTrack />
				);
			}}
		/>
	);
}

export default Body;
