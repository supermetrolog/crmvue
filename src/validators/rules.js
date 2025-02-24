import { helpers, maxLength, minLength, required } from '@vuelidate/validators';
import {
    everyProperty,
    onlyEnglish,
    onlyRussian,
    validateEmail,
    validatePhone,
    validateUrl
} from '@/validators/index.js';
import { nextTick } from 'vue';

const customRequiredNameRu = (value, form) => {
    return (
        form.noName ||
        (value !== null && value !== '') ||
        (form.nameEng != null && form.nameEng !== '')
    );
};

const customRequiredNameEng = (value, form) => {
    return (
        form.noName ||
        (value != null && value !== '') ||
        (form.nameRu != null && form.nameRu !== '')
    );
};

function customRequiredIndividualFullName(value, form, vm) {
    if (form.is_individual) return required.$validator(form.individual_full_name, form, vm);
    return true;
}

const customRequiredPassiveWhy = (_, form) => {
    return form.status || required.$validator(form.passive_why);
};
export const validationRulesForCompany = {
    contacts: {
        emails: {
            everyHasCorrectEmail: everyProperty(validateEmail, 'email')
        },
        websites: {
            everyHasCorrectUrl: everyProperty(validateUrl, 'website')
        },
        phones: {
            everyHasCorrectPhone: everyProperty(validatePhone, 'phone')
        }
    },
    nameEng: {
        customRequiredName: helpers.withMessage('Заполните поле', customRequiredNameEng),
        minLength: helpers.withMessage('Название не может быть меньше 3 символов', minLength(3)),
        maxLength: helpers.withMessage('Название не может быть больше 60 символов', maxLength(60)),
        onlyEnglish: helpers.withMessage('Название должно быть на английском языке', onlyEnglish)
    },
    nameRu: {
        customRequiredName: helpers.withMessage('Заполните поле', customRequiredNameRu),
        minLength: helpers.withMessage('Название не может быть меньше 3 символов', minLength(3)),
        maxLength: helpers.withMessage('Название не может быть больше 60 символов', maxLength(60)),
        onlyRussian: helpers.withMessage('Название должно быть на русском языке', onlyRussian)
    },
    nameBrand: {
        minLength: helpers.withMessage('Название не может быть меньше 3 символов', minLength(3))
    },
    categories: {
        required: helpers.withMessage('Выберите категорию', required)
    },
    status: {
        required: helpers.withMessage('Выберите статус', required)
    },
    consultant_id: {
        required: helpers.withMessage('Выберите консультанта', required)
    },
    ogrn: {
        minLength: helpers.withMessage('ОГРН не может быть меньше 13 символов', minLength(13))
    },
    inn: {
        minLength: helpers.withMessage('ИНН не может быть меньше 10 символов', minLength(10))
    },
    kpp: {
        minLength: helpers.withMessage('КПП не может быть меньше 9 символов', minLength(9))
    },
    checkingAccount: {
        minLength: helpers.withMessage(
            'Расчетный счет не может быть меньше 20 символов',
            minLength(20)
        )
    },
    correspondentAccount: {
        minLength: helpers.withMessage(
            'Корреспондентский счет не может быть меньше 20 символов',
            minLength(20)
        )
    },
    bik: {
        minLength: helpers.withMessage('БИК не может быть меньше 9 символов', minLength(9))
    },
    okved: {
        minLength: helpers.withMessage('ОКВЭД не может быть меньше 4 символов', minLength(4))
    },
    okpo: {
        minLength: helpers.withMessage('ОКПО не может быть меньше 8 символов', minLength(8))
    },
    passive_why: {
        customRequiredPassiveWhy: helpers.withMessage('Выберите причину', customRequiredPassiveWhy)
    },
    individual_full_name: {
        required: helpers.withMessage(
            'Заполните данные физ.лица для обращения',
            customRequiredIndividualFullName
        )
    },
    activity_group_ids: {
        required: helpers.withMessage('Выберите группу деятельности', required)
    },
    activity_profile_ids: {
        required: helpers.withMessage('Выберите профиль деятельности', required)
    }
};

export const validationRulesForCompanyDeal = {
    consultant_id: {
        required: helpers.withMessage('Выберите консультанта', required)
    },
    company_id: {
        required: helpers.withMessage('Заполните поле', required)
    },
    competitor_company_id: {
        customRequired: helpers.withMessage('Заполните поле', (_, form) => {
            return Boolean(form.is_our || form.competitor_company_id);
        })
    },
    object_id: {
        required: helpers.withMessage('Выберите предложение', (_, form) => {
            ``;
            return Boolean(
                form.object_id &&
                    form.original_id &&
                    form.type_id &&
                    form.visual_id &&
                    form.complex_id
            );
        })
    },
    type_id: {
        required: helpers.withMessage('выберите предложение', required)
    },
    original_id: {
        required: helpers.withMessage('выберите предложение', required)
    },
    visual_id: {
        required: helpers.withMessage('выберите предложение', required)
    },
    complex_id: {
        required: helpers.withMessage('выберите предложение', required)
    },
    request_id: {
        customRequired: helpers.withMessage('Выберите предложение', async (_, form, vm) => {
            if (vm) return Boolean(!vm.request_id || form.request_id);
            else return await nextTick(() => Boolean(!vm.request_id || form.request_id));
        })
    }
};
