import { Box } from "@mui/material";
import { mantissaExponentComparator, variantComparator } from "@ot/utils";
import {
  GenTrack
} from "ui";
import { definition } from ".";
import Description from "./Description";
import GEN_TRACK_TEST_QUERY from "./GenTrackQuery.gql";

type BodyProps = {
	id: string;
	entity: string;
};

function Body({ id, entity }: BodyProps) {
  const variables = { ensemblId };
  const request = useQuery(PHARMACOGENOMICS_QUERY, {
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
					<h2>GEN TRACK HERE</h2>
				);
			}}
		/>
	);
}

export default Body;
