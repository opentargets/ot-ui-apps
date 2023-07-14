import { Link } from "ui";


function Description({ symbol, diseaseName }) {
  return (
    <>
      Gene burden analysis prioritising <strong>{symbol}</strong> as likely
      causal gene for <strong>{diseaseName}</strong>. Source:{' '}
      <Link external to="https://www.ebi.ac.uk/gwas/">
        GWAS Catalog
      </Link>
      ,{' '}
      <Link external to="https://azphewas.com">
        AstraZeneca PheWAS Portal
      </Link>
      ,{' '}
      <Link external to="https://app.genebass.org">
        Genebass
      </Link>
      .
    </>
  );
}

export default Description;
