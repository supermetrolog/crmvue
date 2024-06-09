import api from '@/api/api';
import { deleteEmptyFields } from '@/utils/deleteEmptyFields.js';

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
        }
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
                rangeMinCeilingHeight: request.minCeilingHeight,
                rangeMaxCeilingHeight: request.maxCeilingHeight,
                type_id: [1, 2],
                pricePerFloor: request.pricePerFloor,
                heated: request.heated,
                status: 1,
                deal_type: request.dealType,
                self_leveling: request.antiDustOnly,
                approximateDistanceFromMKAD: request.distanceFromMKAD,
                has_cranes: request.haveCranes,
                minElectricity: request.electricity,
                region: request.regions.map(item => item.region),
                expand: 'object,miniOffersMix'
            };
            deleteEmptyFields(query);
            const response = await api.companyObjects.searchOffers(query);
            if (response) {
                context.commit('updateRequestRecomendedObjects', response.data);
            }
            return response;
        }
    },

    getters: {
        COMPANY_OBJECTS(state) {
            return state.companyObjects;
        },
        REQUEST_RECOMENDED_OBJECTS(state) {
            return state.requestRecomendedObjects;
        }
    }
};

export default CompanyObjects;
