import { useState } from 'react';
import { Fab, Tooltip } from '@mui/material';
import { LightBulb as LightBulbIcon } from '../icons/light-bulb';
import { SettingsDrawer } from './settings-drawer';

export const SettingsButton = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Escolha o tema">
        <Fab
          color="primary"
          onClick={handleOpen}
          size="medium"
          sx={{
            bottom: 0,
            margin: (theme) => theme.spacing(4),
            position: 'fixed',
            right: 0,
            zIndex: 1900
          }}
        >
          <LightBulbIcon fontSize="small" />
        </Fab>
      </Tooltip>
      <SettingsDrawer
        onClose={handleClose}
        open={open}
      />
    </>
  );
};
