import api from '@/api/api.js';
import { toValue } from 'vue';

import { getCompanyName } from '@/utils/formatters/models/company.js';

function companyToOption(company) {
    return {
        value: company.id,
        label: getCompanyName(company),
        logo: company.logo
    };
}

export function useSearchCompany(defaultQuery = null) {
    return async function searchCompany(querySearch) {
        let query = {};

        if (querySearch == null) {
            const initialQuery = toValue(defaultQuery);

            if (initialQuery) query = { id: initialQuery };
            else return [];
        } else {
            query = { all: querySearch };
        }

        const response = await api.companies.search(query);
        return response.map(companyToOption);
    };
}
