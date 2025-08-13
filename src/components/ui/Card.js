import { Card as MuiCard, CardContent, CardActions, CardHeader, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

const StyledCard = styled(MuiCard)(({ theme, variant, hover }) => ({
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.short,
  }),
  ...(hover && {
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[8],
    },
  }),
  ...(variant === 'outlined' && {
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none',
  }),
  ...(variant === 'glass' && {
    background: theme.palette.mode === 'dark' 
      ? 'rgba(30, 41, 59, 0.8)' 
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${theme.palette.divider}`,
  }),
}));

export const Card = ({ 
  children, 
  header, 
  actions, 
  variant = 'elevation', 
  hover = false,
  sx = {},
  ...props 
}) => {
  const theme = useTheme();

  return (
    <StyledCard 
      variant={variant === 'glass' ? 'outlined' : variant}
      hover={hover}
      sx={{
        ...sx,
        [theme.breakpoints.down('sm')]: {
          margin: theme.spacing(1),
          borderRadius: theme.spacing(2),
        },
      }}
      {...props}
    >
      {header && (
        <CardHeader 
          {...(typeof header === 'string' ? { title: header } : header)}
          sx={{
            pb: 1,
            [theme.breakpoints.down('sm')]: {
              px: 2,
              pt: 2,
            },
          }}
        />
      )}
      <CardContent
        sx={{
          [theme.breakpoints.down('sm')]: {
            px: 2,
          },
        }}
      >
        {children}
      </CardContent>
      {actions && (
        <CardActions
          sx={{
            pt: 0,
            [theme.breakpoints.down('sm')]: {
              px: 2,
              pb: 2,
            },
          }}
        >
          {actions}
        </CardActions>
      )}
    </StyledCard>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  actions: PropTypes.node,
  variant: PropTypes.oneOf(['elevation', 'outlined', 'glass']),
  hover: PropTypes.bool,
  sx: PropTypes.object,
};

