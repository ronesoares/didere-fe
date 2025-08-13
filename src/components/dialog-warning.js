import { Avatar, Box, Button, Dialog, Paper, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { WarningOutlined as WarningIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';

export const DialogWarning = (props) => {
    const {
        title,
        description,
        cancelButton,
        okButton,
        onSubmitOk,
        onSubmitCancel,
        open,
        ...other
      } = props;

    return (
        <Dialog
            maxWidth="md"
            scroll='paper'
            open={open}
            {...other}
        >
            <Box
                sx={{
                backgroundColor: 'background.default',
                minHeight: '100%',
                p: 1
                }}
            >
                <Paper elevation={12}>
                    <Box
                    sx={{
                        display: 'flex',
                        pb: 2,
                        pt: 3,
                        px: 3
                    }}
                    >
                    <Avatar
                        sx={{
                        backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
                        color: 'error.main',
                        mr: 2
                        }}
                    >
                        <WarningIcon fontSize="small" />
                    </Avatar>
                    <div>
                        <Typography variant="h5">
                            {title}
                        </Typography>
                        <Typography
                        color="textSecondary"
                        sx={{ mt: 1 }}
                        variant="body2"
                        >
                            {description}
                        </Typography>
                    </div>
                    </Box>
                    <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        px: 3,
                        py: 1.5
                    }}
                    >
                    <Button
                        sx={{ mr: 2 }}
                        variant="outlined"
                        onClick={onSubmitCancel}
                    >
                        {cancelButton}
                    </Button>
                    <Button
                        sx={{
                        backgroundColor: 'error.main',
                        '&:hover': {
                            backgroundColor: 'error.dark'
                        }
                        }}
                        variant="contained"
                        onClick={onSubmitOk}
                    >
                        {okButton}
                    </Button>
                    </Box>
                </Paper>
            </Box>
        </Dialog>
    );
};

DialogWarning.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    cancelButton: PropTypes.string.isRequired,
    okButton: PropTypes.string.isRequired,
    onSubmitOk: PropTypes.func.isRequired,
    onSubmitCancel: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};