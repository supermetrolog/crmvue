import api from "@/api/api";

const User = {
    state: {
        consultantList: [],
        thisUser: null,
    },
    mutations: {
        updateConsultantList(state, data) {
            let newConsultantList = [];
            data.map(item => {
                newConsultantList.push({
                    value: item.id,
                    label: item.username,
                    status: item.status
                })
            });
            state.consultantList = newConsultantList;
        },
        setUser(state, user) {
            state.thisUser = user;
        }
    },
    actions: {
        async FETCH_CONSULTANT_LIST(context) {
            if (context.getters.CONSULTANT_LIST.length) {
                return;
            }
            let data = await api.functions.getConsultantList();
            if (data) {
                context.commit('updateConsultantList', data);
            }
        },
        SET_USER(context) {
            if (!context.getters.THIS_USER) {
                let user = JSON.parse(localStorage.getItem('user'));
                user.access_token = localStorage.getItem('access_token');
                context.commit('setUser', user);
            }
            return context.getters.THIS_USER;
        },
        async LOGIN(context, formdata) {
            const response = await api.user.auth.login(formdata);
            if (response !== false) {
                context.dispatch('SET_USER');
            }
            return response;
        },
        async LOGOUT(context) {
            const response = await api.user.auth.logout();
            context.dispatch('WEBSOCKET_STOP');
            if (response !== false) {
                context.commit('setUser', null);
            }
            return response;
        }
    },
    getters: {
        CONSULTANT_LIST(state) {
            return state.consultantList;
        },
        THIS_USER(state) {
            return state.thisUser;
        },

    },
}

export default User;