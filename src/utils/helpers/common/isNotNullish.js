import { isNullish } from '@/utils/helpers/common/isNullish.ts';

export function isNotNullish(value) {
    return !isNullish(value);
}
