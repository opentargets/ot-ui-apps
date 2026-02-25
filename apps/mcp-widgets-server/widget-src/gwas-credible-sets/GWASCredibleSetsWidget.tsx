/**
 * GWAS Credible Sets widget.
 *
 * Renders the exact same Body component used on the Open Targets Platform
 * study page. Apollo Client and MemoryRouter are provided by createWidgetEntry.
 */
import Body from "@ot/sections/study/GWASCredibleSets/Body";

export default function GWASCredibleSetsWidget({ studyId }: { studyId: string }) {
  return <Body id={studyId} entity="study" />;
}
