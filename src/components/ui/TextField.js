import { TextField as MuiTextField, InputAdornment, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

const StyledTextField = styled(MuiTextField)(({ theme, variant }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create(['border-color', 'box-shadow'], {
      duration: theme.transitions.duration.short,
    }),
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 2,
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 3px ${theme.palette.primary.main}20`,
      },
    },
    '&.Mui-error': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.error.main,
      },
      '&.Mui-focused': {
        '& .MuiOutlinedInput-notchedOutline': {
          boxShadow: `0 0 0 3px ${theme.palette.error.main}20`,
        },
      },
    },
  },
  ...(variant === 'glass' && {
    '& .MuiOutlinedInput-root': {
      background: theme.palette.mode === 'dark' 
        ? 'rgba(30, 41, 59, 0.8)' 
        : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
    },
  }),
  [theme.breakpoints.down('sm')]: {
    '& .MuiInputLabel-root': {
      fontSize: '0.875rem',
    },
    '& .MuiOutlinedInput-input': {
      fontSize: '0.875rem',
      padding: theme.spacing(1.5),
    },
  },
}));

export const TextField = ({ 
  startIcon,
  endIcon,
  variant = 'outlined',
  fullWidth = true,
  sx = {},
  ...props 
}) => {
  const theme = useTheme();

  const InputProps = {
    ...(startIcon && {
      startAdornment: (
        <InputAdornment position="start">
          {startIcon}
        </InputAdornment>
      ),
    }),
    ...(endIcon && {
      endAdornment: (
        <InputAdornment position="end">
          {endIcon}
        </InputAdornment>
      ),
    }),
    ...props.InputProps,
  };

  return (
    <StyledTextField
      variant={variant === 'glass' ? 'outlined' : variant}
      fullWidth={fullWidth}
      InputProps={InputProps}
      sx={{
        ...sx,
        [theme.breakpoints.down('sm')]: {
          mb: 2,
          ...sx[theme.breakpoints.down('sm')],
        },
      }}
      {...props}
    />
  );
};

TextField.propTypes = {
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  variant: PropTypes.oneOf(['outlined', 'filled', 'standard', 'glass']),
  fullWidth: PropTypes.bool,
  sx: PropTypes.object,
};

