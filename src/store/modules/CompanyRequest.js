import api from "@/api/api"
import { waitHash } from "../../utils";

const CompanyRequest = {
    state: {
        companyRequests: {},
        requests: [],
        pagination: null,
        request_wait_hash: null,
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
            console.log(concat);

        },
        deleteRequest(state, request_id) {
            state.companyRequests = state.companyRequests.filter(item => item.id != request_id);
        },
        setRequestWaitHash(state, hash) {
            state.request_wait_hash = hash;
            console.warn("SET WAIT HASH", state.request_wait_hash);
        },
    },
    actions: {
        async SEARCH_REQUESTS(context, { query, concat = false }) {
            let hash = waitHash(query);
            context.commit('setRequestWaitHash', hash);
            console.warn('HASH1', hash, 'HASH2', context.getters);
            const data = await api.request.searchRequests(query);
            if (data) {
                console.error('HASH1', hash, 'HASH2', context.getters.REQUEST_WAIT_HASH);
                if (hash == context.getters.REQUEST_WAIT_HASH) {
                    context.commit('updateRequests', { data, concat });

                } else {
                    return false;
                }
            }
            return data;
        },
        // async SEARCH_REQUESTS(_, query) {
        //     const search = query.searchText;
        //     const queryParams = {
        //         minArea: search,
        //         dealType: search,
        //         maxArea: search,
        //     };
        //     const result = await api.request.searchRequests(queryParams);
        //     return result;
        // },
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
        },
        REQUEST_WAIT_HASH(state) {
            return state.request_wait_hash;
        }
    }
}

export default CompanyRequest;