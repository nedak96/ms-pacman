import React, { FC } from 'react';
import {
  SCREEN_TILE_SIZE,
  ScreenCoordinates,
} from '../model/Coordinates';

import './Grid.css';

const ROWS = 28;
const COLUMNS = 25;

export const GridWithHoverCoordinates: FC<{
  screenCoordinates: ScreenCoordinates;
}> = ({ screenCoordinates }) => {
  const { x, y } = screenCoordinates;
  return (
    <div className="Container">
      <Grid x={x} y={y} />
    </div>
  );
};

const YAxis = () => (
  <div className="Axis YAxis">
    {[...Array(ROWS + 1)].map((_, i) => (
      <p className="AxisNumber YAxisNumber" key={i}>{i - 14}</p>
    ))}
  </div>
);

const XAxis = () => (
  <div className="Axis XAxis">
    {[...Array(COLUMNS + 1)].map((_, i) => (
      <p className="AxisNumber XAxisNumber" key={i}>{i - 12}</p>
    ))}
  </div>
);

export const Grid: FC<{
  x: number;
  y: number;
}> = ({ x, y }) => {
  return (
    <div
      className="Grid"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        gridTemplateColumns: `repeat(${COLUMNS}, ${SCREEN_TILE_SIZE}px)`,
        gridTemplateRows: `repeat(${ROWS}, ${SCREEN_TILE_SIZE}PX)`,
      }}
    >
      <YAxis />
      <XAxis />
      {Array(ROWS)
        .fill(null)
        .map((_, rowIndex) =>
          Array.from({ length: COLUMNS }).map((_, columnIndex) => (
            <div className="GridCell" key={`${columnIndex}/${rowIndex}`} />
          ))
        )}
    </div>
  );
};
