import { Link } from 'ui';
import { Fragment } from 'react';


function Description({ name, parentMolecule, childMolecules }) {
  const molecules = [...childMolecules];

  if (parentMolecule) molecules.push(parentMolecule);

  return (
    <>
      <strong>{name}</strong>
      {molecules.length > 0 ? (
        <>
          , and related molecules{' '}
          {molecules.map(molecule => (
            <Fragment key={molecule.id}>
              <Link to={`/drug/${molecule.id}`}>{molecule.name}</Link>
              {', '}
            </Fragment>
          ))}
        </>
      ) : null}{' '}
      biochemical interactions to produce intended pharmacological effects.
      Curated from scientific literature and post-marketing package inserts.
      Source:{' '}
      <Link to="https://www.ebi.ac.uk/chembl/" external>
        ChEMBL
      </Link>
    </>
  );
}

export default Description;
