import { isEmptyArray } from '@/utils/helpers/array/isEmptyArray';

const emptyValues = new Set([null, '', undefined]);

export function formToQuery(form: Record<string, any>) {
    const query = {} as Record<string, any>;

    for (const key in form) {
        if (Object.hasOwn(form, key)) {
            const value = form[key];

            if (!emptyValues.has(value) && !isEmptyArray(value)) {
                query[key] = value;
            }
        }
    }

    return query;
}
