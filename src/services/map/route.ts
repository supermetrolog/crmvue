import { LngLat } from '@yandex/ymaps3-types';

class EventEmitter {
    events: {
        [Key: string]: (() => void)[];
    };
    ymapReady: boolean;
    scriptIsNotAttached: boolean;
    pluginInstalledGlobal: boolean;

    constructor() {
        this.events = {};
        this.ymapReady = false;
        this.scriptIsNotAttached = true;
        this.pluginInstalledGlobal = false;
    }

    on(eventName: string, fn: (value?: unknown) => void) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }

        this.events[eventName].push(fn);

        return () => {
            this.events[eventName] = this.events[eventName].filter(eventFn => fn !== eventFn);
        };
    }

    emit(eventName: string) {
        const event = this.events[eventName];
        if (event) {
            event.forEach(fn => fn());
        }
    }
}

export const emitter = new EventEmitter();

async function loadApi(settings) {
    const readyCallback = (res: (value?: unknown) => void) => () => {
        window.ymaps.ready(() => {
            emitter.ymapReady = true;

            emitter.emit('scriptIsLoaded');

            res(true);
        });
    };

    return new Promise((res, rej) => {
        if (window.ymaps) {
            if (!emitter.ymapReady) {
                emitter.ymapReady = true;
                emitter.emit('scriptIsLoaded');
            }

            return res(true);
        }

        if (document.getElementById('vue-yandex-maps-script')) {
            emitter.on('scriptIsLoaded', res);
            return;
        }

        const yandexMapScript = document.createElement('SCRIPT');

        const {
            apiKey = '',
            lang = 'ru_RU',
            version = '2.1',
            coordorder = 'longlat',
            debug = false,
            enterprise = false
        } = settings;

        const mode = debug ? 'debug' : 'release';
        const settingsPart = `lang=${lang}${apiKey && `&apikey=${apiKey}`}&mode=${mode}&coordorder=${coordorder}`;
        const link = `https://${enterprise ? 'enterprise.' : ''}api-maps.yandex.ru/${version}/?${settingsPart}`;

        yandexMapScript.setAttribute('src', link);
        yandexMapScript.setAttribute('async', '');
        yandexMapScript.setAttribute('defer', '');
        yandexMapScript.setAttribute('id', 'vue-yandex-maps-script');

        document.head.appendChild(yandexMapScript);

        emitter.scriptIsNotAttached = false;

        yandexMapScript.onload = readyCallback(res);
        yandexMapScript.onerror = rej;
    });
}

export type MapRoute = {
    duration: string;
    distance: string;
    bounds: LngLat[];
    lines: MapRouteLine[];
};

type MapRouteLine = {
    id: number;
    coordinates: LngLat[];
};

export async function getRoute(coords: LngLat[]) {
    const settings = {
        apiKey: import.meta.env.VITE_VUE_APP_YANDEX_MAP_KEY,
        lang: 'ru_RU',
        version: '2.1',
        coordorder: 'longlat',
        debug: false,
        enterprise: false
    };

    await loadApi(settings);

    const route = new window.ymaps.multiRouter.MultiRoute(
        {
            referencePoints: coords,
            params: {
                avoidTrafficJams: true
            }
        },
        {
            boundsAutoApply: true,
            wayPointStartIconColor: '#FFFFFF',
            wayPointStartIconFillColor: 'teal',
            wayPointFinishIconColor: '#FFFFFF',
            wayPointFinishIconFillColor: '#f93154'
        }
    );

    let resolve;

    const promise = new Promise<MapRoute | null>(r => {
        resolve = r;
    });

    route.model.events.add('requestsuccess', () => {
        const activeRoute = route.getActiveRoute();

        if (!activeRoute) {
            resolve(null);
        }

        const duration = activeRoute.properties.get('duration')?.text;
        const distance = activeRoute.properties.get('distance')?.text;
        const bounds = activeRoute.properties.get('boundedBy');

        console.log(route);

        const paths = activeRoute?.getPaths();

        const lines = [];

        for (let i = 0; i < paths.getLength(); i++) {
            const path = paths.get(i);

            lines.push({
                id: path.properties.get('index'),
                coordinates: path.properties.get('coordinates')
            });
        }

        resolve({
            duration,
            distance,
            bounds,
            lines
        });
    });

    return promise;
}
