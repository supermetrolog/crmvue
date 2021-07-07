import { createStore } from 'vuex'
import Calendar from './modules/Calendar'
import Timeline from './modules/Timeline'
import CompanyForm from './modules/CompanyForm'
import Companies from './modules/Companies'
const store = createStore({
    modules: {
        Timeline,
        Calendar,
        CompanyForm,
        Companies
    }
})
export default store