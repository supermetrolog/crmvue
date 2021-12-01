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
import User from './modules/User'
const store = createStore({
    state: {},
    mutations: {},
    actions: {

    },
    getters: {},
    modules: {
        Timeline,
        Calendar,
        CompanyRequest,
        CompanyContact,
        Companies,
        Notifications,
        Objects,
        Websocket,
        Call,
        User
    }
})
store.checkAction = function(name) {
    return Object.keys(this._actions).includes(name);
};
export default store