export function isArray<T>(value: T | T[]): value is T[] {
    return Array.isArray(value);
}
