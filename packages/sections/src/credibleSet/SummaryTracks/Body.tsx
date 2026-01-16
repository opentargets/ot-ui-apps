import { useQuery } from "@apollo/client";
import { SectionItem } from "ui";
import { definition } from ".";
import Description from "./Description";
import SUMMARY_TRACKS_QUERY from "./SummaryTracksQuery.gql";
import BodyContent from "./BodyContent";

type BodyProps = {
	id: string;
	entity: string;
};

function Body({ id, entity }: BodyProps) {
  const variables = {
    studyLocusId: id,
  };

  const request = useQuery(SUMMARY_TRACKS_QUERY, {
    variables,
  });
 
	return (
		<SectionItem
			definition={definition}
			entity={entity}
			request={request}
			showContentLoading
			loadingMessage="Loading data. This may take some time..."
			renderDescription={() => <Description />}
			renderBody={() => <BodyContent />}
		/>
	);
}

export default Body;
