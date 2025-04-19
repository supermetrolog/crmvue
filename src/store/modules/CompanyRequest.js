import api from '@/api/api';
import { useQueryHash } from '@/utils/use/useQueryHash.js';
import { spliceById } from '@/utils/helpers/array/spliceById.js';

const CompanyRequest = {
    state: {
        companyRequests: {},
        requests: [],
        pagination: null
    },
    mutations: {
        updateCompanyRequests(state, data) {
            state.companyRequests = data;
        },
        updateRequests(state, { data, concat }) {
            state.pagination = data.pagination;

            if (concat) {
                state.requests = state.requests.concat(data.data);
            } else {
                state.requests = data.data;
            }
        },
        deleteRequest(state, requestId) {
            spliceById(state.companyRequests, requestId);
        }
    },
    actions: {
        async SEARCH_REQUESTS({ commit }, { query, concat = false }) {
            const { setHash, confirmHash } = useQueryHash('company-requests');
            setHash(query);

            const data = await api.request.search(query);

            if (data) {
                if (confirmHash(query)) commit('updateRequests', { data, concat });
                else return false;
            }

            return data;
        },
        async FETCH_COMPANY_REQUESTS(context, id) {
            const requests = await api.request.byCompanyId(id);
            context.commit('updateCompanyRequests', requests);
            return requests;
        }
    },
    getters: {
        COMPANY_REQUESTS(state) {
            return state.companyRequests;
        },
        REQUESTS(state) {
            return state.requests;
        },
        REQUESTS_PAGINATION(state) {
            return state.pagination;
        }
    }
};

export default CompanyRequest;
