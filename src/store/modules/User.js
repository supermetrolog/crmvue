import api from '@/api/api';
import { useAuth } from '@/composables/useAuth.js';
import {
    getUserInLocalStorage,
    LOCALSTORAGE_PREFIX,
    LS_ACCESS_TOKEN_KEY,
    removeUserInLocalStorage,
    setUserInLocalStorage
} from '@/utils/localStorage.js';
import { userOptions } from '@/const/options/user.options.js';

const User = {
    state: {
        consultantList: [],
        thisUser: null,
        users: [],
        consultants: []
    },
    mutations: {
        updateConsultantList(state, data) {
            let newConsultantList = [];
            data.map(item => {
                newConsultantList.push({
                    value: item.id,
                    label: item.userProfile.short_name,
                    status: item.status
                });
            });
            state.consultantList = newConsultantList;
        },
        setUser(state, user) {
            state.thisUser = user;
        },
        updateUsers(state, data) {
            state.users = data;
        },
        setConsultants(state, consultants) {
            state.consultants = consultants;
        }
    },
    actions: {
        async FETCH_CONSULTANT_LIST({ getters, commit }) {
            if (getters.CONSULTANT_LIST.length) return getters.CONSULTANT_LIST;

            let data = await api.functions.getConsultantList();
            if (data) {
                commit('updateConsultantList', data);
                return getters.CONSULTANT_LIST;
            }

            return [];
        },
        async FETCH_USERS({ commit }) {
            let data = await api.user.list();
            if (data) commit('updateUsers', data);
        },
        async REFRESH_USER({ getters, commit }) {
            const access_token = localStorage.getItem(LOCALSTORAGE_PREFIX + LS_ACCESS_TOKEN_KEY);
            if (!getters.THIS_USER || !access_token) return;

            let [newUserData, chatMemberUser] = await Promise.all([
                api.user.get(getters.THIS_USER.id),
                api.messenger.getUserChatMember(getters.THIS_USER.id)
            ]);

            if (!newUserData) return;

            newUserData.chat_member_id = chatMemberUser;
            setUserInLocalStorage(newUserData, access_token);
            newUserData.access_token = access_token;
            commit('setUser', newUserData);
        },
        SET_USER({ getters, commit }) {
            if (getters.THIS_USER) return getters.THIS_USER;
            const user = getUserInLocalStorage();
            if (user) {
                user.access_token = localStorage.getItem(LOCALSTORAGE_PREFIX + LS_ACCESS_TOKEN_KEY);
                commit('setUser', user);
            }
        },
        DROP_USER({ commit }) {
            removeUserInLocalStorage();
            commit('setUser', null);
        },
        async login({ dispatch }, formData) {
            const response = await api.user.auth.login(formData);
            if (response) {
                const { login } = useAuth();
                dispatch('SET_USER');
                login();
                return true;
            }

            return false;
        },
        async LOGOUT({ dispatch }) {
            const response = await api.user.auth.logout();
            if (response !== false) dispatch('DESTROY');
            return response;
        },
        async getConsultants({ state, commit }) {
            if (state.consultants.length) return state.consultants;

            const [consultants, chatMembers] = await Promise.all([
                api.functions.getConsultantList(),
                api.messenger.getUserChatMembers()
            ]);

            if (consultants) {
                consultants.forEach(user => {
                    user.chat_member_id = chatMembers[user.id];
                });

                commit(
                    'setConsultants',
                    consultants.filter(element => element.role < 5)
                );
            }

            return state.consultants;
        },
        async getActiveConsultants({ state, getters, dispatch }) {
            if (state.consultants.length) return getters.activeConsultants;

            await dispatch('getConsultants');
            return getters.activeConsultants;
        }
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
        isModerator(state) {
            return state.thisUser.role > userOptions.roleStatement.CONSULTANT;
        },
        isAdmin(state) {
            return state.thisUser.role === userOptions.roleStatement.ADMIN;
        },
        isDirector(state) {
            return state.thisUser.role === userOptions.roleStatement.DIRECTOR;
        },
        activeConsultants(state) {
            return state.consultants.filter(
                element => element.status === userOptions.statusStatement.ACTIVE
            );
        }
    }
};

export default User;
