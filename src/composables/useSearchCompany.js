import api from '@/api/api.js';
import { unref } from 'vue';

function companyToOption(company) {
    return {
        value: company.id,
        label: company.full_name,
        logo: company.logo
    };
}

export function useSearchCompany(defaultQuery) {
    return async function searchCompany(querySearch) {
        let query = {};

        if (querySearch == null) {
            const initialQuery = unref(defaultQuery);

            if (initialQuery) query = { id: initialQuery };
            else return [];
        } else {
            query = { all: querySearch };
        }

        const response = await api.companies.search(query);
        return response.map(companyToOption);
    };
}
