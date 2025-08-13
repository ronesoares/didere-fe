import { Button as MuiButton, CircularProgress, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

const StyledButton = styled(MuiButton)(({ theme, variant, size }) => ({
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontWeight: 600,
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    transform: 'translateY(-1px)',
  },
  ...(variant === 'gradient' && {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    '&:hover': {
      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
      boxShadow: theme.shadows[8],
    },
  }),
  ...(variant === 'glass' && {
    background: theme.palette.mode === 'dark' 
      ? 'rgba(30, 41, 59, 0.8)' 
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
      background: theme.palette.mode === 'dark' 
        ? 'rgba(30, 41, 59, 0.9)' 
        : 'rgba(255, 255, 255, 0.9)',
    },
  }),
  ...(size === 'large' && {
    padding: theme.spacing(1.5, 4),
    fontSize: '1rem',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.25, 3),
      fontSize: '0.875rem',
    },
  }),
  ...(size === 'medium' && {
    padding: theme.spacing(1, 3),
    fontSize: '0.875rem',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.875, 2.5),
      fontSize: '0.8125rem',
    },
  }),
  ...(size === 'small' && {
    padding: theme.spacing(0.75, 2),
    fontSize: '0.8125rem',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.625, 1.5),
      fontSize: '0.75rem',
    },
  }),
}));

export const Button = ({ 
  children, 
  loading = false, 
  variant = 'contained',
  size = 'medium',
  fullWidth = false,
  sx = {},
  ...props 
}) => {
  const theme = useTheme();

  return (
    <StyledButton
      variant={variant === 'gradient' || variant === 'glass' ? 'contained' : variant}
      size={size}
      fullWidth={fullWidth}
      disabled={loading || props.disabled}
      sx={{
        ...sx,
        ...(fullWidth && {
          [theme.breakpoints.down('sm')]: {
            width: '100%',
          },
        }),
      }}
      {...props}
    >
      {loading && (
        <CircularProgress
          size={20}
          sx={{
            mr: 1,
            color: 'inherit',
          }}
        />
      )}
      {children}
    </StyledButton>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool,
  variant: PropTypes.oneOf(['text', 'outlined', 'contained', 'gradient', 'glass']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  sx: PropTypes.object,
};

