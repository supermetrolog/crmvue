import { useNotify } from '@/utils/useNotify.js';

export function useValidationNotify(v$) {
    const notify = useNotify();

    function validateWithNotify() {
        v$.value.$validate();

        if (v$.value.$error) {
            const firstError = v$.value.$errors[0];

            notify.info(firstError.$message, 'Ошибка валидации');
        }
    }

    return { validateWithNotify };
}
