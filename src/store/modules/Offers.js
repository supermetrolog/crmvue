import api from '@/api/api';
import { deleteEmptyFields } from '@/utils/helpers/object/deleteEmptyFields.js';
import { useQueryHash } from '@/utils/useQueryHash.js';

const Offers = {
    state: {
        offers: [],
        offer: null,
        pagination: null,
        favoritesOffers: [],
        favoritesOffersCache: {}
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
        updateOfferById(state, data) {
            const offerIndex = state.findIndex(offer => offer.original_id === data.original_id);

            state.offers = [...state.slice(0, offerIndex), data, ...state.slice(offerIndex + 1)];
        },
        addFavoritesOffer(state, data) {
            state.favoritesOffers.push(data);
            state.favoritesOffersCache[data.original_id] = true;
        },
        updateFavoritesOffers(state, data) {
            state.favoritesOffers = data;
            state.favoritesOffersCache = data.reduce((acc, element) => {
                acc[element.original_id] = true;
                return acc;
            }, {});
        }
    },
    actions: {
        async SEARCH_OFFERS({ commit }, { query, concat = false }) {
            const { setHash, confirmHash } = useQueryHash('offers');
            setHash(query);

            const data = await api.offers.search(query);
            if (data) {
                if (confirmHash(query)) commit('updateOffers', { data, concat });
                else return false;
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
        async ADD_FAVORITES_OFFER(context, offer) {
            context.commit('addFavoritesOffer', offer);
            const newOffer = await api.offers.createFavoriteOffer({
                user_id: context.getters.THIS_USER.id,
                complex_id: offer.complex_id,
                object_id: offer.object_id,
                original_id: offer.original_id
            });

            context.commit(
                'updateFavoritesOffers',
                context.getters.FAVORITES_OFFERS.filter(
                    item => item.original_id != offer.original_id
                )
            );
            context.commit('addFavoritesOffer', newOffer);
        },
        async DELETE_FAVORITES_OFFERS(context, data) {
            const deleteId = context.getters.FAVORITES_OFFERS.find(
                item => item.original_id == data.original_id
            ).id;
            context.commit(
                'updateFavoritesOffers',
                context.getters.FAVORITES_OFFERS.filter(
                    item => item.original_id != data.original_id
                )
            );
            await api.offers.deleteFavoriteOffer(deleteId);
        },

        async TOGGLE_AVITO_AD(_, id) {
            const status = await api.offers.toggleAvitoAd(id);
            return status === 200;
        },

        async SEARCH_FAVORITES_OFFERS(context) {
            const data = await api.offers.searchFavoriteOffers({
                user_id: context.getters.THIS_USER.id
            });
            if (data.data) {
                context.commit('updateFavoritesOffers', data.data);
            }
            return data;
        },

        async getOffers(context, query) {
            const data = await api.offers.search(query);

            if (data) {
                return data.data;
            }

            return null;
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
        FAVORITES_OFFERS(state) {
            return state.favoritesOffers;
        }
    }
};

export default Offers;
