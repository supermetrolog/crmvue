import api from '@/api/api.js';
import { useAuth } from '@/composables/useAuth.js';
import { useStore } from 'vuex';
import dayjs from 'dayjs';
import { taskOptions } from '@/const/options/task.options.js';
import { getContactFullName } from '@/utils/formatters/models/contact.js';
import { isNotEmptyString } from '@/utils/helpers/string/isNotEmptyString.js';
import { capitalizeString } from '@/utils/helpers/string/capitalizeString.js';
import { messenger, messengerTemplates } from '@/const/messenger.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';

export const CONTACT_CALL_ACTIONS = {
    DELETE: 1,
    MOVE: 2
};

export const CONTACT_CALL_REASONS = {
    AVAILABLE: 1,
    DELETE: 2,
    MOVE: 3,
    BUSY: 4
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

    function generateTaskPayload(message, description = '', surveyId = null, userId = null) {
        return {
            start: dayjs().toDate(),
            end: dayjs().add(DELETE_CONTACT_TASK_DURATION, 'day').toDate(),
            user_id: userId ?? store.getters.moderator?.id,
            title: message,
            message:
                isNotNullish(description) && isNotEmptyString(description)
                    ? capitalizeString(description)
                    : null,
            status: taskOptions.statusTypes.NEW,
            observer_ids: [],
            tag_ids: [],
            survey_id: surveyId
        };
    }

    function getCallStatusByForm(form) {
        if (form.available) {
            return CALL_STATUSES.COMPLETED;
        } else {
            return form.reason === 4 ? CALL_STATUSES.MISSED : CALL_STATUSES.NOT_AVAILABLE;
        }
    }

    async function createCallsWithContacts(contacts, chatMemberId) {
        const payloads = contacts.map(element => {
            return {
                contact_id: element.entity.id,
                user_id: currentUserId.value,
                status: getCallStatusByForm(element.form),
                type: CALL_TYPES.OUTGOING
            };
        });

        return await Promise.allSettled(
            payloads.map(payload => api.call.createForChatMember(chatMemberId, payload))
        );
    }

    function contactMustBeDeleted(contact) {
        return contact.form.reason === CONTACT_CALL_REASONS.DELETE;
    }

    function contactMustBeMoved(contact) {
        return contact.form.reason === CONTACT_CALL_REASONS.MOVE;
    }

    async function createPotentialTasks(contacts, messageId, surveyId = null) {
        const payloads = contacts.reduce((acc, element) => {
            if (contactMustBeDeleted(element)) {
                acc.push({
                    contactId: element.entity.id,
                    payload: generateTaskPayload(
                        `Удалить контакт ${getContactFullName(element.entity)} (компания #${element.entity.company_id})`,
                        element.form.description,
                        surveyId
                    )
                });
            } else if (contactMustBeMoved(element)) {
                acc.push({
                    contactId: element.entity.id,
                    payload: generateTaskPayload(
                        `Перенести контакт ${getContactFullName(element.entity)} (компания #${element.entity.company_id})`,
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

    async function sendMessageAboutSurveyIsUnavailable(chatMemberId, contacts) {
        const messagePayload = {
            message: 'Не удалось дозвониться до контактов опросника',
            template: messengerTemplates.UNAVAILABLE_SURVEY,
            contact_ids: contacts.map(element => element.entity.id)
        };

        return await api.messenger.sendMessage(chatMemberId, messagePayload);
    }

    async function createRelatedSurveys(contact, calls, payload, relatedSurvey) {
        const payloadWithAnswers = payload.filter(offer => offer.answer === 1);
        const payloadWithoutUpdates = payload.filter(offer => offer.answer === 3);

        const chatMembers = await api.messenger.getChats({
            object_ids: payload.map(element => element.object_id),
            model_type: messenger.dialogTypes.OBJECT,
            company_id: contact.company_id
        });

        const chatMembersMap = chatMembers.data.reduce((acc, element) => {
            if (acc[element.model.object_id]) acc[element.model.object_id].push(element.id);
            else acc[element.model.object_id] = [element.id];

            return acc;
        }, {});

        const payloadWithAnswersForm = payloadWithAnswers.reduce((acc, element) => {
            if (chatMembersMap[element.object_id]) {
                acc.push(
                    ...chatMembersMap[element.object_id].map(chatMemberId => ({
                        chatMemberId: chatMemberId,
                        answers: element.form.map(form => ({
                            question_answer_id: form.question_answer_id,
                            value: form.value,
                            files: form.files,
                            file: form.file
                        }))
                    }))
                );
            }

            return acc;
        }, []);

        const payloadWithoutUpdatesForm = payloadWithoutUpdates.reduce((acc, element) => {
            if (chatMembersMap[element.object_id]) {
                acc.push(...chatMembersMap[element.object_id]);
            }

            return acc;
        }, []);

        await Promise.allSettled(
            payloadWithAnswersForm.map(element =>
                createSurvey({
                    contact_id: contact.id,
                    user_id: currentUserId.value,
                    chat_member_id: element.chatMemberId,
                    question_answers: element.answers,
                    related_survey_id: relatedSurvey.id,
                    call_ids: calls.map(call => call.id)
                })
            )
        );

        await Promise.allSettled(
            payloadWithoutUpdatesForm.map(element =>
                createSurvey({
                    contact_id: contact.id,
                    user_id: currentUserId.value,
                    chat_member_id: element,
                    related_survey_id: relatedSurvey.id,
                    call_ids: calls.map(call => call.id)
                })
            )
        );
    }

    return {
        createSurvey,
        findSurveyMessage,
        createPotentialTasks,
        createCallsWithContacts,
        sendMessageAboutSurveyIsUnavailable,
        createRelatedSurveys
    };
}
