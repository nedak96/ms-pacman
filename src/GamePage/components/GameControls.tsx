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
            In this game of Ms. Pac-Man, your task is to move her using translations,
            rotations, and reflections. Remember that Ms. Pacman has to be facing
            the direction she is moving, and she always has to be “right side up”.
            Let’s see if you can get the high score!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});
