import { helpers, required, requiredIf } from '@vuelidate/validators';
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
    region_ids: {
        required: helpers.withMessage('Выберите регион', required)
    },
    dealType: {
        required: helpers.withMessage('Выберите тип сделки', required)
    },
    object_type_general_ids: {
        required: helpers.withMessage('Выберите тип объекта', required)
    },
    distanceFromMKAD: {
        customRequired: helpers.withMessage('Заполните удаленность от МКАД', distanceValidator)
    },
    company_id: {
        required: helpers.withMessage('Выберите компанию', required)
    },
    minArea: {
        required: helpers.withMessage('Заполните минимальную площадь', required)
    },
    maxArea: {
        required: helpers.withMessage('Заполните максимальную площадь', required)
    },
    minCeilingHeight: {
        required: helpers.withMessage(
            'Заполните минимальную высоту',
            requiredIf((_, form) => {
                return !form.object_type_general_ids.includes(2);
            })
        )
    },
    consultant_id: {
        required: helpers.withMessage('Выберите консультанта', required)
    },
    movingDate: {
        customRequiredForMovingDate: helpers.withMessage(
            'Заполните дату переезда',
            movingDateValidator
        ),
        maxValue: helpers.withMessage('Неверная дата переезда', dateRangeValidator)
    },
    passive_why: {
        customRequiredPassiveWhy: helpers.withMessage(
            'Выберите причину архивации',
            passiveWhyValidator
        )
    }
};
