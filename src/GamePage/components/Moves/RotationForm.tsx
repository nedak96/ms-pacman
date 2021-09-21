import React, { memo, useCallback, useMemo } from 'react';
import getShortId from 'shortid';
import { DegreeOptions, MoveType, RotationMove } from './types';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
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
    });
  }, [onChange]);

  return (
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
  );
});
