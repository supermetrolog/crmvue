import api from '@/api/api';
import { notify } from '@kyvg/vue3-notification';

function viewNotify(data) {
    let notifyOptions = {
        group: 'app',
        type: 'success',
        duration: 5000
    };
    const newCallCount = data;
    if (newCallCount) {
        if (newCallCount == 1) {
            notifyOptions.text = `У вас ${newCallCount} новый звонок`;
        } else {
            notifyOptions.text = `У вас ${newCallCount} новых звонков`;
        }
        notifyOptions.title = `Звонки`;

        notify(notifyOptions);
    }
}

const Call = {
    state: {
        calls: [],
        callsCount: 0,
        callsPagination: null,
        currentCalls: [],
        sessionCalls: []
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
        updateCurrentCalls(state, data) {
            state.currentCalls = data;
        },
        pushSessionCalls(state, data) {
            state.sessionCalls = state.sessionCalls.concat(data);
        },
        updateSessionCalls(state, data) {
            state.sessionCalls = data;
        },
        reset(state) {
            state.calls = [];
            state.callsPagination = null;
        }
    },
    actions: {
        async FETCH_CALLS_COUNT(context) {
            const user = context.getters.THIS_USER;
            const count = await api.calls.count(user.userProfile.caller_id);
            context.commit('updateCallsCount', count);
        },
        async SEARCH_CALLS(context, { query, concat = false }) {
            const data = await api.calls.search(query);
            context.commit('updateCalls', { data, concat });
        },
        RESET_CALLS(context) {
            context.commit('reset');
        },
        async FETCH_CALLS_COUNT_POOL({ rootGetters }) {
            if (!rootGetters.SETED_USER_ID_FLAG) return;

            const socket = rootGetters.SOCKET;
            await socket.send(
                JSON.stringify({
                    action: 'sendPool',
                    data: {
                        action: 'check_calls_count',
                        message: null
                    }
                })
            );
        },
        async VIEWED_NOT_COUNT_CALLS({ getters }) {
            return await api.calls.viewedNotCount(getters.THIS_USER.userProfile.caller_id);
        },
        async VIEWED_ALL_CALLS({ getters }) {
            return await api.calls.viewedAll(getters.THIS_USER.userProfile.caller_id);
        },
        async UPDATE_SESSION_CALLS(context) {
            let data = await api.calls.search({
                id: context.getters.SESSION_CALLS.map(item => item.id).join(',')
            });
            context.commit('updateSessionCalls', data.data);
        },
        ACTION_WEBSOCKET_new_calls(context, data) {
            viewNotify(data.message);
            context.dispatch('FETCH_CALLS_COUNT');
        },
        ACTION_WEBSOCKET_check_calls_count(context) {
            context.dispatch('FETCH_CALLS_COUNT');
        },
        ACTION_WEBSOCKET_update_current_calls({ commit, dispatch }, data) {
            commit('updateCurrentCalls', data.message);
            commit('pushSessionCalls', data.message);
            dispatch('UPDATE_SESSION_CALLS');
        }
    },
    getters: {
        CALLS(state) {
            return state.calls;
        },
        CALLS_COUNT(state) {
            return Number(state.callsCount);
        },
        CALLS_PAGINATION(state) {
            return state.callsPagination;
        },
        CURRENT_CALLS(state) {
            return state.currentCalls;
        },
        SESSION_CALLS(state) {
            return state.sessionCalls;
        }
    }
};

export default Call;
