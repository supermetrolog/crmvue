import api from '@//api/api';
import { $toast } from '@/plugins/toast';
import dayjs from 'dayjs';
import { alg } from '@/utils/alg.js';

const getInitialState = () => ({
    chatMembersObjects: [],
    chatMembersRequests: [],
    chatMembersUsers: [],

    messages: [],
    messagesPagination: {},

    newMessage: '',
    querySearch: '',

    currentDialogType: null,

    currentChat: null,
    currentDialog: null,
    currentPanel: null,
    currentRecipient: null,
    currentPinned: null,

    currentAsideDialogID: null,
    currentPanelDialogID: null,
    currentPanelCompanyID: null,

    countNewMessages: 0,
    countNewNotifications: 0,
    countNewTasks: 0,
    countNewReminders: 0,

    loadingChat: false,
    loadingAside: false,
    loadingPanel: false
});

const Messenger = {
    namespaced: true,
    state: getInitialState(),
    mutations: {
        setDialogs(state, dialogs) {
            [state.chatMembersObjects, state.chatMembersRequests] = [...dialogs];
        },
        addDialogs(state, { dialogType, dialogs, pagination }) {
            state[`chatMembers${dialogType}`].data.push(...dialogs);
            state[`chatMembers${dialogType}`].pagination = pagination;
        },
        setQuerySearch(state, value) {
            state.querySearch = value;
        },
        setNewMessage(state, value) {
            state.newMessage = value;
        },

        setMessages(state, value) {
            state.messages = value;
        },
        addMessages(state, value) {
            state.messages.push(...value);
        },
        updateMessage(state, newMessage) {
            let messageIndex = state.messages.findIndex(message => message.id === newMessage.id);
            if (messageIndex !== -1) {
                state.messages[messageIndex] = { ...state.messages[messageIndex], ...newMessage };
            }
        },
        setMessagesPagination(state, value) {
            state.messagesPagination = value;
        },

        setCurrentRecipient(state, value) {
            state.currentRecipient = value;
        },
        setCurrentDialog(state, value) {
            state.currentDialog = value;
        },
        setCurrentPanel(state, value) {
            state.currentPanel = value;
        },
        setCurrentPanelID(state, value) {
            state.currentPanelID = value;
        },
        setCurrentChat(state, value) {
            state.newMessage = '';
            state.currentChat = value;
        },
        setCurrentPinned(state, value) {
            state.currentPinned = value;
        },

        setCurrentAsideDialogID(state, value) {
            state.currentAsideDialogID = value;
        },
        setCurrentPanelDialogID(state, value) {
            state.currentPanelDialogID = value;
        },
        setCurrentPanelCompanyID(state, value) {
            state.currentPanelCompanyID = value;
        },
        setCurrentDialogType(state, value) {
            state.currentDialogType = value;
        },

        setLoadingAside(state, value) {
            state.loadingAside = value;
        },
        setLoadingPanel(state, value) {
            state.loadingPanel = value;
        },
        setLoadingChat(state, value) {
            state.loadingChat = value;
        },

        addAddition(state, { messageID, additionType, addition }) {
            const currentMessage = state.messages.find(message => message.id === messageID);

            if (currentMessage) currentMessage[`${additionType}s`].push(addition);
        },

        completeTask() {
            // const message = state.messages.find(message => message.id === task.message_id);
            //
            // if (message) {
            //     const addition = message.additions.find(addition => addition.id === task.id);
            //     addition.completed = !addition.completed;
            // }
        },

        deleteAddition(state, { additionType, messageID, additionID }) {
            const currentMessage = state.messages.find(message => message.id === messageID);

            if (currentMessage) {
                currentMessage[additionType + 's'].splice(
                    currentMessage[additionType + 's'].findIndex(
                        addition => addition.id === additionID
                    ),
                    1
                );
            }
        },
        updateAddition(state, { additionType, messageID, addition }) {
            const currentMessage = state.messages.find(message => message.id === messageID);
            if (currentMessage) {
                currentMessage[additionType + 's'][
                    currentMessage[additionType + 's'].findIndex(
                        _addition => _addition.id === addition.id
                    )
                ] = addition;
            }
        },

        pinMessage(state, messageID) {
            if (state.currentPinned) {
                state.currentPinned.pinned = false;
            }

            if (state.currentPinned?.id === messageID) {
                state.currentPinned = null;
                return;
            }

            const message = state.messages.find(message => message.id === messageID);

            if (message) {
                message.pinned = !message.pinned;
                state.currentPinned = message;
            }
        },
        pinMessageToObject(state, messageID) {
            const messageIndex = state.messages.findIndex(message => message.id === messageID);

            if (messageIndex !== -1) {
                state.messages[messageIndex].pinnedToObject =
                    !state.messages[messageIndex].pinnedToObject;
            }
        },
        clearState(state) {
            const initialState = getInitialState();
            Object.keys(initialState).forEach(key => (state[key] = initialState[key]));
        }
    },
    actions: {
        async updateDialogs({ state, commit }) {
            commit('setLoadingAside', true);

            const options = {};

            if (alg.isNumeric(state.querySearch)) options.model_id = state.querySearch;

            const chats = await Promise.all([
                api.messenger.getChats({ model_type: 'object', ...options }),
                api.messenger.getChats({ model_type: 'request', ...options })
            ]);

            if (chats) {
                commit('setDialogs', chats);
            }

            commit('setLoadingAside', false);
            return null;
        },
        async selectPanel(context, { companyID, dialogID, dialogType }) {
            context.commit('setCurrentRecipient', null);

            if (dialogID === context.state.currentAsideDialogID) {
                context.commit('setCurrentAsideDialogID', null);
                context.commit('setCurrentPanel', null);
                context.commit('setCurrentPanelID', null);
                context.commit('setCurrentPanelCompanyID', null);
                context.commit('setCurrentDialogType', null);
                return;
            }

            context.commit('setCurrentAsideDialogID', dialogID);
            context.commit('setCurrentPanelCompanyID', companyID);
            context.commit('setCurrentDialogType', dialogType);

            context.commit('setLoadingPanel', true);

            const data = await api.messenger.getPanel(companyID);

            context.commit('setCurrentPanel', data || null);
            context.commit('setLoadingPanel', false);
        },
        async selectChat(context, { dialogID, dialogType }) {
            if (dialogID === context.state.currentPanelDialogID) {
                context.commit('setCurrentPanelDialogID', null);
                context.commit('setCurrentChat', false);
                context.commit('setCurrentPinned', null);
                return;
            }

            context.commit('setCurrentDialogType', dialogType);
            context.commit('setCurrentPanelDialogID', dialogID);
            context.commit('setMessages', []);
            context.commit('setMessagesPagination', {});
            context.commit('setLoadingChat', true);

            const [dialog, messages] = await Promise.all([
                api.messenger.getDialog(dialogID),
                api.messenger.getMessages(dialogID)
            ]);

            //context.commit('setCurrentPinned', pinned);
            context.commit('setCurrentChat', true);
            context.commit('setCurrentDialog', dialog);
            context.commit('setMessages', messages.data);
            context.commit('setMessagesPagination', messages.pagination);
            context.commit('setLoadingChat', false);
        },
        async getCompanyObjects() {
            // try {
            //     const objects = await api.companyObjects.search({ company_id, page });
            //     console.log(objects, 'objects');
            //
            //     const data = await api.messenger.getChats({
            //         model_type: 'object',
            //         model_id: [23, 24]
            //     });
            //     console.log(data);
            //     return [];
            // } catch {
            //     return [];
            // }
        },
        async getCompanyRequests() {
            // const data = await api.request.getRequests(id);
            //
            // if (data) return data;
            //
            // return [];
        },

        async sendMessage({ commit, state }) {
            const text = state.newMessage.replaceAll('\n', '<br />');

            const response = await api.messenger.sendMessage(state.currentPanelDialogID, text);

            if (response) {
                commit('addMessages', [response]);
                commit('setNewMessage', '');

                return true;
            }

            $toast('Произошла ошибка при отправке сообщения');
            return false;
        },
        async updateMessage() {
            // context.commit('updateMessage', message);
            // return true;
        },

        async reportContact(context, { contact }) {
            $toast(`${contact.full_name} отмечен как неактуальный контакт`, { duration: 3000 });

            context.commit('addMessages', [
                {
                    id: context.state.messages.length + 1,
                    sender: null,
                    text: `<b>${context.rootGetters.THIS_USER?.userProfile?.full_name}</b> отметил контакт <b>${contact.full_name}</b> как <b>неактуальный</b>.`
                }
            ]);

            return true;
        },
        async addCall(context, { contact, date }) {
            const formattedDate = dayjs(date).format('DD.MM.YYYY, HH:mm');

            context.commit('addMessages', [
                {
                    id: context.state.messages.length + 1,
                    sender: null,
                    text: `<b>${context.rootGetters.THIS_USER?.userProfile?.full_name}</b> назначил созвон с <b>${contact.full_name}</b> на <b>${formattedDate}</b>.`
                }
            ]);

            return true;
        },
        async sendQuiz(context, { contact }) {
            context.commit('addMessages', [
                {
                    id: context.state.messages.length + 1,
                    sender: null,
                    text: `<b>${context.rootGetters.THIS_USER?.userProfile?.full_name}</b> создал опросник с <b>${contact.full_name}</b>.`
                }
            ]);

            return true;
        },
        async sendBreakObject(context) {
            context.commit('addMessages', [
                {
                    id: context.state.messages.length + 1,
                    sender: null,
                    text: `<b>${context.rootGetters.THIS_USER?.userProfile?.full_name}</b> отметил объект снесенным.`
                }
            ]);

            return true;
        },
        async addNotification({ commit }, { messageID }) {
            const addition = null; // axios fetch

            if (addition) {
                commit('addAddition', { messageID, additionType: 'notification', addition });
                return true;
            }

            return false;
        },
        async addTask({ commit }, { messageID, options }) {
            const addition = await api.task.createFromMessage(messageID, {
                ...options,
                status: 1
            });

            if (addition) {
                commit('addAddition', { messageID, additionType: 'task', addition });
                return true;
            }

            return false;
        },
        async deleteTask({ commit }, { messageID, taskID }) {
            const response = await api.task.delete(taskID);

            if (response) {
                commit('deleteAddition', {
                    additionType: 'task',
                    additionID: taskID,
                    messageID: messageID
                });

                return true;
            }

            return false;
        },
        async updateTask({ commit }, { messageID, taskID, payload }) {
            const addition = await api.task.update(taskID, payload);

            if (addition) {
                commit('updateAddition', {
                    additionType: 'task',
                    addition,
                    messageID
                });

                return true;
            }

            return false;
        },
        async addReminder({ commit }, { messageID }) {
            const addition = null; // axios fetch

            if (addition) {
                commit('addAddition', { messageID, additionType: 'reminder', addition });
                return true;
            }

            return false;
        },

        async getCurrentChatFiles(context) {
            return await api.messenger.getFiles(context.state.currentDialog);
        },
        async getCurrentChatPhotos(context) {
            return await api.messenger.getPhotos(context.state.currentDialog);
        },
        async getCurrentChatQuizzes(context) {
            return await api.messenger.getQuizzes(context.state.currentDialog);
        },

        async completeTask(context, task) {
            context.commit('completeTask', task);
        },

        async updateAddition(context, addition) {
            context.commit('updateAddition', addition);
        },
        async pinMessage(context, messageID) {
            context.commit('pinMessage', messageID);
        },
        async pinMessageToObject(context, message) {
            context.commit('pinMessageToObject', message.id);
            return true;
        },

        async loadDialogs({ commit, state }, modelType) {
            const modelTypePlural = modelType.charAt(0).toUpperCase() + modelType.slice(1) + 's';

            const data = await api.messenger.getChats({
                model_type: modelType,
                page: state[`chatMembers${modelTypePlural}`].pagination.currentPage + 1
            });

            if (data) {
                commit('addDialogs', {
                    dialogType: modelTypePlural,
                    dialogs: data.data,
                    pagination: data.pagination
                });

                return data.pagination.currentPage === data.pagination.pageCount;
            }

            return null;
        },

        async loadMessages({ commit, state }) {
            if (
                state.messagesPagination.currentPage === state.messagesPagination.pageCount ||
                state.messagesPagination.pageCount === 0
            )
                return true;

            const { data, pagination } = await api.messenger.getMessages(
                state.currentDialog.id,
                state.messagesPagination.currentPage + 1
            );

            if (data) {
                commit('addMessages', data);
                commit('setMessagesPagination', pagination);

                return pagination.currentPage === pagination.pageCount;
            }

            return null;
        }
    },
    getters: {
        hasQuery(state) {
            return state.querySearch.length;
        },
        hasDialogs(state) {
            return (
                state.chatMembersObjects.length +
                state.chatMembersRequests.length +
                state.chatMembersUsers.length
            );
        }
    }
};

export default Messenger;
