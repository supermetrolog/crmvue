import { notify } from '@kyvg/vue3-notification';

let notifyOptions = {
    group: 'app',
    type: 'success',
    duration: 5000
};

const Websocket = {
    state: {
        socket: null,
        setedUserIdFlag: false,
        pingLoop: null,
        reconnectTimeout: null
    },
    mutations: {
        updateSocket(state, data) {
            state.socket = data;
        },
        toggleSetedUserIdFlag(state, flag = null) {
            state.setedUserIdFlag = flag === null ? !state.setedUserIdFlag : flag;
        },
        deletePingLoop(state) {
            if (state.pingLoop) clearInterval(state.pingLoop);
        },
        setPingLoop(state, data) {
            state.pingLoop = data;
        },
        deleteSocket(state) {
            if (state.socket) state.socket.close();
            state.socket = null;
        }
    },
    actions: {
        WEBSOCKET_STOP({ commit }) {
            commit('deleteSocket');
            commit('deletePingLoop');
            commit('toggleSetedUserIdFlag', false);
        },
        WEBSOCKET_RUN({ state, dispatch, commit, rootGetters }) {
            if (state.socket || !rootGetters.THIS_USER) return;

            let socket = new WebSocket(import.meta.env.VITE_VUE_APP_WS_URL);
            socket.onopen = function () {
                return dispatch('EVENT_WEBSOCKET_ON_OPEN');
            };
            socket.onmessage = function (event) {
                return dispatch('EVENT_WEBSOCKET_ON_MESSAGE', event);
            };
            socket.onerror = function (error) {
                return dispatch('EVENT_WEBSOCKET_ON_ERROR', error);
            };
            socket.onclose = function (event) {
                return dispatch('EVENT_WEBSOCKET_ON_CLOSE', event);
            };
            commit('updateSocket', socket);
        },
        WEBSOCKET_RUN_PING_LOOP({ dispatch, commit }) {
            commit(
                'setPingLoop',
                setInterval(() => {
                    dispatch('WEBSOCKET_PING');
                }, 50000)
            );
        },
        EVENT_WEBSOCKET_ON_OPEN({ dispatch }) {
            dispatch('WEBSOCKET_SET_USER');
            dispatch('WEBSOCKET_RUN_PING_LOOP');
        },
        WEBSOCKET_PING({ state }) {
            state.socket.send(
                JSON.stringify({
                    action: 'ping'
                })
            );
        },
        EVENT_WEBSOCKET_ON_MESSAGE({ dispatch }, event) {
            let data = JSON.parse(event.data);
            let prefix = 'ACTION_WEBSOCKET_';
            let actionName = prefix + 'info';

            if (Object.prototype.hasOwnProperty.call(data, 'action'))
                actionName = prefix + data.action.toLowerCase();

            if (this.checkAction(actionName)) dispatch(actionName, data);
        },
        EVENT_WEBSOCKET_ON_ERROR({ dispatch }) {
            notifyOptions.text =
                'Не удалось подключиться к Websocket серверу. Обратитесь к администратору.';
            notifyOptions.title = 'Websocket server';
            notifyOptions.type = 'error';
            notify(notifyOptions);

            dispatch('WEBSOCKET_STOP');
            setTimeout(() => {
                dispatch('WEBSOCKET_RUN');
            }, 30000);
        },
        EVENT_WEBSOCKET_ON_CLOSE({ state, dispatch }, event) {
            if (event.wasClean) return;

            notifyOptions.text = 'Websocket соединение прервано.';
            notifyOptions.title = 'Websocket server';
            notifyOptions.type = 'warn';

            if (state.socket) {
                notify(notifyOptions);
                dispatch('WEBSOCKET_STOP');
                dispatch('WEBSOCKET_RUN');
            }
        },
        WEBSOCKET_SET_USER({ state, rootGetters }) {
            if (!state.setedUserIdFlag) {
                state.socket.send(
                    JSON.stringify({
                        action: 'setUser',
                        data: { window_id: window.name, user_id: rootGetters.THIS_USER?.id }
                    })
                );
            }
        },
        ACTION_WEBSOCKET_user_setted({ commit }) {
            commit('toggleSetedUserIdFlag', true);
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
