import { computed } from 'vue';
import { toValue } from '@vueuse/core';

export function useFormControlValidation(v, modelValue, options) {
    const _reactive = options?.reactive ?? false;

    const hasValidation = computed(() =>
        Boolean(v.value && v.value.$dirty && (v.value.$model || v.value.$error))
    );
    const hasValidationError = computed(() => Boolean(v.value && v.value.$error));

    const validationClass = computed(() => {
        if (!v.value) return '';

        if (v.value.required) {
            return {
                invalid: v.value.$error,
                valid: v.value.$dirty && !v.value.$error && !_reactive
            };
        } else {
            const value = toValue(modelValue);

            if (Array.isArray(value)) {
                return {
                    invalid: v.value.$error,
                    valid: v.value.$dirty && !v.value.$error && modelValue.length && !_reactive
                };
            }

            return {
                invalid: v.value.$error,
                valid:
                    v.value.$dirty &&
                    !v.value.$error &&
                    modelValue !== null &&
                    modelValue !== '' &&
                    !_reactive
            };
        }
    });

    function validate() {
        if (v.value) v.value.$touch();
    }

    return { validate, hasValidation, hasValidationError, validationClass };
}
