export const TEMPLATE_START = '\u276c';
export const TEMPLATE_END = '\u276d';

export function isValued<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}
