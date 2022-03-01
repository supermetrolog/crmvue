import { notify } from "@kyvg/vue3-notification";
let notifyOptions = {
    group: "app",
    type: "success",
    duration: 5000,
};
const Websocket = {
    state: {
        socket: null,
        setedUserIdFlag: false,
        websocketLoops: []
    },
    mutations: {
        updateSocket(state, data) {
            state.socket = data;
        },
        toggleSetedUserIdFlag(state, flag = null) {
            if (flag !== null) {
                state.setedUserIdFlag = flag;
            } else {
                state.setedUserIdFlag = !state.setedUserIdFlag;
            }
        },
        websocketLoopPush(state, setInterval) {
            state.websocketLoops.push(setInterval);
        },
        deleteWebsocketLoops(state) {
            state.websocketLoops.forEach(interval => {
                clearInterval(interval.loop);
            });
        },
        deleteSocket(state) {
            if (state.socket) {
                state.socket.close();
            }
            state.socket = null;
        }
    },
    actions: {
        WEBSOCKET_LOOP_PUSH(context, setInterval) {
            context.commit('websocketLoopPush', setInterval);
        },
        WEBSOCKET_STOP(context) {
            console.log('WEBSOCKET_STOP');
            context.commit('deleteWebsocketLoops');
            context.commit('deleteSocket');
            context.commit('toggleSetedUserIdFlag', false);
        },
        WEBSOCKET_RUN(context) {
            console.warn('RUN WEBSOCKET', context.getters.SOCKET);
            if (context.getters.SOCKET) {
                return;
            }
            console.log('RUN WEBSOCKET 2');
            let socket = new WebSocket("ws://localhost:8082");
            socket.onopen = function() {
                return context.dispatch('EVENT_WEBSOCKET_ON_OPEN');
            };
            socket.onmessage = function(event) {
                return context.dispatch('EVENT_WEBSOCKET_ON_MESSAGE', event);
            };
            socket.onerror = function(error) {
                return context.dispatch('EVENT_WEBSOCKET_ON_ERROR', error);
            };
            socket.onclose = function(event) {
                return context.dispatch('EVENT_WEBSOCKET_ON_CLOSE', event);
            };
            context.commit('updateSocket', socket);
        },
        EVENT_WEBSOCKET_ON_OPEN(context) {
            console.log("Connected websocket server!");
            notifyOptions.type = 'success';
            notifyOptions.text = "Connected websocket server!";
            notify(notifyOptions);

            context.dispatch('CALL_WEBSOCKET_LOOP');
            context.dispatch('NOTIFICATION_WEBSOCKET_LOOP');
        },
        EVENT_WEBSOCKET_ON_MESSAGE(context, event) {
            // console.warn("Server send:");
            let data = JSON.parse(event.data);
            let prefix = 'ACTION_WEBSOCKET_';
            let actionName = prefix + 'info';

            if (Object.prototype.hasOwnProperty.call(data, 'action')) {
                actionName = prefix + data.action.toLowerCase();
            }
            if (this.checkAction(actionName)) {
                context.dispatch(actionName, data);
            }
        },
        EVENT_WEBSOCKET_ON_ERROR(context, error) {
            console.error(`[error] ${error.message}`);
            notifyOptions.text = `[error] ${error.message}`;
            notifyOptions.type = 'error';
            notify(notifyOptions);
            setTimeout(() => {
                context.dispatch('WEBSOCKET_RUN');
            }, 3000);
        },
        EVENT_WEBSOCKET_ON_CLOSE(_, event) {
            if (event.wasClean) {
                console.log(
                    `Соединение закрыто чисто, код=${event.code} причина=${event.reason}`
                );
            } else {
                console.warn("Соединение прервано");
            }
        },
        ACTION_WEBSOCKET_info(_, data) {
            if (data.error) {
                console.error('ACTION_WEBSOCKET_info: ', data.message);

            } else {
                console.log('ACTION_WEBSOCKET_info: ', data.message);

            }
        },
        ACTION_WEBSOCKET_user_id_seted(context, data) {
            console.log('ACTION_WEBSOCKET_user_id_seted: ', data.message);
            context.commit('toggleSetedUserIdFlag', true);
        },
    },
    getters: {
        SOCKET(state) {
            return state.socket;
        },
        SETED_USER_ID_FLAG(state) {
            return state.setedUserIdFlag;
        },
    }
}

export default Websocket;