import { SvgIcon } from '@mui/material';
// import { makeStyles } from '@mui/styles';

import config from '../config';

const styles = {
  root: {
    height: 'unset',
  },
};

function OTLogo({props, sx = []}) {
  const tagline = config.profile.otLogoTagline ?? '';

  return (
    <SvgIcon
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1659.66 346.78"
      // TODO: review props spreading
      // eslint-disable-next-line
      {...props}
      sx={[
        styles.root,
        // You cannot spread `sx` directly because `SxProps` (typeof sx) can be an array.
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <path
        fill="#abd0e7"
        d="M45.05 262.19a37.12 37.12 0 110-74.23h214.77v74.24z"
        transform="translate(-7.94 -6.26)"
      />
      <path
        fill="#3488c8"
        d="M171 278.81v37.12a37.12 37.12 0 01-74.24 0v-37.12z"
        transform="translate(-7.94 -6.26)"
      />
      <path
        fill="#abd0e7"
        d="M185.58 80.5V43.38a37.12 37.12 0 0174.24 0V80.5z"
        transform="translate(-7.94 -6.26)"
      />
      <path
        fill="#3488c8"
        d="M96.76 97.11h214.75a37.12 37.12 0 110 74.24H96.76z"
        transform="translate(-7.94 -6.26)"
      />
      <path
        fill="#5c605f"
        d="M390.12 172.71v-.23c0-22.6 17.44-41.53 42.11-41.53s41.88 18.7 41.88 41.3v.23c0 22.6-17.44 41.53-42.11 41.53s-41.88-18.7-41.88-41.3zm69.19 0v-.23c0-15.6-11.36-28.57-27.31-28.57s-27.08 12.74-27.08 28.34v.23c0 15.6 11.36 28.45 27.31 28.45s27.08-12.62 27.08-28.22zM489.6 158.37a6.86 6.86 0 016.88-7 7 7 0 017 7v3.79c4.48-6.32 10.79-11.36 20.65-11.36 14.23 0 28.11 11.24 28.11 31.43v.23c0 20.08-13.77 31.44-28.11 31.44-10.09 0-16.4-5.05-20.65-10.67v21.45a6.94 6.94 0 01-13.88 0zm48.53 24.09v-.23c0-11.7-7.92-19.39-17.32-19.39s-17.67 7.81-17.67 19.39v.23c0 11.59 8.26 19.39 17.67 19.39s17.32-7.46 17.32-19.39zM594.35 214c-17.55 0-31.09-12.73-31.09-31.43v-.23c0-17.33 12.28-31.55 29.6-31.55 19.28 0 28.8 15.83 28.8 29.83a6.49 6.49 0 01-6.54 6.65h-38c1.49 9.87 8.49 15.38 17.44 15.38a21.78 21.78 0 0014.34-5.28 5.15 5.15 0 013.56-1.26 5.46 5.46 0 015.51 5.62 6.06 6.06 0 01-1.84 4.24c-5.49 4.95-12.37 8.03-21.78 8.03zm13.77-35.91c-.92-8.95-6.2-15.94-15.37-15.94-8.49 0-14.46 6.53-15.72 15.94zM635.89 158.37a6.86 6.86 0 016.88-7 7 7 0 017 7v3c3.9-5.62 9.52-10.55 18.93-10.55 13.65 0 21.57 9.18 21.57 23.17v32.36a6.76 6.76 0 01-6.88 6.88 6.86 6.86 0 01-7-6.88v-28.13c0-9.41-4.71-14.8-13-14.8-8 0-13.65 5.62-13.65 15v27.88a6.94 6.94 0 01-13.88 0zM762.79 145.4h-19.51a6.54 6.54 0 110-13.07h53.35a6.54 6.54 0 010 13.07H777v60.81a7.11 7.11 0 01-14.22 0zM798.7 195.2v-.2c0-13.08 10.21-19.51 25-19.51A50.6 50.6 0 01840 178v-1.5c0-8.61-5.28-13.2-15-13.2a36 36 0 00-13.42 2.41 7.77 7.77 0 01-2.18.35 5.78 5.78 0 01-5.85-5.74 6.07 6.07 0 013.78-5.51 52 52 0 0119.51-3.55c9.06 0 15.83 2.41 20.08 6.76 4.47 4.36 6.54 10.79 6.54 18.71v29.83a6.62 6.62 0 01-6.77 6.65c-4 0-6.77-2.75-6.77-5.85v-2.3c-4.13 4.94-10.44 8.84-19.74 8.84-11.39 0-21.48-6.54-21.48-18.7zm41.53-4.36v-4.13a38.43 38.43 0 00-13.77-2.41c-9 0-14.22 3.78-14.22 10.09v.23c0 5.86 5.16 9.18 11.81 9.18 9.18 0 16.18-5.28 16.18-12.96zM870.07 158.37a6.86 6.86 0 016.88-7 7 7 0 017 7v6.19c3.21-7.57 9.18-13.3 15.26-13.3 4.36 0 6.88 2.86 6.88 6.88a6.51 6.51 0 01-5.51 6.65c-9.86 1.72-16.63 9.3-16.63 23.64v17.9a6.93 6.93 0 01-7 6.88 6.82 6.82 0 01-6.88-6.88zM919.29 225.83a5.69 5.69 0 01-3.9-5.51 5.85 5.85 0 015.85-5.73 5.52 5.52 0 012.52.57 37 37 0 0018.59 4.84c12.39 0 19.16-6.43 19.16-18.59v-4.7c-5 6.54-11.36 11.13-21.34 11.13-14.23 0-27.54-10.56-27.54-28.34v-.23c0-17.9 13.43-28.45 27.54-28.45 10.21 0 16.52 4.7 21.22 10.32v-2.87a6.95 6.95 0 0113.89.12v41.88c0 10.21-2.64 17.78-7.69 22.83-5.51 5.5-14 8.14-24.9 8.14a52.26 52.26 0 01-23.4-5.41zm42.33-46.46v-.23c0-9.87-8.14-16.64-17.78-16.64s-17.21 6.65-17.21 16.64v.23c0 9.86 7.69 16.63 17.21 16.63s17.78-6.77 17.78-16.63zM1020.48 214c-17.55 0-31.09-12.73-31.09-31.43v-.23c0-17.33 12.28-31.55 29.6-31.55 19.28 0 28.8 15.83 28.8 29.83a6.49 6.49 0 01-6.54 6.65h-38c1.5 9.87 8.49 15.38 17.44 15.38a21.78 21.78 0 0014.34-5.28 5.15 5.15 0 013.56-1.26 5.46 5.46 0 015.51 5.62 6.06 6.06 0 01-1.84 4.24c-5.48 4.95-12.37 8.03-21.78 8.03zm13.77-35.91c-.92-8.95-6.19-15.94-15.37-15.94-8.49 0-14.46 6.53-15.72 15.94zM1064.89 195.89V164h-2.3a6 6 0 010-11.93h2.3v-10.34a6.94 6.94 0 0113.88 0v10.33h10.9a6 6 0 110 11.93h-10.9v29.72c0 5.39 2.75 7.57 7.46 7.57a32.47 32.47 0 003.44-.35 5.85 5.85 0 015.85 5.74 6 6 0 01-3.67 5.39 27.42 27.42 0 01-9.52 1.61c-10.21 0-17.44-4.48-17.44-17.78zM1106.88 206.56a5.34 5.34 0 01-2.64-4.82 5.56 5.56 0 015.63-5.62 6.08 6.08 0 013 .8c5.85 3.9 11.93 5.85 17.44 5.85 6 0 9.41-2.52 9.41-6.54V196c0-4.7-6.43-6.31-13.54-8.49-9-2.52-18.93-6.19-18.93-17.78v-.23c0-11.48 9.52-18.47 21.57-18.47a41.6 41.6 0 0119 4.93 5.89 5.89 0 013.33 5.28 5.59 5.59 0 01-5.74 5.62 5.43 5.43 0 01-2.75-.69c-4.94-2.52-10-4.13-14.23-4.13-5.39 0-8.49 2.52-8.49 6v.23c0 4.47 6.54 6.31 13.65 8.6 8.84 2.75 18.82 6.77 18.82 17.67v.23c0 12.73-9.87 19-22.49 19a41.4 41.4 0 01-23.04-7.21zM1204.29 135.31a3 3 0 013-3h26.16c17.67 0 29.83 9.06 29.83 24.55v.23c0 16.86-14.57 25.58-31.32 25.58h-21.68v27.42a3 3 0 11-6 0zm28 41.87c14.91 0 25-7.8 25-19.73v-.23c0-12.73-9.87-19.39-24.33-19.39h-22.71v39.35zM1280.48 131.29a2.75 2.75 0 012.75-2.87 2.84 2.84 0 012.87 2.87v78.94a2.68 2.68 0 01-2.75 2.87 2.77 2.77 0 01-2.87-2.87zM1303.42 195.66v-.23c0-12.16 10.45-19.05 25.59-19.05a70 70 0 0119.39 2.53v-2.53c0-11.82-7.23-17.9-19.28-17.9a37.89 37.89 0 00-16.63 3.9 3 3 0 01-1.26.35 2.75 2.75 0 01-2.64-2.64 2.83 2.83 0 011.6-2.52 45.35 45.35 0 0119.28-4.36c7.91 0 14.23 2.18 18.47 6.42 3.9 3.9 6 9.29 6 16.52v34.08a2.76 2.76 0 11-5.51 0v-7.35c-4 5.63-11.24 11.13-22.37 11.13-10.93-.01-22.64-6.19-22.64-18.35zm45.09-4.94v-6.65a77.59 77.59 0 00-19.84-2.64c-12.4 0-19.28 5.51-19.28 13.65v.23c0 8.49 8 13.43 17 13.43 11.91 0 22.12-7.35 22.12-18.02zM1376.63 197.61v-38.32h-6.31a2.75 2.75 0 01-2.64-2.64 2.65 2.65 0 012.64-2.53h6.31v-16.29a2.75 2.75 0 012.75-2.87 2.84 2.84 0 012.87 2.87v16.29h18.36a2.75 2.75 0 012.63 2.64 2.65 2.65 0 01-2.63 2.53h-18.36V197c0 8.38 4.93 11.36 11.7 11.36 4 0 5.85-1.15 6.66-1.15a2.63 2.63 0 012.52 2.53 2.55 2.55 0 01-1.84 2.41 24.2 24.2 0 01-8.26 1.49c-9.03.03-16.4-4.9-16.4-16.03zM1422.87 159.29h-6.31a2.59 2.59 0 01-2.64-2.64 2.65 2.65 0 012.64-2.53h6.31v-5.73c0-6.66 1.83-11.93 5.16-15.26 3-3 7.11-4.59 12.27-4.59a29.33 29.33 0 017 .8 2.7 2.7 0 012.18 2.64 2.56 2.56 0 01-3.21 2.41 31.88 31.88 0 00-6-.69c-8 0-11.81 4.82-11.81 14.8v5.62h18.24a2.6 2.6 0 012.64 2.64 2.65 2.65 0 01-2.64 2.53h-18.24v50.94a2.75 2.75 0 01-2.76 2.87 2.84 2.84 0 01-2.86-2.87zM1455.8 183.61v-.23c0-16.41 12.73-30.63 30.17-30.63s30 14 30 30.4v.23c0 16.41-12.74 30.63-30.18 30.63s-29.99-14.01-29.99-30.4zm54 0v-.23c0-14.11-10.55-25.36-24.09-25.36-13.88 0-23.86 11.36-23.86 25.13v.23c0 14.11 10.55 25.36 24.09 25.36 13.91 0 23.89-11.36 23.89-25.13zM1533.24 156.53a2.82 2.82 0 115.63 0v14.23c5-11.36 15.25-17.55 23.52-17.55a3 3 0 013 3.09 3.05 3.05 0 01-3 3.1c-12.39 1.15-23.52 10.44-23.52 29.26v21.57a2.82 2.82 0 11-5.63 0zM1579.14 156.53a2.81 2.81 0 115.62 0v8c3.79-6.08 9.06-11.81 19.5-11.81 10.22 0 16.53 5.85 19.74 12.62 3.78-6.54 10.09-12.62 21.11-12.62 13.88 0 22.49 9.75 22.49 24.43v33a2.69 2.69 0 01-2.76 2.87 2.78 2.78 0 01-2.87-2.87v-32.28c0-12.62-6.54-20-17.32-20-9.87 0-18.47 7.57-18.47 20.65v31.67a2.69 2.69 0 01-2.76 2.87 2.77 2.77 0 01-2.86-2.87v-32.7c0-12.16-6.66-19.62-17.1-19.62s-18.7 9.18-18.7 21v31.32a2.68 2.68 0 01-2.75 2.87 2.77 2.77 0 01-2.87-2.87z"
        transform="translate(-7.94 -6.26)"
      />
      <text
        fill="#3488c8"
        style={{
          fontSize: '50px',
          fontWeight: '500',
          fontFamily: 'Inter, sans-serif',
        }}
        transform="translate(1660 261.35)"
        textAnchor="end"
      >
        <tspan>{tagline}</tspan>
      </text>
    </SvgIcon>
  );
}

export default OTLogo;
