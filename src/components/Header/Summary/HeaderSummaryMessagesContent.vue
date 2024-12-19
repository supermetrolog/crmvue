<template>
    <div class="header-summary-messages-content">
        <Button @click="fetchAll" :disabled="loaders.user" class="ml-auto mb-2" small icon>
            <span>Обновить все</span>
            <i class="fa-solid fa-refresh" />
        </Button>
        <div class="header-summary-messages-content__grid">
            <HeaderSummaryDialogs
                :title="`Чаты сотрудников (${chats.user.pagination?.totalCount ?? userCounts.unread_message_count})`"
            >
                <template #actions>
                    <Button
                        @click="fetchChats(messenger.dialogTypes.USER)"
                        :disabled="loaders.user"
                        class="ml-auto mb-2"
                        small
                        icon
                    >
                        <i class="fa-solid fa-refresh" />
                    </Button>
                </template>
                <HeaderSummaryDialogsList :loading="loaders.user">
                    <MessengerDialogUser
                        v-for="chat in chats.user.data"
                        :key="chat.id"
                        @click="toUserChat(chat)"
                        :model="chat.model"
                        :statistic="chat.statistic"
                        class="header-summary-dialogs__dialog"
                    />
                </HeaderSummaryDialogsList>
                <template v-if="!loaders.user && chats.user.pagination?.totalCount">
                    <hr />
                    <PaginationClassic
                        v-if="!loaders.user && chats.user.pagination?.totalCount"
                        @next="fetchChats(messenger.dialogTypes.USER, $event)"
                        :pagination="chats.user.pagination"
                        class="mt-2"
                    />
                </template>
            </HeaderSummaryDialogs>
            <HeaderSummaryDialogs
                :title="`Чаты компаний (${chats.company.pagination?.totalCount ?? companiesCounts.unread_message_count})`"
            >
                <template #actions>
                    <Button
                        @click="fetchChats(messenger.dialogTypes.COMPANY)"
                        :disabled="loaders.company"
                        class="ml-auto mb-2"
                        small
                        icon
                    >
                        <i class="fa-solid fa-refresh" />
                    </Button>
                </template>
                <HeaderSummaryDialogsList :loading="loaders.company">
                    <MessengerDialogCompany
                        v-for="chat in chats.company.data"
                        :key="chat.id"
                        @click="toCompanyChat(chat)"
                        :model="chat.model"
                        :statistic="chat.statistic"
                        class="header-summary-dialogs__dialog"
                    />
                    <MessengerDialogCompany
                        v-for="chat in chats.company.data"
                        :key="chat.id"
                        @click="toCompanyChat(chat)"
                        :model="chat.model"
                        :statistic="chat.statistic"
                        class="header-summary-dialogs__dialog"
                    />
                </HeaderSummaryDialogsList>
                <template v-if="!loaders.company && chats.company.pagination?.totalCount">
                    <hr />
                    <PaginationClassic
                        @next="fetchChats(messenger.dialogTypes.COMPANY, $event)"
                        :pagination="chats.company.pagination"
                        class="mt-2"
                    />
                </template>
            </HeaderSummaryDialogs>
            <HeaderSummaryDialogs
                :title="`Чаты предложений (${chats.object.pagination?.totalCount ?? objectCounts.unread_message_count})`"
            >
                <template #actions>
                    <Button
                        @click="fetchChats(messenger.dialogTypes.OBJECT)"
                        :disabled="loaders.object"
                        class="ml-auto mb-2"
                        small
                        icon
                    >
                        <i class="fa-solid fa-refresh" />
                    </Button>
                </template>
                <HeaderSummaryDialogsList :loading="loaders.object">
                    <MessengerDialogObject
                        v-for="chat in chats.object.data"
                        :key="chat.id"
                        @click="toOfferChat(chat)"
                        :model="chat.model"
                        :statistic="chat.statistic"
                        class="header-summary-dialogs__dialog"
                    />
                </HeaderSummaryDialogsList>
                <template v-if="!loaders.object && chats.object.pagination?.totalCount">
                    <hr />
                    <PaginationClassic
                        v-if="!loaders.object && chats.object.pagination?.totalCount"
                        @next="fetchChats(messenger.dialogTypes.OBJECT, $event)"
                        :pagination="chats.object.pagination"
                        class="mt-2"
                    />
                </template>
            </HeaderSummaryDialogs>
        </div>
    </div>
</template>
<script setup>
import { onMounted, reactive } from 'vue';

import api from '@/api/api.js';
import Button from '@/components/common/Button.vue';
import MessengerDialogUser from '@/components/Messenger/Dialog/MessengerDialogUser.vue';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import MessengerDialogObject from '@/components/Messenger/Dialog/Object/MessengerDialogObject.vue';
import MessengerDialogCompany from '@/components/Messenger/Dialog/Company/MessengerDialogCompany.vue';
import { messenger } from '@/const/messenger.js';
import { useSharedMessengerStatistic } from '@/components/Messenger/useSharedMessengerStatistic.js';
import HeaderSummaryDialogs from '@/components/Header/Summary/Dialogs/HeaderSummaryDialogs.vue';
import HeaderSummaryDialogsList from '@/components/Header/Summary/Dialogs/HeaderSummaryDialogsList.vue';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';

const emit = defineEmits(['close']);

const { companiesCounts, userCounts, objectCounts } = useSharedMessengerStatistic();

const chats = reactive({
    [messenger.dialogTypes.USER]: {
        data: [],
        pagination: null
    },
    [messenger.dialogTypes.COMPANY]: {
        data: [],
        pagination: null
    },
    [messenger.dialogTypes.OBJECT]: {
        data: [],
        pagination: null
    }
});

const loaders = reactive({
    [messenger.dialogTypes.USER]: true,
    [messenger.dialogTypes.COMPANY]: true,
    [messenger.dialogTypes.OBJECT]: true
});

async function fetchChats(modelType, page = 1) {
    loaders[modelType] = true;

    const response = await api.messenger.getChats({
        model_type: modelType,
        with_messages: 1,
        page
    });

    if (response) {
        chats[modelType].data = response.data;
        chats[modelType].pagination = response.pagination;
    }

    loaders[modelType] = false;
}

function fetchAll() {
    fetchChats(messenger.dialogTypes.USER);
    fetchChats(messenger.dialogTypes.COMPANY);
    fetchChats(messenger.dialogTypes.OBJECT);
}

onMounted(fetchAll);

// chat

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
</script>
