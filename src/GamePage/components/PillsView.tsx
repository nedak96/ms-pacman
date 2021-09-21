import { FC, memo, useContext } from 'react';
import { Sprite } from '../../components/Sprite';
import {
  addCoordinatesAndVector,
  ScreenCoordinates,
  screenFromTile,
  SCREEN_TILE_CENTER_VECTOR,
  TileCoordinate,
} from '../../model/Coordinates';
import {
  BASIC_PILL_ID,
  ENERGIZER_ID,
  FRUIT_ID,
  MAZE_HEIGHT_IN_TILES,
  MAZE_WIDTH_IN_TILES,
  EMPTY_TILE_ID,
  TileId,
} from '../../model/MazeData';
import { GameContext } from '../../components/StoreContext';

const Pill: FC<{ position: ScreenCoordinates }> = ({ position }) => (
  <Sprite x={position.x - 10} y={position.y - 10} name="basic-pill" />
);

const Energizer: FC<{ position: ScreenCoordinates }> = ({ position }) => (
  <Sprite x={position.x - 10} y={position.y - 10} name="energizer" />
);

const Fruit: FC<{ id: number, position: ScreenCoordinates }> = ({ id, position }) => (
  <Sprite x={position.x - 14} y={position.y - 14} style={{ transform: 'scale(1.75)' }} name={`fruit-${id}`} />
);

const PillView = memo<{ x: TileCoordinate, y: TileCoordinate, tileId: TileId }>(
  ({ x, y, tileId }) => {
    if (tileId === BASIC_PILL_ID) {
      return (
        <Pill
          position={addCoordinatesAndVector(
            screenFromTile({ x, y }),
            SCREEN_TILE_CENTER_VECTOR
          )}
        />
      );
    }
    if (tileId === ENERGIZER_ID) {
      return (
        <Energizer
          position={addCoordinatesAndVector(
            screenFromTile({ x, y }),
            SCREEN_TILE_CENTER_VECTOR
          )}
        />
      );
    }
    if (tileId > FRUIT_ID) {
      return (
        <Fruit
          id={tileId - FRUIT_ID}
          position={addCoordinatesAndVector(
            screenFromTile({ x, y }),
            SCREEN_TILE_CENTER_VECTOR
          )}
        />
      );
    }
    return null;
  }
);

// Performance tricks used here:
// Make each PillView an observer, so that we don't have to rerender PillsView.
// Make PillsView a React.memo to prevent any rerenders.
// Also: Create PillView only for those coordinates where there is a pill on first render.
export const PillsView: FC = memo(() => {
  const { pills } = useContext(GameContext);

  return (
    <>
      {Array.from({ length: MAZE_HEIGHT_IN_TILES }).map((_, y) =>
        Array.from({ length: MAZE_WIDTH_IN_TILES }).map((_, x) => {
          const pill = pills[y][x];
          return pill !== EMPTY_TILE_ID &&
            <PillView key={`${x}/${y}`} tileId={pill} x={x} y={y} />;
        })
      )}
    </>
  );
});
