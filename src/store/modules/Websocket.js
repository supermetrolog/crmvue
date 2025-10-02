import { notify } from '@kyvg/vue3-notification';
import { captureException } from '@sentry/vue';
import { initNotifications } from '@/services/notifications/notifications';

function showNotify(text, title, type = 'success') {
    notify({
        group: 'app',
        type,
        duration: 5000,
        title,
        text
    });
}

function getWindowId() {
    return crypto && crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

function socketIsOpen(socket) {
    return socket && socket.readyState === WebSocket.OPEN;
}

const Websocket = {
    state: {
        socket: null,
        setedUserIdFlag: false,

        pingTimer: null,
        sendQueue: [],
        windowId: getWindowId(),
        telegramIsLinked: false
    },

    mutations: {
        setSocket(state, socket) {
            state.socket = socket;
        },
        clearSocket(state) {
            state.socket = null;
        },

        setPingTimer(state, id) {
            state.pingTimer = id;
        },
        clearPingTimer(state) {
            if (state.pingTimer) clearInterval(state.pingTimer);
            state.pingTimer = null;
        },

        enqueue(state, payload) {
            state.sendQueue.push(payload);
        },
        clearQueue(state) {
            state.sendQueue = [];
        },

        toggleSetedUserIdFlag(state, flag = null) {
            state.setedUserIdFlag = flag === null ? !state.setedUserIdFlag : flag;
        },
        setTelegramIsLinked(state, value) {
            state.telegramIsLinked = value;
        }
    },

    actions: {
        WEBSOCKET_RUN({ state, dispatch, commit, rootGetters }) {
            if (state.socket || !rootGetters.THIS_USER) return;

            const socket = new WebSocket(import.meta.env.VITE_VUE_APP_WS_URL);

            socket.onopen = () => dispatch('EVENT_WEBSOCKET_ON_OPEN');
            socket.onmessage = event => dispatch('EVENT_WEBSOCKET_ON_MESSAGE', event);
            socket.onerror = err => dispatch('EVENT_WEBSOCKET_ON_ERROR', err);
            socket.onclose = evt => dispatch('EVENT_WEBSOCKET_ON_CLOSE', evt);

            commit('setSocket', socket);
        },
        WEBSOCKET_STOP({ state, commit }) {
            commit('clearPingTimer');

            if (socketIsOpen(state.socket)) {
                try {
                    state.socket.close(1000, 'client stop');
                } catch (e) {
                    captureException(e);
                }
            }

            commit('clearSocket');
            commit('toggleSetedUserIdFlag', false);
        },
        EVENT_WEBSOCKET_ON_OPEN({ dispatch, commit, state, rootGetters }) {
            dispatch('SEND_JSON', {
                action: 'setUser',
                data: { window_id: state.windowId, user_id: rootGetters.THIS_USER?.id }
            });

            commit('clearPingTimer');

            const id = setInterval(() => {
                dispatch('PING');
            }, 30000);

            commit('setPingTimer', id);

            if (state.sendQueue.length) {
                for (const payload of state.sendQueue) {
                    dispatch('SEND_JSON', payload);
                }

                commit('clearQueue');
            }
        },
        EVENT_WEBSOCKET_ON_MESSAGE({ dispatch }, event) {
            const data = JSON.parse(event.data);
            if (!data) return;

            if (data.action === 'pong') return;

            const prefix = '_ws_';
            const name = data.action
                ? `${prefix}${String(data.action).toLowerCase()}`
                : `${prefix}info`;

            if (this.checkAction(name)) {
                dispatch(name, data);
            }
        },
        EVENT_WEBSOCKET_ON_ERROR({ dispatch }) {
            showNotify(
                'Не удалось подключиться к Websocket серверу. Обратитесь к администратору.',
                'Websocket server',
                'error'
            );

            dispatch('WEBSOCKET_STOP');

            setTimeout(() => {
                dispatch('WEBSOCKET_RUN');
            }, 30000);
        },
        EVENT_WEBSOCKET_ON_CLOSE({ state, dispatch }, event) {
            if (event && event.wasClean) return;

            if (state.socket) {
                showNotify('Websocket соединение прервано.', 'Websocket server', 'warn');

                dispatch('WEBSOCKET_STOP');
                dispatch('WEBSOCKET_RUN');
            }
        },
        PING({ state }) {
            if (!socketIsOpen(state.socket)) {
                return;
            }

            state.socket.send(JSON.stringify({ action: 'ping' }));
        },
        SEND_JSON({ state, commit }, payload) {
            const body = JSON.stringify(payload);
            const sock = state.socket;

            if (socketIsOpen(sock)) {
                try {
                    sock.send(body);
                } catch {
                    commit('enqueue', payload);
                }
            } else {
                commit('enqueue', payload);
            }
        },
        _ws_new_user_notification(_, data) {
            // publishNotificationFromWS(data.message);
        },
        _ws_user_set({ commit, rootGetters }) {
            commit('toggleSetedUserIdFlag', true);

            const user = rootGetters.THIS_USER;

            if (user) {
                initNotifications(user.id);
            }
        },
        _ws_info() {
            // нераспознанные события
        },
        _ws_telegram_linked({ commit }) {
            commit('setTelegramIsLinked', true);
        }
    },
    getters: {
        SOCKET: state => state.socket,
        SETED_USER_ID_FLAG: state => state.setedUserIdFlag
    }
};

export default Websocket;
