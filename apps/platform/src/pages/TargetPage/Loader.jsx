import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  Paper,
  Container,
  Chip,
  Stack,
  useTheme,
  alpha,
} from "@mui/material";
import { keyframes } from "@mui/system";

export const AnimatedHelixLoader = () => {
  const theme = useTheme();
  const pixelSize = 3;
  const [currentAnimation, setCurrentAnimation] = useState("pulse");

  const pixelMap = [
    // Top
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    // First element
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    // empty spacing row
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    // : dark blue middle bar
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    // empty spacing row
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    // light blue horizontal bar
    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    // spacing rows
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    // bottom dark blue point shape
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    // Bottom
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const getColor = value => {
    switch (value) {
      case 1:
        return "#2a86c0"; // Dark blue
      case 2:
        return "#aad5f3"; // Light blue
      default:
        return "transparent";
    }
  };

  const getPixelDelay = (rowIdx, colIdx) => {
    switch (currentAnimation) {
      case "wave":
        return (rowIdx + colIdx) * 0.05;
      case "cascade":
        return rowIdx * 0.1;
      case "center":
        const centerRow = pixelMap.length / 2;
        const centerCol = 25 / 2;
        const distance = Math.sqrt(
          Math.pow(rowIdx - centerRow, 2) + Math.pow(colIdx - centerCol, 2)
        );
        return distance * 0.05;
      case "random":
        return Math.random() * 2;
      case "helix-rotate":
        // Create rotating helix effect - different timing for top/bottom sections
        if (rowIdx < 6) return (colIdx * 0.1); // Top section
        if (rowIdx >= 7 && rowIdx <= 11) return ((24 - colIdx) * 0.05); // Middle bar (reverse)
        if (rowIdx >= 13 && rowIdx <= 17) return (colIdx * 0.08); // Middle section
        if (rowIdx >= 19 && rowIdx <= 22) return ((12 - Math.abs(colIdx - 12)) * 0.06); // Bottom section
        return 0;
      case "helix-flow":
        // Create flowing effect along the helix structure
        if (rowIdx < 6) return (rowIdx + colIdx) * 0.15; // Top diagonal
        if (rowIdx >= 7 && rowIdx <= 11) return (rowIdx * 0.2); // Middle bar
        if (rowIdx >= 13 && rowIdx <= 17) return ((rowIdx - 13) + (18 - colIdx)) * 0.1; // Bottom diagonal
        if (rowIdx >= 19 && rowIdx <= 22) return ((22 - rowIdx) + Math.abs(colIdx - 12)) * 0.1; // Bottom point
        return 0;
      default:
        return 0;
    }
  };

  // Define keyframes using MUI's keyframes
  const pulseAnimation = keyframes`
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(0.95);
    }
  `;

  const helixRotateAnimation = keyframes`
    0% {
      opacity: 1;
      transform: scale(1);
    }
    25% {
      opacity: 0.3;
      transform: scale(0.8);
    }
    50% {
      opacity: 0.1;
      transform: scale(0.6);
    }
    75% {
      opacity: 0.3;
      transform: scale(0.8);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  `;

  const helixFlowAnimation = keyframes`
    0% {
      opacity: 0;
      transform: scale(0.5);
    }
    50% {
      opacity: 1;
      transform: scale(1.1);
    }
    100% {
      opacity: 0;
      transform: scale(0.5);
    }
  `;

  const AnimatedPixel = ({ value, rowIdx, colIdx }) => {
    const delay = getPixelDelay(rowIdx, colIdx);

    const getAnimationSx = () => {
      const baseStyle = {
        width: pixelSize,
        height: pixelSize,
        backgroundColor: value === 0 ? "transparent" : getColor(value),
        borderRadius: "2px",
        transition: "all 0.3s ease",
      };

      switch (currentAnimation) {
        case "pulse":
          return {
            ...baseStyle,
            animation: `${pulseAnimation} 2s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          };
        case "wave":
          return {
            ...baseStyle,
            animation: `${pulseAnimation} 1s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          };
        case "cascade":
          return {
            ...baseStyle,
            animation: `${pulseAnimation} 0.8s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          };
        case "center":
          return {
            ...baseStyle,
            animation: `${pulseAnimation} 1.2s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          };
        case "random":
          return {
            ...baseStyle,
            animation: `${pulseAnimation} ${0.5 + Math.random()}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          };
        case "helix-rotate":
          return {
            ...baseStyle,
            animation: `${helixRotateAnimation} 3s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          };
        case "helix-flow":
          return {
            ...baseStyle,
            animation: `${helixFlowAnimation} 2s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          };
        default:
          return baseStyle;
      }
    };

    return <Box sx={getAnimationSx()} />;
  };

  const animations = ["pulse", "wave", "cascade", "center", "random", "helix-rotate", "helix-flow"];

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          // bgcolor: "grey.900",
          py: 4,
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: "white",
              mb: 2,
              fontWeight: "bold",
            }}
          >
            Helix DNA Loader
          </Typography>

          {/* Animation Controls */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: "grey.400", mb: 2 }}>
              Choose Animation Style:
            </Typography>
            <ButtonGroup variant="contained" size="small" sx={{ flexWrap: "wrap", gap: 1 }}>
              {animations.map(animation => (
                <Button
                  key={animation}
                  onClick={() => setCurrentAnimation(animation)}
                  variant={currentAnimation === animation ? "contained" : "outlined"}
                  sx={{
                    textTransform: "capitalize",
                    minWidth: "auto",
                    px: 2,
                    bgcolor: currentAnimation === animation ? "primary.main" : "transparent",
                    borderColor: "primary.main",
                    color: currentAnimation === animation ? "white" : "primary.main",
                    "&:hover": {
                      bgcolor:
                        currentAnimation === animation
                          ? "primary.dark"
                          : alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  {animation}
                </Button>
              ))}
            </ButtonGroup>
          </Box>
        </Box>

        {/* Logo Container */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            bgcolor: "transparent",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(25, ${pixelSize}px)`,
              gridTemplateRows: `repeat(${pixelMap.length}, ${pixelSize}px)`,
              gap: "0px",
              margin: "0 auto",
            }}
          >
            {pixelMap.map((row, rowIdx) =>
              row.map((val, colIdx) => (
                <AnimatedPixel
                  key={`${rowIdx}-${colIdx}`}
                  value={val}
                  rowIdx={rowIdx}
                  colIdx={colIdx}
                />
              ))
            )}
          </Box>
        </Paper>

        {/* Loading Indicator */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 4 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              bgcolor: "primary.light",
              borderRadius: "50%",
              animation: `${pulseAnimation} 1s ease-in-out infinite`,
            }}
          />
          <Typography variant="h6" sx={{ color: "grey.300" }}>
            Loading...
          </Typography>
          <Box
            sx={{
              width: 12,
              height: 12,
              bgcolor: "primary.main",
              borderRadius: "50%",
              animation: `${pulseAnimation} 1s ease-in-out infinite`,
              animationDelay: "0.5s",
            }}
          />
        </Stack>

        {/* Current Animation Chip */}
        <Chip
          label={`Current: ${currentAnimation}`}
          variant="outlined"
          size="small"
          sx={{
            mt: 2,
            color: "primary.main",
            borderColor: "primary.main",
            bgcolor: alpha(theme.palette.primary.main, 0.1),
          }}
        />

        {/* Color Legend */}
        <Stack direction="row" spacing={3} sx={{ mt: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "#2a86c0",
                borderRadius: 1,
              }}
            />
            <Typography variant="caption" sx={{ color: "grey.400" }}>
              Dark Blue (#2a86c0)
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "#aad5f3",
                borderRadius: 1,
              }}
            />
            <Typography variant="caption" sx={{ color: "grey.400" }}>
              Light Blue (#aad5f3)
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
};

// Simple usage example:
export const LoaderComponent = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // bgcolor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <AnimatedHelixLoader />
    </Box>
  );
};

// Minimal version for quick use:
export const SimpleHelixLoader = ({ size = 15 }) => {
  const pixelMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const pulseAnimation = keyframes`
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(0.95); }
  `;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(25, ${size}px)`,
        gridTemplateRows: `repeat(${pixelMap.length}, ${size}px)`,
        gap: "2px",
      }}
    >
      {pixelMap.map((row, rowIdx) =>
        row.map((val, colIdx) => (
          <Box
            key={`${rowIdx}-${colIdx}`}
            sx={{
              width: size,
              height: size,
              backgroundColor: val === 1 ? "#2a86c0" : val === 2 ? "#aad5f3" : "transparent",
              borderRadius: "1px",
              animation: val !== 0 ? `${pulseAnimation} 2s ease-in-out infinite` : "none",
              animationDelay: `${(rowIdx + colIdx) * 0.1}s`,
            }}
          />
        ))
      )}
    </Box>
  );
};