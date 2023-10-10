import Link from '../Link';

type ExternalLinkProps = {
  title: string;
  id: string | null;
  url: string;
};
function ExternalLink({ title, id, url }: ExternalLinkProps) {
  if (!id) return null;

  return (
    <span>
      {title}:{' '}
      <Link external to={url}>
        {id}
      </Link>
    </span>
  );
}

export default ExternalLink;
