import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

import './assets/styles/grid.min.css'
import './assets/styles/style.scss'
import router from './router'

createApp(App).use(router).use(VueAxios, axios).mount('#app');