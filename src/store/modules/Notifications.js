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
        notificationCurrentPage: 1,
        newNotifications: []
    },
    mutations: {
        updateNotifications(state, data) {
            state.notifications = data.data;
            state.notificationsPagination = data.pagination;
        },
        updateNewNotifications(state, data) {
            state.newNotifications = data;
        },
        updateNotificationsCount(state, data) {
            state.notificationsCount = data;
        },
        incrimentCurrentPage(state) {
            state.notificationCurrentPage++;
        },
        returnCurrentPageToFirst(state) {
            state.notificationCurrentPage = 1;
        },
        viewedNotifications(state) {
            state.notifications.map((item) => {
                if (item.status == 0 || item.status == -1) {
                    item.status = 1;
                }
                return item;
            });
        },
    },
    actions: {
        async FETCH_NOTIFICATIONS(context) {
            const user = context.getters.THIS_USER;
            const notifications = await api.notifications.fetchNotifications(user.id, this.getters.NOTIFICATIONS_CURRENT_PAGE);
            context.commit('updateNotifications', notifications);
        },
        async FETCH_NOTIFICATIONS_COUNT(context) {
            const user = context.getters.THIS_USER;
            const count = await api.notifications.fetchNotificationsCount(user.id);
            console.log(count);
            context.commit('updateNotificationsCount', count);
        },
        INCRIMENT_NOTIFICATIONS_CURRENT_PAGE(context) {
            context.commit('incrimentCurrentPage');
        },
        RETURN_NOTIFICATION_CURRENT_PAGE_TO_FIRST(context) {
            context.commit('returnCurrentPageToFirst');
        },
        async VIEWED_NOTIFICATIONS(context) {
            const user = context.getters.THIS_USER;
            await api.notifications.viewed(user.id);
        },
        ACTION_WEBSOCKET_new_notifications(context, data) {
            viewNotify(data.message);
            context.dispatch('FETCH_NOTIFICATION_COUNT');
        },
    },
    getters: {
        NOTIFICATIONS(state) {
            return state.notifications;
        },
        NOTIFICATIONS_COUNT(state) {
            return state.notificationsCount;
        },
        NOTIFICATIONS_CURRENT_PAGE(state) {
            return state.notificationCurrentPage;
        },
        NOTIFICATIONS_PAGINATION(state) {
            return state.notificationsPagination;
        },
    }
}

export default Notifications