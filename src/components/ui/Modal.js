import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  IconButton,
  Typography,
  Slide,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close as CloseIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledDialog = styled(Dialog)(({ theme, size }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius * 2,
    ...(size === 'small' && {
      maxWidth: 400,
    }),
    ...(size === 'medium' && {
      maxWidth: 600,
    }),
    ...(size === 'large' && {
      maxWidth: 900,
    }),
    ...(size === 'fullscreen' && {
      maxWidth: '100vw',
      maxHeight: '100vh',
      margin: 0,
      borderRadius: 0,
    }),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(2),
      maxHeight: `calc(100vh - ${theme.spacing(4)})`,
      ...(size === 'fullscreen' && {
        margin: 0,
        maxHeight: '100vh',
        borderRadius: 0,
      }),
    },
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderTop: `1px solid ${theme.palette.divider}`,
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    flexDirection: 'column-reverse',
    '& > *': {
      width: '100%',
      margin: 0,
    },
  },
}));

export const Modal = ({ 
  open = false,
  onClose,
  title,
  children,
  actions,
  size = 'medium',
  fullScreen = false,
  disableBackdropClick = false,
  sx = {},
  ...props 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isFullScreen = fullScreen || (isMobile && size === 'fullscreen');

  const handleClose = (event, reason) => {
    if (disableBackdropClick && reason === 'backdropClick') {
      return;
    }
    onClose && onClose(event, reason);
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      size={size}
      fullScreen={isFullScreen}
      TransitionComponent={Transition}
      sx={sx}
      {...props}
    >
      {title && (
        <StyledDialogTitle>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {onClose && (
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: theme.palette.grey[500],
                '&:hover': {
                  backgroundColor: theme.palette.grey[100],
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </StyledDialogTitle>
      )}
      <StyledDialogContent>
        {children}
      </StyledDialogContent>
      {actions && (
        <StyledDialogActions>
          {actions}
        </StyledDialogActions>
      )}
    </StyledDialog>
  );
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  actions: PropTypes.node,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'fullscreen']),
  fullScreen: PropTypes.bool,
  disableBackdropClick: PropTypes.bool,
  sx: PropTypes.object,
};

