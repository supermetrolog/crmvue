import { isEmpty } from '@/utils/helpers/common/isEmpty.js';
import { isArray } from '@/utils/helpers/array/isArray.ts';
import { cloneObject } from '@/utils/helpers/object/cloneObject.js';
import { computed } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';

function _updateForm(form, formData, transforms = {}) {
    if (isEmpty(formData)) return;

    Object.keys(form).forEach(key => {
        if (isNotNullish(formData[key])) {
            if (typeof formData[key] === 'object' || isArray(formData[key]))
                form[key] = cloneObject(formData[key]);
            else form[key] = formData[key];
        } else if (isNotNullish(transforms[key])) {
            form[key] = transforms[key](formData);
        }
    });
}

export function useFormData(form, formData, config = {}) {
    const { isDeletedAttribute = 'deleted_at', transforms = {} } = config;

    function updateForm() {
        _updateForm(form, formData, transforms);
    }

    updateForm();

    const isEditMode = computed(() => isNotNullish(formData));
    const isDeletedEntity = computed(
        () =>
            isEditMode.value &&
            isNotNullish(formData[isDeletedAttribute]) &&
            !!formData[isDeletedAttribute]
    );

    return { form, updateForm, isEditMode, isDeletedEntity };
}
