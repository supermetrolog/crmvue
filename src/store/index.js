import { createStore } from 'vuex'
import Calendar from './modules/Calendar'
import Timeline from './modules/Timeline'
import CompanyForm from './modules/CompanyForm'
import CompanyRequestForm from './modules/CompanyRequestForm'
import Companies from './modules/Companies'
const store = createStore({
    modules: {
        Timeline,
        Calendar,
        CompanyForm,
        CompanyRequestForm,
        Companies
    }
})
export default store