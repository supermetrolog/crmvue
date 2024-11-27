<template>
    <div class="messenger-chat__content">
        <MessengerChatHeader />
        <AnimationTransition>
            <MessengerChatPinned v-if="pinnedMessage" :message="pinnedMessage" />
        </AnimationTransition>
        <VirtualDragList
            ref="virtual"
            disabled
            :data-source="messages"
            data-key="id"
            :keeps="60"
            class="messenger-chat__virtual"
            :class="{ 'scroll-lock': scrollIsLock }"
            wrap-class="messenger-chat__body"
        >
            <template #header>
                <Loader v-if="isLoading" class="small" />
                <InfiniteLoading v-if="messages.length && scrolled" @infinite="loadMessages">
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
                    <MessengerChatNotification
                        v-else-if="message.is_system"
                        @viewed="debouncedReadMessage"
                        @deleted="onMessageDeleted(message.id)"
                        @reply="replyTo = message"
                        @cancel-reply="replyTo = null"
                        :message="message"
                        :pinned="message.id === pinnedMessage?.id"
                        :reply="message.id === replyTo?.id"
                        :can-be-viewed="!message.is_viewed"
                    />
                    <MessengerChatMessage
                        v-else
                        @viewed="debouncedReadMessage"
                        @deleted="onMessageDeleted(message.id)"
                        @reply="replyTo = message"
                        @cancel-reply="replyTo = null"
                        :self="message.from.model.id === currentUser.id"
                        :message="message"
                        :pinned="message.id === pinnedMessage?.id"
                        :reply="message.id === replyTo?.id"
                        :can-be-viewed="!message.is_viewed"
                    />
                </div>
            </template>
            <template #footer>
                <div v-intersection-observer="scrollObserver" class="messenger-chat__end"></div>
            </template>
        </VirtualDragList>
        <MessengerChatScrollButton
            @scroll="scrollToEnd"
            :style="{
                bottom: scrollButtonBottom
            }"
            :visible="scrollButtonIsVisible"
        />
        <MessengerChatForm ref="formEl" @cancel-reply="replyTo = null" :reply-to="replyTo" />
    </div>
</template>
<script setup>
import MessengerChatHeader from '@/components/Messenger/Chat/Header/MessengerChatHeader.vue';
import MessengerChatForm from '@/components/Messenger/Chat/Form/MessengerChatForm.vue';
import { useStore } from 'vuex';
import MessengerChatLabel from '@/components/Messenger/Chat/MessengerChatLabel.vue';
import MessengerChatNotification from '@/components/Messenger/Chat/MessengerChatNotification.vue';
import InfiniteLoading from 'v3-infinite-loading';
import MessengerChatPinned from '@/components/Messenger/Chat/MessengerChatPinned.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { debounce } from '@/utils/common/debounce.js';
import MessengerChatScrollButton from '@/components/Messenger/Chat/MessengerChatScrollButton.vue';
import { useElementSize, useTimeoutFn } from '@vueuse/core';
import { computed, nextTick, onMounted, ref, shallowRef, useTemplateRef, watch } from 'vue';
import VirtualDragList from 'vue-virtual-draglist';
import EmptyLabel from '@/components/common/EmptyLabel.vue';
import MessengerChatMessage from '@/components/Messenger/Chat/Message/MessengerChatMessage.vue';
import Loader from '@/components/common/Loader.vue';
import { vIntersectionObserver } from '@vueuse/components';

const store = useStore();

const virtual = useTemplateRef('virtual');
const formEl = useTemplateRef('formEl');

const scrolled = shallowRef(false);
const scrollButtonIsVisible = shallowRef(false);
const scrollIsLock = shallowRef(false);
const replyTo = shallowRef(null);

const isLoading = ref(false);

const { height } = useElementSize(formEl);
const scrollButtonBottom = computed(() => height.value + 45 + 'px');

const messages = computed(() => store.state.Messenger.messages);
const pinnedMessage = computed(() => store.state.Messenger.currentPinned);
const currentUser = computed(() => store.getters.THIS_USER);

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

watch(isLoading, value => {
    if (!value && scrollIsLock.value) scrollIsLock.value = false;
});

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
const scrollToEnd = async () => {
    await nextTick();
    virtual.value.scrollToBottom();
};
const loadMessages = async $state => {
    if (isLoading.value) return;

    isLoading.value = true;
    scrollIsLock.value = true;

    const isLastPage = await store.dispatch('Messenger/loadMessages');

    isLoading.value = false;

    if (isLastPage) $state.complete();
    else $state.loaded();
};

const readMessages = async messageID => {
    await store.dispatch('Messenger/readMessages', messageID);
};
const debouncedReadMessage = debounce(readMessages, 2000);
const scrollObserver = ([{ isIntersecting }]) => {
    scrollButtonIsVisible.value = !isIntersecting;
};

const onMessageDeleted = messageId => {
    store.commit('Messenger/onMessageDeleted', messageId);
};

onMounted(() => {
    if (messages.value.length) {
        scrollIsLock.value = true;
        scrollToCorrectPosition();
    }
});
</script>
