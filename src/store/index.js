import { createStore } from 'vuex'
import Calendar from './modules/Calendar'
import Timeline from './modules/Timeline'
import CompanyForm from './modules/CompanyForm'
const store = createStore({
    modules: {
        Timeline,
        Calendar,
        CompanyForm
    }
})
export default store