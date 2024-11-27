import api from '@/api/api';
import { useAuth } from '@/composables/useAuth.js';
import {
    getAccessTokenFromLocalStorage,
    getUserFromLocalStorage,
    removeUserInLocalStorage,
    setUserInLocalStorage
} from '@/services/localStorage.js';
import { userOptions } from '@/const/options/user.options.js';

const User = {
    state: {
        consultantList: [],
        users: [],
        consultants: [],
        user: null
    },
    mutations: {
        updateConsultantList(state, data) {
            state.consultantList = data.map(element => {
                return {
                    id: element.id,
                    value: element.id,
                    label: element.userProfile.medium_name,
                    status: element.status,
                    avatar: element.userProfile.avatar,
                    short_name: element.userProfile.short_name,
                    role_id: element.role,
                    role: userOptions.role[element.role],
                    email: element.email,
                    phones: element.userProfile.phones.map(element => element.phone).join(', '),
                    emails: element.userProfile.emails.map(element => element.email).join(', ')
                };
            });
        },
        setUser(state, user) {
            state.user = user;
        },
        updateUsers(state, data) {
            state.users = data;
        },
        setConsultants(state, consultants) {
            state.consultants = consultants;
        },
        restore(state, userId) {
            const userIndex = state.users.findIndex(user => user.id === userId);
            if (userIndex !== -1)
                state.users[userIndex].status = userOptions.statusStatement.ACTIVE;
        },
        archive(state, userId) {
            const userIndex = state.users.findIndex(user => user.id === userId);
            if (userIndex !== -1)
                state.users[userIndex].status = userOptions.statusStatement.INACTIVE;
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
        async FETCH_USERS({ commit }, params = {}) {
            let data = await api.user.list(params);
            if (data) commit('updateUsers', data);
        },
        async refreshUser({ commit, state }) {
            const [userResponse, chatMemberId] = await Promise.all([
                api.user.get(state.user.id),
                api.messenger.getUserChatMember(state.user.id)
            ]);

            if (!userResponse) return false;
            userResponse.chat_member_id = chatMemberId;

            const { accessToken, accessTokenId } = getAccessTokenFromLocalStorage();

            setUserInLocalStorage(userResponse, accessToken, accessTokenId);

            commit('setUser', userResponse);

            return true;
        },
        initializeUser({ commit }) {
            const user = getUserFromLocalStorage();

            if (user) {
                commit('setUser', user);
                return true;
            }

            return false;
        },
        dropUser({ commit }) {
            removeUserInLocalStorage();
            commit('setUser', null);
        },
        async login({ dispatch }, formData) {
            const { login } = useAuth();

            const user = await api.user.auth.login(formData);

            if (user) {
                setUserInLocalStorage(user.user, user.access_token, user.access_token_id);

                dispatch('initializeUser');
                login();
                return true;
            }

            return false;
        },
        async logout({ dispatch }) {
            const response = await api.user.auth.logout();

            if (response !== false) {
                dispatch('destroy');
            }

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
            return state.user;
        },
        USERS(state) {
            return state.users;
        },
        isModerator(state) {
            return state.user.role > userOptions.roleStatement.CONSULTANT;
        },
        isAdmin(state) {
            return state.user.role === userOptions.roleStatement.ADMIN;
        },
        isDirector(state) {
            return state.user.role === userOptions.roleStatement.DIRECTOR;
        },
        activeConsultants(state) {
            return state.consultants.filter(
                element => element.status === userOptions.statusStatement.ACTIVE
            );
        },
        moderator(state) {
            return state.consultantList.find(
                element => element.role_id === userOptions.roleStatement.MODERATOR
            );
        }
    }
};

export default User;
