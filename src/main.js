import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import { Tabs, Tab } from 'vue3-tabs-component'
import Maska from "maska"
import axios from 'axios'
import VueAxios from 'vue-axios'
import Notifications from "@kyvg/vue3-notification"

// import VueFileAgent from 'vue-file-agent'
import 'animate.css'

import './assets/styles/grid.min.css'
import './assets/styles/style.scss'
import "@vueform/multiselect/themes/default.css"
axios.defaults.baseURL = "http://crmka/";
// axios.defaults.baseURL = "http://api.billypro.beget.tech/";
console.log('FUCsK');
const app = createApp(App);
app.config.devtools = true;
app.component('Tabs', Tabs).component('Tab', Tab).use(Notifications).use(Maska).use(VueAxios, axios).use(store).use(router).mount('#app');