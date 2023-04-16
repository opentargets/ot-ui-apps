import React from 'react';
import { Button } from '@mui/material';
import { findDOMNode } from 'react-dom';
import Grid from '@mui/material/Grid';

import downloadSvg from './DownloadSvg';
import PlotContainer from '../PlotContainer';

const handleSvgDownload = (svgContainer, filenameStem) => {
  const node = findDOMNode(svgContainer.current);
  const svgNode = node.nodeName === 'svg' ? node : node.querySelector('svg');
  downloadSvg({ svgNode, filenameStem });
};

const DownloadSvgPlot = ({
  loading,
  error,
  left,
  center,
  svgContainer,
  filenameStem,
  reportDownloadEvent,
  children,
}) => (
  <PlotContainer
    loading={loading}
    error={error}
    left={left}
    center={center}
    right={
      <Grid container justifyContent="flex-end" spacing={1}>
        <Grid item>
          <Button
            variant="outlined"
            onClick={() => {
              if (reportDownloadEvent) {
                reportDownloadEvent();
              }
              handleSvgDownload(svgContainer, filenameStem);
            }}
          >
            SVG
          </Button>
        </Grid>
      </Grid>
    }
  >
    {children}
  </PlotContainer>
);

export default DownloadSvgPlot;
