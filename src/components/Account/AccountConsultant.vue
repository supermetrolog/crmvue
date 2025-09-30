<template>
    <div class="account-consultant account-section">
        <Avatar class="account-consultant__avatar" :size :src="user.userProfile.avatar" />
        <div class="account-consultant__body">
            <p class="account-consultant__title">
                <span class="account-consultant__username">{{ user.userProfile.medium_name }}</span>
                <span class="account-consultant__role">{{ userRole }}</span>
            </p>
            <p v-if="showContacts" class="account-consultant__contacts">
                <span v-if="user.userProfile.emails?.length">{{ emails }}, </span>
                <span v-else class="account-consultant__helper">Email не указан, </span>
                <span v-if="user.userProfile.phones?.length">{{ phones }}</span>
                <span v-else class="account-consultant__helper">телефон не указан</span>
            </p>
            <div>
                <slot />
            </div>
            <div class="account-consultant__actions">
                <UiButton v-if="canEdit" @click="$emit('edit')" small>Редактировать</UiButton>
            </div>
        </div>
    </div>
</template>
<script setup>
import Avatar from '@/components/common/Avatar.vue';
import { RoleList } from '@/const/const';
import { computed } from 'vue';
import UiButton from '@/components/common/UI/UiButton.vue';

defineEmits(['edit']);
const props = defineProps({
    user: {
        type: Object,
        required: true
    },
    canEdit: {
        type: Boolean,
        default: false
    },
    size: {
        type: Number,
        default: 120
    },
    showContacts: Boolean
});

const userRole = computed(() => RoleList[props.user.role]);
const emails = computed(() => props.user.userProfile.emails.map(el => el.email).join(', '));
const phones = computed(() => props.user.userProfile.phones.map(el => el.phone).join(', '));
</script>
