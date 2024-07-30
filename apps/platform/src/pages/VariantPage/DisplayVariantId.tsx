import { useState } from "react";
import { Box, Button, Popover, Typography } from "@mui/material";

function DisplayVariantId({ variantId, referenceAllele, alternateAllele, maxChars = 3 }) {

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'popover' : undefined;

  const stem = variantId.split('_').slice(0, -2).join('_');
  const longReferenceAllele = referenceAllele.length > maxChars;
  const longAlternateAllele = alternateAllele.length > maxChars;
  const fullName = `${stem}_${referenceAllele}_${alternateAllele}`;

  if (longReferenceAllele || longAlternateAllele) {
    return (
      <div>
        <Box
          aria-describedby={id}
          onClick={handleClick}
          sx={{
            cursor: "pointer",
            // outline: "2px solid",
            "&:hover": {
              // outlineColor: "red"
              // background: "pink"
            }
          }}
        >
          {stem}
          _
          {longReferenceAllele
            ? <HighlightBox>...</HighlightBox>  // or use DEL
            : referenceAllele
          }
          _
          {longAlternateAllele
            ? <HighlightBox>...</HighlightBox>  // or use INS
            : alternateAllele
          }
        </Box>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          // marginThreshold={32}
          slotProps={{
            paper: {
              sx: {
                padding: 1,
              }
            }
          }}  
        >
          <Typography
            variant="body2"
            sx={{
              textWrap: "wrap",
              wordWrap: "break-word",
            }}
          >
            {fullName}
          </Typography>
          <Button sx={{mt: "1em", float: "right"}}>
            Copy icon
          </Button>
        </Popover>
      </div>
    );
  }

  return fullName;

}

function HighlightBox({ children }) {
  return (
    <Box
      display="inline-block"
      border="1px solid"
      borderRadius={5}
      mx={0.5}
      px={0.5}
      bgcolor="#3489ca22"  // HARDCODED! - and may want faint of current color
    >
      {children}
    </Box>
  );
}

export default DisplayVariantId;

// TODO:
// - when hover on name, highlight the div - maybe with outline and offset to avoid space
//   differences to when no hover or other entities, but not currently working?! - because
//   parent cutting it off?
//   - will need to make space in the header component itself - keep appearance change to a min
// - copy button
//   - use copy icon
//   - add functinality! - see copy from data-downalaods schema or from AOTF export
//     - create e.g. package/ui/utiil - create a helpers file with a copy function
//            and snackbar component ideally
//   - indicate that copied to clipboard after click?
// - ensure works anywhere use variant name
// - larger space to sides of box when wide - but using marginThreshold does not work?
// - test with variant names of different sizes
// - what set maxChars to?
// - add a type for the props
// - add space between name and popover
// - does popover need a close button?
