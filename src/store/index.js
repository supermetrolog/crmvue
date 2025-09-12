import { createStore } from 'vuex';
import Timeline from './modules/Timeline';
import CompanyRequest from './modules/CompanyRequest';
import CompanyContact from './modules/CompanyContact';
import CompanyLogs from './modules/CompanyLogs';
import Companies from './modules/Companies';
import Notifications from './modules/Notifications';
import Websocket from './modules/Websocket';
import Call from './modules/Call';
import User from './modules/User';
import CompanyObjects from './modules/CompanyObjects';
import Offers from './modules/Offers';
import CallerManager from './modules/CallerManager';
import Location from './modules/Location';
import Complex from './modules/Complex';
import Messenger from '@/store/modules/Messenger';
import Task from '@/store/modules/Task.js';
import { hasAccessToken, login, logout } from '@/composables/useAuth';
import Quizz from '@/store/modules/Quiz.js';
import { getAccessTokenFromLocalStorage } from '@/services/localStorage.js';
import { setAccessToken } from '@/services/axios.js';
import Folder from '@/store/modules/Folder.js';
import FolderEntity from '@/store/modules/FolderEntity.js';

const store = createStore({
    state: {},
    mutations: {},
    actions: {
        async initialize({ dispatch }) {
            if (!hasAccessToken()) return false;

            const userInitialized = dispatch('initializeUser');
            if (!userInitialized) return false;

            const { accessToken } = getAccessTokenFromLocalStorage();
            setAccessToken(accessToken);

            dispatch('WEBSOCKET_STOP');
            dispatch('WEBSOCKET_RUN');

            const refreshed = await dispatch('refreshUser');
            if (!refreshed) return false;

            login();
            return true;
        },
        destroy({ dispatch, commit }) {
            dispatch('WEBSOCKET_STOP');
            dispatch('dropUser');
            commit('Messenger/clearCountersInterval');
            commit('Messenger/clearCachedMessage');

            logout();
        }
    },
    getters: {},
    modules: {
        Timeline,
        CompanyRequest,
        CompanyContact,
        CompanyLogs,
        Companies,
        Notifications,
        Websocket,
        Call,
        User,
        CompanyObjects,
        Offers,
        CallerManager,
        Location,
        Complex,
        Messenger,
        Task,
        Quizz,
        Folder,
        FolderEntity
    }
});

store.checkAction = function (name) {
    return Object.keys(this._actions).includes(name);
};

export default store;
