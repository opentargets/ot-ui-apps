import Link from '../../../components/Link';

function Description({ symbol, name }) {
  return (
    <>
      Somatic variation associated with <strong>{symbol}</strong> on patients
      affected by <strong>{name}</strong>. Source:{' '}
      <Link to="https://www.ebi.ac.uk/eva/" external>
        EVA
      </Link>
    </>
  );
}

export default Description;
