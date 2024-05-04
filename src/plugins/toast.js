import { notify } from '@kyvg/vue3-notification';

export let $toast = null;

function $notifyFactory(defaultOptions) {
    const toastInstance = function $showNotify(text, options = {}) {
        options.text = text;
        notify({ ...defaultOptions, ...options });
    };

    $toast = toastInstance;

    return toastInstance;
}

const Toast = {
    install: function (app, options = {}) {
        app.config.globalProperties.$toast = $notifyFactory(options);
    }
};

export default Toast;
