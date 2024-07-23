import { helpers, minValue, required } from '@vuelidate/validators';
import { onlyPositiveNumber } from '@/validators/index.js';

export const validationRulesForComplexPlot = {
    address: {
        required: helpers.withMessage('Заполните поле', required)
    },
    company_id: {
        required: helpers.withMessage('Заполните поле', required)
    },
    land_length: {
        onlyPositive: onlyPositiveNumber()
    },
    land_width: {
        onlyPositive: onlyPositiveNumber()
    },
    cadastral_number_land: {
        required: helpers.withMessage('Заполните поле', required)
    },
    first_line: {
        required: helpers.withMessage('Выберите один из вариантов', required)
    },
    area_field_full: {
        required: helpers.withMessage('Заполните поле', required),
        minValue: onlyPositiveNumber('Значение должно быть больше 0')
    },
    own_type_land: {
        required: helpers.withMessage('Выберите один из вариантов', required)
    },
    landscape_type: {
        required: helpers.withMessage('Выберите один из вариантов', required)
    },
    power: {
        required: helpers.withMessage('Выберите один из вариантов', required)
    },
    power_value: {
        required: helpers.withMessage('Заполните поле', required),
        minValue: onlyPositiveNumber('Значение должно быть больше 0')
    },
    heating_central: {
        required: helpers.withMessage('Выберите один из вариантов', required)
    },
    water: {
        required: helpers.withMessage('Выберите один из вариантов', required)
    },
    water_value: {
        required: helpers.withMessage('Заполните поле', required),
        minValue: onlyPositiveNumber('Значение должно быть больше 0')
    },
    water_type: {
        required: helpers.withMessage('Выберите один из вариантов', required)
    },
    sewage_central: {
        required: helpers.withMessage('Выберите один из вариантов', required)
    },
    sewage_central_value: {
        required: helpers.withMessage('Заполните поле', required),
        minValue: onlyPositiveNumber('Значение должно быть больше 0')
    },
    gas_value: {
        required: helpers.withMessage('Заполните поле', required),
        minValue: onlyPositiveNumber('Значение должно быть больше 0')
    },
    gas_type: {
        required: helpers.withMessage('Выберите один из вариантов', required)
    },
    steam_value: {
        required: helpers.withMessage('Заполните поле', required),
        minValue: onlyPositiveNumber('Значение должно быть больше 0')
    },
    internet_type: {
        required: helpers.withMessage('Выберите один из вариантов', required)
    },
    guard_type: {
        required: helpers.withMessage('Выберите один из вариантов', required)
    },
    parking_car_value: {
        required: helpers.withMessage('Выберите один из вариантов', required)
    },
    parking_lorry_value: {
        required: helpers.withMessage('Выберите один из вариантов', required)
    },
    parking_truck_value: {
        required: helpers.withMessage('Выберите один из вариантов', required)
    },
    railway_value: {
        minValue: onlyPositiveNumber('Значение должно быть больше 0')
    },
    buildings_on_territory_description: {
        required: helpers.withMessage('Заполните описание', required)
    }
};
