<template>
    <div class="messenger-chat__content">
        <MessengerChatHeader />
        <AnimationTransition>
            <MessengerChatPinned v-if="pinnedMessage" :message="pinnedMessage" />
        </AnimationTransition>
        <div class="messenger-chat__body">
            <InfiniteLoading v-if="messages.length && scrolled" @infinite="loadMessages">
                <template #complete><span></span></template>
                <template #spinner>
                    <Spinner />
                </template>
            </InfiniteLoading>
            <template v-for="(section, id) in messagesByDays" :key="id">
                <MessengerChatLabel class="messenger-chat__label" :date="section.label" />
                <template v-for="message in section.messages" :key="message.id">
                    <MessengerChatMessage
                        v-if="message.from.model_type === 'user'"
                        v-intersection="
                            message.notViewed
                                ? ([{ isIntersecting }], observer) =>
                                      messageIntersectionObserver(isIntersecting, observer, message)
                                : null
                        "
                        :self="message.from.model.id === currentUser.id"
                        :message="message"
                        :pinned="message.id === pinnedMessage?.id"
                    />
                    <MessengerChatNotification v-else :message="message" />
                </template>
            </template>
            <div ref="scrollEnd" v-intersection="scrollObserver" class="messenger-chat__end"></div>
            <MessengerChatScrollButton @scroll="scrollToEnd" :visible="scrollButtonIsVisible" />
        </div>
        <div @click="$toggleQuiz" class="messenger-chat__quiz-toggle">
            <div>
                <i class="fa-solid fa-chevron-up"></i>
                <p>Открыть новый опросник с клиентом</p>
            </div>
        </div>
        <MessengerChatForm />
    </div>
</template>
<script>
import MessengerChatHeader from '@/components/Messenger/Chat/Header/MessengerChatHeader.vue';
import MessengerChatMessage from '@/components/Messenger/Chat/Message/MessengerChatMessage.vue';
import MessengerChatForm from '@/components/Messenger/Chat/Form/MessengerChatForm.vue';
import { mapGetters, mapState } from 'vuex';
import MessengerChatLabel from '@/components/Messenger/Chat/MessengerChatLabel.vue';
import MessengerChatNotification from '@/components/Messenger/Chat/MessengerChatNotification.vue';
import dayjs from 'dayjs';
import InfiniteLoading from 'v3-infinite-loading';
import Spinner from '@/components/common/Spinner.vue';
import MessengerChatPinned from '@/components/Messenger/Chat/MessengerChatPinned.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { debounce } from '@/utils/debounce.js';
import api from '@/api/api.js';
import MessengerChatScrollButton from '@/components/Messenger/Chat/MessengerChatScrollButton.vue';

export default {
    name: 'MessengerChatContent',
    components: {
        MessengerChatScrollButton,
        AnimationTransition,
        MessengerChatPinned,
        Spinner,
        InfiniteLoading,
        MessengerChatNotification,
        MessengerChatLabel,
        MessengerChatForm,
        MessengerChatMessage,
        MessengerChatHeader
    },
    inject: ['$toggleQuiz'],
    data() {
        return {
            scrolled: false,
            scrollButtonIsVisible: false
        };
    },
    computed: {
        ...mapGetters({ currentUser: 'THIS_USER', isModerator: 'isModerator' }),
        ...mapState({
            isLoading: state => state.Messenger.loadingChat,
            messages: state => state.Messenger.messages,
            pinnedMessage: state => state.Messenger.currentPinned,
            currentRecipient: state => state.Messenger.currentRecipient
        }),
        messagesByDays() {
            const sections = this.messages.reduce((acc, message) => {
                const dayjsObject = dayjs(message.created_at);
                const dayjsObjectFormat = dayjsObject.format('MM.DD.YYYY');

                if (dayjsObjectFormat in acc)
                    acc[dayjsObjectFormat].push({ ...message, dayjs_date: dayjsObject });
                else acc[dayjsObjectFormat] = [{ ...message, dayjs_date: dayjsObject }];

                return acc;
            }, {});

            return Object.keys(sections)
                .map(key => ({
                    label: dayjs(key),
                    messages: sections[key].sort(
                        (first, second) => first.dayjs_date - second.dayjs_date
                    )
                }))
                .sort((first, second) => first.label - second.label);
        }
    },
    methods: {
        async scrollToNotViewed() {
            await this.$nextTick();

            const message = document.querySelector(
                '#message-' + this.$store.state.Messenger.lastNotViewedMessageID
            );

            if (message) message.scrollIntoView({ block: 'end' });
            this.scrolled = true;
        },
        async scrollToEnd() {
            await this.$nextTick();
            this.$refs.scrollEnd.scrollIntoView({ behavior: 'smooth' });
        },
        async loadMessages($state) {
            const isLastPage = await this.$store.dispatch(
                'Messenger/loadMessages',
                this.$store.state.Messenger.lessThenMessageId
            );

            if (isLastPage) $state.complete();
            else $state.loaded();
        },
        messageIntersectionObserver(isIntersecting, observer, message) {
            if (!isIntersecting) return;

            if (!message.notViewed) {
                observer.disconnect();
                return;
            }

            //this.debouncedReadMessage(message.id);
            console.log(message);

            message.notViewed = false;
            observer.disconnect();
        },
        debouncedReadMessage: debounce(api.messenger.readMessages, 2000),
        scrollObserver([{ isIntersecting }]) {
            this.scrollButtonIsVisible = !isIntersecting;
        }
    },
    mounted() {
        this.scrollToNotViewed();
    }
};
</script>
