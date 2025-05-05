<template>
    <div class="messenger-dialog messenger-dialog-user" :class="{ current: current }">
        <div class="messenger-dialog__body messenger-dialog-user__body">
            <div class="messenger-dialog-user__preview">
                <Avatar :src="model.userProfile.avatar" />
            </div>
            <div class="messenger-dialog-user__description">
                <p class="messenger-dialog-user__name">{{ model.userProfile.medium_name }}</p>
                <p class="messenger-dialog-user__role">{{ role }}</p>
            </div>
        </div>
        <div class="messenger-dialog__footer">
            <MessengerDialogFunctions v-if="statistic" :counts="statistic" />
        </div>
        <MessengerDialogLastMessage v-if="lastMessage" :last-message />
    </div>
</template>
<script setup>
import MessengerDialogFunctions from '@/components/Messenger/Dialog/MessengerDialogFunctions.vue';
import { computed } from 'vue';
import Avatar from '@/components/common/Avatar.vue';
import { userOptions } from '@/const/options/user.options.js';
import MessengerDialogLastMessage from '@/components/Messenger/Dialog/MessengerDialogLastMessage.vue';

const props = defineProps({
    model: {
        type: Object,
        required: true
    },
    current: Boolean,
    statistic: Object,
    lastMessage: Object
});

const role = computed(() => userOptions.role[props.model.role]);
</script>
