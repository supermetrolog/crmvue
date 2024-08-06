import { notify } from '@kyvg/vue3-notification';

const GROUP = 'app';

function success(text, title = 'Успешно') {
    notify({ group: GROUP, text, title, duration: 3500, type: 'success' });
}

function error(text, title = 'Ошибка') {
    notify({ group: GROUP, text, title, duration: 5000, type: 'error' });
}

function warning(text, title = 'Предупреждение') {
    notify({ group: GROUP, text, title, duration: 5000, type: 'warn' });
}

function info(text, title) {
    notify({ group: GROUP, text, title, duration: 3500 });
}

export function useNotify() {
    return { success, error, warning, info, notify };
}
