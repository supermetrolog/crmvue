import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import PhoneNumber from '@/components/common/PhoneNumber.vue';
import Notifications from '@kyvg/vue3-notification';
import Maska from 'maska';
import { Formatter } from '@/plugins/index.js';
import UniqueID from '@/plugins/uid';
import { VueAgile } from 'vue-agile';
import { directive as tippyDirective, tippy } from 'vue-tippy';
import 'tippy.js/dist/tippy.css'; // optional for styling
import '@vueform/multiselect/themes/default.css';
import 'vue-color-kit/dist/vue-color-kit.css';
import './assets/fontawesome/css/fontawesome.min.css';
import './assets/fontawesome/css/all.min.css';
import 'animate.css';
import 'cropperjs/dist/cropper.css';
import Tab from '@/components/common/Tabs/Tab.vue';
import Tabs from '@/components/common/Tabs/Tabs.vue';

import Url, { $generatorURL } from '@/plugins/url';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import relativeTime from 'dayjs/plugin/relativeTime';
import minMax from 'dayjs/plugin/minMax';
import duration from 'dayjs/plugin/duration';
import { axiosRequestInterceptor, axiosResponseErrorInterceptor } from '@/services/axios.js';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.extend(minMax);
dayjs.extend(duration);
dayjs.locale('ru');

axios.defaults.baseURL = $generatorURL.api.url();
axios.interceptors.request.use(axiosRequestInterceptor);
axios.interceptors.response.use(response => response, axiosResponseErrorInterceptor);

tippy.setDefaultProps({ placement: 'auto-end', allowHTML: true });
import { initSentry } from '@/plugins/sentry.js';

const app = createApp(App);
initSentry(app);

// TODO: Удалить PhoneNumber, Tab, Tabs из глобала

app.config.performance = true;

app.component('Tabs', Tabs)
    .component('Tab', Tab)
    .component('PhoneNumber', PhoneNumber)
    .use(VueAgile)
    .directive('tippy', tippyDirective)
    .use(UniqueID)
    .use(Formatter)
    .use(Url)
    .use(Notifications, {
        group: 'app',
        type: 'info',
        duration: 1000
    })
    .use(Maska)
    .use(store)
    .use(router)
    .mount('#app');
