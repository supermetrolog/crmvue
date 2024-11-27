<template>
    <Tr class="users-table__element">
        <Td class="avatar-container">
            <Avatar class="mx-auto" :size="70" :src="user.userProfile.avatar" />
        </Td>
        <Td class="text-left">
            {{ user.userProfile.medium_name }}
        </Td>
        <Td>
            <div>
                <PhoneNumber
                    v-for="phone in user.userProfile.phones"
                    :key="phone.id"
                    :phone="phone"
                    class="d-block"
                />
                <a
                    v-for="email in user.userProfile.emails"
                    :key="email.id"
                    :href="'mailto:' + email.email"
                    class="d-block"
                >
                    {{ email.email }}
                </a>
            </div>
            <p v-if="!user.userProfile.phones.length && !user.userProfile.emails.length">&#8212;</p>
        </Td>
        <Td>
            <p>{{ role }}</p>
        </Td>
        <Td>
            <p>{{ user.username }}</p>
        </Td>
        <Td>
            <span v-if="user.userProfile.caller_id" class="square-badge">
                {{ user.userProfile.caller_id }}
            </span>
            <p v-else>&#8212;</p>
        </Td>
        <Td class="date">
            {{ createdAt }}
        </Td>
        <Td class="date">
            {{ updatedAt }}
        </Td>
        <Td class="action">
            <div class="d-flex gap-2 flex-wrap">
                <HoverActionsButton v-if="isActive" @click="$emit('archive')" label="Архивировать">
                    <i class="fa-solid fa-user-slash"></i>
                </HoverActionsButton>
                <HoverActionsButton v-else @click="$emit('restore')" label="Восстановить">
                    <i class="fas fa-rotate-left"></i>
                </HoverActionsButton>
                <HoverActionsButton @click="$emit('edit')" label="Редактировать">
                    <i class="fas fa-pen"></i>
                </HoverActionsButton>
                <HoverActionsButton @click="$emit('show-sessions')" label="Управлять сессиями">
                    <i class="fa-solid fa-shield-halved"></i>
                </HoverActionsButton>
                <HoverActionsButton @click="$emit('delete')" label="Удалить">
                    <i class="fas fa-trash-alt"></i>
                </HoverActionsButton>
            </div>
        </Td>
    </Tr>
</template>

<script setup>
import Tr from '@/components/common/Table/Tr.vue';
import Td from '@/components/common/Table/Td.vue';
import Avatar from '@/components/common/Avatar.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import { computed } from 'vue';
import { userOptions } from '@/const/options/user.options.js';
import { toDateFormat } from '@/utils/formatters/date.js';

defineEmits(['delete', 'edit', 'show-sessions', 'restore', 'archive']);
const props = defineProps({
    user: {
        type: Object,
        required: true
    }
});

const role = computed(() => userOptions.role[props.user.role]);
const isActive = computed(() => props.user.status === userOptions.statusStatement.ACTIVE);

const createdAt = computed(() => toDateFormat(props.user.created_at * 1000));
const updatedAt = computed(() => toDateFormat(props.user.updated_at * 1000));
</script>
