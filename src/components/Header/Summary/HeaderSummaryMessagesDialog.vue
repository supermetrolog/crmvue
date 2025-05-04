<template>
    <component
        :is="dialogComponent"
        :model="dialog.model"
        :statistic="dialog.statistic"
        :last-message="dialog.last_message"
        :current
    />
</template>
<script setup>
import { computed } from 'vue';
import MessengerDialogCompany from '@/components/Messenger/Dialog/Company/MessengerDialogCompany.vue';
import { messenger } from '@/const/messenger.js';
import MessengerDialogUser from '@/components/Messenger/Dialog/MessengerDialogUser.vue';
import MessengerDialogObject from '@/components/Messenger/Dialog/Object/MessengerDialogObject.vue';
import MessengerDialogRequest from '@/components/Messenger/Dialog/MessengerDialogRequest.vue';

const props = defineProps({
    dialog: {
        type: Object,
        required: true
    },
    current: Boolean
});

const componentsMap = {
    [messenger.dialogTypes.COMPANY]: MessengerDialogCompany,
    [messenger.dialogTypes.USER]: MessengerDialogUser,
    [messenger.dialogTypes.OBJECT]: MessengerDialogObject,
    [messenger.dialogTypes.REQUEST]: MessengerDialogRequest
};

const dialogComponent = computed(() => {
    return componentsMap[props.dialog.model_type];
});
</script>
