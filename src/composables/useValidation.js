import useVuelidate from '@vuelidate/core';
import { computed } from 'vue';
import { useNotify } from '@/utils/use/useNotify.js';

export function useValidation(rules, form, config = {}) {
    const { notification: notificationShouldBeShown = true } = config;

    const notify = useNotify();
    const v$ = useVuelidate(rules, form);

    async function validate() {
        const isValid = await v$.value.$validate();

        if (!isValid && notificationShouldBeShown) {
            notify.info(error.value, 'Ошибка валидации');
        }

        return isValid;
    }

    function resetValidation() {
        v$.value.$reset();
    }

    const error = computed(() => {
        if (v$.value.$errors.length) return v$.value.$errors[0].$message;
        return null;
    });

    return { v$, validate, error, resetValidation };
}
