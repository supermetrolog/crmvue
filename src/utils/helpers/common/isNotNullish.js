import { isNullish } from '@/utils/helpers/common/isNullish.js';

export function isNotNullish(value) {
    return !isNullish(value);
}
