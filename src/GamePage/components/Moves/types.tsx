export enum MoveType {
  ROTATION = 'Rotation',
  TRANSLATION = 'Translation',
  REFLECTION = 'Reflection',
};

export enum DegreeOptions {
  NEG_TWO_SEVENTY = '-270',
  NEG_ONE_EIGHTY = '-180',
  NEG_NINTY = '-90',
  NINTY = '90',
  ONE_EIGHTY = '180',
  TWO_SEVENTY = '270',
}

export const xOptions = Array.from({ length: 26 }, (_, i) => i + -12);
export const yOptions = Array.from({ length: 29 }, (_, i) => i + -14);

export interface RotationMove {
  key: string;
  type?: MoveType.ROTATION,
  degrees?: DegreeOptions,
  x?: number;
  y?: number;
}

export enum AxisOptions {
  X = 'X',
  Y = 'Y',
};

export interface ReflectionMove {
  key: string;
  type?: MoveType.REFLECTION,
  axis?: AxisOptions,
  n?: number,
}

export enum DirectionOptions {
  UP = 'Up',
  DOWN = 'Down',
  LEFT = 'Left',
  RIGHT = 'Right',
};

export interface TranslationMove {
  key: string;
  type?: MoveType.TRANSLATION,
  direction?: DirectionOptions,
  n?: number,
}

export type Move = RotationMove | ReflectionMove | TranslationMove;
