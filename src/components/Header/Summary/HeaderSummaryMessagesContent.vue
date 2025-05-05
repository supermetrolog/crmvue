<template>
    <div class="header-summary-messages-content">
        <div v-if="count > 0" class="header-summary-messages-content__grid">
            <div>
                <HeaderSummaryDialogs
                    :title="isLoading ? 'Поиск чатов..' : `Найдено ${dialogsLabel}`"
                >
                    <template #actions>
                        <UiButton
                            @click="fetchChats()"
                            :disabled="isLoading"
                            small
                            class="ml-auto mb-2"
                            icon="fa-solid fa-refresh"
                            color="light"
                        >
                            Обновить
                        </UiButton>
                    </template>
                    <HeaderSummaryDialogsList :loading="isLoading">
                        <HeaderSummaryMessagesDialog
                            v-for="dialog in dialogs"
                            :key="dialog.id"
                            @click="selectDialog(dialog)"
                            :dialog="dialog"
                            class="header-summary-messages-content__dialog"
                            :current="dialog.id === currenDialog?.id"
                        />
                    </HeaderSummaryDialogsList>
                </HeaderSummaryDialogs>
            </div>
            <div class="header-summary-messages-content__preview">
                <HeaderSummaryMessagesContentPreview
                    v-if="currenDialog"
                    @to-chat="openDialogChat(currenDialog)"
                    @read="onReadMessages"
                    :dialog="currenDialog"
                />
                <div v-else class="header-summary-messages-content__empty">
                    <i class="fa-regular fa-comments"></i>
                </div>
            </div>
        </div>
        <HeaderSummaryEmpty
            v-else
            :loading="isLoading"
            empty-title="Новых сообщений нет. Отлично!"
            loading-title="Поиск сообщений.."
        />
    </div>
</template>
<script setup>
import { computed, onMounted, ref, shallowRef } from 'vue';
import api from '@/api/api.js';
import HeaderSummaryEmpty from '@/components/Header/Summary/HeaderSummaryEmpty.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import HeaderSummaryMessagesDialog from '@/components/Header/Summary/HeaderSummaryMessagesDialog.vue';
import { plural } from '@/utils/plural.js';
import HeaderSummaryDialogsList from '@/components/Header/Summary/Dialogs/HeaderSummaryDialogsList.vue';
import HeaderSummaryDialogs from '@/components/Header/Summary/Dialogs/HeaderSummaryDialogs.vue';
import HeaderSummaryMessagesContentPreview from '@/components/Header/Summary/HeaderSummaryMessagesContentPreview.vue';
import { messenger } from '@/const/messenger.js';
import { useMessenger } from '@/components/Messenger/useMessenger.js';

const emit = defineEmits(['close']);
const props = defineProps({
    count: {
        type: Number,
        default: 0
    }
});

const isLoading = ref(false);
const dialogs = ref([]);
const pagination = ref(null);

const dialogsLabel = computed(() => plural(dialogs.value.length, '%d чат', '%d чата', '%d чатов'));

async function fetchChats(page = 1) {
    isLoading.value = true;

    const response = await api.messenger.getChats({
        with_messages: 1,
        page,
        'per-page': 0
    });

    if (response) {
        dialogs.value = response.data;
        pagination.value = response.pagination;
    }

    isLoading.value = false;
}

onMounted(() => {
    if (props.count > 0) {
        fetchChats();
    }
});

// chat

const currenDialog = shallowRef(null);

function selectDialog(dialog) {
    if (currenDialog.value?.id === dialog.id) {
        currenDialog.value = null;
    } else {
        currenDialog.value = dialog;
    }
}

function openDialogChat(dialog) {
    if (dialog.model_type === messenger.dialogTypes.USER) {
        return toUserChat(dialog);
    }

    if (dialog.model_type === messenger.dialogTypes.COMPANY) {
        return toCompanyChat(dialog);
    }

    if (dialog.model_type === messenger.dialogTypes.OBJECT) {
        return toOfferChat(dialog);
    }
}

const { openChatByUserId, openChat } = useMessenger();

async function toUserChat(chat) {
    const opened = await openChatByUserId(chat.model.id);
    if (opened) emit('close');
}

async function toCompanyChat(chat) {
    const opened = await openChat(chat.model.id, chat.model.id, messenger.dialogTypes.COMPANY);
    if (opened) emit('close');
}

async function toOfferChat(chat) {
    const opened = await openChat(
        chat.model.object.company?.id,
        chat.model.object.id,
        messenger.dialogTypes.OBJECT,
        chat.model.type
    );
    if (opened) emit('close');
}

// read

async function onReadMessages() {
    const currenDialogId = currenDialog.value.id;

    const response = await api.messenger.getChats({
        id: currenDialogId
    });

    if (response.data.length) {
        const dialogIndex = dialogs.value.findIndex(dialog => dialog.id === currenDialogId);
        Object.assign(dialogs.value[dialogIndex], response.data[0]);
    }
}
</script>
