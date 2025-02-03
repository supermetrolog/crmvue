<template>
    <div class="comments-panel">
        <div class="comments-panel__content" :class="{ loading: isLoading }">
            <div class="row heading no-gutters">
                <div class="title text-left align-self-center">
                    <p>Активность сотрудников</p>
                </div>
            </div>
            <Loader v-if="isLoading" />
            <div v-else class="header-activity">
                <p class="header-activity__label">Сотрудники в сети ({{ onlineUsers.length }}):</p>
                <div class="header-activity__list">
                    <UserPreview v-for="user in onlineUsers" :key="user.id" :user="user" />
                </div>
                <hr />
                <p class="header-activity__label">
                    Сотрудники не в сети ({{ offlineUsers.length }}):
                </p>
                <div class="header-activity__list">
                    <UserPreview v-for="user in offlineUsers" :key="user.id" :user="user" />
                    <UserPreview v-for="user in unknownUsers" :key="user.id" :user="user" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Loader from '@/components/common/Loader.vue';
import { computed, onMounted, ref, watch } from 'vue';
import api from '@/api/api.js';
import dayjs from 'dayjs';
import UserPreview from '@/components/User/UserPreview.vue';
import { userOptions } from '@/const/options/user.options.js';

const emit = defineEmits(['online-updated']);

const isLoading = ref(true);
const users = ref([]);

const onlineUsers = computed(() => users.value.filter(user => user.is_online));
const offlineUsers = computed(() =>
    users.value
        .filter(user => !user.is_online && user.last_seen)
        .sort((a, b) => dayjs(b.last_seen).diff(dayjs(a.last_seen), 'seconds'))
);
const unknownUsers = computed(() => users.value.filter(user => !user.last_seen));

const fetchUsers = async () => {
    isLoading.value = true;

    const response = await api.user.list();
    if (response)
        users.value = response.filter(user => user.role !== userOptions.roleStatement.SYSTEM);

    isLoading.value = false;
};

watch(
    () => onlineUsers.value.length,
    () => {
        emit('online-updated', onlineUsers.value.length);
    }
);

onMounted(() => {
    fetchUsers();
});
</script>
