export function isEmptyArray(value) {
    if (Array.isArray(value)) {
        return !value.length;
    }

    return false;
}
