import { hasInjectionContext, inject, provide } from 'vue';
import { useStore } from 'vuex';
import { useNotify } from '@/utils/use/useNotify.js';
import { useTaskManager } from '@/composables/useTaskManager.js';
import { messenger } from '@/const/messenger.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { isNotEmptyString } from '@/utils/helpers/string/isNotEmptyString.js';
import { getObjectMbUniqueAddress } from '@/utils/formatters/models/object.js';
import { isEmpty } from '@/utils/helpers/common/isEmpty.js';
import { getCompanyName, getCompanyShortName } from '@/utils/formatters/models/company.js';
import dayjs from 'dayjs';
import api from '@/api/api.js';

const CREATE_TASK_INJECTION_KEY = Symbol('$createTask');

const SCHEDULING_CALL_DURATION = 7; // days

export function createMessengerChatContext() {
    const store = useStore();
    const notify = useNotify();
    const { createTaskWithTemplate } = useTaskManager();

    function generateTaskTemplate() {
        const dialogType = store.state.Messenger.currentDialogType;
        const dialog = store.state.Messenger.currentDialog;

        let customDescription = false;
        let message = '';
        let userId = store.getters.moderator?.id;

        const additionalContent = {
            modelType: dialogType
        };

        switch (dialogType) {
            case messenger.dialogTypes.OBJECT: {
                const object = dialog.model.object;
                const messageTemplate = [`ID ${object.id}`];

                customDescription = true;

                if (isNotNullish(object.address) && isNotEmptyString(object.address)) {
                    additionalContent.address = object.address;
                    messageTemplate.push(getObjectMbUniqueAddress(object.address));
                }

                additionalContent.companyId = object.company_id;
                additionalContent.objectId = object.id;
                additionalContent.area = object.area_floor_full || object.area_building;

                if (isNotNullish(additionalContent.area) && !isEmpty(additionalContent.area)) {
                    messageTemplate.push(`${additionalContent.area} м2`);
                }

                message = messageTemplate.join(', ') + ', ';

                if (object.consultant) {
                    userId = object.consultant.id;
                }

                break;
            }
            case messenger.dialogTypes.COMPANY: {
                const company = dialog.model;
                const messageTemplate = [`Компания ${getCompanyShortName(company)}`];

                customDescription = true;

                additionalContent.address = company.legal_address || company.office_address;
                additionalContent.companyName = getCompanyName(company);

                message = messageTemplate.join(', ') + ', ';

                if (company.consultant_id) {
                    userId = company.consultant_id;
                }

                break;
            }
            case messenger.dialogTypes.USER:
                userId = dialog.model_id;

                break;
        }

        return {
            message,
            end: dayjs().add(SCHEDULING_CALL_DURATION, 'day').toDate(),
            customDescription,
            additionalContent,
            user_id: userId
        };
    }

    async function createTaskForMessage(messageId) {
        const taskPayload = await createTaskWithTemplate(generateTaskTemplate());

        if (!taskPayload) return;

        const task = await api.task.createFromMessage(messageId, taskPayload);

        if (task) {
            notify.success('Задача успешно создана!');
            store.commit('Messenger/addAddition', {
                additionType: 'task',
                addition: task,
                messageID: messageId
            });
        }

        return task;
    }

    provide(CREATE_TASK_INJECTION_KEY, createTaskForMessage);

    return { createTaskForMessage };
}

export function useMessengerChatContext() {
    if (hasInjectionContext()) {
        return {
            createTaskForMessage: inject(CREATE_TASK_INJECTION_KEY)
        };
    }

    console.warn(
        '[Messenger] Are you trying to use Messenger outside the context of the application'
    );
}
