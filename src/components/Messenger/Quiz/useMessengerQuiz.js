import api from '@/api/api.js';
import { useAuth } from '@/composables/useAuth.js';
import { useStore } from 'vuex';
import dayjs from 'dayjs';
import { taskOptions } from '@/const/options/task.options.js';
import { getContactFullName } from '@/utils/formatters/models/contact.js';
import { isNotEmptyString } from '@/utils/helpers/string/isNotEmptyString.js';
import { capitalizeString } from '@/utils/helpers/string/capitalizeString.js';
import { messenger, messengerTemplates, objectChatMemberTypes } from '@/const/messenger.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';

export const CONTACT_CALL_ACTIONS = {
    DELETE: 1,
    MOVE: 2
};

export const CONTACT_CALL_REASONS = {
    NO_ANSWER: 1,
    NOT_AVAILABLE: 2,
    BLOCKED: 3
};

export const CALL_TYPES = {
    OUTGOING: 0,
    INCOMING: 1
};

export const CALL_STATUSES = {
    MISSED: 0,
    COMPLETED: 1,
    BUSY: 2,
    NOT_AVAILABLE: 3,
    REJECTED: 4,
    ANGY: 5,
    BLOCKED: 6
};

export const CALL_STATUSES_TEXT = {
    [CALL_STATUSES.MISSED]: 'Клиент не взял трубку',
    [CALL_STATUSES.COMPLETED]: 'Клиент ответил',
    [CALL_STATUSES.BUSY]: 'Телефон занят',
    [CALL_STATUSES.NOT_AVAILABLE]: 'Телефон недоступен',
    [CALL_STATUSES.REJECTED]: 'Вызов отклонен',
    [CALL_STATUSES.ANGY]: 'Клиент отказался отвечать',
    [CALL_STATUSES.BLOCKED]: 'Телефон заблокирован'
};

const DELETE_CONTACT_TASK_DURATION = 3;

export function useMessengerQuiz() {
    const store = useStore();
    const { currentUserId } = useAuth();

    async function createSurvey(contact, answers, chatMemberId = null, retry = 3) {
        const createdSurvey = await api.survey.create({
            contact_id: contact.id,
            user_id: currentUserId.value,
            chat_member_id: chatMemberId ?? store.state.Messenger.currentDialog.id,
            question_answers: answers
        });

        if (createdSurvey) return createdSurvey;

        if (retry > 0) return await createSurvey(contact, answers, chatMemberId, retry - 1);

        return null;
    }

    async function findSurveyMessage(surveyId, toChatMemberId) {
        const { data: messages } = await api.messenger.getMessagesByQuery({
            to_chat_member_id: toChatMemberId,
            survey_id: surveyId
        });

        if (messages.length > 0) return messages[0];
        return null;
    }

    function generateTaskPayload(message, description = '', surveyId = null, userId = null) {
        return {
            start: dayjs().toDate(),
            end: dayjs().add(DELETE_CONTACT_TASK_DURATION, 'day').toDate(),
            user_id: userId ?? store.getters.moderator?.id,
            message:
                message +
                (isNotNullish(description) && isNotEmptyString(description)
                    ? `. ${capitalizeString(description)}`
                    : ''),
            status: taskOptions.statusTypes.NEW,
            observer_ids: [],
            tag_ids: [],
            survey_id: surveyId
        };
    }

    function getCallStatusForUnavailableReason(reason) {
        switch (reason) {
            case CONTACT_CALL_REASONS.NO_ANSWER:
                return CALL_STATUSES.MISSED;
            case CONTACT_CALL_REASONS.NOT_AVAILABLE:
                return CALL_STATUSES.NOT_AVAILABLE;
            case CONTACT_CALL_REASONS.BLOCKED:
                return CALL_STATUSES.BLOCKED;
            default:
                return CALL_STATUSES.COMPLETED;
        }
    }

    async function createCallsWithContacts(contacts, chatMemberId) {
        const payloads = contacts.map(element => {
            return {
                contact_id: element.entity.id,
                user_id: currentUserId.value,
                status: element.form.available
                    ? CALL_STATUSES.COMPLETED
                    : getCallStatusForUnavailableReason(element.form.reason),
                type: CALL_TYPES.OUTGOING
            };
        });

        return await Promise.allSettled(
            payloads.map(payload => api.call.createForChatMember(chatMemberId, payload))
        );
    }

    function contactMustBeDeleted(contact) {
        return (
            (contact.form.available && contact.form.action === CONTACT_CALL_ACTIONS.DELETE) ||
            (!contact.form.available && contact.form.reason === CONTACT_CALL_REASONS.BLOCKED)
        );
    }

    function contactMustBeMoved(contact) {
        return contact.form.available && contact.form.action === CONTACT_CALL_ACTIONS.MOVE;
    }

    async function createPotentialTasks(contacts, messageId, surveyId = null) {
        const payloads = contacts.reduce((acc, element) => {
            if (contactMustBeDeleted(element)) {
                acc.push({
                    contactId: element.entity.id,
                    payload: generateTaskPayload(
                        `Удалить контакт ${getContactFullName(element.entity)} (#${element.entity.id})`,
                        element.form.description,
                        surveyId
                    )
                });
            } else if (contactMustBeMoved(element)) {
                acc.push({
                    contactId: element.entity.id,
                    payload: generateTaskPayload(
                        `Перенести контакт ${getContactFullName(element.entity)} (#${element.entity.id})`,
                        element.form.description,
                        surveyId
                    )
                });
            }

            return acc;
        }, []);

        if (payloads.length > 0) {
            return await api.messenger.createTasks(
                messageId,
                payloads.map(element => element.payload)
            );
        }

        return [];
    }

    async function createScheduledCallTasks(contacts, messageId, surveyId = null) {
        return await api.messenger.createTasks(
            messageId,
            contacts.map(element => ({ ...element.payload, survey_id: surveyId }))
        );
    }

    async function sendMessageWithRetrying(chatMemberId, messagePayload, retry = 3) {
        const createdMessage = await api.messenger.sendMessage(chatMemberId, messagePayload);
        if (createdMessage) return createdMessage;
        if (retry > 0)
            return await sendMessageWithRetrying(chatMemberId, messagePayload, retry - 1);
        return null;
    }

    async function sendMessageAboutSurveyIsUnavailable(chatMemberId, contacts) {
        const messagePayload = {
            message: 'Не удалось дозвониться до контактов опросника',
            template: messengerTemplates.UNAVAILABLE_SURVEY,
            contact_ids: contacts.map(element => element.entity.id)
        };

        return await sendMessageWithRetrying(chatMemberId, messagePayload);
    }

    async function createRelatedSurveys(contact, payload) {
        const formattedPayload = Object.keys(payload).map(key => {
            return {
                objectId: key,
                answers: Object.keys(payload[key].answer).map(answerKey => ({
                    question_answer_id: answerKey,
                    value: payload[key].answer[answerKey]
                }))
            };
        });

        const chatMembers = await api.messenger.getChats({
            object_ids: formattedPayload.map(element => element.objectId),
            model_type: messenger.dialogTypes.OBJECT,
            company_id: contact.company_id,
            type: objectChatMemberTypes.RENT_OR_SALE
        });

        const chatMembersMap = chatMembers.data.reduce((acc, element) => {
            acc[element.model.object_id] = element.id;
            return acc;
        }, {});

        const preparedPayload = formattedPayload.reduce((acc, element) => {
            if (chatMembersMap[element.objectId]) {
                acc.push({
                    chatMemberId: chatMembersMap[element.objectId],
                    answers: element.answers
                });
            }

            return acc;
        }, []);

        await Promise.allSettled(
            preparedPayload.map(element =>
                createSurvey(contact, element.answers, element.chatMemberId)
            )
        );
    }

    return {
        createSurvey,
        findSurveyMessage,
        createPotentialTasks,
        createCallsWithContacts,
        createScheduledCallTasks,
        sendMessageAboutSurveyIsUnavailable,
        createRelatedSurveys
    };
}
