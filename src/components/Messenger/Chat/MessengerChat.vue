<template>
    <div class="messenger-column">
        <AnimationTransition :speed="0.5">
            <component :is="currentMessengerChatComponent" />
        </AnimationTransition>
    </div>
</template>
<script setup>
import { messenger } from '@/const/messenger.js';
import { computed, provide } from 'vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import MessengerChatForObject from '@/components/Messenger/Chat/MessengerChatForObject.vue';
import MessengerChatForUser from '@/components/Messenger/Chat/MessengerChatForUser.vue';
import dayjs from 'dayjs';
import api from '@/api/api.js';
import { useTaskManager } from '@/composables/useTaskManager.js';
import { useStore } from 'vuex';
import { useNotify } from '@/utils/use/useNotify.js';
import { getCompanyName, getCompanyShortName } from '@/utils/formatters/models/company.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { isNotEmptyString } from '@/utils/helpers/string/isNotEmptyString.js';
import { getObjectMbUniqueAddress } from '@/utils/formatters/models/object.js';
import { isEmpty } from '@/utils/helpers/common/isEmpty.js';

const SCHEDULING_CALL_DURATION = 7; // days

const props = defineProps({
    currentTab: {
        type: Object,
        default: null
    }
});

const store = useStore();
const notify = useNotify();
const { createTaskWithTemplate } = useTaskManager();

const currentMessengerChatComponent = computed(() => {
    if (props.currentTab.name === messenger.tabs.USERS) return MessengerChatForUser;
    else return MessengerChatForObject;
});

const generateTemplate = () => {
    const dialogType = store.state.Messenger.currentDialogType;
    const dialog = store.state.Messenger.currentDialog;
    let customDescription = false;
    let message = '';

    const additionalContent = {
        modelType: dialogType
    };

    if (dialogType === messenger.dialogTypes.OBJECT) {
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
    } else if (dialogType === messenger.dialogTypes.COMPANY) {
        const company = dialog.model;
        const messageTemplate = [`Компания ${getCompanyShortName(company)}`];

        customDescription = true;

        additionalContent.address = company.legal_address || company.office_address;
        additionalContent.companyName = getCompanyName(company);

        message = messageTemplate.join(', ') + ', ';
    }

    return {
        message,
        end: dayjs().add(SCHEDULING_CALL_DURATION, 'day').toDate(),
        customDescription,
        additionalContent
    };
};

async function createTask(messageId) {
    const taskPayload = await createTaskWithTemplate(generateTemplate());

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

provide('$createTask', createTask);
</script>
