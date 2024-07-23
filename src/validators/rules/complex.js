import { helpers, required } from '@vuelidate/validators';
import { onlyPositiveNumber } from '@/validators/index.js';

export const validationRulesForComplex = {
    title: {
        requiredIfHasName: helpers.withMessage('Заполните поле', (value, form, vm) => {
            if (form.title_novalue) return true;
            return required.$validator(value, form, vm);
        })
    },
    from_mkad: {
        requiredIfHasMkad: helpers.withMessage('Заполните поле', (value, form, vm) => {
            if (form.from_mkad_novalue) return true;
            return required.$validator(value, form, vm);
        }),
        onlyPositive: onlyPositiveNumber()
    },
    address: {
        required: helpers.withMessage('Заполните поле', required)
    },
    area_field_full: {
        required: helpers.withMessage('Заполните поле', required),
        onlyPositive: onlyPositiveNumber()
    },
    area_buildings_full: {
        onlyPositive: onlyPositiveNumber()
    },
    buildings_admin_num: {
        onlyPositive: onlyPositiveNumber()
    },
    buildings_industry_num: {
        onlyPositive: onlyPositiveNumber()
    },
    buildings_help_num: {
        onlyPositive: onlyPositiveNumber()
    },
    power: {
        required: helpers.withMessage('Выберите значение', required)
    },
    power_value: {
        onlyPositive: onlyPositiveNumber()
    },
    heating_autonomous: {
        onlyPositive: onlyPositiveNumber()
    },
    heating_central: {
        onlyPositive: onlyPositiveNumber()
    },
    water: {
        required: helpers.withMessage('Выберите значение', required)
    },
    water_value: {
        onlyPositive: onlyPositiveNumber()
    },
    sewage: {
        required: helpers.withMessage('Выберите значение', required)
    },
    sewage_value: {
        onlyPositive: onlyPositiveNumber()
    },
    gas_value: {
        onlyPositive: onlyPositiveNumber()
    },
    steam_value: {
        onlyPositive: onlyPositiveNumber()
    },
    railway_value: {
        onlyPositive: onlyPositiveNumber()
    }
};
