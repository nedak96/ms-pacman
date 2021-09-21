import React, { FC, CSSProperties } from 'react';
import C from 'classnames';
import { SCALE_FACTOR } from '../model/Coordinates';
import './Sprite.css';

const scale = `scale(${SCALE_FACTOR})`;

export const Sprite: FC<{
  name: string;
  x?: number;
  y?: number;
  className?: string | null;
  style?: CSSProperties;
}> = ({ name: spriteName, x, y, className, style = {} }) => {
  return (
    <div
      className={C('Sprite', 'Sprite-' + spriteName, className)}
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        transform: scale,
        transformOrigin: 'top let',
        ...style,
      }}
    />
  );
};
