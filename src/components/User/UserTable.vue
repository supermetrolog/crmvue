<template>
    <div class="users-table">
        <Table>
            <template #thead>
                <Tr>
                    <Th></Th>
                    <Th>Фамилия/Имя</Th>
                    <Th>Контакты</Th>
                    <Th>Роль</Th>
                    <Th>Username</Th>
                    <Th>Добавочный</Th>
                    <Th>Дата создания</Th>
                    <Th>Дата обновления</Th>
                    <Th>Действия</Th>
                </Tr>
            </template>
            <template #tbody>
                <Tr v-for="user in users" :key="user.id">
                    <Td class="avatar-container">
                        <Avatar class="mx-auto" :size="70" :src="user.userProfile.avatar" />
                    </Td>
                    <Td class="text-left">
                        {{ user.userProfile.middle_name }}
                        {{ user.userProfile.first_name }}
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
                        <p
                            v-if="
                                user.userProfile.phones.length === 0 &&
                                user.userProfile.emails.length === 0
                            "
                        >
                            &#8212;
                        </p>
                    </Td>
                    <Td>
                        <p>{{ role(user.role) }}</p>
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
                        {{ user.created_at_format }}
                    </Td>
                    <Td class="date">
                        {{ user.updated_at_format }}
                    </Td>
                    <Td class="action">
                        <div class="d-flex gap-2 flex-wrap">
                            <HoverActionsButton
                                @click="$emit('edit', user)"
                                label="Редактировать"
                                class="mb-1"
                            >
                                <i class="fas fa-pen"></i>
                            </HoverActionsButton>
                            <HoverActionsButton
                                @click="$emit('show-sessions', user.id)"
                                label="Управлять сессиями"
                            >
                                <i class="fa-solid fa-shield-halved"></i>
                            </HoverActionsButton>
                            <HoverActionsButton @click="deleteUser(user)" label="Удалить">
                                <i class="fas fa-trash-alt"></i>
                            </HoverActionsButton>
                        </div>
                    </Td>
                </Tr>
            </template>
        </Table>
    </div>
</template>

<script setup>
import Table from '@/components/common/Table/Table.vue';
import Tr from '@/components/common/Table/Tr.vue';
import Th from '@/components/common/Table/Th.vue';
import Td from '@/components/common/Table/Td.vue';
import Avatar from '@/components/common/Avatar.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import { shallowRef } from 'vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { userOptions } from '@/const/options/user.options.js';
import api from '@/api/api.js';

const emit = defineEmits(['deleted', 'edit', 'show-sessions']);
defineProps({
    users: {
        type: Array,
        default: () => []
    }
});

const { confirm } = useConfirm();

const isLoading = shallowRef(false);

const role = _role => userOptions.role[_role];

const deleteUser = async user => {
    const confirmed = await confirm(
        `Вы уверены, что хотите удалить пользователя "${user.userProfile.first_name} ${user.userProfile.middle_name}" (Username: ${user.username})?`
    );
    if (!confirmed) return;

    isLoading.value = true;
    const deleted = api.user.delete(user.id);
    if (deleted) emit('deleted');
    isLoading.value = false;
};
</script>
