import isNullish from '@vueform/multiselect/src/utils/isNullish.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { isNotEmptyString } from '@/utils/helpers/string/isNotEmptyString.js';

export function getCompanyName(company, companyID = null) {
    if (isNullish(company)) return `Компания #${companyID}`;

    if (company.is_individual && company.noName)
        return `${company.individual_full_name} (физ.лицо)`;

    if (company.noName) {
        if (isNotNullish(company.nameBrand) && isNotEmptyString(company.nameBrand))
            return `${company.nameBrand} - #${company.id} (без названия)`;
        else return `Компания #${company.id} (без названия)`;
    }

    if (company.full_name) return company.full_name;

    let companyName = company.nameRu;
    if (company.nameEng) companyName += ' - ' + company.nameEng;

    return companyName;
}
