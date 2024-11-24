import { isEmpty } from '@/utils/helpers/common/isEmpty.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { isEmptyArray } from '@/utils/helpers/array/isEmptyArray.js';

function isNotEmpty(value) {
    return !isEmpty(value);
}

function isNotEmptyArray(value) {
    return !isEmptyArray(value);
}

export const progressCharacteristics = [
    {
        key: 'noName',
        label: 'Название',
        validator: (value, company) => company.is_individual || !company.noName
    },
    {
        key: 'bik',
        label: 'БИК',
        validator: isNotEmpty
    },
    {
        key: 'inn',
        label: 'ИНН',
        validator: isNotEmpty
    },
    {
        key: 'kpp',
        label: 'КПП',
        validator: isNotEmpty
    },
    {
        key: 'ogrn',
        label: 'ОГРН',
        validator: isNotEmpty
    },
    {
        key: 'okpo',
        label: 'ОКПО',
        validator: isNotEmpty
    },
    {
        key: 'okved',
        label: 'ОКВЭД',
        validator: isNotEmpty
    },
    {
        key: 'officeAdres',
        label: 'Адрес (офиса или юридический)',
        validator: (value, company) =>
            isNotEmpty(company.officeAdres) || isNotEmpty(company.legalAddress)
    },
    {
        key: 'consultant_id',
        label: 'Консультант',
        validator: isNotNullish
    },
    {
        key: 'formOfOrganization',
        label: 'Форма организации',
        validator: isNotNullish
    },
    {
        key: 'description',
        label: 'Описание',
        validator: isNotEmpty
    },
    {
        key: 'logo',
        label: 'Логотип',
        validator: isNotNullish
    },
    {
        key: 'productRanges',
        label: 'Номенклатура товара',
        validator: isNotEmptyArray
    },
    {
        key: 'categories',
        label: 'Категория',
        validator: isNotEmptyArray
    },
    {
        key: 'contacts',
        label: 'Контакты',
        validator: isNotEmptyArray
    },
    {
        key: 'activityGroup',
        label: 'Группа деятельности',
        validator: isNotNullish
    },
    {
        key: 'activityProfile',
        label: 'Профиль деятельности',
        validator: isNotNullish
    }
];

export const companyProperties = {
    progressCharacteristics
};
