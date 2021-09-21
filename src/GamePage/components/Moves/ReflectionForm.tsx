import React, { ChangeEventHandler, memo, useCallback, useMemo } from 'react';
import getShortId from 'shortid';
import { AxisOptions, MoveType, ReflectionMove } from './types';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, TextField } from '@mui/material';
import './Moves.css';

interface Props {
  disabled: boolean;
  move: ReflectionMove;
  onChange(move: Omit<ReflectionMove, 'key'>): void;
}

export const ReflectionForm = memo<Props>(({
  onChange,
  move,
  disabled,
}) => {
  const labelId = useMemo(getShortId, []);

  const onAxisChange = useCallback((e: SelectChangeEvent) => {
    onChange({
      type: MoveType.REFLECTION,
      axis: e.target.value as AxisOptions,
    });
  }, [onChange]);

  const onNChange = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    onChange({
      type: MoveType.REFLECTION,
      axis: move.axis,
      n: e.target.value === '' ? undefined : Math.round(Number(e.target.value)),
    });
  }, [move.axis]);

  return (
    <>
     <FormControl className="AxisCell">
       <InputLabel id={labelId}>Axis</InputLabel>
       <Select
         labelId={labelId}
         disabled={disabled}
         onChange={onAxisChange}
         value={move.axis}
         label="Axis">
         {Object.values(AxisOptions).map((t) =>
           <MenuItem value={t}>{t}</MenuItem>
         )}
       </Select>
     </FormControl>
     <p>
       =
     </p>
     <TextField
       type="number"
       onChange={onNChange}
       value={move.n}
       disabled={disabled || !move.axis}
       InputProps={{
         inputProps: {
           min: move.axis === AxisOptions.X ? -12 : -14,
           max: move.axis === AxisOptions.X ? 13 : 14,
           step: 1,
         },
       }}
     />
   </>
  );
});
