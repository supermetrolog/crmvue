<template>
    <div class="header-summary-messages-content">
        <HeaderSummaryDialogs
            :title="`Список предложений для обзвона (${objectCounts.outdated_company_call_count})`"
        >
            <template #actions>
                <UiButton
                    @click="fetchChats()"
                    :loading="isLoading"
                    small
                    class="ml-auto mb-2"
                    icon="fa-solid fa-refresh"
                    color="light"
                >
                    Обновить
                </UiButton>
            </template>
            <HeaderSummaryDialogsGrid
                :loading="isLoading && count > 0"
                :class="{ disabled: !chats.data.length }"
            >
                <MessengerDialogObject
                    v-for="chat in chats.data"
                    :key="chat.id"
                    @click="toSurvey(chat)"
                    :model="chat.model"
                    :statistic="chat.statistic"
                    class="header-summary-dialogs__dialog"
                    show-company
                />
                <template #empty>
                    <HeaderSummaryEmpty
                        :loading="isLoading"
                        empty-title="Обзвон предложений не требуется. Отлично!"
                        loading-title="Исследование предложений.."
                    />
                </template>
            </HeaderSummaryDialogsGrid>
            <template v-if="!isLoading && chats.pagination?.totalCount">
                <hr />
                <PaginationClassic @next="fetchChats" :pagination="chats.pagination" />
            </template>
        </HeaderSummaryDialogs>
    </div>
</template>
<script setup>
import { onMounted, reactive } from 'vue';
import api from '@/api/api.js';
import { useAuth } from '@/composables/useAuth';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import { messenger } from '@/const/messenger.js';
import { useSharedMessengerStatistic } from '@/components/Messenger/useSharedMessengerStatistic.js';
import HeaderSummaryDialogs from '@/components/Header/Summary/Dialogs/HeaderSummaryDialogs.vue';
import HeaderSummaryDialogsGrid from '@/components/Header/Summary/Dialogs/HeaderSummaryDialogsGrid.vue';
import MessengerDialogObject from '@/components/Messenger/Dialog/Object/MessengerDialogObject.vue';
import HeaderSummaryEmpty from '@/components/Header/Summary/HeaderSummaryEmpty.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useSurveyForm } from '@/composables/useSurveyForm.ts';

const emit = defineEmits(['close']);
const props = defineProps({
    count: {
        type: Number,
        default: 0
    }
});

const { currentUserId } = useAuth();
const { objectCounts } = useSharedMessengerStatistic();

const chats = reactive({
    data: [],
    pagination: null
});

const { isLoading } = useDelayedLoader(props.count > 0);

async function fetchChats(page = 1) {
    isLoading.value = true;

    const response = await api.messenger.getChats({
        model_type: messenger.dialogTypes.OBJECT,
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

onMounted(() => {
    if (props.count > 0) fetchChats();
});

// chat

const { openSurvey } = useSurveyForm();

function toSurvey(chat) {
    openSurvey(chat.model.object.company?.id ?? chat.model.object.company_id);

    emit('close');
}
</script>
