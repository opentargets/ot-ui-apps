import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Typography } from '@material-ui/core';
import Link from '../Link';

function WarningBanner() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        background: '#FFC53D',
        color: 'black',
        alignItems: 'center',
        gap: 5,
      }}
    >
      <FontAwesomeIcon icon={faWarning} />
      <Typography variant="subtitle1">
        Open Targets Genetics is currently out of maintenance and we plan to
        replace it with improved pipelines very soon. See{' '}
        <Link
          external
          to="https://community.opentargets.org/t/watch-out-for-our-new-product-release-next-spring/1627"
        >
          {' '}
          here{' '}
        </Link>{' '}
        for more info.
      </Typography>
    </Box>
  );
}
export default WarningBanner;
