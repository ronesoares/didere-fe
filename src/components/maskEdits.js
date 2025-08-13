import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';

export function TelefoneCelularMaskEdit(props) {
    const { inputRef, ...other } = props;
  
    return (
      <MaskedInput
        {...other}
        mask={['(', /[1-9]/, /\d/,')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/,'-', /\d/, /\d/, /\d/, /\d/]}
        placeholderChar={'\u2000'}
        ref={inputRef}
      />
    );
  };

  TelefoneCelularMaskEdit.propTypes = {
    inputRef: PropTypes.func.isRequired,
  };

  export function CpfMaskEdit(props) {
    const { inputRef, ...other } = props;
  
    return (
      <MaskedInput
        {...other}
        mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/,'-',/\d/, /\d/]}
        placeholderChar={'\u2000'}
        required
        ref={inputRef}
      />
    );
  }
  
  CpfMaskEdit.propTypes = {
    inputRef: PropTypes.func.isRequired,
  };

  export function CEPMaskEdit(props) {
    const { inputRef, ...other } = props;
  
    return (
      <MaskedInput
        {...other}
        mask={[/\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
        placeholderChar={'\u2000'}
        ref={inputRef}
      />
    );
  }
  
  CEPMaskEdit.propTypes = {
    inputRef: PropTypes.func.isRequired,
  };