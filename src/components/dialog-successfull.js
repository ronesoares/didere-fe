import { Avatar, Box, Button, Dialog, Paper, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Check as CheckIcon } from '../../../icons/check';
import PropTypes from 'prop-types';

export const DialogSuccessfull = (props) => {
    const {
        title,
        description,
        okbutton,
        onsubmitok,
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
                <Paper
                    elevation={12}
                    sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                    }}
                >
                    <Avatar
                        sx={{
                            backgroundColor: (theme) => alpha(theme.palette.success.main, 0.08),
                            color: 'success.main',
                            mb: 2
                        }}
                    >
                    <CheckIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="h5">
                        {title}
                    </Typography>
                    <Typography
                        align="center"
                        color="textSecondary"
                        sx={{ mt: 1 }}
                        variant="body2"
                    >
                        {description}
                    </Typography>
                    <Button
                        fullWidth
                        size="large"
                        sx={{ mt: 4 }}
                        variant="contained"
                        onClick={onsubmitok}
                    >
                        {okbutton}
                    </Button>
                </Paper>
            </Box>
        </Dialog>
    );
};

DialogSuccessfull.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    okbutton: PropTypes.string.isRequired,
    onsubmitok: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};