import { helpers, required } from '@vuelidate/validators';
import dayjs from 'dayjs';

function distanceValidator(value, form) {
    return Boolean(form.distanceFromMKADnotApplicable) || value !== null;
}
function passiveWhyValidator(_, form, vm) {
    return form.status || required.$validator(form.passive_why, form, vm);
}
function movingDateValidator(value, form) {
    return form.unknownMovingDate !== null || value !== null;
}

function dateRangeValidator(value, form, vm) {
    if (value === null || vm.formData) return true;
    return dayjs(value).isAfter(dayjs(vm.formData ? vm.formData.movingDate : undefined), 'day');
}

export const validationRulesForRequest = {
    regions: {
        required: helpers.withMessage('Выберите регион', required)
    },
    dealType: {
        required: helpers.withMessage('Выберите тип сделки', required)
    },
    objectTypesGeneral: {
        required: helpers.withMessage('Выберите тип объекта', required)
    },
    distanceFromMKAD: {
        customRequired: helpers.withMessage('Заполните поле', distanceValidator)
    },
    company_id: {
        required: helpers.withMessage('Выберите компанию', required)
    },
    contact_id: {
        required: helpers.withMessage('Выберите контакт', required)
    },
    minArea: {
        required: helpers.withMessage('Заполните поле', required)
    },
    maxArea: {
        required: helpers.withMessage('Заполните поле', required)
    },
    minCeilingHeight: {
        required: helpers.withMessage('Заполните поле', required)
    },
    consultant_id: {
        required: helpers.withMessage('Выберите вариант', required)
    },
    movingDate: {
        customRequiredForMovingDate: helpers.withMessage('Заполните поле', movingDateValidator),
        maxValue: helpers.withMessage('Неверная дата', dateRangeValidator)
    },
    passive_why: {
        customRequiredPassiveWhy: helpers.withMessage('Выберите причину', passiveWhyValidator)
    }
};
