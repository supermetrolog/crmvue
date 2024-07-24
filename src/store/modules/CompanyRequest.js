import api from '@/api/api';
import { useQueryHash } from '@/utils/useQueryHash.js';

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
        deleteRequest(state, request_id) {
            state.companyRequests = state.companyRequests.filter(item => item.id != request_id);
        }
    },
    actions: {
        async SEARCH_REQUESTS({ commit }, { query, concat = false }) {
            const { setHash, confirmHash } = useQueryHash('company-requests');
            setHash(query);

            const data = await api.request.searchRequests(query);
            if (data) {
                if (confirmHash(query)) commit('updateRequests', { data, concat });
                else return false;
            }
            return data;
        },
        async CREATE_REQUEST(context, formdata) {
            return await api.request.createRequest(formdata);
        },
        async UPDATE_REQUEST(context, formdata) {
            return await api.request.updateRequest(formdata);
        },
        async DELETE_REQUEST(context, request) {
            if (await api.request.deleteRequest(request.id)) {
                context.commit('deleteRequest', request.id);
            }
        },
        async FETCH_COMPANY_REQUESTS(context, id) {
            const requests = await api.request.getRequests(id);
            context.commit('updateCompanyRequests', requests);
            return requests;
        },
        async getCompanyRequests(_, id) {
            return await api.request.getRequests(id);
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
