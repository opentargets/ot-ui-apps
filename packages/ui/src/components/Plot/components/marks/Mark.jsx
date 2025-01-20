import StandardMark from "./StandardMark";
import SelectionMark from "./SelectionMark";

export default function Mark(props) {
  return props.dataFrom ? <SelectionMark {...props} /> : <StandardMark {...props} />;
}
