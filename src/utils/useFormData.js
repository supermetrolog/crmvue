import { cloneObject } from '@/utils/index.js';

function _updateForm(form, formData) {
    if (formData == null) return;

    Object.keys(form).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null) {
            if (typeof formData[key] === 'object') form[key] = cloneObject(formData[key]);
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
