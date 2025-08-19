import { isNullish, nullish } from '@/utils/helpers/common/isNullish';
import { isString } from '@/utils/helpers/string/isString.js';

export type MaybeBool = boolean | string | nullish;

export function toBool<T extends MaybeBool>(value: T, fallback: boolean = false): boolean {
    if (isString(value)) {
        return value === 'true' || value === '1';
    }

    if (isNullish(value)) {
        return fallback;
    }

    return value;
}
