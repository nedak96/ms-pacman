import React, { FC, useCallback, useMemo } from 'react';
import getShortId from 'shortid';
import { Move, MoveType } from './types';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, IconButton } from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import './Moves.css';
import { TranslationForm } from './TranslationForm';
import { ReflectionForm } from './ReflectionForm';
import { RotationForm } from './RotationForm';

interface Props {
  disabled: boolean;
  move: Move;
  onChange(move: Omit<Move, 'key'>): void;
  onRemove(): void;
  onAdd?(): void;
}

export const MovesForm: FC<Props> = ({
  disabled,
  move,
  onChange,
  onRemove,
  onAdd,
}: Props) => {
  const labelId = useMemo(() => [getShortId(), getShortId(), getShortId()], []);

  const onTypeChange = useCallback((e: SelectChangeEvent) => {
    onChange({
      type: e.target.value as MoveType,
    });
  }, [onChange]);

  return (
    <div className="MoveForm">
      <FormControl className="TypeCell">
        <InputLabel id={labelId[0]}>Type</InputLabel>
        <Select
          labelId={labelId[0]}
          disabled={disabled}
          onChange={onTypeChange}
          value={move.type || ''}
          label="Type">
          {Object.values(MoveType).map((t) =>
            <MenuItem key={t} value={t}>{t}</MenuItem>
          )}
        </Select>
      </FormControl>
      {move.type === MoveType.TRANSLATION && (
        <TranslationForm
          onChange={onChange}
          move={move}
          disabled={disabled}
        />
      )}
      {move.type === MoveType.REFLECTION && (
        <ReflectionForm
          onChange={onChange}
          move={move}
          disabled={disabled}
        />
      )}
      {move.type === MoveType.ROTATION && (
        <RotationForm
          onChange={onChange}
          move={move}
          disabled={disabled}
        />
      )}
      <IconButton
        color="error"
        disabled={disabled}
        className="IconButton"
        onClick={onRemove}>
        <RemoveCircle />
      </IconButton>
      {onAdd && (
        <IconButton
          color="success"
          disabled={disabled}
          className="IconButton AddButton"
          onClick={onAdd}>
          <AddCircle />
        </IconButton>
      )}
    </div>
  );
};
