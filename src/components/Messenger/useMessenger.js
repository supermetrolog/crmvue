import { hasInjectionContext, inject, provide, shallowRef } from 'vue';
import { captureException } from '@sentry/vue';

const OPEN_MESSENGER_CHAT_INJECTION_KEY = '$openMessengerChat';
const OPEN_CHAT_INJECTION_KEY = '$openChat';
const OPEN_CHAT_BY_USER_ID_INJECTION_KEY = '$openChatByUserId';
const OPEN_CHAT_BY_COMPANY_ID_INJECTION_KEY = '$openChatByCompanyId';
const OPEN_CHAT_BY_ID_INJECTION_KEY = '$openChatById';
const OPEN_SURVEY_INJECTION_KEY = '$openSurvey';

export function createMessengerContext(element) {
    const isOpening = shallowRef(false);

    function createOpenHandler(handler) {
        return async (...props) => {
            isOpening.value = true;

            let isOpened = false;

            try {
                isOpened = await handler(...props);
            } catch (e) {
                captureException(e);
            } finally {
                isOpening.value = false;
            }

            return isOpened;
        };
    }

    const openChatByUserId = createOpenHandler((...args) =>
        element.value.openChatByUserID(...args)
    );
    const openChatByCompanyId = createOpenHandler((...args) =>
        element.value.openChatByCompanyID(...args)
    );
    const openChatById = createOpenHandler((...args) => element.value.openChatByID(...args));
    const openChat = createOpenHandler((...args) => element.value.openChat(...args));
    const openSurvey = createOpenHandler((...args) => element.value.openSurvey(...args));

    provide(
        OPEN_MESSENGER_CHAT_INJECTION_KEY,
        async ({
            companyID = null,
            objectID = null,
            chatMemberID = null,
            modelType = 'object',
            userID = null
        }) => {
            if (chatMemberID) return await openChatById(chatMemberID);
            else if (companyID !== null && objectID === null) return openChatByCompanyId(companyID);
            else if (userID !== null) {
                return await openChatByUserId(userID);
            } else {
                return await openChat(companyID, objectID, modelType);
            }
        }
    );

    provide(OPEN_CHAT_INJECTION_KEY, openChat);
    provide(OPEN_CHAT_BY_USER_ID_INJECTION_KEY, openChatByUserId);
    provide(OPEN_CHAT_BY_ID_INJECTION_KEY, openChatById);
    provide(OPEN_CHAT_BY_COMPANY_ID_INJECTION_KEY, openChatByCompanyId);
    provide(OPEN_SURVEY_INJECTION_KEY, openSurvey);

    return { isOpening };
}

export function useMessenger() {
    if (hasInjectionContext()) {
        return {
            openChat: inject(OPEN_CHAT_INJECTION_KEY),
            openChatById: inject(OPEN_CHAT_BY_ID_INJECTION_KEY),
            openChatByCompanyId: inject(OPEN_CHAT_BY_COMPANY_ID_INJECTION_KEY),
            openChatByUserId: inject(OPEN_CHAT_BY_USER_ID_INJECTION_KEY),
            openMessenger: inject(OPEN_MESSENGER_CHAT_INJECTION_KEY),
            openSurvey: inject(OPEN_SURVEY_INJECTION_KEY)
        };
    }

    console.warn(
        '[Messenger] Are you trying to use Messenger outside the context of the application'
    );
}
