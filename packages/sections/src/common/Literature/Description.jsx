import { Link } from "ui";

const url = "http://platform-docs.opentargets.org/bibliography";

function Description({ name }) {
  return (
    <>
      <b>!! NEW !!</b>
      Scientific literature mentioning NLP-recognised entity <strong>{name}</strong> and other
      selected co-occurring entities. Source:{" "}
      <Link external to={url}>
        Open Targets
      </Link>
      .
    </>
  );
}

export default Description;
