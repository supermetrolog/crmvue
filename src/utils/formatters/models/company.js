import isNullish from '@vueform/multiselect/src/utils/isNullish.js';

export function getCompanyName(company, companyID = null) {
    if (isNullish(company)) return `Компания #${companyID}`;

    if (company.is_individual && company.noName)
        return `${company.individual_full_name} (физ.лицо)`;

    if (company.noName) return `Компания #${company.id} (без названия)`;

    if (company.full_name) return company.full_name;

    let companyName = company.nameRu;
    if (company.nameEng) companyName += ' - ' + company.nameEng;

    return companyName;
}