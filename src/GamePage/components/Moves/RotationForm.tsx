import React, { ChangeEventHandler, memo, useCallback, useMemo } from 'react';
import getShortId from 'shortid';
import { isUndefined } from 'lodash';
import { DegreeOptions, MoveType, RotationMove } from './types';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, TextField } from '@mui/material';
import './Moves.css';

interface Props {
  disabled: boolean;
  move: RotationMove;
  onChange(move: Omit<RotationMove, 'key'>): void;
}

export const RotationForm = memo<Props>(({
  onChange,
  move,
  disabled,
}) => {
  const labelId = useMemo(getShortId, []);

  const onDegreesChange = useCallback((e: SelectChangeEvent) => {
    onChange({
      type: MoveType.ROTATION,
      degrees: e.target.value as DegreeOptions,
      x: move.x,
      y: move.y,
    });
  }, [onChange, move.x, move.y]);

  const onXChange = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    onChange({
      type: MoveType.ROTATION,
      degrees: move.degrees,
      y: move.y,
      x: e.target.value === '' ? undefined : Math.round(Number(e.target.value)),
    });
  }, [onChange, move.degrees, move.y]);

  const onYChange = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    onChange({
      type: MoveType.ROTATION,
      degrees: move.degrees,
      x: move.x,
      y: e.target.value === '' ? undefined : Math.round(Number(e.target.value)),
    });
  }, [onChange, move.degrees, move.x]);

  return (
    <>
      <FormControl className="DegreesCell">
        <InputLabel id={labelId}>Degrees</InputLabel>
        <Select
          labelId={labelId}
          disabled={disabled}
          onChange={onDegreesChange}
          value={move.degrees || ''}
          displayEmpty
          label="Degrees">
          {Object.values(DegreeOptions).map((t) =>
            <MenuItem key={t} value={t}>{t}</MenuItem>
          )}
        </Select>
      </FormControl>
      <TextField
        label="X"
        type="number"
        onChange={onXChange}
        value={isUndefined(move.x) ? '' : move.x}
        disabled={disabled}
        InputProps={{
          inputProps: {
            min: -12,
            max: 13,
            step: 1,
          },
        }}
      />
      <TextField
        label="Y"
        type="number"
        onChange={onYChange}
        value={isUndefined(move.y) ? '' : move.y}
        disabled={disabled}
        InputProps={{
          inputProps: {
            min: -14,
            max: 14,
            step: 1,
          },
        }}
     />
    </>
  );
});
