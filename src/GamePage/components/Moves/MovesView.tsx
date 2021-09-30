import React, { memo, useCallback, useContext, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import getShortId from 'shortid';

import { Move } from './types';
import { MovesForm } from './MoveForm';
import { GameContext } from '../../../components/StoreContext';

import './Moves.css';

export const MovesView = memo(() => {
  const [moves, setMovesState] = useState<Move[]>([]);

  const { unpause, setMoves, paused } = useContext(GameContext);

  const onChange = useCallback((ind: number, info: Omit<Move, 'key'>) => {
    setMovesState(prev => [
      ...prev.slice(0, ind),
      {
        ...info,
        key: prev[ind].key,
      },
      ...prev.slice(ind + 1),
    ]);
  }, []);

  const onRemove = useCallback((ind: number) => {
    setMovesState(prev => [
      ...prev.slice(0, ind),
      ...prev.slice(ind + 1),
    ]);
  }, []);

  const onAdd = useCallback((ind: number) => {
    setMovesState(prev => [
      ...prev.slice(0, ind + 1),
      {
        key: getShortId(),
      },
      ...prev.slice(ind + 1)
    ]);
  }, []);

  const addMove = useCallback(() => {
    setMovesState(prev => [
      ...prev,
      {
        key: getShortId(),
      },
    ]);
  }, []);

  const go = useCallback(() => {
    setMoves(moves);
    unpause();
  }, [unpause, setMoves, moves]);

  return (
    <div className="MovesView">
      {moves.map((move, i) => (
        <MovesForm
          key={move.key}
          disabled={!paused}
          move={move}
          onChange={onChange}
          onRemove={onRemove}
          onAdd={i !== moves.length - 1 ? onAdd : undefined}
          ind={i}
        />
      ))}
      <div className="Controls">
        <Button
          startIcon={<Add />}
          variant="outlined"
          disabled={!paused || moves.length >= 20}
          onClick={addMove}>
          Add Move
        </Button>
        <Button variant="contained" disabled={!paused} onClick={go}>Go</Button>
      </div>
    </div>
  );
});
