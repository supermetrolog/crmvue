import { helpers, required } from '@vuelidate/validators';
import { onlyPositiveNumber } from '@/validators/index.js';

export const validationRulesForCrane = {
    crane_location: {
        required: helpers.withMessage('Выберите один из вариантов', required)
    },
    crane_capacity: {
        required: helpers.withMessage('Заполните поле', required),
        onlyPositive: onlyPositiveNumber('Значение должно быть больше 0')
    },
    crane_span: {
        onlyPositive: onlyPositiveNumber('Значение должно быть больше 0')
    },
    crane_hook_height: {
        onlyPositive: onlyPositiveNumber('Значение должно быть больше 0')
    },
    crane_hooks: {
        onlyPositive: onlyPositiveNumber('Значение должно быть больше 0')
    }
};
