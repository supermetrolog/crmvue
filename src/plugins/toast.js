import { notify } from '@kyvg/vue3-notification';

function $notifyFactory(defaultOptions) {
    return function $showNotify(text, options = {}) {
        options.text = text;
        notify({ ...defaultOptions, ...options });
    };
}

const Toast = {
    install: function (app, options = {}) {
        app.config.globalProperties.$toast = $notifyFactory(options);
    }
};

export default Toast;
