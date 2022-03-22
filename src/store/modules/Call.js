import api from "@/api/api";
import { notify } from "@kyvg/vue3-notification";

function viewNotify(data) {
    let notifyOptions = {
        group: "app",
        type: "success",
        duration: 5000,
    };
    const newCallCount = data.length;
    if (newCallCount) {

        if (newCallCount == 1) {
            notifyOptions.text = `У вас ${newCallCount} новое оповещение`;
        } else {
            notifyOptions.text = `У вас ${newCallCount} новых оповещений`;

        }
        notifyOptions.title = `Оповещение`;
        console.log(newCallCount);

        notify(notifyOptions);
    }
}
const Call = {
    state: {
        calls: [],
        callsCount: 0,
        callsPagination: null,
    },
    mutations: {
        updateCalls(state, { data, concat = false }) {
            state.callsPagination = data.pagination;
            if (concat) {
                state.calls = state.calls.concat(data.data);
            } else {
                state.calls = data.data;
            }
        },
        updateCallsCount(state, data) {
            state.callsCount = data;
        },
        reset(state) {
            state.calls = [];
            state.callsPagination = null;
        },
    },
    actions: {
        async FETCH_CALLS_COUNT(context) {
            const user = context.getters.THIS_USER;
            const count = await api.calls.fetchCount(user.userProfile.caller_id);
            console.log(count);
            context.commit('updateCallsCount', count);
        },
        async SEARCH_CALLS(context, { query, concat = false }) {
            const data = await api.calls.search(query);
            context.commit('updateCalls', { data, concat });
        },
        RESET_CALLS(context) {
            context.commit('reset');
        },
        async FETCH_CALLS_COUNT_POOL(context) {
            console.log('NO_COUNT_ALL');
            const socket = context.getters.SOCKET;
            if (!context.getters.SETED_USER_ID_FLAG) {
                return;
            }
            await socket.send(JSON.stringify({
                action: 'sendPool',
                data: {
                    action: 'check_calls_count',
                    message: null
                }
            }));
        },
        async VIEWED_NOT_COUNT_CALLS({ getters }) {
            console.log('VIEWED_NOT_COUNT_CALLS');
            return await api.calls.viewedNotCount(getters.THIS_USER.userProfile.caller_id);
        },
        async VIEWED_ALL_CALLS({ getters }) {
            console.log('VIEWED_ALL_CALLS');
            return await api.calls.viewedAll(getters.THIS_USER.userProfile.caller_id);
        },
        ACTION_WEBSOCKET_new_calls(context, data) {
            viewNotify(data.message);
            context.dispatch('FETCH_CALLS_COUNT');
        },
        ACTION_WEBSOCKET_check_calls_count(context) {
            console.log('check_notify_count');
            context.dispatch('FETCH_CALLS_COUNT');
        },
    },
    getters: {
        CALLS(state) {
            return state.calls;
        },
        CALLS_COUNT(state) {
            return state.callsCount;
        },
        CALLS_PAGINATION(state) {
            return state.callsPagination;
        },
    }
}

export default Call