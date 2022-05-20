import api from "@/api/api"

const Deal = {
    state: {},
    mutations: {},
    actions: {
        async FETCH_DEALS() {
            return await api.deal.getDeals();
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
        },

    },
    getters: {}
}

export default Deal;