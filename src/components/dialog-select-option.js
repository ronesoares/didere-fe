import { Avatar, Box, Button, Dialog, Divider, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { QuestionAnswerOutlined as QuestionAnswerIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';

export const DialogSelectOption = (props) => {
    const {
        title,
        description,
        cancelButton,
        okButton,
        onSubmitOk,
        onSubmitCancel,
        labelOptions,
        listOptions,
        selected,
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
                        backgroundColor: (theme) => alpha(theme.palette.info.main, 0.08),
                        color: 'info.main',
                        mr: 2
                        }}
                    >
                        <QuestionAnswerIcon fontSize="small" />
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
                        <Divider sx={{ my: 3 }} />
                        <TextField
                            fullWidth
                            select
                            required
                            name="selected"
                            id="selected"
                            label={labelOptions}
                            onChange={(event) => {
                                selected(event.target.value);
                            }}
                            variant="outlined"
                            style={{ display: 'block' }}
                        >
                            {listOptions?.sort((a, b) => a.name.localeCompare(b.name)).map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.name}
                            </MenuItem>
                            ))}
                        </TextField>
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
                        backgroundColor: 'info.main',
                        '&:hover': {
                            backgroundColor: 'info.dark'
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

DialogSelectOption.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    cancelButton: PropTypes.string.isRequired,
    okButton: PropTypes.string.isRequired,
    onSubmitOk: PropTypes.func.isRequired,
    onSubmitCancel: PropTypes.func.isRequired,
    labelOptions: PropTypes.string.isRequired,
    listOptions: PropTypes.array.isRequired,
    selected: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};