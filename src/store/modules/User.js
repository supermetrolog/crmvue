import api from "@/api/api";

const User = {
    state: {
        consultantList: [],
        thisUser: null,
        users: [],
    },
    mutations: {
        updateConsultantList(state, data) {
            let newConsultantList = [];
            data.map(item => {
                newConsultantList.push({
                    value: item.id,
                    label: item.userProfile.short_name,
                    status: item.status
                })
            });
            state.consultantList = newConsultantList;
        },
        setUser(state, user) {
            state.thisUser = user;
        },
        updateUsers(state, data) {
            state.users = data;
        }
    },
    actions: {
        async FETCH_CONSULTANT_LIST(context) {
            if (context.getters.CONSULTANT_LIST.length) {
                return context.getters.CONSULTANT_LIST;
            }
            let data = await api.functions.getConsultantList();
            if (data) {
                context.commit('updateConsultantList', data);
                return context.getters.CONSULTANT_LIST;
            }
        },
        async FETCH_USERS(context) {
            let data = await api.user.getUsers();
            if (data) {
                context.commit('updateUsers', data);
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
        DROP_USER(context) {
            console.log("DROP_USER");
            context.commit('setUser', null);
            context.dispatch('WEBSOCKET_STOP');
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
        },
        async CREATE_USER(_, formdata) {
            return await api.user.createUser(formdata);
        },
        async UPDATE_USER(_, formdata) {
            return await api.user.updateUser(formdata);
        },
        async DELETE_USER(_, id) {
            return await api.user.deleteUser(id);
        },
    },
    getters: {
        CONSULTANT_LIST(state) {
            return state.consultantList;
        },
        THIS_USER(state) {
            return state.thisUser;
        },
        USERS(state) {
            return state.users;
        },
    },
}

export default User;