import React, { memo, useCallback, useContext, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Replay } from '@mui/icons-material';

import { GameContext } from '../../components/StoreContext';

import './GameControls.css';

export const GameControls = memo(() => {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const { reset, paused } = useContext(GameContext);

  return (
    <div className="GameControls">
      <Button variant="outlined" onClick={handleOpen}>
        Instructions
      </Button>
      <Button
        startIcon={<Replay />}
        disabled={paused}
        onClick={reset}
        variant="contained">
        Retry
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Instructions</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ms. Pacman can not be upside down. To translate in a direction, you
            must be facing that direction.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});
