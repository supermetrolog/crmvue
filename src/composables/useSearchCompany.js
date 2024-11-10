import api from '@/api/api.js';

export function useSearchCompany(defaultQuery) {
    return async function searchCompany(querySearch) {
        let query = {};

        if (querySearch == null) {
            if (defaultQuery.value) query = { id: defaultQuery.value };
            else return [];
        } else {
            query = { all: querySearch };
        }

        const response = await api.companies.search(query);

        return response.map(company => ({
            value: company.id,
            label: company.full_name,
            logo: company.logo
        }));
    };
}
