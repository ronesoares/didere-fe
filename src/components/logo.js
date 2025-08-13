import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { restoreSettings } from '../contexts/settings-context';

export const Logo = styled((props) => {
  const { variant, ...other } = props;

  const color = variant === 'light' ? '#C1C4D6' : '#0167A5';
  const source = restoreSettings()?.theme === 'light' 
    ? 'https://i.ibb.co/20fx54TT/logo-light-didere.png' 
    : 'https://i.ibb.co/DPfvZSvt/logo-dark-didere.png';

  return (
    <img
      alt="Components"
      color={color}
      width={217}
      height={60}
      src={source}
      inputMode='url'
    />
  );
})``;

Logo.defaultProps = {
  variant: 'primary'
};

Logo.propTypes = {
  variant: PropTypes.oneOf(['light', 'primary'])
};
