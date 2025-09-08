import api from '@/api/api';
import { notify } from '@kyvg/vue3-notification';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';
import { plural } from '@/utils/plural.js';

function viewNotify(data) {
    const count = Number(data);

    if (count === 0) return;

    const notifyOptions = {
        group: 'app',
        type: 'success',
        duration: 5000,
        title: 'Оповещение',
        text: plural(
            count,
            'У вас %d новое оповещение',
            'У вас %d новых оповещения',
            'У вас %d новых оповещений'
        )
    };

    notify(notifyOptions);
}

const Notifications = {
    state: {
        notifications: [],
        notificationsCount: 0,
        notificationsPagination: null
    },
    mutations: {
        updateNotifications(state, { data, concat = false }) {
            state.notificationsPagination = data.pagination;

            if (concat) {
                state.notifications = state.notifications.concat(data.data);
            } else {
                state.notifications = data.data;
            }
        },
        updateNotificationsCount(state, data) {
            state.notificationsCount = data;
        },
        reset(state) {
            state.notifications = [];
            state.notificationsPagination = null;
        }
    },
    actions: {
        async FETCH_NOTIFICATIONS_COUNT(context) {
            const user = context.getters.THIS_USER;

            if (isNullish(user)) return;

            const count = await api.notifications.fetchCount(user.id);
            context.commit('updateNotificationsCount', count);
        },
        async SEARCH_NOTIFICATIONS(context, { query, concat = false }) {
            const data = await api.notifications.search(query);
            context.commit('updateNotifications', { data, concat });
        },
        RESET_NOTIFICATIONS(context) {
            context.commit('reset');
        },
        async FETCH_NOTIF_COUNT_POOL({ rootGetters }) {
            if (!rootGetters.SETED_USER_ID_FLAG) return;

            const socket = rootGetters.SOCKET;
            await socket.send(
                JSON.stringify({
                    action: 'sendPool',
                    data: {
                        action: 'check_notifications_count',
                        message: null
                    }
                })
            );
        },
        async VIEWED_NOT_COUNT_NOTIFICATIONS({ getters }) {
            return await api.notifications.viewedNotCount(getters.THIS_USER.id);
        },
        async VIEWED_ALL_NOTIFICATIONS({ getters }) {
            return await api.notifications.viewedAll(getters.THIS_USER.id);
        },
        _ws_new_notifications(context, data) {
            viewNotify(data.message);
            context.dispatch('FETCH_NOTIFICATIONS_COUNT');
        },
        _ws_check_notifications_count(context) {
            context.dispatch('FETCH_NOTIFICATIONS_COUNT');
        }
    },
    getters: {
        NOTIFICATIONS(state) {
            return state.notifications;
        },
        NOTIFICATIONS_COUNT(state) {
            return Number(state.notificationsCount);
        },
        NOTIFICATIONS_PAGINATION(state) {
            return state.notificationsPagination;
        }
    }
};

export default Notifications;
