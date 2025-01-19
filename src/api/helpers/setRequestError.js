import { notify } from '@kyvg/vue3-notification';
import store from '../../store';
import router from '../../router';
import { abortRequests } from '@/services/axios.js';
import { useAuth } from '@/composables/useAuth.js';

const notifyOptions = {
    group: 'app',
    type: 'error',
    duration: 15000
};

const ValidationErrorHttpStatusCode = 422;
const AuthErrorHttpStatusCode = 401;

function getTitle(data) {
    if ('success' in data) {
        return `Ошибка #${data.status ?? data.code}`;
    }

    return data.name + ' (Ошибка #' + (data.status ?? data.code) + ')';
}

function errorsToNotifications(errors) {
    // eslint-disable-next-line no-unused-vars
    return Object.entries(errors).reduce((acc, [_, value]) => {
        acc.push(...value);
        return acc;
    }, []);
}

function handleValidationError(data) {
    data.name = 'Ошибка валидации';
    notifyOptions.title = getTitle(data);

    if (data.message) {
        data.message = JSON.parse(data.message);
        data.message.map(item => {
            notifyOptions.text = item;
            notify(notifyOptions);
        });
    } else if (data.errors) {
        const notifications = errorsToNotifications(data.errors);
        notifications.forEach(message => {
            notifyOptions.text = message;
            notify(notifyOptions);
        });
    }
}

function handleUnknownError(data) {
    notifyOptions.title = getTitle(data);
    notifyOptions.text = data.message;
    notify(notifyOptions);
}

function handleAuthError(data) {
    notifyOptions.title = `Ошибка авторизации (Ошибка #${data.status})`;
    notifyOptions.text = 'Пожалуйста, пройдите повторную аутентификацию';
    notify(notifyOptions);
}

export async function setRequestError(event) {
    if (!event.response) return;

    const data = event.response.data;
    if (!('status' in data)) data.status = event.response.status;

    if (data.status === AuthErrorHttpStatusCode) {
        const { setRedirect } = useAuth();

        abortRequests();
        handleAuthError(data);

        if (store) await store.dispatch('destroy');
        setRedirect(router.currentRoute.value.fullPath);
        await router.push('/login');

        return;
    }

    if (data.status === ValidationErrorHttpStatusCode) handleValidationError(data);
    else handleUnknownError(data);
}
