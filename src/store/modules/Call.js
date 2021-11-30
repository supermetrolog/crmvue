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
        }
    },
    actions: {
        CALL_WEBSOCKET_LOOP(context) {
            let socket = context.getters.SOCKET;
            setInterval(() => {
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
            }, 3000);
        },
        ACTION_WEBSOCKET_new_call() {
            console.log('ACTION_WEBSOCKET_new_call');
        },
        ACTION_WEBSOCKET_current_calls(context, data) {
            console.log('ACTION_WEBSOCKET_current_call');
            context.commit('updateCurrentCalls', data.message);
        },
    },
    getters: {
        CURRENT_CALLS(state) {
            return state.currentCalls;
        },
        CALLS(state) {
            return state.notifications;
        },
        CALLS_CURRENT_PAGE(state) {
            return state.notificationCurrentPage;
        },
        CALLS_PAGINATION(state) {
            return state.notificationsPagination;
        },
        CALLS_INTERVAL(state) {
            return state.notificationsPagination;
        }
    }
}

export default Call;