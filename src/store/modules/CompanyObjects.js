import api from '@/api/api';
import { deleteEmptyFields } from '@/utils/deleteEmptyFields.js';

const CompanyObjects = {
    state: {
        companyObjects: [],
        pagination: null,
        requestRecomendedObjects: []
    },
    mutations: {
        updateCompanyObjects(state, data) {
            state.companyObjects = data;
        },
        addCompanyObjects(state, objects) {
            state.companyObjects.push(...objects);
        },
        updateRequestRecomendedObjects(state, data) {
            state.requestRecomendedObjects = data;
        },
        clearCompanyObjectsStore(state) {
            state.companyObjects = [];
            state.requestRecomendedObjects = [];
            state.pagination = null;
        },
        updatePagination(state, pagination) {
            state.pagination = pagination;
        }
    },
    actions: {
        async FETCH_COMPANY_OBJECTS(context, company_id) {
            const response = await api.companyObjects.search({ company_id });
            if (response) {
                context.commit('updateCompanyObjects', response.data);
                context.commit('updatePagination', response.pagination);
            }
            return response;
        },
        async loadCompanyObjects({ commit, state }, company_id) {
            if (state.pagination && state.pagination.currentPage === state.pagination.pageCount)
                return true;
            const page = state.pagination?.currentPage ?? 1;
            const response = await api.companyObjects.search({ company_id, page: page + 1 });

            if (response) {
                commit('addCompanyObjects', response.data);
                commit('updatePagination', response.pagination);

                if (response.pagination.currentPage === response.pagination.pageCount) return true;
            }

            return false;
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
