import api from "@/api/api"

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
            console.log(concat);

        },
        deleteRequest(state, request_id) {
            state.companyRequests = state.companyRequests.filter(item => item.id != request_id);
        }
    },
    actions: {
        async SEARCH_REQUESTS(context, { query, concat = false }) {
            const data = await api.request.searchRequests(query);
            if (data) {
                context.commit('updateRequests', { data, concat });
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
        }
    }
}

export default CompanyRequest;