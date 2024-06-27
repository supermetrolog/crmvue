import { alg } from '@/utils/alg.js';

export const getCompanyName = (company, companyID) => {
    if (!company || company?.noName) return 'Компания #' + companyID;

    if (alg.isNumeric(company.nameRu)) return 'Компания №' + company.nameRu;

    let companyName = company.nameRu;
    if (company.nameEng) companyName += ' - ' + company.nameEng;

    return companyName;
};
