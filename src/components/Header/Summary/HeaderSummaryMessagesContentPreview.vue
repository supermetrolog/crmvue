<template>
    <div class="header-summary-messages-content-preview position-relative">
        <HeaderSummaryMessagesContentHeader
            :dialog
            class="header-summary-messages-content-preview__header"
        />
        <div class="header-summary-messages-content-preview__list">
            <Loader v-if="isFetching" class="absolute-center" />
            <VirtualDragList
                v-else
                ref="virtual"
                v-model="messages"
                disabled
                data-key="id"
                :keeps="60"
                class="messenger-chat__virtual"
                :class="{ 'scroll-lock': scrollIsLock }"
                wrap-class="messenger-chat__body"
            >
                <template #header>
                    <Loader v-if="isLoading" class="small" />
                    <InfiniteLoading v-if="messages.length && scrolled" @infinite="onLoadMessages">
                        <template #complete>
                            <EmptyLabel>Больше сообщений нет..</EmptyLabel>
                        </template>
                        <template #spinner><span></span></template>
                    </InfiniteLoading>
                </template>
                <template #item="{ record: message }">
                    <div>
                        <MessengerChatLabel
                            v-if="message.isLabel"
                            class="messenger-chat__label"
                            :date="message.label"
                        />
                        <HeaderSummaryMessagesContentNotification
                            v-else-if="message.is_system"
                            @viewed="readMessages"
                            :message="message"
                            :can-be-viewed="!message.is_viewed"
                        />
                        <HeaderSummaryMessagesContentMessage
                            v-else
                            @viewed="readMessages"
                            :self="message.from.model.id === currentUserId"
                            :message="message"
                            :can-be-viewed="!message.is_viewed"
                        />
                    </div>
                </template>
            </VirtualDragList>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref, shallowRef, useTemplateRef, watch } from 'vue';
import api from '@/api/api.js';
import InfiniteLoading from 'v3-infinite-loading';
import MessengerChatLabel from '@/components/Messenger/Chat/MessengerChatLabel.vue';
import Loader from '@/components/common/Loader.vue';
import EmptyLabel from '@/components/common/EmptyLabel.vue';
import VirtualDragList from 'vue-virtual-draglist';
import { useTimeoutFn } from '@vueuse/core';
import { debounce } from '@/utils/common/debounce.js';
import { useAuth } from '@/composables/useAuth.js';
import { messagesToSections } from '@/utils/mapper.js';
import HeaderSummaryMessagesContentMessage from '@/components/Header/Summary/HeaderSummaryMessagesContentMessage.vue';
import HeaderSummaryMessagesContentNotification from '@/components/Header/Summary/HeaderSummaryMessagesContentNotification.vue';
import HeaderSummaryMessagesContentHeader from '@/components/Header/Summary/HeaderSummaryMessagesContentHeader.vue';

const emit = defineEmits(['close']);
const props = defineProps({
    dialog: Object
});

function unshiftMessages(value) {
    const { messages: newMessages, hasLeakedMessages } = messagesToSections(
        value,
        messages.value[0].label
    );

    if (hasLeakedMessages) messages.value.splice(0, 1);
    messages.value.unshift(...newMessages);
}

// fetch

const isFetching = ref(false);

const messages = ref([]);

async function fetchMessages() {
    isFetching.value = true;

    const response = await api.messenger.getMessages(props.dialog.id);

    if (response) {
        lessThenMessageId.value = response[0].id;
        messages.value = messagesToSections(response).messages;
    }

    isFetching.value = false;
}

onMounted(fetchMessages);

watch(
    () => props.dialog?.id,
    value => {
        if (value) fetchMessages();
    }
);

watch(isFetching, value => {
    if (!value) {
        scrollIsLock.value = true;
        scrollToCorrectPosition();
    }
});

//

const { currentUserId } = useAuth();

const virtual = useTemplateRef('virtual');

// scroll

const scrolled = shallowRef(false);
const scrollIsLock = ref(false);

watch(
    () => messages.value.length,
    (value, oldValue) => {
        if (scrollIsLock.value) {
            useTimeoutFn(() => {
                virtual.value.scrollToKey(messages.value[value - oldValue].id);
                scrollIsLock.value = false;
            }, 50);
        }
    }
);

const { start: scrollToCorrectPosition } = useTimeoutFn(
    () => {
        const notViewedMessage = messages.value.find(
            element => !element.is_viewed && !element.isLabel
        );

        if (notViewedMessage) virtual.value.scrollToKey(notViewedMessage.id);
        else virtual.value.scrollToBottom();

        scrolled.value = true;
        scrollIsLock.value = false;
    },
    50,
    { immediate: false }
);

// load

const isLoading = ref(false);
const lessThenMessageId = ref(null);

async function loadMessages() {
    const response = await api.messenger.getMessages(props.dialog.id, lessThenMessageId.value);

    if (response?.length) {
        unshiftMessages(response);
        lessThenMessageId.value = response[0].id;
    }

    return response?.length < 30;
}

async function onLoadMessages($state) {
    if (isLoading.value) return;

    isLoading.value = true;
    scrollIsLock.value = true;

    const isLastPage = await loadMessages();

    isLoading.value = false;

    if (isLastPage) $state.complete();
    else $state.loaded();
}

watch(isLoading, value => {
    if (!value && scrollIsLock.value) scrollIsLock.value = false;
});

// read

const readMessages = debounce(async messageID => {
    const reads = await api.messenger.readMessages(messageID);
    if (reads) {
        emit('read');
    }
}, 2000);
</script>
