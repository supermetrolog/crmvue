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
import Deal from './modules/Deal'
import CompanyObjects from './modules/CompanyObjects'
import axios from "axios";
const store = createStore({
    state: {},
    mutations: {},
    actions: {
        SET_WINDOW_NAME(context) {
            const currentTime = new Date().getTime();
            let session_unique_id = `${currentTime}_${context.getters.THIS_USER.id}`;
            window.name = session_unique_id;
        },
        UNSET_WINDOW_NAME() {
            window.name = '';
        },
        async INIT(context) {
            console.log('INIT');
            if (!localStorage.getItem("user")) {
                console.error('User not found in localStorage!');
                return false;
            }
            await context.dispatch("SET_USER");
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${context.getters.THIS_USER.access_token}`;
            await context.dispatch("SET_WINDOW_NAME");
            await context.dispatch("WEBSOCKET_STOP");
            await context.dispatch("WEBSOCKET_RUN");
            context.dispatch('REFRESH_USER');
        },
        DESTROY(context) {
            console.log('DESTROY');
            context.dispatch('WEBSOCKET_STOP');
            context.dispatch("DROP_USER");
            context.dispatch("UNSET_WINDOW_NAME");
        },
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
        User,
        Deal,
        CompanyObjects
    }
})
store.checkAction = function(name) {
    return Object.keys(this._actions).includes(name);
};
export default store