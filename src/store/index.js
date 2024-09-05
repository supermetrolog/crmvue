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
import axios from 'axios';
import Messenger from '@/store/modules/Messenger';
import Task from '@/store/modules/Task.js';
import { useAuth } from '@/composables/useAuth.js';
import Quizz from '@/store/modules/Quiz.js';
import { getUserInLocalStorage } from '@/utils/localStorage.js';

const store = createStore({
    state: {},
    mutations: {},
    actions: {
        SET_WINDOW_NAME(context) {
            const currentTime = new Date().getTime();
            window.name = `${currentTime}_${context.getters.THIS_USER.id}`;
        },
        UNSET_WINDOW_NAME() {
            window.name = '';
        },
        async INIT({ dispatch, getters }) {
            const { isAuth, login } = useAuth();

            if (!isAuth.value) {
                if (getUserInLocalStorage()) login();
                else return false;
            }

            dispatch('SET_USER');
            axios.defaults.headers.common['Authorization'] =
                `Bearer ${getters.THIS_USER.access_token}`;

            dispatch('SET_WINDOW_NAME');
            dispatch('WEBSOCKET_STOP');
            dispatch('WEBSOCKET_RUN');
            await dispatch('REFRESH_USER');
            dispatch('Messenger/setCountersUpdater');
        },
        async DESTROY({ dispatch, commit }) {
            const { logout } = useAuth();

            dispatch('WEBSOCKET_STOP');
            dispatch('DROP_USER');
            dispatch('UNSET_WINDOW_NAME');
            commit('Messenger/clearCountersInterval');
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
