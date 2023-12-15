import api from '@/api/api';

const Deal = {
    state: {
        deals: []
    },
    mutations: {
        SET_DEALS(state, deals) {
            state.deals = deals;
        }
    },
    actions: {
        async FETCH_DEALS({ commit }) {
            const data = await api.deal.getDeals();
            commit('SET_DEALS', data.data);
        },
        async FETCH_DEAL(_, id) {
            return await api.deal.getDeal(id);
        },
        async CREATE_DEAL(_, formdata) {
            return await api.deal.createDeal(formdata);
        },
        async UPDATE_DEAL(_, formdata) {
            return await api.deal.updateDeal(formdata, formdata.id);
        },
        async DELETE_DEAL(_, formdata) {
            return await api.deal.deleteDeal(formdata, formdata.id);
        }
    },
    getters: {
        getDeals(state) {
            return state.deals;
        }
    }
};

export default Deal;
