import { useEffect, useState } from 'react';
import { Grid, Input, IconButton, styled } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import useAotfContext from './hooks/useAotfContext';
import useDebounce from '../../hooks/useDebounce';

const InputContainer = styled(Grid)({
  marginRight: '15px',
  width: '250px',
  '& input': {
    width: '220px',
  },
});

function SearchInput({ placeholder = 'Search' }) {
  const { handleSearchInputChange } = useAotfContext();
  const [inputValue, setInputValue] = useState('');
  const debouncedInputValue = useDebounce(inputValue, 300);

  const handleInputChange = e => {
    setInputValue(e.target.value);
  };

  const handleInputClean = () => {
    setInputValue('');
  };

  useEffect(
    () => {
      handleSearchInputChange(debouncedInputValue);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedInputValue]
  );

  return (
    <InputContainer container>
      <Grid item xs={12}>
        <Input
          autoComplete="off"
          startAdornment={<SearchIcon />}
          endAdornment={
            !!inputValue && (
              <IconButton onClick={handleInputClean}>
                <ClearIcon />
              </IconButton>
            )
          }
          placeholder={placeholder}
          label="Filter"
          onChange={handleInputChange}
          value={inputValue}
        />
      </Grid>
    </InputContainer>
  );
}

export default SearchInput;
