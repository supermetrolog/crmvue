import api from '@//api/api';
import dayjs from 'dayjs';
import { entityOptions } from '@/const/options/options.js';
import { notify } from '@kyvg/vue3-notification';
import { messagesToSections } from '@/utils/mapper.js';
import { ucFirst } from '@/utils/formatters/string.js';
import { messenger } from '@/const/messenger.js';
import { spliceById } from '@/utils/helpers/array/spliceById.js';
import { taskOptions } from '@/const/options/task.options.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { isNumeric } from '@/utils/helpers/common/isNumeric.js';
import { isNotEmptyString } from '@/utils/helpers/string/isNotEmptyString.js';

const needCacheMessage = (dialogID, asideID, panelID) => {
    return Boolean(
        panelID !== null && (dialogID !== asideID || panelID === dialogID || asideID !== panelID)
    );
};

const getInitialState = () => ({
    chatMembersObject: {
        data: [],
        pagination: null
    },
    chatMembersRequest: {
        data: [],
        pagination: null
    },
    chatMembersUser: {
        data: [],
        pagination: null
    },
    chatMembersCompany: {
        data: [],
        pagination: null
    },

    tags: [],
    messages: [],
    lastNotViewedMessageID: null,
    lessThenMessageId: null,

    newMessage: '',
    cachedNewMessages: {},
    querySearch: '',
    consultantsQuerySearch: '',

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
    currentPanelUserID: null,
    currentAsidePanel: null,
    currentContentPanel: null,

    currentChatTab: messenger.chatTabs.CHAT,
    currentSurveyType: null,

    counts: {
        object: {
            outdated_call_count: 0,
            outdated_call_count_all: 0,
            unread_message_count: 0,
            unread_task_count: 0,
            unread_reminder_count: 0
        },
        request: {
            outdated_call_count: 0,
            outdated_call_count_all: 0,
            unread_message_count: 0,
            unread_task_count: 0,
            unread_reminder_count: 0
        },
        user: {
            outdated_call_count: 0,
            outdated_call_count_all: 0,
            unread_message_count: 0,
            unread_task_count: 0,
            unread_reminder_count: 0
        },
        company: {
            outdated_call_count: 0,
            outdated_call_count_all: 0,
            unread_message_count: 0,
            unread_task_count: 0,
            unread_reminder_count: 0
        }
    },

    loadingChat: false,
    loadingAside: false,
    loadingPanel: false
});

const Messenger = {
    namespaced: true,
    state: getInitialState(),
    mutations: {
        setDialogs(state, dialogs) {
            [state.chatMembersObject, state.chatMembersCompany] = [...dialogs];
        },
        addDialogs(state, { dialogType, dialogs, pagination }) {
            state[`chatMembers${dialogType}`].data.push(...dialogs);
            state[`chatMembers${dialogType}`].pagination = pagination;
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
            } else messages = messagesToSections(value).messages;

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
        updateCurrentPanel(state, value) {
            Object.assign(state.currentPanel, value);
        },
        setCurrentChat(state, value) {
            state.newMessage = '';
            state.currentChat = value;
        },
        addAddition(state, { messageID, additionType, addition }) {
            const currentMessage = state.messages.find(message => message.id === messageID);

            if (currentMessage) currentMessage[`${additionType}s`].push(addition);
        },
        deleteAddition(state, { additionType, messageID, additionID }) {
            const currentMessage = state.messages.find(message => message.id === messageID);

            if (currentMessage) {
                currentMessage[additionType].splice(
                    currentMessage[additionType].findIndex(addition => addition.id === additionID),
                    1
                );
            }
        },
        updateAddition(state, { additionType, messageID, addition }) {
            const currentMessage = state.messages.find(message => message.id === messageID);
            if (currentMessage) {
                currentMessage[additionType][
                    currentMessage[additionType].findIndex(
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
        setStatisticsByModelTypes(state, { modelTypes = [], statistics }) {
            modelTypes.forEach(modelType => {
                state.counts[modelType] = statistics[0];
            });
        },
        clearCountersInterval(state) {
            clearInterval(state.countersInterval);
            state.countersInterval = null;
        },
        setCurrentAsidePanel(state, value) {
            if (messenger.tabsGroups[state.currentAsidePanel] !== messenger.tabsGroups[value]) {
                state.currentAsideDialogID = null;
            }

            state.currentAsidePanel = value;
        },

        onTaskObserved(state, { chatMemberId, modelType }) {
            const chatMemberStateName = 'chatMembers' + ucFirst(modelType);

            const chatMemberIndex = state[chatMemberStateName].data.findIndex(
                element => element.id === chatMemberId
            );

            if (chatMemberIndex !== -1) {
                state[chatMemberStateName].data[chatMemberIndex].statistic.tasks--;
            }

            if (state.counts[modelType].unread_task_count > 0)
                state.counts[modelType].unread_task_count--;
        },
        onMessagesReads(state, messageId) {
            const chatMemberStateName = 'chatMembers' + ucFirst(state.currentDialog.model_type);
            const chatMemberIndex = state[chatMemberStateName].data.findIndex(
                element => element.id === state.currentDialog.id
            );

            if (chatMemberIndex !== -1) {
                const oldNotViewedMessagedCount =
                    state[chatMemberStateName].data[chatMemberIndex].statistic.messages;
                const oldNotViewedNotificationsCount =
                    state[chatMemberStateName].data[chatMemberIndex].statistic.notifications;

                let notViewedMessagesCount = 0;
                let notViewedNotificationsCount = 0;
                for (
                    let i = state.messages.length - 1;
                    i > 0 && state.messages[i].id !== messageId;
                    i--
                ) {
                    if (!state.messages[i].isLabel) {
                        if (!state.messages[i].is_viewed) notViewedMessagesCount++;
                        if (state.messages[i].notifications.length) {
                            notViewedNotificationsCount += state.messages[i].notifications.reduce(
                                (acc, element) => {
                                    if (element.viewed_at === null) acc++;
                                    return acc;
                                },
                                0
                            );
                        }
                    }
                }

                state[chatMemberStateName].data[chatMemberIndex].statistic.messages =
                    notViewedMessagesCount;
                state[chatMemberStateName].data[chatMemberIndex].statistic.notifications =
                    notViewedNotificationsCount;

                const readsCount = oldNotViewedMessagedCount - notViewedMessagesCount;
                const readsNotificationsCount =
                    oldNotViewedNotificationsCount - notViewedNotificationsCount;

                if (
                    state.counts[state.currentDialog.model_type].unread_message_count >= readsCount
                ) {
                    state.counts[state.currentDialog.model_type].unread_message_count -= readsCount;
                }

                if (
                    state.counts[state.currentDialog.model_type].unread_notification_count >=
                    readsNotificationsCount
                ) {
                    state.counts[state.currentDialog.model_type].unread_notification_count -=
                        readsNotificationsCount;
                }
            }
        },
        onMessageDeleted(state, messageId) {
            spliceById(state.messages, messageId);

            for (
                let i = state.messages.length - 1;
                i > 0 && state.messages[i].id !== messageId;
                i--
            ) {
                if (!state.messages[i].isLabel) {
                    if (state.messages[i].reply_to_id === messageId) {
                        state.messages[i].reply_to.deleted_at = dayjs();
                        break;
                    } else if (state.messages[i].id < messageId) break;
                }
            }
        },
        onContactUpdated(state, contact) {
            if (!state.currentPanel) return;

            const contactIndex = state.currentPanel.contacts.findIndex(
                element => element.id === contact.id
            );
            if (contactIndex === -1) return;

            Object.assign(state.currentPanel.contacts[contactIndex], contact);
        },
        onCompanyLogoUpdated(state, { id = null, logo = null }) {
            if (state.currentPanel?.id === id) state.currentPanel.logo = logo;

            const companyIndex = state.chatMembersCompany.data.findIndex(
                element => element.model?.id === id
            );

            if (companyIndex !== -1)
                state.chatMembersCompany.data[companyIndex].model.logo = logo?.src;

            if (
                state.currentDialog?.model_type === messenger.dialogTypes.COMPANY &&
                state.currentDialog.model.id === id
            )
                state.currentDialog.model.logo = logo?.src;
        }
    },
    actions: {
        async updateStatistics({ rootGetters, commit }, modelTypes) {
            const response = await api.messenger.getStatistics(
                [rootGetters.THIS_USER?.chat_member_id],
                modelTypes
            );

            if (response)
                commit('setStatisticsByModelTypes', {
                    modelTypes,
                    statistics: response
                });
        },
        async updateDialogs({ state, commit }, payload) {
            state.loadingAside = true;

            if (isNotNullish(state.querySearch) && isNotEmptyString(state.querySearch)) {
                if (isNumeric(state.querySearch)) {
                    payload.object.object_id = state.querySearch;
                    payload.company.model_id = state.querySearch;
                } else {
                    payload.object.search = state.querySearch;
                    payload.company.search = state.querySearch;
                }
            }

            const chats = await Promise.all([
                api.messenger.getChats({ model_type: 'object', ...payload.object }),
                api.messenger.getChats({ model_type: 'company', ...payload.company })
            ]);

            if (chats) {
                commit('setDialogs', chats);
            }

            state.loadingAside = false;
            return null;
        },
        async updateConsultantsDialogs({ state }, payload) {
            state.loadingAside = true;

            const chats = await api.messenger.getChats({
                model_type: 'user',
                search: state.consultantsQuerySearch?.length ? state.consultantsQuerySearch : null,
                ...payload
            });

            if (chats) {
                state.chatMembersUser = chats;
            }

            state.loadingAside = false;
            return null;
        },
        async selectPanel(
            { commit, state },
            { userID = null, companyID = null, dialogID, dialogType, anywayOpen = false }
        ) {
            if (dialogID === state.currentAsideDialogID && anywayOpen) return;

            commit('setCurrentRecipient', { contact: null });

            if (dialogID === state.currentAsideDialogID) {
                state.currentAsideDialogID = null;
                state.currentPanel = null;
                state.currentPanel = null;
                state.currentPanelID = null;
                state.currentPanelCompanyID = null;
                state.currentPanelUserID = null;
                state.currentDialogType = null;
                return;
            }

            state.loadingPanel = true;

            state.currentPanel = null;

            state.currentAsideDialogID = dialogID;
            state.currentPanelCompanyID = companyID;
            state.currentPanelUserID = userID;
            state.currentDialogType = dialogType;
            state.currentContentPanel = dialogType;

            let data = null;

            if (userID) {
                data = await api.messenger.getUser(userID);
            } else {
                data = await api.messenger.getPanel(companyID);
            }

            state.currentPanel = data;
            state.loadingPanel = false;
        },
        async selectPanelWithoutDialog({ state }, companyID) {
            state.currentPanelID = null;
            state.currentAsideDialogID = null;
            state.currentPanelCompanyID = companyID;
            state.currentDialogType = 'object';

            state.loadingPanel = true;

            state.currentPanel = await api.messenger.getPanel(companyID);

            state.loadingPanel = false;
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

            if (!state.currentAsideDialogID && !state.currentPanelCompanyID) {
                state.currentPanelDialogID = null;
                return;
            }

            if (dialogID === state.currentPanelDialogID && anywayOpen) return;
            if (getters.hasCachedMessage) commit('setCurrentRecipient', { contact: null });

            if (dialogID === state.currentPanelDialogID) {
                state.currentPanelDialogID = null;
                state.currentPinned = null;
                commit('setCurrentChat', false);
                return;
            }

            state.currentCategory = null;
            state.currentDialog = null;
            state.currentDialogType = dialogType;
            state.currentPanelDialogID = dialogID;
            state.lastNotViewedMessageID = null;
            commit('setMessages', []);

            state.loadingChat = true;

            const dialog = await api.messenger.getDialog(dialogID);
            if (!dialog) {
                state.loadingChat = false;
                return false;
            }

            state.currentDialog = dialog;
            state.currentChatTab = messenger.chatTabs.CHAT;

            const [messages, pinned] = await Promise.all([
                api.messenger.getMessages(dialogID),
                api.messenger.getPinned(dialogID)
            ]);

            state.currentPinned = pinned;

            if (messages.length) {
                commit('setMessages', messages);
                state.lessThenMessageId = messages[0].id;
            }

            commit('setCurrentChat', true);
            state.loadingChat = false;
        },
        async selectSurvey({ commit, state }, { dialogID, dialogType }) {
            if (dialogID === state.currentPanelDialogID) {
                state.currentChatTab = messenger.chatTabs.SURVEY;
                return;
            }

            state.currentCategory = null;
            state.currentDialogType = dialogType;
            state.currentPanelDialogID = dialogID;
            state.lastNotViewedMessageID = null;
            commit('setMessages', []);
            state.loadingChat = true;

            const dialog = await api.messenger.getDialog(dialogID);

            commit('setCurrentChat', true);
            state.currentDialog = dialog;
            state.currentChatTab = messenger.chatTabs.SURVEY;
            state.loadingChat = false;
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
                message: message.length ? message : null,
                contact_ids: state.currentRecipient ? [state.currentRecipient.id] : [],
                ...options
            });

            if (response) {
                if (getters.hasCachedMessage)
                    commit('clearCachedMessage', state.currentPanelDialogID);

                response.is_viewed = true;

                commit('addMessages', [response]);
                state.newMessage = null;

                return true;
            }

            notify('Произошла ошибка при отправке сообщения');
            return false;
        },
        async updateMessage(
            { commit, state },
            { id, message = null, tag = null, contact = null, files = [], currentFiles = [] }
        ) {
            const payload = {
                id,
                message,
                files: files,
                current_files: currentFiles.map(element => element.id),
                tag_ids: tag ? [tag] : [],
                contact_ids: contact ? [contact.id] : []
            };

            const updatedMessage = await api.messenger.updateMessage(payload);

            if (updatedMessage) {
                commit('updateMessage', updatedMessage);

                if (state.currentPinned && id === state.currentPinned.id) {
                    state.currentPinned = updatedMessage;
                }

                return true;
            }

            notify('Произошла ошибка при отправке запроса');
            return false;
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
                status: taskOptions.statusTypes.NEW
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
        async getCurrentChatQuizzes({ state }, params = {}) {
            return await api.survey.list({
                chat_member_id: state.currentDialog.id,
                page: params.page ?? 1,
                search: params.search,
                sort: params.sort
            });
        },

        async pinMessage({ state }, message) {
            const pinned = await api.messenger.pinMessage(state.currentDialog.id, message.id);

            if (pinned) {
                state.currentPinned = message;
                return true;
            }

            return false;
        },
        async unpinMessage({ state }) {
            const unpinned = await api.messenger.unpinMessage(state.currentDialog.id);

            if (unpinned) {
                state.currentPinned = null;
                return true;
            }

            return false;
        },
        async pinMessageToObject(context, message) {
            // ONLY TESTING
            context.commit('pinMessageToObject', message.id);
            return true;
        },

        async loadDialogs({ commit, state }, options) {
            const modelTypePlural =
                options.modelType.charAt(0).toUpperCase() + options.modelType.slice(1);

            const data = await api.messenger.getChats({
                model_type: options.modelType,
                page: state[`chatMembers${modelTypePlural}`].pagination.currentPage + 1,
                ...options.payload
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
                state.lessThenMessageId = messages[0].id;
            }

            return messages?.length < 30;
        },
        setCurrentMessageFromCache({ state, commit }) {
            const cachedMessage = state.cachedNewMessages[state.currentPanelDialogID];

            state.newMessage = cachedMessage?.message;
            state.currentCategory = cachedMessage?.tag;
            commit('setCurrentRecipient', { contactID: cachedMessage.contact });
        },
        async readMessages({ commit }, messageID) {
            const reads = await api.messenger.readMessages(messageID);

            if (reads) {
                commit('onMessagesReads', messageID);
                return true;
            }

            return false;
        },
        async fetchTags({ state }) {
            if (state.tags.length) return state.tags;

            const response = await api.messengerTag.list();
            if (response) {
                state.tags = response.data;
                return response.data;
            }

            return null;
        },
        async refreshTags({ state, dispatch }) {
            state.tags = [];
            dispatch('fetchTags');
        },
        async refreshMessages({ state, commit }) {
            const messages = await api.messenger.getMessages(state.currentPanelDialogID);

            if (messages.length) {
                commit('setMessages', messages);
                state.lessThenMessageId = messages[0].id;
            }
        },
        async onSurveyCompleted({ state }, chatMemberId) {
            const dialog = await api.messenger.getDialog(chatMemberId);
            if (!dialog) return;

            const chatMemberStateName = 'chatMembers' + ucFirst(state.currentDialog.model_type);
            const chatMemberIndex = state[chatMemberStateName].data.findIndex(
                element => element.id === chatMemberId
            );

            if (chatMemberIndex !== -1) {
                state[chatMemberStateName].data[chatMemberIndex].last_call = dialog.last_call;
            }

            if (dialog.id === state.currentDialog?.id) {
                state.currentDialog.last_call = dialog.last_call;
            }
        }
    },
    getters: {
        hasQuery(state) {
            return Boolean(state.querySearch.length);
        },
        hasConsultantsQuery(state) {
            return Boolean(state.consultantsQuerySearch.length);
        },
        hasDialogs(state) {
            return Boolean(
                state.chatMembersObject.data.length || state.chatMembersCompany.data.length
            );
        },
        hasCachedMessage(state) {
            return state.currentChat && state.currentPanelDialogID in state.cachedNewMessages;
        },
        currentDaysCountAfterLastCall(state) {
            if (!state.currentDialog) return null;
            let daysFromNow = 0;

            if (state.currentDialog.last_call)
                daysFromNow = dayjs().diff(state.currentDialog.last_call.created_at, 'day');
            else {
                if (state.currentDialog.model_type === 'object')
                    daysFromNow = dayjs().diff(
                        state.currentDialog.model.object.last_update * 1000,
                        'day'
                    );
                else if (state.currentDialog.model_type === 'request')
                    daysFromNow = dayjs().diff(state.currentDialog.model.updated_at, 'day');
                else if (state.currentDialog.model_type === 'company')
                    daysFromNow = dayjs().diff(state.currentDialog.model.updated_at, 'day');
            }

            return daysFromNow;
        },
        currentChatHasLastCall(state) {
            return state.currentDialog?.last_call != null;
        }
    }
};

export default Messenger;
