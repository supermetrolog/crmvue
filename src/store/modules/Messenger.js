import api from '@//api/api';
import dayjs from 'dayjs';
import { alg } from '@/utils/alg.js';
import { entityOptions } from '@/const/options/options.js';
import { notify } from '@kyvg/vue3-notification';
import { messagesToSections } from '@/utils/mapper.js';
import { ucFirst } from '@/utils/formatter.js';

const needCacheMessage = (dialogID, asideID, panelID) => {
    // Лучше не трогать условие.. Оно долго выводилось
    return Boolean(
        panelID !== null && (dialogID !== asideID || panelID === dialogID || asideID !== panelID)
    );
};

const getInitialState = () => ({
    chatMembersObjects: {
        data: [],
        pagination: null
    },
    chatMembersRequests: {
        data: [],
        pagination: null
    },
    chatMembersUsers: {
        data: [],
        pagination: null
    },

    messages: [],
    lastNotViewedMessageID: null,
    lessThenMessageId: null,

    newMessage: '',
    cachedNewMessages: {},
    querySearch: '',

    currentDialogType: null,

    currentChat: null,
    currentDialog: null,
    currentPanel: null,
    currentRecipient: null,
    currentPinned: null,
    currentCategory: null,

    currentAsideDialogID: null,
    currentPanelDialogID: null,
    currentPanelCompanyID: null,

    unreadMessageCount: 0,
    unreadNotificationCount: 0,
    unreadTaskCount: 0,
    unreadReminderCount: 0,

    loadingChat: false,
    loadingAside: false,
    loadingPanel: false,

    countersInterval: null
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
        setCurrentCategory(state, value) {
            state.currentCategory = value;
        },
        setCachedMessage(state) {
            if (!state.newMessage.length) {
                if (state.currentPanelDialogID in state.cachedNewMessages)
                    delete state.cachedNewMessages[state.currentPanelDialogID];
                return;
            }

            state.cachedNewMessages[state.currentPanelDialogID] = {
                message: state.newMessage,
                contact: state.currentRecipient?.id ?? null,
                tag: state.currentCategory
            };
        },
        clearCachedMessage(state, chatMemberID) {
            delete state.cachedNewMessages[chatMemberID];
        },

        setMessages(state, messages) {
            state.messages = messagesToSections(messages).messages;
        },
        addMessages(state, value) {
            let messages = [];
            let hasLeakedMessages = false;

            if (state.messages.length) {
                const obj = messagesToSections(
                    value,
                    state.messages[state.messages.length - 1].dayjs_date,
                    true
                );

                messages = obj.messages;
                hasLeakedMessages = obj.hasLeakedMessages;
            } else messages = messagesToSections(value);

            if (hasLeakedMessages) {
                state.messages.push(...messages.toSpliced(0, 1));
            } else {
                state.messages.push(...messages);
            }
        },
        unshiftMessages(state, messages) {
            const { messages: newMessages, hasLeakedMessages } = messagesToSections(
                messages,
                state.messages[0].label
            );

            if (hasLeakedMessages) state.messages.splice(0, 1);
            state.messages.unshift(...newMessages);
        },
        updateMessage(state, newMessage) {
            let messageIndex = state.messages.findIndex(message => message.id === newMessage.id);

            if (messageIndex !== -1) {
                newMessage.is_viewed = true;
                Object.assign(state.messages[messageIndex], newMessage);
            }
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
        },
        setCounts(state, obj) {
            state.unreadTaskCount = Number(obj.unread_task_count);
            state.unreadMessageCount = Number(obj.unread_message_count);
            state.unreadNotificationCount = Number(obj.unread_notification_count);
            state.unreadReminderCount = Number(obj.unread_reminder_count);
        },
        setLastNotViewedMessage(state, messageID) {
            state.lastNotViewedMessageID = messageID;
        },
        setLessThenMessageId(state, messageID) {
            state.lessThenMessageId = messageID;
        },
        updateDialogCounts(state, messageID) {
            const modelTypeName = 'chatMembers' + ucFirst(state.currentDialog.model_type) + 's';

            const chatMemberIndex = state[modelTypeName].data.findIndex(
                element => element.id === state.currentDialog.id
            );
            if (chatMemberIndex !== -1) {
                let count = 0;
                for (
                    let i = state.messages.length - 1;
                    i > 0 && state.messages[i].id !== messageID;
                    i--
                ) {
                    if (!state.messages[i].isLabel && !state.messages[i].is_viewed) count++;
                }

                state[modelTypeName].data[chatMemberIndex].statistic.messages = count;
            }
        },
        clearCountersInterval(state) {
            clearInterval(state.countersInterval);
            state.countersInterval = null;
        },
        setCountersInterval(state, interval) {
            state.countersInterval = interval;
        }
    },
    actions: {
        async setCountersUpdater({ state, dispatch, commit }) {
            if (state.countersInterval !== null) commit('clearCountersInterval');

            dispatch('updateCounters');
            commit(
                'setCountersInterval',
                setInterval(() => {
                    dispatch('updateCounters');
                }, 30000)
            );
        },
        async updateCounters({ rootGetters, commit }) {
            const counters = await api.messenger.getStatistics([
                rootGetters.THIS_USER?.chat_member_id
            ]);
            if (counters) commit('setCounts', counters[0]);
        },
        async updateDialogs({ state, commit }) {
            commit('setLoadingAside', true);

            const options = {};

            if (alg.isNumeric(state.querySearch)) options.model_id = state.querySearch;
            else options.search = state.querySearch;

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
        async selectChat({ commit, state, getters }, { dialogID, dialogType, anywayOpen = false }) {
            if (needCacheMessage(dialogID, state.currentAsideDialogID, state.currentPanelDialogID))
                commit('setCachedMessage');

            if (!state.currentAsideDialogID) {
                commit('setCurrentPanelDialogID', null);
                return;
            }

            if (dialogID === state.currentPanelDialogID && anywayOpen) return;
            if (getters.hasCachedMessage) commit('setCurrentRecipient', { contact: null });

            if (dialogID === state.currentPanelDialogID) {
                commit('setCurrentPanelDialogID', null);
                commit('setCurrentChat', false);
                commit('setCurrentPinned', null);
                return;
            }

            commit('setCurrentCategory', null);
            commit('setCurrentDialogType', dialogType);
            commit('setCurrentPanelDialogID', dialogID);
            commit('setMessages', []);
            commit('setLastNotViewedMessage', null);
            commit('setLoadingChat', true);

            const [dialog, messages, pinned] = await Promise.all([
                api.messenger.getDialog(dialogID),
                api.messenger.getMessages(dialogID),
                api.messenger.getPinned(dialogID)
            ]);

            commit('setCurrentPinned', pinned);
            commit('setCurrentChat', true);
            commit('setCurrentDialog', dialog);

            if (messages.length) {
                commit('setMessages', messages);
                commit('setLessThenMessageId', messages[0].id);
            }

            commit('setLoadingChat', false);
        },
        async getCompanyChats(_, { companyID, modelType, page = 1 }) {
            const data = await api.messenger.getChats({
                model_type: modelType,
                company_id: companyID,
                page: page
            });

            return data ?? { data: [], pagination: null };
        },
        async sendMessage({ commit, state, getters }, options) {
            const message = state.newMessage.replaceAll('\n', '<br />');

            const response = await api.messenger.sendMessage(state.currentPanelDialogID, {
                message,
                contact_ids: state.currentRecipient ? [state.currentRecipient.id] : [],
                ...options
            });

            if (response) {
                if (getters.hasCachedMessage)
                    commit('clearCachedMessage', state.currentPanelDialogID);

                response.is_viewed = true;

                commit('addMessages', [response]);
                commit('setNewMessage', '');

                return true;
            }

            notify('Произошла ошибка при отправке сообщения');
            return false;
        },
        async updateMessage(
            { commit, state },
            { id, message = null, tag = null, contact = null, files = [], fileList = [] }
        ) {
            const payload = {
                id,
                message,
                files: files.concat(fileList),
                tag_ids: tag ? [tag] : [],
                contact_ids: contact ? [contact.id] : []
            };

            const updatedMessage = await api.messenger.updateMessage(payload);

            if (updatedMessage) {
                commit('updateMessage', updatedMessage);
                if (state.currentPinned && id === state.currentPinned.id)
                    commit('setCurrentPinned', updatedMessage);

                return true;
            }

            notify('Произошла ошибка при отправке запроса');
            return false;
        },

        async reportContact(context, { contact }) {
            // ONLY TESTING
            notify(`${contact.full_name} отмечен(а) как неактуальный контакт`, { duration: 3000 });

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
            const addition = await api.notification.createFromMessage(messageID, options);

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
        async addReminder({ commit }, { messageID, options }) {
            const addition = await api.reminder.createFromMessage(messageID, {
                ...options,
                status: 1
            });

            if (addition) {
                commit('addAddition', { messageID, additionType: 'reminder', addition });
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
        async getCurrentChatFiles({ state }, page) {
            return await api.messenger.getMedia(state.currentPanelDialogID, {
                page
            });
        },
        async getCurrentChatPhotos({ state }, page) {
            return await api.messenger.getMedia(state.currentPanelDialogID, {
                extension: 'jpg',
                page
            });
        },
        async getCurrentChatQuizzes({ state }, { page = 1, search = undefined }) {
            return await api.survey.list({
                chat_member_id: state.currentDialog.id,
                page,
                search: search
            });
        },

        async pinMessage({ state, commit }, message) {
            const pinned = await api.messenger.pinMessage(state.currentDialog.id, message.id);

            if (pinned) {
                commit('setCurrentPinned', message);
                return true;
            }

            return false;
        },
        async unpinMessage({ state, commit }) {
            const unpinned = await api.messenger.unpinMessage(state.currentDialog.id);

            if (unpinned) {
                commit('setCurrentPinned', null);
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
            const messages = await api.messenger.getMessages(
                state.currentDialog.id,
                state.lessThenMessageId
            );

            if (messages?.length) {
                commit('unshiftMessages', messages);
                commit('setLessThenMessageId', messages[0].id);
            }

            return messages?.length < 30;
        },
        setCurrentMessageFromCache({ state, commit }) {
            const cachedMessage = state.cachedNewMessages[state.currentPanelDialogID];

            commit('setNewMessage', cachedMessage.message);
            commit('setCurrentRecipient', { contactID: cachedMessage.contact });
            commit('setCurrentCategory', cachedMessage.tag);
        },
        async readMessages({ commit }, messageID) {
            const reads = api.messenger.readMessages(messageID);

            if (reads) {
                commit('updateDialogCounts', messageID);
                return true;
            }

            return false;
        }
    },
    getters: {
        hasQuery(state) {
            return Boolean(state.querySearch.length);
        },
        hasDialogs(state) {
            return Boolean(
                state.chatMembersObjects.data.length ||
                    state.chatMembersRequests.data.length ||
                    state.chatMembersUsers.data.length
            );
        },
        hasCachedMessage(state) {
            return state.currentChat && state.currentPanelDialogID in state.cachedNewMessages;
        }
    }
};

export default Messenger;
