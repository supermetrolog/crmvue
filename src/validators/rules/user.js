import { helpers, required } from '@vuelidate/validators';
import { validateEmail } from '@/validators/index.js';

function passwordValidator(value, form, vm) {
    return vm.formData || value != null;
}

export const validationRulesForUser = {
    username: {
        required: helpers.withMessage('Введите логин', required)
    },
    password: {
        required: helpers.withMessage('Введите пароль', passwordValidator)
    },
    email: {
        email: helpers.withMessage('Заполните email правильно', validateEmail)
    }
};

export const validationRulesForUserProfile = {
    userProfile: {
        first_name: {
            required: helpers.withMessage('Введите имя', required)
        },
        middle_name: {
            required: helpers.withMessage('Введите фамилию', required)
        }
    }
};
