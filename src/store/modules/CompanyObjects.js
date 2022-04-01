import api from "@/api/api"

const CompanyObjects = {
    state: {
        companyObjects: [],
    },
    mutations: {
        updateCompanyObjects(state, data) {
            state.companyObjects = data;
        },
    },
    actions: {
        async FETCH_COMPANY_OBJECTS(context, company_id) {
            const response = await api.companyObjects.search({ company_id });
            if (response) {
                context.commit('updateCompanyObjects', response.data);
            }
            return response;
        },
    },

    getters: {
        COMPANY_OBJECTS(state) {
            return state.companyObjects;
        }
    }
}

export default CompanyObjects;