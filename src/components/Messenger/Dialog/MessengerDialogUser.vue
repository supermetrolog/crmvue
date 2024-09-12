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
    </div>
</template>
<script setup>
import MessengerDialogFunctions from '@/components/Messenger/Dialog/MessengerDialogFunctions.vue';
import { computed } from 'vue';
import Avatar from '@/components/common/Avatar.vue';
import { userOptions } from '@/const/options/user.options.js';

const props = defineProps({
    model: {
        type: Object,
        required: true
    },
    current: {
        type: Boolean,
        default: false
    },
    statistic: {
        type: Object,
        default: null
    }
});

const role = computed(() => userOptions.beautifulRole[props.model.role]);
</script>
