import { notify } from '@kyvg/vue3-notification';
import store from '../../store';
import router from '../../router';
import { abortRequests } from '@/services/axios.js';
import { useAuth } from '@/composables/useAuth.js';
import { useRouter } from 'vue-router';

const notifyOptions = {
    group: 'app',
    type: 'error',
    duration: 15000
};

const ValidationErrorHttpStatusCode = 422;
const AuthErrorHttpStatusCode = 401;

function getTitle(data) {
    return data.name + ' (Ошибка #' + data.status + ')';
}

function handleValidationError(data) {
    data.message = JSON.parse(data.message);
    notifyOptions.title = getTitle(data);
    data.message.map(item => {
        notifyOptions.text = item;
        notify(notifyOptions);
    });
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

    if (data.status === AuthErrorHttpStatusCode) {
        const { setRedirect } = useAuth();

        abortRequests();
        handleAuthError(data);

        if (store) await store.dispatch('DESTROY');
        setRedirect(router.currentRoute.value.fullPath);
        await router.push('/login');

        return;
    }

    if (data.status === ValidationErrorHttpStatusCode) handleValidationError(data);
    else handleUnknownError(data);
}
