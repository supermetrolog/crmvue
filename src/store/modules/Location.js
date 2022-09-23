import api from "@/api/api";

const Location = {
    state: {
        notifications: [],
        notificationsCount: 0,
        notificationsPagination: null,
        regionList: null
    },
    mutations: {
        updateRegionList(state, data) {
            state.regionList = data;
        }
    },
    actions: {
        async FETCH_REGION_LIST(context) {
            if (context.getters.REGION_LIST) return;
            let regionList = await api.location.fetchRegionList();
            if (regionList) {
                context.commit('updateRegionList', regionList);
            }
        }
    },
    getters: {
        REGION_LIST(state) {
            return state.regionList;
        }
    }
}

export default Location