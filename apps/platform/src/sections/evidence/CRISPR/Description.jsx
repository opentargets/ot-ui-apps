import Link from '../../../components/Link';

function Description({ symbol, name }) {
  return (
    <>
      Cancer cell line dependencies identified using CRISPR-Cas9 whole genome
      screenings pinpointing a <strong>{symbol}</strong> dependency in{' '}
      <strong>{name}</strong>. Source:{' '}
      <Link to="https://score.depmap.sanger.ac.uk" external>
        Project Score
      </Link>
    </>
  );
}

export default Description;
