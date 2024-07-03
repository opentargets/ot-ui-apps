import { Skeleton } from "@mui/material";
import { v1 } from "uuid";

type SectionContainerLoaderProps = {
  sectionsCount: number;
};

function SectionLoader({ sectionsCount = 1 }: SectionContainerLoaderProps) {
  const loadingSections = Array.from(Array(sectionsCount));

  return loadingSections.map((_, i) => <Skeleton key={v1()} height="90px" width="100%" />);
}
export default SectionLoader;
