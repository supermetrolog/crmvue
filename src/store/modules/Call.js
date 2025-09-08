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
            'У вас %d новый звонок',
            'У вас %d новых звонка',
            'У вас %d новых звонков'
        )
    };

    notify(notifyOptions);
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

            if (isNullish(user)) return;

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
        _ws_new_calls(context, data) {
            viewNotify(data.message);
            context.dispatch('FETCH_CALLS_COUNT');
        },
        _ws_check_calls_count(context) {
            context.dispatch('FETCH_CALLS_COUNT');
        },
        _ws_update_current_calls({ commit, dispatch }, data) {
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
