import api from "@/api/api"

const CompanyObjects = {
    state: {
        companyObjects: [],
        requestRecomendedObjects: []
    },
    mutations: {
        updateCompanyObjects(state, data) {
            state.companyObjects = data;
        },
        updateRequestRecomendedObjects(state, data) {
            state.requestRecomendedObjects = data;
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
        async FETCH_REQUEST_RECOMENDED_OBJECTS(context, request) {
            let query = {
                rangeMinArea: request.minArea,
                rangeMaxArea: request.maxArea,
                type_id: 1,
                pricePerFloor: request.pricePerFloor,
                // heated: request.heated,
                status: 1,
                // has_cranes: request.haveCranes,
                deal_type: request.dealType
            };
            const response = await api.companyObjects.searchOffers(query);
            if (response) {
                context.commit('updateRequestRecomendedObjects', response.data);
            }
            return response;
        },
    },

    getters: {
        COMPANY_OBJECTS(state) {
            return state.companyObjects;
        },
        REQUEST_RECOMENDED_OBJECTS(state) {
            return state.requestRecomendedObjects;
        }
    }
}

export default CompanyObjects;