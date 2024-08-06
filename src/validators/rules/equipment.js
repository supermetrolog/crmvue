import { helpers, maxLength, minLength, minValue, required } from '@vuelidate/validators';
import { equipmentOptions } from '@/const/options/equipment.options.js';

function passiveTypeValidator(value, form, vm) {
    return (
        form.status === equipmentOptions.statusStatement.ACTIVE ||
        required.$validator(form.passive_type, form, vm)
    );
}

export const validationRulesForEquipment = {
    name: {
        required: helpers.withMessage('Введите название', required),
        minLength: helpers.withMessage('Название не может быть меньше 3 символов', minLength(3)),
        maxLength: helpers.withMessage('Название не может быть больше 60 символов', maxLength(60))
    },
    category: {
        required: helpers.withMessage('Выберите категорию', required)
    },
    address: {
        required: helpers.withMessage('Заполните адрес', required)
    },
    consultant_id: {
        required: helpers.withMessage('Выберите консультанта', required)
    },
    company_id: {
        required: helpers.withMessage('Укажите компанию', required)
    },
    state: {
        required: helpers.withMessage('Укажите состояние оборудования', required)
    },
    contact_id: {
        required: helpers.withMessage('Укажите контакта', required)
    },
    deliveryPrice: {
        min: helpers.withMessage('Укажите корректную цену', minValue(0))
    },
    price: {
        min: helpers.withMessage('Укажите корректную цену', minValue(0))
    },
    count: {
        min: helpers.withMessage('Укажите корректно количество', minValue(0))
    },
    passive_type: {
        required: helpers.withMessage('Укажите причину пассива', passiveTypeValidator)
    }
};
