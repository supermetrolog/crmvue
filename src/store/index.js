import { createStore } from 'vuex'
import Calendar from './modules/Calendar'
import Timeline from './modules/Timeline'
import CompanyRequest from './modules/CompanyRequest'
import CompanyContact from './modules/CompanyContact'
import Companies from './modules/Companies'
import Notifications from './modules/Notifications'
import Objects from './modules/Objects'
import Websocket from './modules/Websocket'
import Call from './modules/Call'
import api from '@/api/api'
const store = createStore({
    state: {
        errors: ["fuck"],
        consultantList: [],
        thisUser: null,
    },
    mutations: {
        setErrors(state, errorList) {
            state.errors = errorList;
        },
        deleteErrors(state) {
            state.errors = [];
        },
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
        SET_ERRORS(context, errorList, delay = 2000) {
            context.commit('setErrors', errorList);
            setTimeout(() => {
                context.dispatch('DELETE_ERRORS');
            }, delay);
        },
        DELETE_ERRORS(context) {
            context.commit('deleteErrors');
        },
        SET_USER(context) {
            if (!context.getters.THIS_USER) {
                const user = JSON.parse(localStorage.getItem('user'));
                context.commit('setUser', user);
            }
            return context.getters.THIS_USER;
        },

    },
    getters: {
        ERRORS(state) {
            return state.errors;
        },
        CONSULTANT_LIST(state) {
            return state.consultantList;
        },
        THIS_USER(state) {
            return state.thisUser;
        }
    },
    modules: {
        Timeline,
        Calendar,
        CompanyRequest,
        CompanyContact,
        Companies,
        Notifications,
        Objects,
        Websocket,
        Call
    }
})
store.checkAction = function(name) {
    return Object.keys(this._actions).includes(name);
};
export default store