import React, { FC } from 'react';
import { GridWithHoverCoordinates } from '../../components/Grid';
import { Sprite } from '../../components/Sprite';

export const MazeView: FC = () => (
  <>
    <Sprite className="Sprite-maze" name="maze-state-empty" x={0} y={0} />
    <GridWithHoverCoordinates screenCoordinates={{ x: 0, y: 0 }} />
  </>
);
