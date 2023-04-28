import { Component } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { Modal, Paper, withStyles } from '@material-ui/core';
import SmilesDrawer from 'smiles-drawer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchPlus } from '@fortawesome/free-solid-svg-icons';

const styles = theme => ({
  container: {
    background: 'none',
    cursor: 'pointer',
    height: '240px',
    marginLeft: 'auto',
    width: 'fit-content',
    '& .seeDetailsIcon': {
      visibility: 'hidden',
    },
    '&:hover .seeDetailsIcon': {
      visibility: 'visible',
    },
  },
  modal: {
    width: '800px',
    margin: '130px auto 0 auto',
  },
  modalCanvas: {
    display: 'block',
    margin: '0 auto',
  },
  close: {
    cursor: 'pointer',
    float: 'right',
    fill: theme.palette.grey[800],
  },
});

class SmilesHelper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  componentDidMount() {
    const { smiles, chemblId } = this.props;
    const smilesDrawer = new SmilesDrawer.Drawer({
      width: 450,
      height: 240,
      padding: 10,
    });
    SmilesDrawer.parse(
      smiles,
      tree => {
        smilesDrawer.draw(tree, chemblId);
      },
      () => {
        console.error('error parsing smiles');
      }
    );
  }

  componentDidUpdate() {
    const { open } = this.state;

    if (open) {
      const { smiles, chemblId } = this.props;
      const smilesDrawer = new SmilesDrawer.Drawer({
        width: 750,
        height: 440,
        padding: 10,
      });

      SmilesDrawer.parse(
        smiles,
        tree => {
          smilesDrawer.draw(tree, `${chemblId}-modal`);
        },
        () => {
          console.error('error parsing smiles');
        }
      );
    }
  }

  toggleModal = () => {
    this.setState(({ open }) => ({ open: !open }));
  };

  render() {
    const { chemblId, classes } = this.props;
    const { open } = this.state;
    return (
      <>
        <Paper
          className={classes.container}
          elevation={0}
          onClick={this.toggleModal}
        >
          <canvas id={chemblId} />
          <FontAwesomeIcon icon={faSearchPlus} className="seeDetailsIcon" />
        </Paper>
        <Modal open={open} onClose={this.toggleModal} keepMounted>
          <Paper className={classes.modal}>
            <CloseIcon className={classes.close} onClick={this.toggleModal} />
            <canvas id={`${chemblId}-modal`} className={classes.modalCanvas} />
          </Paper>
        </Modal>
      </>
    );
  }
}

export default withStyles(styles)(SmilesHelper);
