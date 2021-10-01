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
  onChange(ind: number, move: Omit<Move, 'key'>): void;
  onRemove(ind: number): void;
  onAdd?(ind: number): void;
  ind: number;
}

export const MovesForm: FC<Props> = ({
  disabled,
  move,
  onChange: handleOnChange,
  onRemove: handleOnRemove,
  onAdd: handleOnAdd,
  ind,
}: Props) => {
  const labelId = useMemo(getShortId, []);

  const onChange = useCallback((move: Omit<Move, 'key'>) => handleOnChange(ind, move), [ind, handleOnChange]);

  const onTypeChange = useCallback((e: SelectChangeEvent) => {
    onChange({
      type: e.target.value as MoveType,
    });
  }, [onChange, ind]);

  const onRemove = useCallback(() => handleOnRemove(ind), [ind, handleOnRemove]);
  const onAdd = useCallback(() => handleOnAdd && handleOnAdd(ind), [ind, handleOnAdd]);

  return (
    <div className="MoveForm">
      <FormControl className="TypeCell">
        <InputLabel id={labelId}>Type</InputLabel>
        <Select
          labelId={labelId}
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
      {handleOnAdd && (
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
