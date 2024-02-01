import { Component } from "react";
import { Skeleton } from "@mui/material";
import SmilesHelper from "./SmilesHelper";

class Smiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      smiles: null,
    };
  }

  componentDidMount() {
    this.mounted = true;

    const { chemblId } = this.props;
    fetch(`https://www.ebi.ac.uk/chembl/api/data/molecule/${chemblId}?format=json`)
      .then(res => res.json())
      .then(data => {
        if (this.mounted) {
          this.setState({
            smiles:
              data.molecule_type === "Small molecule"
                ? data.molecule_structures?.canonical_smiles
                : null,
          });
        }
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { chemblId } = this.props;
    const { smiles } = this.state;

    if (smiles === null) return null;

    return smiles ? (
      <SmilesHelper chemblId={chemblId} smiles={smiles} />
    ) : (
      <Skeleton style={{ marginLeft: "auto" }} height="240px" variant="rect" width="450px" />
    );
  }
}

export default Smiles;
