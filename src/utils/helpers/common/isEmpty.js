import { isArray } from '@/utils/helpers/array/isArray.ts';
import { isEmptyArray } from '@/utils/helpers/array/isEmptyArray.js';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';
import { isString } from '@/utils/helpers/string/isString.js';
import { isEmptyString } from '@/utils/helpers/string/isEmptyString.js';

export function isEmpty(value) {
    if (isNullish(value)) return true;
    if (isArray(value)) return isEmptyArray(value);
    if (isString(value)) return isEmptyString(value);
    return isNullish(value);
}
