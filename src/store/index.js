import { createStore } from 'vuex'
import Client from './modules/Client'
import Calendar from './modules/Calendar'
const store = createStore({
    modules: {
        Client,
        Calendar
    }
})
export default store