export type nullish = null | undefined;

export function isNullish<T>(value: nullish | T): value is nullish {
    return value === null || value === undefined;
}
