<template>
    <VirtualDragList
        ref="virtual"
        v-model="_messages"
        disabled
        data-key="id"
        :keeps="20"
        class="messenger-chat__virtual"
        :class="{ 'scroll-lock': scrollIsLock }"
        wrap-class="messenger-chat__body"
    >
        <template #header>
            <Loader v-if="loading" class="small" />
            <InfiniteLoading v-if="messages.length && scrolled" @infinite="onLoadMessages">
                <template #complete>
                    <EmptyLabel>Больше сообщений нет..</EmptyLabel>
                </template>
                <template #spinner><span></span></template>
            </InfiniteLoading>
        </template>
        <template #item="{ record: message }">
            <div>
                <MessengerChatLabelRow v-if="message.isRow" :label="message.label" />
                <MessengerChatLabel
                    v-else-if="message.isLabel"
                    class="messenger-chat__label"
                    :date="message.label"
                />
                <HeaderSummaryMessagesContentNotification
                    v-else-if="message.is_system"
                    @viewed="$emit('read', message.id)"
                    :message="message"
                    :can-be-viewed="!message.is_viewed"
                />
                <HeaderSummaryMessagesContentMessage
                    v-else
                    @viewed="$emit('read', message.id)"
                    :self="message.from.model.id === currentUserId"
                    :message="message"
                    :can-be-viewed="!message.is_viewed"
                />
            </div>
        </template>
    </VirtualDragList>
</template>
<script setup>
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import InfiniteLoading from 'v3-infinite-loading';
import MessengerChatLabel from '@/components/Messenger/Chat/MessengerChatLabel.vue';
import Loader from '@/components/common/Loader.vue';
import EmptyLabel from '@/components/common/EmptyLabel.vue';
import VirtualDragList from 'vue-virtual-draglist';
import { useTimeoutFn } from '@vueuse/core';
import { useAuth } from '@/composables/useAuth';
import HeaderSummaryMessagesContentMessage from '@/components/Header/Summary/Messages/HeaderSummaryMessagesContentMessage.vue';
import HeaderSummaryMessagesContentNotification from '@/components/Header/Summary/Messages/HeaderSummaryMessagesContentNotification.vue';
import MessengerChatLabelRow from '@/components/Messenger/Chat/MessengerChatLabelRow.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';

const emit = defineEmits(['load', 'read']);

const props = defineProps({
    loading: Boolean,
    messages: Array,
    finished: Boolean
});

const _messages = computed({
    get() {
        return props.messages;
    },
    set() {}
});

const { currentUserId } = useAuth();

// scroll

const virtual = useTemplateRef('virtual');
const scrolled = ref(false);
const scrollIsLock = ref(false);

onMounted(() => {
    if (props.messages.length) {
        scrollIsLock.value = true;
        scrollToCorrectPosition();
    }
});

watch(
    () => props.messages.length,
    (value, oldValue) => {
        if (scrollIsLock.value) {
            useTimeoutFn(() => {
                virtual.value.scrollToKey(props.messages[value - oldValue].id);
                scrollIsLock.value = false;
            }, 50);
        }
    }
);

watch(
    () => props.loading,
    value => {
        if (!value) {
            if (scrollIsLock.value) {
                scrollIsLock.value = false;
            }

            state.loaded();
        }
    }
);

watch(
    () => props.finished,
    value => {
        if (value && isNotNullish(state)) {
            state.complete();
        }
    }
);

const { start: scrollToCorrectPosition } = useTimeoutFn(
    () => {
        const notViewedMessage = props.messages.find(
            element =>
                isNotNullish(element.is_viewed) &&
                !element.is_viewed &&
                !element.isLabel &&
                !element.isRow
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

let state;

function onLoadMessages($state) {
    if (props.loading) return;

    scrollIsLock.value = true;

    emit('load');
    state = $state;
}
</script>
