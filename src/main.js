import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import { Tabs, Tab } from 'vue3-tabs-component'
import Maska from "maska"
import axios from 'axios'
import VueAxios from 'vue-axios'
import './assets/styles/grid.min.css'
import './assets/styles/style.scss'
const app = createApp(App);
app.component('Tabs', Tabs).component('Tab', Tab).use(Maska).use(VueAxios, axios).use(router).use(store).mount('#app');