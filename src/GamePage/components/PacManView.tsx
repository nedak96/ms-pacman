import { FC, useEffect, useCallback, memo, useContext } from 'react';
import { useSpring, animated } from 'react-spring';
import { easeCubicInOut, easeLinear } from 'd3-ease';
import { isNumber } from 'lodash';
import { GameContext } from '../../components/StoreContext';
import { ScreenCoordinates, screenFromTile, TileCoordinates, tileFromScreen } from '../../model/Coordinates';
import { PacMan } from './PacMan';
import { AxisOptions, DirectionOptions, MoveType } from './Moves/types';

export type PacManAnimationPhase = 0 | 1 | 2;

export const PacManAnimationPhases: PacManAnimationPhase[] = [0, 1, 2];

const directions = [DirectionOptions.LEFT, DirectionOptions.UP, DirectionOptions.RIGHT, DirectionOptions.DOWN];

const pacManScreenFromTile = (tileCoordinates: TileCoordinates) => {
  const screenCoordinates = screenFromTile(tileCoordinates);
  return {
    x: screenCoordinates.x - 4,
    y: screenCoordinates.y - 4,
  };
};

const pacManTileFromScreen = (screenCoordinates: ScreenCoordinates) => (
  tileFromScreen({
    x: screenCoordinates.x + 4,
    y: screenCoordinates.y + 4,
  })
);

const getXTile = (x: number) => x + 13;
const getYTile = (y: number) => (y * -1) + 15;

const STARTING_COORDINATES = pacManScreenFromTile({ x: 14, y: 23 });
const defaults = {
  scale: 0,
  rotateY: 0,
  rotateX: 0,
  rotateZ: 0,
  ...STARTING_COORDINATES,
};

export const PacManView: FC = memo(() => {
  const { eatPill, moves, paused, gameOver, setGameOver } = useContext(GameContext);

  const onRest = useCallback(({ value }) => {
    // Upside-down
    if ((value.rotateX + value.rotateZ) % 360 === 180) {
      setGameOver(true);
      return;
    }
    eatPill(pacManTileFromScreen(value));
  }, [eatPill, setGameOver]);

  const [{ x, y, scale, ...styles }, api] = useSpring(() => ({
    from: defaults,
    onRest,
  }));

  useEffect(() => {
    if (paused) {
      api.start({
        to: defaults,
        config: {
          duration: 0,
        },
      });
    }
  }, [paused, api]);

  useEffect(() => {
    if (gameOver) {
      api.stop();
    }
  }, [api.stop, gameOver]);

  useEffect(() => {
    if (!paused) {
      let rotateX = 0;
      let rotateY = 0;
      let rotateZ = 0;
      let x = 14;
      let y = 23;
      let scale = 0;
      let direction = DirectionOptions.LEFT;
      let negateZ = 0;
      api.start({
        to: async (next) => {
          for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            if (move.type === MoveType.TRANSLATION) {
              if (move.direction && isNumber(move.n)) {
                if (direction !== move.direction) {
                  setGameOver(true);
                } else {
                  const coords = [];
                  for (let n = 0; n < move.n; n++) {
                    if (move.direction === DirectionOptions.UP) {
                      y = y - 1;
                    } else if (move.direction === DirectionOptions.DOWN) {
                      y = y + 1;
                    } else if (move.direction === DirectionOptions.RIGHT) {
                      x = x + 1;
                    } else {
                      x = x - 1;
                    }
                    coords.push(pacManScreenFromTile({ x, y }));
                  }
                  await next({
                      to: coords,
                      config: {
                        duration: 300,
                        easing: easeLinear,
                      },
                  });
                }
              } else {
                setGameOver(true);
              }
            } else if (move.type === MoveType.ROTATION) {
              const degrees = Number(move.degrees);
              if (isNumber(degrees)) {
                rotateZ = rotateZ + degrees;
                switch (degrees) {
                  case -90:
                  case 270:
                    direction = directions[(directions.indexOf(direction) + 3) % 4];
                    break;
                  case -180:
                  case 180:
                    direction = directions[(directions.indexOf(direction) + 2) % 4];
                    break;
                  case -270:
                  case 90:
                    direction = directions[(directions.indexOf(direction) + 1) % 4];
                    break;
                }
                await next({
                  to: {
                    rotateZ: (negateZ * -1) * rotateZ,
                  },
                  config: {
                    duration: Math.min((Math.abs(degrees) / 90) * 500, 1000),
                    easing: easeCubicInOut,
                  },
                });
              } else {
                setGameOver(true);
              }
            } else if (move.type === MoveType.REFLECTION) {
              if (move.axis && isNumber(move.n)) {
                scale = scale === 0 ? 1 : 0;
                negateZ = negateZ === 0 ? 1 : 0;
                let diff = 0;
                if (move.axis === AxisOptions.Y) {
                  if (direction === DirectionOptions.UP || direction === DirectionOptions.DOWN) {
                    direction = direction === DirectionOptions.UP ? DirectionOptions.DOWN : DirectionOptions.UP;
                  }
                  rotateX = (rotateX + 180) % 360;
                  const yTile = getYTile(move.n);
                  diff = 2 * (yTile - y);
                  y = y + diff;
                } else {
                  if (direction === DirectionOptions.LEFT || direction === DirectionOptions.RIGHT) {
                    direction = direction === DirectionOptions.LEFT ? DirectionOptions.RIGHT : DirectionOptions.LEFT;
                  }
                  rotateY = (rotateY + 180) % 360
                  const xTile = getXTile(move.n);
                  diff = 2 * (xTile - x);
                  x = x + diff;
                }
                await next({
                  to: {
                    scale,
                    rotateX,
                    rotateY,
                    ...pacManScreenFromTile({ x, y }),
                  },
                    config: {
                      duration: Math.max(Math.min(Math.abs(diff) * 300, 1500), 300),
                      easing: easeCubicInOut,
                    },
                });
              } else {
                setGameOver(true);
              }
            }
          }
        },
      });
    }
  }, [api, moves, paused, setGameOver]);

  return (
    <AnimatedPacMan
      x={x}
      y={y}
      style={{
        scale: scale.to([0, .5, 1], [1, 1.15, 1]),
        ...styles,
      }}
    />
  );
});

const AnimatedPacMan = animated(PacMan);
