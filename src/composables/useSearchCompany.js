import api from '@/api/api.js';
import { multiselectAdapter } from '@/utils/adapters.js';

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
        return multiselectAdapter(response, 'id', 'full_name');
    };
}
