import React from 'react';
import Select from 'react-select';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';

import Control from "./Control";
import Input from "./Input";
import Placeholder from './Placeholder';
import NoOptionsMessage from './NoOptionsMessage';
import SingleValue from './SingleValue';
import ValueContainer from './ValueContainer';
import Menu from './MenuFilter';
import MultiValue from './MultiValue';
import OptionFilter from './OptionFilter';

const styles = theme => ({
  root: {
    position: 'relative',
    minWidth: '70px',
  },
  wide: {
    minWidth: '300px',
  },
});

const IndicatorSeparator = () => null;

const ClearIndicator = () => null;

const OptionContainer = props => {
  const { children, innerRef, innerProps, isFocused, isSelected } = props;
  return (
    <MenuItem
      buttonRef={innerRef}
      selected={isFocused}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
        maxWidth: '800px',
        padding: 0,
        height: 'auto',
      }}
      {...innerProps}
    >
      {children}
    </MenuItem>
  );
};

class Autocomplete extends React.Component {
  state = {
    value: null,
  };
  handleChange = value => {
    this.setState({ value });
  };
  render() {
    const {
      classes,
      theme,
      placeholder,
      options,
      multiple,
      value,
      handleSelectOption,
      getOptionLabel,
      getOptionValue,
      OptionComponent,
      wide,
    } = this.props;

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
      }),
      menuPortal: base => ({ ...base, zIndex: 9999 }),
    };

    const Option = ({ data, children, isSelected, ...rest }) => {
      return (
        <OptionContainer {...rest}>
          {OptionComponent ? (
            <OptionComponent data={data}>{children}</OptionComponent>
          ) : (
            <OptionFilter data={data}>{children}</OptionFilter>
          )}
        </OptionContainer>
      );
    };

    const components = {
      Control,
      NoOptionsMessage,
      Placeholder,
      SingleValue,
      ValueContainer,
      Menu,
      Option,
      MultiValue,
      IndicatorSeparator,
      ClearIndicator,
      Input,
    };

    return (
      <div className={classNames(classes.root, { [classes.wide]: wide })}>
        <Select
          options={options}
          styles={selectStyles}
          components={components}
          value={value}
          onChange={handleSelectOption}
          placeholder={placeholder}
          isMulti={multiple}
          hideSelectedOptions={false}
          getOptionLabel={getOptionLabel}
          getOptionValue={getOptionValue}
          menuPlacement="auto"
          menuPosition="absolute"
        />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Autocomplete);
