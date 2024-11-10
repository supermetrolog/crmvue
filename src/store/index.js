import { createStore } from 'vuex';
import Calendar from './modules/Calendar';
import Timeline from './modules/Timeline';
import CompanyRequest from './modules/CompanyRequest';
import CompanyContact from './modules/CompanyContact';
import CompanyLogs from './modules/CompanyLogs';
import Companies from './modules/Companies';
import Notifications from './modules/Notifications';
import Objects from './modules/Objects';
import Websocket from './modules/Websocket';
import Call from './modules/Call';
import User from './modules/User';
import Deal from './modules/Deal';
import CompanyObjects from './modules/CompanyObjects';
import Offers from './modules/Offers';
import CallerManager from './modules/CallerManager';
import Location from './modules/Location';
import Complex from './modules/Complex';
import Messenger from '@/store/modules/Messenger';
import Task from '@/store/modules/Task.js';
import { useAuth } from '@/composables/useAuth.js';
import Quizz from '@/store/modules/Quiz.js';
import { getAccessTokenFromLocalStorage } from '@/utils/localStorage.js';
import { setAccessToken } from '@/services/axios.js';

const store = createStore({
    state: {},
    mutations: {},
    actions: {
        async initialize({ dispatch }) {
            const { hasAccessToken, login } = useAuth();

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
            const { logout } = useAuth();

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
        Calendar,
        CompanyRequest,
        CompanyContact,
        CompanyLogs,
        Companies,
        Notifications,
        Objects,
        Websocket,
        Call,
        User,
        Deal,
        CompanyObjects,
        Offers,
        CallerManager,
        Location,
        Complex,
        Messenger,
        Task,
        Quizz
    }
});

store.checkAction = function (name) {
    return Object.keys(this._actions).includes(name);
};
export default store;
