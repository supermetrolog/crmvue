import { isArray } from '@/utils/helpers/array/isArray.ts';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';

export function isObject(value) {
    return typeof value === 'object' && !isArray(value) && isNotNullish(value);
}
