import { Typography } from '@material-ui/core';

function BibliographyHtmlText({ text }) {
  return (
    <Typography variant="body1" dangerouslySetInnerHTML={{ __html: text }} />
  );
}

export default BibliographyHtmlText;
