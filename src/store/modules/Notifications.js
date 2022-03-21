import api from "@/api/api";
import { notify } from "@kyvg/vue3-notification";

function viewNotify(data) {
    let notifyOptions = {
        group: "app",
        type: "success",
        duration: 5000,
    };
    const newNotificationCount = data.length;
    if (newNotificationCount) {

        if (newNotificationCount == 1) {
            notifyOptions.text = `У вас ${newNotificationCount} новое оповещение`;
        } else {
            notifyOptions.text = `У вас ${newNotificationCount} новых оповещений`;

        }
        notifyOptions.title = `Оповещение`;
        console.log(newNotificationCount);

        notify(notifyOptions);
    }
}
const Notifications = {
    state: {
        notifications: [],
        notificationsCount: 0,
        notificationsPagination: null,
        newNotifications: []
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
        updateNewNotifications(state, data) {
            state.newNotifications = data.data;
        },
        updateNotificationsCount(state, data) {
            state.notificationsCount = data;
        },
        reset(state) {
            state.notifications = [];
            state.notificationsPagination = null;
        },
    },
    actions: {
        async FETCH_NOTIFICATIONS(context) {
            const user = context.getters.THIS_USER;
            const data = await api.notifications.fetch(user.id, this.getters.NOTIFICATIONS_CURRENT_PAGE);
            context.commit('updateNotifications', { data });
        },
        async FETCH_NOTIFICATIONS_COUNT(context) {
            const user = context.getters.THIS_USER;
            const count = await api.notifications.fetchCount(user.id);
            console.log(count);
            context.commit('updateNotificationsCount', count);
        },
        async SEARCH_NOTIFICATION(context, { query, concat = false }) {
            const data = await api.notifications.search(query);
            context.commit('updateNotifications', { data, concat });
        },
        async FETCH_NEW_NOTIFICATIONS(context, query) {
            const data = await api.notifications.search(query);
            context.commit('updateNewNotifications', data);
        },
        RESET_NOTIFICATION(context) {
            context.commit('reset');
        },
        async VIEWED_ALL_NOTIFICATIONS(context) {
            console.log('VIEWED_ALL');
            const socket = context.getters.SOCKET;
            if (!context.getters.SETED_USER_ID_FLAG) {
                return;
            }
            await socket.send(JSON.stringify({
                action: 'viewedAllNotify',
            }));
        },
        ACTION_WEBSOCKET_new_notifications(context, data) {
            viewNotify(data.message);
            context.dispatch('FETCH_NOTIFICATIONS_COUNT');
        },
        ACTION_WEBSOCKET_check_notifications_count(context) {
            console.log('check_notify_count');
            context.dispatch('FETCH_NOTIFICATIONS_COUNT');
        },
    },
    getters: {
        NOTIFICATIONS(state) {
            return state.notifications;
        },
        NEW_NOTIFICATIONS(state) {
            return state.newNotifications;
        },
        NOTIFICATIONS_COUNT(state) {
            return state.notificationsCount;
        },
        NOTIFICATIONS_PAGINATION(state) {
            return state.notificationsPagination;
        },
    }
}

export default Notifications