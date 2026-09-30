import type { ar } from './ar';

/** Same shape as the Arabic dictionary, with every leaf widened to `string`. */
type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };

/** Every dictionary must match the Arabic one key-for-key (missing or extra keys are type errors). */
export type Dictionary = Widen<typeof ar>;

type Paths<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${Paths<T[K]>}`;
}[keyof T & string];

/** Dotted key of any string in the dictionary, e.g. "sidebar.documents". */
export type TranslationKey = Paths<Dictionary>;

export type TranslationVars = Record<string, string | number>;
