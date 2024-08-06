import { helpers, required } from '@vuelidate/validators';
import { onlyPositiveNumber } from '@/validators/index.js';

export const validationRulesForElevator = {
    elevator_location: {
        required: helpers.withMessage('Выберите один из вариантов', required)
    },
    elevator_capacity: {
        required: helpers.withMessage('Заполните поле', required),
        onlyPositive: onlyPositiveNumber('Значение должно быть больше 0')
    },
    elevator_volume: {
        required: helpers.withMessage('Заполните поле', required),
        onlyPositive: onlyPositiveNumber('Значение должно быть больше 0')
    },
    elevator_length: {
        onlyPositive: onlyPositiveNumber('Значение должно быть больше 0')
    },
    elevator_width: {
        onlyPositive: onlyPositiveNumber('Значение должно быть больше 0')
    }
};
