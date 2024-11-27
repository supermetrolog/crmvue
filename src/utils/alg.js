import { isNumeric } from '@/utils/helpers/common/isNumeric.js';
import { chunk } from '@/utils/helpers/array/chunk.js';
import { parts } from '@/utils/helpers/array/parts.js';
import { extractDeepProperty } from '@/utils/helpers/object/extractDeepProperty.js';
import { filterArrayByPropertyEntity } from '@/utils/helpers/array/filterArrayByPropertyEntity.js';
import { strictMin } from '@/utils/helpers/common/strictMin.js';
import { extractPropertiesFromObject } from '@/utils/helpers/object/extractPropertiesFromObject.js';

export const alg = {
    strictMin,
    filterArrayByPropertyEntity,
    extractDeepProperty,
    chunk,
    extractPropertiesFromObject,
    isNumeric,
    parts
};
