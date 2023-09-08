import { withStyles } from '@mui/styles';
import Tooltip from '@mui/material/Tooltip';

const HtmlTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: '#fff',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 300,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
    top: 0,
  },
}))(Tooltip);

export default HtmlTooltip;
