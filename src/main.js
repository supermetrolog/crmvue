import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";
import PhoneNumber from "@/components/common/PhoneNumber.vue";
import Notifications from "@kyvg/vue3-notification";
import {ApiUrlHelper, apiUrlHelperObject, Formatter} from "@/plugins/index.js";
import {Tab, Tabs} from "vue3-tabs-component";

import "@vueform/multiselect/themes/default.css";
import './assets/fontawesome/css/fontawesome.min.css';
import './assets/fontawesome/css/all.min.css'
import './assets/scss/style.scss';
import "animate.css";

axios.defaults.baseURL = apiUrlHelperObject.url();

const app = createApp(App)

app.config.performance = true;
app
    .component('Tabs', Tabs)
    .component('Tab', Tab)
    .component('PhoneNumber', PhoneNumber)
    .use(Formatter)
    .use(ApiUrlHelper)
    .use(Notifications)
    .use(VueAxios, axios)
    .use(store)
    .use(router)
    .mount("#app");