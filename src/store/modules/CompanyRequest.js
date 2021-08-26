import api from "@/api/api"
import axios from "axios"

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
            const url = "requests/company-requests/" + id + "?expand=consultant,directions,districts,gateTypes,objectClasses,objectTypes,regions&sort=-created_at";
            await axios
                .get(url)
                .then((Response) => {
                    context.commit('updateCompanyRequests', Response.data)
                });
        }
    },

    getters: {
        COMPANY_REQUESTS(state) {
            return state.companyRequests;
        }
    }
}

export default CompanyRequest;