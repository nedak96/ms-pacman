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

const directions = [DirectionOptions.LEFT, DirectionOptions.DOWN, DirectionOptions.RIGHT, DirectionOptions.UP];

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

  const [{ x, y, ...styles }, api] = useSpring(() => ({
    from: defaults,
    onRest,
  }));

  useEffect(() => {
    if (paused) {
      api.stop();
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
      let direction = DirectionOptions.LEFT;
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
              if ([degrees, move.x, move.y].every(isNumber)) {
                if (x !== getXTile(move.x!) || y !== getYTile(move.y!)) {
                  setGameOver(true);
                }
                rotateZ = rotateZ + degrees * (((rotateX + rotateY) % 360) ? 1 : -1);
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
                    rotateZ,
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
                if (move.axis === AxisOptions.Y) {
                  if (getYTile(move.n) !== y) {
                    setGameOver(true);
                  }
                  if (direction === DirectionOptions.UP || direction === DirectionOptions.DOWN) {
                    direction = direction === DirectionOptions.UP ? DirectionOptions.DOWN : DirectionOptions.UP;
                  }
                  rotateX = (rotateX + 180) % 360;
                } else {
                  if (getXTile(move.n) !== x) {
                    setGameOver(true);
                  }
                  if (direction === DirectionOptions.LEFT || direction === DirectionOptions.RIGHT) {
                    direction = direction === DirectionOptions.LEFT ? DirectionOptions.RIGHT : DirectionOptions.LEFT;
                  }
                  rotateY = (rotateY + 180) % 360
                }
                await next({
                  to: {
                    rotateX,
                    rotateY,
                  },
                    config: {
                      duration: 300,
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
      style={styles}
    />
  );
});

const AnimatedPacMan = animated(PacMan);
