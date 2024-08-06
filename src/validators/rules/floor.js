import { helpers, required } from '@vuelidate/validators';
import { onlyPositiveNumber } from '@/validators/index.js';

export const validationRulesForFloor = {
    area_floor_full: {
        required: helpers.withMessage('Заполните поле', required),
        onlyPositive: onlyPositiveNumber()
    },
    area_office_full: {
        onlyPositive: onlyPositiveNumber()
    },
    area_tech_full: {
        onlyPositive: onlyPositiveNumber()
    },
    area_field_full: {
        required: helpers.withMessage('Заполните поле', required),
        onlyPositive: onlyPositiveNumber()
    },
    area_mezzanine_full: {
        required: helpers.withMessage('Заполните поле', required),
        onlyPositive: onlyPositiveNumber()
    },
    floor_types: {
        required: helpers.withMessage('Выберите один или несколько вариантов', required)
    },
    firefighting_type: {
        required: helpers.withMessage('Выберите значение', required)
    },
    heated: {
        required: helpers.withMessage('Выберите значение', required)
    },
    water: {
        required: helpers.withMessage('Выберите значение', required)
    },
    sewage: {
        required: helpers.withMessage('Выберите значение', required)
    },
    ceiling_height_min: {
        required: helpers.withMessage('Заполните поле', required)
    },
    ceiling_height_max: {
        required: helpers.withMessage('Заполните поле', required)
    },
    load_floor_min: {
        required: helpers.withMessage('Заполните поле', required)
    },
    load_floor_max: {
        required: helpers.withMessage('Заполните поле', required)
    },
    column_grids: {
        required: helpers.withMessage('Выберите один или несколько вариантов', required)
    },
    land_width: {
        onlyPositive: onlyPositiveNumber()
    },
    land_length: {
        onlyPositive: onlyPositiveNumber()
    }
};
