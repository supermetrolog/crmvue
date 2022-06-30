import api from "@/api/api"
import { waitHash } from "../../utils";
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
        wait_hash: null,
        favoritesOffers: []
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
        addFavoritesOffer(state, data) {
            state.favoritesOffers.push(data)
        },
        updateFavoritesOffers(state, data) {
            state.favoritesOffers = data;
        }
    },
    actions: {
        async SEARCH_OFFERS(context, { query, concat = false }) {
            let hash = waitHash(query);
            context.commit('setWaitHash', hash);
            const data = await api.offers.search(query);
            if (data) {
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
        ADD_FAVORITES_OFFER(context, offer) {
            context.commit('addFavoritesOffer', offer)
            localStorage.setItem('favoritesOffers', JSON.stringify(context.getters.FAVORITES_OFFERS));
        },
        UPDATE_FAVORITES_OFFERS(context, data) {
            context.commit('updateFavoritesOffers', data)
            localStorage.setItem('favoritesOffers', JSON.stringify(context.getters.FAVORITES_OFFERS));
        },

        LOAD_LOCAL_TO_VUEX(context) {
            if (localStorage.getItem('favoritesOffers')) {
                context.commit('updateFavoritesOffers', JSON.parse(localStorage.getItem('favoritesOffers')));
            }
        }
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
        },

        FAVORITES_OFFERS(state) {
            return state.favoritesOffers;
        }
    }
}

export default Offers;