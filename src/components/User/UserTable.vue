<template>
    <div class="users-table">
        <Loader v-if="isLoading" />
        <Table shadow>
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
                <UserTableElement
                    v-for="user in users"
                    :key="user.id"
                    @delete="deleteUser(user)"
                    @show-sessions="$emit('show-sessions', user.id)"
                    @edit="$emit('edit', user)"
                    @restore="restore(user)"
                    @archive="archive(user)"
                    :class="{
                        'users-table__element--archived': archivedCache[user.id],
                        'users-table__element--restored': restoredCache[user.id]
                    }"
                    :user="user"
                    class="users-table__element"
                />
            </template>
        </Table>
    </div>
</template>

<script setup>
import Table from '@/components/common/Table/Table.vue';
import Tr from '@/components/common/Table/Tr.vue';
import Th from '@/components/common/Table/Th.vue';
import { ref, shallowRef, watch } from 'vue';
import { useConfirm } from '@/composables/useConfirm.js';
import api from '@/api/api.js';
import Loader from '@/components/common/Loader.vue';
import UserTableElement from '@/components/User/UserTableElement.vue';

const emit = defineEmits(['deleted', 'edit', 'show-sessions', 'archived', 'restored']);
const props = defineProps({
    users: {
        type: Array,
        default: () => []
    }
});

const { confirm } = useConfirm();

const archivedCache = ref({});
const restoredCache = ref({});
const isLoading = shallowRef(false);

watch(
    () => props.users,
    () => {
        archivedCache.value = {};
        restoredCache.value = {};
    },
    { deep: 1 }
);

const deleteUser = async user => {
    const confirmed = await confirm(
        'Удалить пользователя',
        `Вы уверены, что хотите удалить пользователя "${user.userProfile.full_name}" (Username: ${user.username})?`
    );
    if (!confirmed) return;

    isLoading.value = true;
    const deleted = await api.user.delete(user.id);
    if (deleted) emit('deleted');
    isLoading.value = false;
};

const restore = async user => {
    const confirmed = await confirm(
        'Восстановить пользователя',
        `Вы уверены, что хотите восстановить пользователя "${user.userProfile.full_name}" (Username: ${user.username})?`
    );

    if (!confirmed) return;

    isLoading.value = true;

    const restored = await api.user.restore(user.id);
    if (restored) {
        restoredCache.value[user.id] = true;
        emit('restored', user.id);
    }

    isLoading.value = false;
};

const archive = async user => {
    const confirmed = await confirm(
        'Архивировать пользователя',
        `Вы уверены, что хотите архивировать пользователя "${user.userProfile.full_name}" (Username: ${user.username})?`
    );

    if (!confirmed) return;

    isLoading.value = true;

    const archived = await api.user.archive(user.id);
    if (archived) {
        archivedCache.value[user.id] = true;
        emit('archived', user.id);
    }

    isLoading.value = false;
};
</script>
