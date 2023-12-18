import { notify } from '@kyvg/vue3-notification';
import { apiUrlHelperObject } from '@/plugins';

let notifyOptions = {
    group: 'app',
    type: 'success',
    duration: 5000
};
const Websocket = {
    state: {
        socket: null,
        setedUserIdFlag: false,
        pingLoop: null
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
        deletePingLoop(state) {
            if (state.pingLoop) {
                clearInterval(state.pingLoop);
            }
        },
        setPingLoop(state, data) {
            state.pingLoop = data;
        },
        deleteSocket(state) {
            if (state.socket) {
                state.socket.close();
            }
            state.socket = null;
        }
    },
    actions: {
        WEBSOCKET_STOP(context) {
            context.commit('deleteSocket');
            context.commit('deletePingLoop');
            context.commit('toggleSetedUserIdFlag', false);
        },
        WEBSOCKET_RUN(context) {
            if (context.getters.SOCKET || !context.getters.THIS_USER) {
                return;
            }
            let socket = new WebSocket(apiUrlHelperObject.wsUrl());
            socket.onopen = function () {
                return context.dispatch('EVENT_WEBSOCKET_ON_OPEN');
            };
            socket.onmessage = function (event) {
                return context.dispatch('EVENT_WEBSOCKET_ON_MESSAGE', event);
            };
            socket.onerror = function (error) {
                return context.dispatch('EVENT_WEBSOCKET_ON_ERROR', error);
            };
            socket.onclose = function (event) {
                return context.dispatch('EVENT_WEBSOCKET_ON_CLOSE', event);
            };
            context.commit('updateSocket', socket);
        },
        WEBSOCKET_RUN_PING_LOOP(context) {
            let pingLoop = setInterval(() => {
                context.dispatch('WEBSOCKET_PING');
            }, 50000);
            context.commit('setPingLoop', pingLoop);
        },
        EVENT_WEBSOCKET_ON_OPEN(context) {
            context.dispatch('WEBSOCKET_SET_USER');
            context.dispatch('WEBSOCKET_RUN_PING_LOOP');
        },
        WEBSOCKET_PING(context) {
            const socket = context.getters.SOCKET;
            socket.send(
                JSON.stringify({
                    action: 'ping'
                })
            );
        },
        EVENT_WEBSOCKET_ON_MESSAGE(context, event) {
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
        EVENT_WEBSOCKET_ON_ERROR(context) {
            notifyOptions.text = 'Не удалось подключиться к Websocket серверу. Обратитесь к администратору.';
            notifyOptions.title = 'Websocket server';
            notifyOptions.type = 'error';
            notify(notifyOptions);

            context.dispatch('WEBSOCKET_STOP');
            setTimeout(() => {
                context.dispatch('WEBSOCKET_RUN');
            }, 30000);
        },
        EVENT_WEBSOCKET_ON_CLOSE({ getters, dispatch }, event) {
            if (event.wasClean) {
                return;
            } else {
                notifyOptions.text = 'Websocket соединение прервано.';
                notifyOptions.title = 'Websocket server';
                notifyOptions.type = 'warn';
                if (getters.SOCKET) {
                    notify(notifyOptions);
                    dispatch('WEBSOCKET_STOP');
                    dispatch('WEBSOCKET_RUN');
                }
            }
        },
        WEBSOCKET_SET_USER(context) {
            const socket = context.getters.SOCKET;
            if (!context.getters.SETED_USER_ID_FLAG) {
                socket.send(
                    JSON.stringify({
                        action: 'setUser',
                        data: { window_id: window.name, user_id: context.getters.THIS_USER.id }
                    })
                );
            }
        },
        ACTION_WEBSOCKET_user_setted(context) {
            context.commit('toggleSetedUserIdFlag', true);
        }
    },
    getters: {
        SOCKET(state) {
            return state.socket;
        },
        SETED_USER_ID_FLAG(state) {
            return state.setedUserIdFlag;
        }
    }
};

export default Websocket;
