<template>
    <DashboardCard class="dashboard-stats-messages dashboard-stats-block">
        <template #header>
            <div class="dashboard-stats-block__header">
                <h3 class="dashboard-card__title">Последние сообщения</h3>
                <MessengerButton @click="fetchMessages">Обновить</MessengerButton>
            </div>
        </template>
        <div class="row">
            <template v-if="isLoading">
                <div class="col-12">
                    <div class="dashboard-stats-messages__column">
                        <DashboardCardMessageSkeleton v-for="i in 10" :key="i" />
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="col-12">
                    <InProgress v-if="true" />
                    <div v-else-if="messages.length" class="dashboard-stats-messages__column">
                        <DashboardCardMessage
                            v-for="message in messages"
                            :key="message.id"
                            @toChat="openInChat(message.to_chat_member_id)"
                            :message="message"
                        />
                    </div>
                    <EmptyData v-else>Список сообщений пуст..</EmptyData>
                </div>
            </template>
        </div>
    </DashboardCard>
</template>

<script setup>
import api from '@/api/api.js';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import DashboardCardMessage from '@/components/Dashboard/Card/DashboardCardMessage.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import DashboardCardMessageSkeleton from '@/components/Dashboard/Card/DashboardCardMessageSkeleton.vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import { onBeforeMount, ref, watch } from 'vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import InProgress from '@/components/common/InProgress.vue';
import { useMessenger } from '@/components/Messenger/useMessenger.js';

const props = defineProps({
    user: {
        type: Number,
        default: null
    }
});

const { openChatById } = useMessenger();
const { isLoading } = useDelayedLoader();
const messages = ref([]);

const openInChat = chatMemberID => {
    openChatById(chatMemberID);
};

const fetchMessages = async () => {
    isLoading.value = true;

    const userParams = props.user ? { from_chat_member_id: props.user } : {};

    const response = await api.messenger.getMessagesByQuery({
        ...userParams,
        sort: '-id'
    });

    if (response) messages.value = response.data.slice(0, 10);

    isLoading.value = false;
};

watch(() => props.user, fetchMessages);
onBeforeMount(() => {
    fetchMessages();
});
</script>
