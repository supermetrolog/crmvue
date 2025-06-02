import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import PhoneNumber from '@/components/common/PhoneNumber.vue';
import Notifications from '@kyvg/vue3-notification';
import Maska from 'maska';
import { Formatter } from '@/plugins/index.js';
import { VueAgile } from 'vue-agile';
import 'tippy.js/dist/tippy.css';
import '@vueform/multiselect/themes/default.css';
import 'vue-color-kit/dist/vue-color-kit.css';
import './assets/fontawesome/css/fontawesome.min.css';
import './assets/fontawesome/css/all.min.css';
import 'animate.css';
import 'cropperjs/dist/cropper.css';
import 'splitpanes/dist/splitpanes.css';
import Tab from '@/components/common/Tabs/Tab.vue';
import Tabs from '@/components/common/Tabs/Tabs.vue';
import Url from '@/plugins/url';
import { initAxios } from '@/services/axios.js';
import { initSentry } from '@/plugins/sentry.js';
import { initDayjs } from '@/plugins/dayjs.js';
import { initTippy } from '@/plugins/tippy.js';

const app = createApp(App);

initAxios();
initSentry(app);
initDayjs();
initTippy(app);

// TODO: Удалить PhoneNumber, Tab, Tabs из глобала
// TODO: Удалить $url плагин
// TODO: Удалить $formatter плагин

app.config.performance = true;

app.component('Tabs', Tabs)
    .component('Tab', Tab)
    .component('PhoneNumber', PhoneNumber)
    .use(VueAgile)
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
