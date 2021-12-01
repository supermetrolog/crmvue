import api from "@/api/api";

function existNewCalls(calls) {
    let result = false;
    for (let index = 0; index < calls.length; index++) {
        const item = calls[index];
        if (item.viewed != 2) {
            result = true;
            break;
        }
    }
    return result;
}

const Call = {
    state: {
        currentCalls: [],
        calls: [],
        callsPagination: null,
        callsCurrentPage: 1,
    },
    mutations: {
        updateCurrentCalls(state, data) {
            state.currentCalls = data;
        },
        updateCalls(state, data) {
            state.calls = data.data;
            state.callsPagination = data.pagination;
        },
        incrimentCallsCurrentPage(state) {
            state.callsCurrentPage++;
        },
        returnCallsCurrentPageToFirst(state) {
            state.callsCurrentPage = 1;
        },
        viewedCalls(state) {
            state.calls.map((item) => {
                item.viewed = 2;
                return item;
            });
        },
    },
    actions: {
        FETCH_CALLS(context) {
            // console.warn(context);
            context.dispatch('FETCH_CALLS_NO_INTERVAL');
            // setInterval(async() => {
            //     // console.warn('interval');
            //     context.dispatch('FETCH_NOTIFICATIONS_NO_INTERVAL');
            //     // console.error('interval');
            // }, 5000);
        },
        async FETCH_CALLS_NO_INTERVAL(context) {
            const user = context.getters.THIS_USER;
            const calls = await api.calls.fetchCalls(user.id, this.getters.CALLS_CURRENT_PAGE);
            context.commit('updateCalls', calls);
        },
        INCRIMENT_CALLS_CURRENT_PAGE(context) {
            context.commit('incrimentCallsCurrentPage');
        },
        RETURN_CALLS_CURRENT_PAGE_TO_FIRST(context) {
            context.commit('returnCallsCurrentPageToFirst');
        },
        async VIEWED_CALLS(context) {
            if (existNewCalls(this.getters.CALLS)) {
                // const user = JSON.parse(localStorage.getItem('user'));
                const user = context.getters.THIS_USER;
                await api.calls.viewed(user.id);
                context.commit('viewedCalls');
            }
        },
        CALL_WEBSOCKET_LOOP(context) {
            let socket = context.getters.SOCKET;

            let interval = {
                loop: setInterval(() => {
                    if (context.getters.SETED_USER_ID_FLAG) {
                        socket.send(JSON.stringify({
                            action: 'checkCall',
                        }));
                        return;
                    }
                    socket.send(JSON.stringify({
                        action: "setUserID",
                        data: {
                            user_id: context.getters.THIS_USER.id
                        },
                    }));
                }, 200)
            };
            context.dispatch('WEBSOCKET_LOOP_PUSH', interval);
        },
        ACTION_WEBSOCKET_new_call() {
            // console.log('ACTION_WEBSOCKET_new_call');
        },
        ACTION_WEBSOCKET_current_calls(context, data) {
            // console.log('ACTION_WEBSOCKET_current_call');
            context.commit('updateCurrentCalls', data.message);
        },
    },
    getters: {
        CURRENT_CALLS(state) {
            return state.currentCalls;
        },
        CALLS(state) {
            return state.calls;
        },
        CALLS_CURRENT_PAGE(state) {
            return state.callsCurrentPage;
        },
        CALLS_PAGINATION(state) {
            return state.callsPagination;
        },
        CALLS_INTERVAL(state) {
            return state.callsPagination;
        }
    }
}

export default Call;