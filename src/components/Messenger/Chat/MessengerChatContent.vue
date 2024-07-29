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
                <Loader v-if="isLoading" />
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
                    <MessengerChatMessage
                        v-else-if="message.from.model_type === 'user'"
                        v-intersection="
                            message.is_viewed
                                ? null
                                : ([{ isIntersecting }], observer) =>
                                      messageIntersectionObserver(isIntersecting, observer, message)
                        "
                        :self="message.from.model.id === currentUser.id"
                        :message="message"
                        :pinned="message.id === pinnedMessage?.id"
                    />
                    <MessengerChatNotification v-else :message="message" />
                </div>
            </template>
            <template #footer>
                <div
                    ref="scrollEnd"
                    v-intersection="scrollObserver"
                    class="messenger-chat__end"
                ></div>
            </template>
        </VirtualDragList>
        <MessengerChatScrollButton
            @scroll="scrollToEnd"
            :style="{ top: scrollButtonTop }"
            :visible="scrollButtonIsVisible"
        />
        <div ref="quiz" @click="$toggleQuiz" class="messenger-chat__quiz-toggle">
            <div>
                <i class="fa-solid fa-chevron-up"></i>
                <p>Открыть новый опросник с клиентом</p>
            </div>
        </div>
        <MessengerChatForm />
    </div>
</template>
<script setup>
import MessengerChatHeader from '@/components/Messenger/Chat/Header/MessengerChatHeader.vue';
import MessengerChatMessage from '@/components/Messenger/Chat/Message/MessengerChatMessage.vue';
import MessengerChatForm from '@/components/Messenger/Chat/Form/MessengerChatForm.vue';
import { useStore } from 'vuex';
import MessengerChatLabel from '@/components/Messenger/Chat/MessengerChatLabel.vue';
import MessengerChatNotification from '@/components/Messenger/Chat/MessengerChatNotification.vue';
import InfiniteLoading from 'v3-infinite-loading';
import MessengerChatPinned from '@/components/Messenger/Chat/MessengerChatPinned.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { debounce } from '@/utils/debounce.js';
import MessengerChatScrollButton from '@/components/Messenger/Chat/MessengerChatScrollButton.vue';
import { useElementBounding } from '@vueuse/core';
import { computed, inject, nextTick, onMounted, ref, shallowRef, watch } from 'vue';
import VirtualDragList from 'vue-virtual-draglist';
import EmptyLabel from '@/components/common/EmptyLabel.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import Loader from '@/components/common/Loader.vue';

const store = useStore();
const $toggleQuiz = inject('$toggleQuiz');

const quiz = ref(null);
const scrollEnd = ref(null);
const virtual = ref(null);
const scrolled = shallowRef(false);
const scrollButtonIsVisible = shallowRef(false);
const scrollIsLock = shallowRef(false);
const { isLoading } = useDelayedLoader(false, 700);

const { top } = useElementBounding(quiz);
const scrollButtonTop = computed(() => top.value - 45 + 'px');

const messages = computed(() => store.state.Messenger.messages);
const pinnedMessage = computed(() => store.state.Messenger.currentPinned);
const currentUser = computed(() => store.getters.THIS_USER);

watch(
    () => messages.value.length,
    (value, oldValue) => {
        if (scrollIsLock.value) {
            nextTick(() => {
                virtual.value.scrollToKey(messages.value[value - oldValue].id);
                scrollIsLock.value = false;
            });
        }
    }
);

watch(isLoading, value => {
    if (!value && scrollIsLock.value) scrollIsLock.value = false;
});

const scrollToNotViewed = async () => {
    await nextTick();

    const notViewedMessage = messages.value.find(element => !element.is_viewed && !element.isLabel);

    if (notViewedMessage) virtual.value.scrollToKey(notViewedMessage.id);
    else virtual.value.scrollToBottom();

    scrolled.value = true;
};
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
const messageIntersectionObserver = (isIntersecting, observer, message) => {
    if (!isIntersecting) return;

    if (message.is_viewed || message._is_viewed) {
        observer.disconnect();
        return;
    }

    debouncedReadMessage(message.id);

    message._is_viewed = true;
    setTimeout(() => {
        message.is_viewed = true;
    }, 1200);
    observer.disconnect();
};

const readMessages = async messageID => {
    await store.dispatch('Messenger/readMessages', messageID);
};
const debouncedReadMessage = debounce(readMessages, 2000);
const scrollObserver = ([{ isIntersecting }]) => {
    scrollButtonIsVisible.value = !isIntersecting;
};

onMounted(() => {
    if (messages.value.length) scrollToNotViewed();
});
</script>
