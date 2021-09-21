import { CSSProperties, FC } from 'react';
import pacman from '../../resources/pacman.gif';
import './PacMan.css';

export const PacMan: FC<{
  x: number;
  y: number;
  style?: CSSProperties;
}> = ({ x, y, style }) => (
  <img
    src={pacman}
    className="PacMan"
    style={{ left: x, top: y, ...style }} />
);