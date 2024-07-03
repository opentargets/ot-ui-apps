import Link from "../Link";

type ExternalLinkProps = {
  id: string | null,
  title: string,
  url: string,
};

function ExternalLink({ title, id, url }: ExternalLinkProps) {
  if (!id) return null;

  return (
    <span>
      {title}:{" "}
      <Link external to={url}>
        {id}
      </Link>
    </span>
  );
}

export default ExternalLink;
