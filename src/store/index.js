import { createStore } from 'vuex'
import Calendar from './modules/Calendar'
import Timeline from './modules/Timeline'
import CompanyRequest from './modules/CompanyRequest'
import CompanyContact from './modules/CompanyContact'
import Companies from './modules/Companies'
import Notifications from './modules/Notifications'
import Objects from './modules/Objects'
import api from '@/api/api'
const store = createStore({
    state: {
        errors: ["fuck"],
        consultantList: [],
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
        }
    },
    getters: {
        ERRORS(state) {
            return state.errors;
        },
        CONSULTANT_LIST(state) {
            return state.consultantList;
        }
    },
    modules: {
        Timeline,
        Calendar,
        CompanyRequest,
        CompanyContact,
        Companies,
        Notifications,
        Objects
    }
})
export default store