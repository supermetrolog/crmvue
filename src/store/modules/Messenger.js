import api from '@//api/api';
import { $toast } from '@/plugins/toast';
import dayjs from 'dayjs';
import { alg } from '@/utils/alg.js';
import { entityOptions } from '@/const/options/options.js';

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
    countNewAlerts: 0,
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
                Object.assign(state.messages[messageIndex], newMessage);
            }
        },
        setMessagesPagination(state, value) {
            state.messagesPagination = value;
        },

        setCurrentRecipient(state, { contact, contactID }) {
            if (contact) state.currentRecipient = contact;
            else if (contactID) {
                const contact = state.currentPanel.contacts.find(
                    element => element.id === contactID
                );

                if (contact.type === entityOptions.contact.typeStatement.GENERAL) {
                    state.currentRecipient = {
                        ...contact,
                        full_name: 'Общий контакт',
                        general: true
                    };
                } else {
                    state.currentRecipient = contact;
                }
            } else state.currentRecipient = null;
        },
        setCurrentDialog(state, value) {
            state.currentDialog = value;
        },
        setCurrentPanel(state, value) {
            state.currentPanel = value;
        },
        updateCurrentPanel(state, value) {
            Object.assign(state.currentPanel, value);
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

        pinMessage(state, message) {
            state.currentPinned = message;
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
        async selectPanel(
            { commit, state },
            { companyID, dialogID, dialogType, anywayOpen = false }
        ) {
            if (dialogID === state.currentAsideDialogID && anywayOpen) return;

            commit('setCurrentRecipient', { contact: null });

            if (dialogID === state.currentAsideDialogID) {
                commit('setCurrentAsideDialogID', null);
                commit('setCurrentPanel', null);
                commit('setCurrentPanelID', null);
                commit('setCurrentPanelCompanyID', null);
                commit('setCurrentDialogType', null);
                return;
            }

            commit('setCurrentAsideDialogID', dialogID);
            commit('setCurrentPanelCompanyID', companyID);
            commit('setCurrentDialogType', dialogType);

            commit('setLoadingPanel', true);

            const data = await api.messenger.getPanel(companyID);

            commit('setCurrentPanel', data || null);
            commit('setLoadingPanel', false);
        },
        async updatePanel({ commit, state }) {
            const panel = await api.messenger.getPanel(state.currentPanelCompanyID);

            if (panel) {
                commit('updateCurrentPanel', panel);

                if (state.currentChat && state.currentRecipient) {
                    commit('setCurrentRecipient', { contactID: state.currentRecipient?.id });
                }
            }
        },
        async selectChat({ commit, state }, { dialogID, dialogType, anywayOpen = false }) {
            if (dialogID === state.currentPanelDialogID && anywayOpen) return;

            if (dialogID === state.currentPanelDialogID) {
                commit('setCurrentPanelDialogID', null);
                commit('setCurrentChat', false);
                commit('setCurrentPinned', null);
                return;
            }

            commit('setCurrentDialogType', dialogType);
            commit('setCurrentPanelDialogID', dialogID);
            commit('setMessages', []);
            commit('setMessagesPagination', {});
            commit('setLoadingChat', true);

            const [dialog, messages, pinned] = await Promise.all([
                api.messenger.getDialog(dialogID),
                api.messenger.getMessages(dialogID),
                api.messenger.getPinned(dialogID)
            ]);

            commit('setCurrentPinned', pinned);
            commit('setCurrentChat', true);
            commit('setCurrentDialog', dialog);
            commit('setMessages', messages.data);
            commit('setMessagesPagination', messages.pagination);
            commit('setLoadingChat', false);
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

        async sendMessage({ commit, state }, options) {
            const message = state.newMessage.replaceAll('\n', '<br />');

            const response = await api.messenger.sendMessage(state.currentPanelDialogID, {
                message,
                contact_ids: state.currentRecipient ? [state.currentRecipient.id] : [],
                ...options
            });

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
            // ONLY TESTING
            $toast(`${contact.full_name} отмечен(а) как неактуальный контакт`, { duration: 3000 });

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
            // ONLY TESTING
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
            // ONLY TESTING// ONLY TESTING
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
            // ONLY TESTING
            context.commit('addMessages', [
                {
                    id: context.state.messages.length + 1,
                    sender: null,
                    text: `<b>${context.rootGetters.THIS_USER?.userProfile?.full_name}</b> отметил объект снесенным.`
                }
            ]);

            return true;
        },
        async addAlert({ commit }, { messageID, options }) {
            const addition = await api.alert.createFromMessage(messageID, options);

            if (addition) {
                commit('addAddition', { messageID, additionType: 'alert', addition });
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
        async deleteAddition({ commit }, { messageID, additionID, additionType }) {
            const response = await api[additionType].delete(additionID);

            if (response) {
                commit('deleteAddition', {
                    additionType,
                    additionID,
                    messageID
                });

                return true;
            }

            return false;
        },
        async updateAddition({ commit }, { messageID, additionID, additionType, payload }) {
            const addition = await api[additionType].update(additionID, payload);

            if (addition) {
                commit('updateAddition', {
                    additionType,
                    addition,
                    messageID
                });

                return true;
            }

            return false;
        },
        async addReminder({ commit }, { messageID }) {
            // ONLY TESTING
            const addition = null; // axios fetch

            if (addition) {
                commit('addAddition', { messageID, additionType: 'reminder', addition });
                return true;
            }

            return false;
        },

        async getCurrentChatFiles(context) {
            // ONLY TESTING
            return await api.messenger.getFiles(context.state.currentDialog);
        },
        async getCurrentChatPhotos(context) {
            // ONLY TESTING
            return await api.messenger.getPhotos(context.state.currentDialog);
        },
        async getCurrentChatQuizzes(context) {
            // ONLY TESTING
            return await api.messenger.getQuizzes(context.state.currentDialog);
        },

        async pinMessage({ state, commit }, message) {
            const pinned = await api.messenger.pinMessage(state.currentDialog.id, message.id);

            if (pinned) {
                commit('pinMessage', message);

                return true;
            }

            return false;
        },
        async pinMessageToObject(context, message) {
            // ONLY TESTING
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
