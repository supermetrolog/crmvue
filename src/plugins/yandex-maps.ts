import { createYmaps, VueYandexMaps } from 'vue-yandex-maps';
import { App } from 'vue';

const settings = {
    apikey: import.meta.env.VITE_VUE_APP_YANDEX_MAP_KEY
} as const satisfies VueYandexMaps.PluginSettings;

export function initYandexMap(app: App) {
    app.use(createYmaps(settings));
}
