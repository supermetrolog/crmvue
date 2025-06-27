import { isNullish, nullish } from '@/utils/helpers/common/isNullish';

export function isNotNullish<T>(value: nullish | T): value is T {
    return !isNullish(value);
}
