import api from "@/api/api";
import { notify } from "@kyvg/vue3-notification";

function existNewNotifications(notifications) {
    let result = false;
    for (let index = 0; index < notifications.length; index++) {
        const item = notifications[index];
        if (item.status == 0 || item.status == -1) {
            result = true;
            break;
        }
    }
    return result;
}

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
        INCRIMENT_NOTIFICATIONS_CURRENT_PAGE(context) {
            context.commit('incrimentCurrentPage');
        },
        RETURN_NOTIFICATION_CURRENT_PAGE_TO_FIRST(context) {
            context.commit('returnCurrentPageToFirst');
        },
        async VIEWED_NOTIFICATIONS(context) {
            if (existNewNotifications(this.getters.NOTIFICATIONS)) {
                // const user = JSON.parse(localStorage.getItem('user'));
                const user = context.getters.THIS_USER;
                await api.notifications.viewed(user.id);
                context.commit('viewedNotifications');
            }
        },
        NOTIFICATION_WEBSOCKET_LOOP(context) {
            let socket = context.getters.SOCKET;

            let interval = {
                loop: setInterval(() => {
                    if (context.getters.SETED_USER_ID_FLAG) {
                        socket.send(JSON.stringify({
                            action: 'checkNewNotifications',
                        }));
                        return;
                    }
                    socket.send(JSON.stringify({
                        action: "setUserID",
                        data: {
                            user_id: context.getters.THIS_USER.id
                        },
                    }));
                }, 2000)
            };
            context.dispatch('WEBSOCKET_LOOP_PUSH', interval);
        },
        ACTION_WEBSOCKET_new_notifications(context, data) {
            viewNotify(data.message);
            context.commit('updateNewNotifications', data.message);
        },
    },
    getters: {
        NEW_NOTIFICATIONS(state) {
            return state.newNotifications;
        },
        NOTIFICATIONS(state) {
            return state.notifications;
        },
        NOTIFICATIONS_CURRENT_PAGE(state) {
            return state.notificationCurrentPage;
        },
        NOTIFICATIONS_PAGINATION(state) {
            return state.notificationsPagination;
        },
        NOTIFICATIONS_INTERVAL(state) {
            return state.notificationsPagination;
        }
    }
}

export default Notifications