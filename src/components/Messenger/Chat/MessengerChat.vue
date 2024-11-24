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
import { useNotify } from '@/utils/useNotify.js';
import { getCompanyName } from '@/utils/formatter.js';

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

    const additionalContent = {
        modelType: dialogType
    };

    if (dialogType === messenger.dialogTypes.OBJECT) {
        customDescription = true;

        additionalContent.address = dialog.model.object.address;
        additionalContent.companyId = dialog.model.object.company_id;
        additionalContent.area =
            dialog.model.object.area_floor_full || dialog.model.object.area_building;
    } else if (dialogType === messenger.dialogTypes.COMPANY) {
        customDescription = true;

        additionalContent.address = dialog.model.legal_address || dialog.model.office_address;
        additionalContent.companyName = getCompanyName(dialog.model);
    }

    return {
        message: '',
        end: dayjs().add(SCHEDULING_CALL_DURATION, 'day').toDate(),
        customDescription,
        additionalContent
    };
};

const createTask = async messageId => {
    const taskPayload = await createTaskWithTemplate(generateTemplate());

    if (!taskPayload) return;

    const task = await api.task.createFromMessage(messageId, taskPayload);

    if (task) notify.success('Задача успешно создана!');

    return task;
};

provide('$createTask', createTask);
</script>
