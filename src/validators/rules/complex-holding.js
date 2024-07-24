import { helpers, maxValue, minValue, required } from '@vuelidate/validators';
import { onlyPositiveNumber } from '@/validators/index.js';

export const validationRulesForComplexHolding = {
    address: {
        required: helpers.withMessage('Заполните поле', required)
    },
    company_id: {
        required: helpers.withMessage('Заполните поле', required)
    },
    area_building: {
        required: helpers.withMessage('Заполните поле', required),
        onlyPositive: onlyPositiveNumber()
    },
    area_floor_full: {
        onlyPositive: onlyPositiveNumber()
    },
    area_mezzanine_full: {
        onlyPositive: onlyPositiveNumber()
    },
    area_office_full: {
        onlyPositive: onlyPositiveNumber()
    },
    area_tech_full: {
        onlyPositive: onlyPositiveNumber()
    },
    object_class: {
        required: helpers.withMessage('Выберите класс объекта', required)
    },
    year_build: {
        minValue: helpers.withMessage('Минимальное значение - 1800', minValue(1800)),
        maxValue: helpers.withMessage(
            `Максимальное значение - ${new Date().getFullYear()}`,
            maxValue(new Date().getFullYear())
        )
    },
    year_repair: {
        minValue: helpers.withMessage('Минимальное значение - 1800', minValue(1800)),
        maxValue: helpers.withMessage(
            `Максимальное значение - ${new Date().getFullYear()}`,
            maxValue(new Date().getFullYear())
        )
    },
    cadastral_number: {
        required: helpers.withMessage('Заполните поле', required)
    }
};
