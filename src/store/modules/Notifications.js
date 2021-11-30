import api from "@/api/api";

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
const Notifications = {
    state: {
        notifications: [],
        notificationsPagination: null,
        notificationCurrentPage: 1,
        interval: null
    },
    mutations: {
        updateNotifications(state, data) {
            state.notifications = data.data;
            state.notificationsPagination = data.pagination;
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
        FETCH_NOTIFICATIONS(context) {
            // console.warn(context);
            context.dispatch('FETCH_NOTIFICATIONS_NO_INTERVAL');
            // setInterval(async() => {
            //     // console.warn('interval');
            //     context.dispatch('FETCH_NOTIFICATIONS_NO_INTERVAL');
            //     // console.error('interval');
            // }, 5000);
        },
        async FETCH_NOTIFICATIONS_NO_INTERVAL(context) {
            const user = JSON.parse(localStorage.getItem('user'));
            api.notifications.fetchNewNotificationForNotif(user.id);
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
                const user = JSON.parse(localStorage.getItem('user'));
                await api.notifications.viewed(user.id);
                context.commit('viewedNotifications');
            }
        }
    },
    getters: {
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