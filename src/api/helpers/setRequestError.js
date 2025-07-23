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

function showNotify(text, title = 'Ошибка') {
    notify({ ...notifyOptions, title, text });
}

const ValidationErrorHttpStatusCode = 422;
const AuthErrorHttpStatusCode = 401;
const ForbiddenErrorHttpStatusCode = 401;

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
    notifyOptions.title = 'Ошибка валидации';

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

const ErrorCodeEnum = {
    IP_RESTRICTED: 1001
};

const errorHandlers = {
    [ErrorCodeEnum.IP_RESTRICTED]: async error => {
        abortRequests();

        showNotify(error.message, 'Доступ запрещен');

        if (store) await store.dispatch('destroy');
        await router.push('/login');
    }
};

export async function setRequestError(event) {
    if (!event.response) return;

    const data = event.response.data;
    const code = event.response.data.code;

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

    if (code && code in errorHandlers) {
        await errorHandlers[code](data);

        return;
    }

    if (data.status === ValidationErrorHttpStatusCode) handleValidationError(data);
    else handleUnknownError(data);
}
