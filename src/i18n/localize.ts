export type Lang = 'ar' | 'en';

/** A user-facing text value available in both languages. */
export interface LocalizedText {
  ar: string;
  en: string;
}

/**
 * Mirrors a data type but lets every free-text `string` field be given as
 * { ar, en }. Literal unions (statuses, ids' types) stay exactly as they are.
 */
export type Localizable<T> = T extends string
  ? string extends T
    ? string | LocalizedText
    : T
  : T extends readonly (infer U)[]
  ? Localizable<U>[]
  : T extends object
  ? { [K in keyof T]: Localizable<T[K]> }
  : T;

const isLocalizedText = (value: unknown): value is LocalizedText =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  Object.keys(value).length === 2 &&
  'ar' in value &&
  'en' in value;

/** Resolves every { ar, en } leaf of a localizable value to the given language. */
export function localize<T>(value: Localizable<T>, lang: Lang): T {
  const resolve = (node: unknown): unknown => {
    if (isLocalizedText(node)) return node[lang];
    if (Array.isArray(node)) return node.map(resolve);
    if (typeof node === 'object' && node !== null) {
      return Object.fromEntries(Object.entries(node).map(([key, child]) => [key, resolve(child)]));
    }
    return node;
  };
  return resolve(value) as T;
}
