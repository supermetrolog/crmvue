import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import VueAxios from 'vue-axios';
import PhoneNumber from '@/components/common/PhoneNumber.vue';
import Notifications from '@kyvg/vue3-notification';
import Maska from 'maska';
import { ApiUrlHelper, apiUrlHelperObject, Formatter } from '@/plugins/index.js';
import UniqueID from '@/plugins/uid';
import { VueAgile } from 'vue-agile';
import { plugin as VueTippy } from 'vue-tippy';
import 'tippy.js/dist/tippy.css'; // optional for styling

import '@vueform/multiselect/themes/default.css';
import './assets/fontawesome/css/fontawesome.min.css';
import './assets/fontawesome/css/all.min.css';
import './assets/scss/style.scss';
import 'animate.css';
import Tab from '@/components/common/Tabs/Tab.vue';
import Tabs from '@/components/common/Tabs/Tabs.vue';

axios.defaults.baseURL = apiUrlHelperObject.url();

const app = createApp(App);

app.config.performance = true;
app.component('Tabs', Tabs)
    .component('Tab', Tab)
    .component('PhoneNumber', PhoneNumber)
    .use(VueAgile)
    .use(VueTippy, {
        directive: 'tippy',
        component: 'tippy',
        defaultProps: {
            placement: 'auto-end',
            allowHTML: true
        }
    })
    .use(UniqueID)
    .use(Formatter)
    .use(ApiUrlHelper)
    .use(Notifications)
    .use(Maska)
    .use(VueAxios, axios)
    .use(store)
    .use(router)
    .mount('#app');
