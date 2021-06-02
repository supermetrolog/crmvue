import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store'
import './assets/styles/grid.min.css'
import './assets/styles/style.scss'
import router from './router'
import moment from 'moment'
import VueMoment from 'vue-moment'
const app = createApp(App);
app.use(VueAxios, axios).use(router).use(store).use({ VueMoment }, moment).mount('#app');