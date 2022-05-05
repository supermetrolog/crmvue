import api from "@/api/api"
import crypto from "crypto"
const deleteEmptyFields = (object) => {
    for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
            const value = object[key];
            if (
                value === null ||
                value === "" ||
                (Array.isArray(value) && !value.length)
            ) {
                delete object[key];
            }
        }
    }
};
const Offers = {
    state: {
        offers: [],
        offer: null,
        pagination: null,
        wait_hash: null
    },
    mutations: {
        updateOffers(state, { data, concat }) {
            state.pagination = data.pagination;
            if (concat) {
                state.offers = state.offers.concat(data.data);
            } else {
                state.offers = data.data;
            }
        },
        setWaitHash(state, hash) {
            state.wait_hash = hash;
            console.warn("SET WAIT HASH", state.wait_hash);
        },
    },
    actions: {
        async SEARCH_OFFERS(context, { query, concat = false }) {
            let hash = crypto.createHash('sha256').update(JSON.stringify(query)).digest('base64');
            context.commit('setWaitHash', hash);
            console.warn('HASH1', hash, 'HASH2', context.getters);
            const data = await api.offers.search(query);
            if (data) {
                console.error('HASH1', hash, 'HASH2', context.getters.WAIT_HASH);
                if (hash == context.getters.WAIT_HASH) {
                    context.commit('updateOffers', { data, concat });
                } else {
                    return false;
                }
            }
            return data;
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
            const response = await api.offers.search(query);
            if (response) {
                context.commit('updateRequestRecomendedObjects', response.data);
            }
            return response;
        },
    },
    getters: {
        OFFERS(state) {
            return state.offers;
        },
        OFFER(state) {
            return state.offer;
        },
        OFFERS_PAGINATION(state) {
            return state.pagination;
        },
        WAIT_HASH(state) {
            return state.wait_hash;
        }
    }
}

export default Offers;