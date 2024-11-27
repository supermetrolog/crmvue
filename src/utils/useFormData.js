import { isEmpty } from '@/utils/helpers/common/isEmpty.js';
import { isArray } from '@/utils/helpers/array/isArray.js';
import { cloneObject } from '@/utils/helpers/object/cloneObject.js';

function _updateForm(form, formData) {
    if (isEmpty(formData)) return;

    Object.keys(form).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null) {
            if (typeof formData[key] === 'object' || isArray(formData[key]))
                form[key] = cloneObject(formData[key]);
            else form[key] = formData[key];
        }
    });
}

export function useFormData(form, formData) {
    function updateForm() {
        _updateForm(form, formData);
    }

    updateForm();

    return { form, updateForm };
}
