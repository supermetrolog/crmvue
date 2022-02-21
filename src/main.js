import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import { Tabs, Tab } from 'vue3-tabs-component'
import Maska from "maska"
import axios from 'axios'
import VueAxios from 'vue-axios'
import Notifications from "@kyvg/vue3-notification"
import Modal from "@/components/common/Modal";
import Loader from "@/components/common/Loader";
import PhoneNumber from "@/components/common/PhoneNumber";
import Pagination from "@/components/common/Pagination";
import PaginationClassic from '@/components/common/PaginationClassic';

// import VueFileAgent from 'vue-file-agent'
import 'animate.css'

import './assets/styles/grid.min.css'
import './assets/styles/style.scss'
import "@vueform/multiselect/themes/default.css"

if (process.env.NODE_ENV == 'development') {
    axios.defaults.baseURL = "http://crmka/";

} else {
    axios.defaults.baseURL = "http://api.billypro.beget.tech/";
}
const app = createApp(App);
app.config.devtools = true;
app.component('Tabs', Tabs).component('Modal', Modal).component('PhoneNumber', PhoneNumber).component('Loader', Loader).component('Pagination', Pagination).component('PaginationClassic', PaginationClassic).component('Tab', Tab).use(Notifications).use(Maska).use(VueAxios, axios).use(store).use(router).mount('#app');