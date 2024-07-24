import { helpers, maxLength, minLength, minValue, required } from '@vuelidate/validators';

export const validationRulesForEquipment = {
    name: {
        minLength: helpers.withMessage('Название не может быть меньше 3 символов', minLength(3)),
        maxLength: helpers.withMessage('Название не может быть больше 60 символов', maxLength(60))
    },
    address: {
        required: helpers.withMessage('Заполните адрес', required)
    },
    category: {
        required: helpers.withMessage('Выберите категорию', required)
    },
    consultant_id: {
        required: helpers.withMessage('Выберите консультанта', required)
    },
    company_id: {
        required: helpers.withMessage('Укажите компанию', required)
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
    }
};
