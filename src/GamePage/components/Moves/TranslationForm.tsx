import React, { ChangeEventHandler, memo, useCallback, useMemo } from 'react';
import getShortId from 'shortid';
import { DirectionOptions, MoveType, TranslationMove } from './types';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, TextField } from '@mui/material';
import './Moves.css';

interface Props {
  disabled: boolean;
  move: TranslationMove;
  onChange(move: Omit<TranslationMove, 'key'>): void;
}

export const TranslationForm = memo<Props>(({
  onChange,
  move,
  disabled,
}) => {
  const labelId = useMemo(getShortId, []);

  const onDirectionChange = useCallback((e: SelectChangeEvent) => {
    onChange({
      type: MoveType.TRANSLATION,
      direction: e.target.value as DirectionOptions,
    });
  }, [onChange]);

  const onStepsChange = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    onChange({
      type: MoveType.TRANSLATION,
      direction: move.direction,
      n: e.target.value === '' ? undefined : Number(e.target.value),
    });
  }, [move.direction]);

  return (
    <>
      <FormControl className="DirectionCell">
        <InputLabel id={labelId}>Direction</InputLabel>
        <Select
          labelId={labelId}
          disabled={disabled}
          onChange={onDirectionChange}
          value={move.direction}
          label="Direction">
          {Object.values(DirectionOptions).map((t) =>
            <MenuItem value={t}>{t}</MenuItem>
          )}
        </Select>
      </FormControl>
      <TextField
        label="Steps"
        type="number"
        onChange={onStepsChange}
        value={move.n}
        disabled={disabled}
        InputProps={{
          inputProps: {
            max: 29,
            min: -29,
            step: 1,
          },
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </>
  );
});
