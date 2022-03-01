import api from "@/api/api"

const CompanyRequest = {
    state: {
        companyRequests: {},

    },
    mutations: {
        updateCompanyRequests(state, data) {
            state.companyRequests = data;
        },
        deleteRequest(state, request_id) {
            state.companyRequests = state.companyRequests.filter(item => item.id != request_id);
        }
    },
    actions: {
        async SEARCH_REQUESTS(_, query) {
            const data = await api.request.searchRequests(query);
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
    }
}

export default CompanyRequest;