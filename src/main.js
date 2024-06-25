import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import VueAxios from 'vue-axios';
import PhoneNumber from '@/components/common/PhoneNumber.vue';
import Notifications from '@kyvg/vue3-notification';
import Maska from 'maska';
import { Formatter } from '@/plugins/index.js';
import UniqueID from '@/plugins/uid';
import { VueAgile } from 'vue-agile';
import { plugin as VueTippy } from 'vue-tippy';
import 'tippy.js/dist/tippy.css'; // optional for styling
import '@vueform/multiselect/themes/default.css';
import './assets/fontawesome/css/fontawesome.min.css';
import './assets/fontawesome/css/all.min.css';
import 'animate.css';
import Tab from '@/components/common/Tabs/Tab.vue';
import Tabs from '@/components/common/Tabs/Tabs.vue';
import Toast from '@/plugins/toast';

import Url, { $generatorURL } from '@/plugins/url';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import relativeTime from 'dayjs/plugin/relativeTime';
import { vIntersection } from '@/directives/intersection.js';

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(relativeTime);
dayjs.locale('ru');

axios.defaults.baseURL = $generatorURL.api.url();

const app = createApp(App);

app.config.performance = true;
app.component('Tabs', Tabs)
    .component('Tab', Tab)
    .component('PhoneNumber', PhoneNumber)
    .directive('intersection', vIntersection)
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
    .use(Url)
    .use(Notifications)
    .use(Toast, {
        group: 'app',
        type: 'info',
        duration: 1000
    })
    .use(Maska)
    .use(VueAxios, axios)
    .use(store)
    .use(router)
    .mount('#app');
