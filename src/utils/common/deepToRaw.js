import { toRaw } from 'vue';

export function deepToRaw(item) {
    if (Array.isArray(item)) {
        return item.map(i => deepToRaw(i));
    }

    if (item !== null && typeof item === 'object') {
        const rawItem = toRaw(item);
        const clone = {};

        for (const key in rawItem) {
            clone[key] = deepToRaw(rawItem[key]);
        }

        return clone;
    }

    return item;
}
