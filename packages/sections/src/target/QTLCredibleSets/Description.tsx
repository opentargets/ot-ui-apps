import type { ReactElement } from "react";
import { Link } from "ui";

type DescriptionProps = {
	targetSymbol: string;
};

function Description({ targetSymbol }: DescriptionProps): ReactElement {
	return (
		<>
			95% credible sets fine-mapped from quantitative trait loci associated with
			molecular traits affecting <strong>{targetSymbol}</strong>. Source{" "}
			<Link to="https://platform-docs.opentargets.org/target" external>
				Open Targets
			</Link>
		</>
	);
}

export default Description;
