<template>
    <div class="header-summary-messages-content">
        <HeaderSummaryDialogs
            :title="`Требуется обзвон клиентов (${companiesCounts.outdated_call_count})`"
        >
            <template #actions>
                <Button @click="fetchChats" :disabled="isLoading" class="ml-auto mb-2" small icon>
                    <span>Обновить</span>
                    <i class="fa-solid fa-refresh" />
                </Button>
            </template>
            <HeaderSummaryDialogsGrid
                :loading="isLoading"
                :class="{ disabled: !chats.data.length && !isLoading }"
            >
                <MessengerDialogCompany
                    v-for="chat in chats.data"
                    :key="chat.id"
                    @click="toSurvey(chat)"
                    :model="chat.model"
                    :statistic="chat.statistic"
                    class="header-summary-dialogs__dialog"
                />
            </HeaderSummaryDialogsGrid>
            <template v-if="!isLoading && chats.pagination">
                <hr />
                <PaginationClassic @next="fetchChats" :pagination="chats.pagination" />
            </template>
        </HeaderSummaryDialogs>
    </div>
</template>
<script setup>
import { onMounted, reactive } from 'vue';
import api from '@/api/api.js';
import { useAuth } from '@/composables/useAuth.js';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import Button from '@/components/common/Button.vue';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import MessengerDialogCompany from '@/components/Messenger/Dialog/Company/MessengerDialogCompany.vue';
import { messenger } from '@/const/messenger.js';
import { useSharedMessengerStatistic } from '@/components/Messenger/useSharedMessengerStatistic.js';
import HeaderSummaryDialogs from '@/components/Header/Summary/Dialogs/HeaderSummaryDialogs.vue';
import HeaderSummaryDialogsGrid from '@/components/Header/Summary/Dialogs/HeaderSummaryDialogsGrid.vue';

const emit = defineEmits(['close']);

const { currentUserId } = useAuth();
const { companiesCounts } = useSharedMessengerStatistic();

const chats = reactive({
    data: [],
    pagination: null
});

const { isLoading } = useDelayedLoader(true);

async function fetchChats(page = 1) {
    isLoading.value = true;

    const response = await api.messenger.getChats({
        model_type: messenger.dialogTypes.COMPANY,
        need_calling: 1,
        consultant_ids: [currentUserId.value],
        page
    });

    if (response) {
        chats.data = response.data;
        chats.pagination = response.pagination;
    }

    isLoading.value = false;
}

onMounted(fetchChats);

// chat

const { openSurvey } = useMessenger();

async function toSurvey(chat) {
    const opened = await openSurvey(messenger.dialogTypes.COMPANY, chat.model.id, chat.model.id);

    if (opened) emit('close');
}
</script>
