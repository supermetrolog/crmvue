<template>
    <div class="messenger-chat__content">
        <MessengerChatHeader />
        <AnimationTransition>
            <MessengerChatPinned v-if="pinnedMessage" :message="pinnedMessage" />
        </AnimationTransition>
        <div ref="chat" class="messenger-chat__body">
            <InfiniteLoading @infinite="loadMessages">
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
                        :self="message.from.model.id === THIS_USER.id"
                        :message="message"
                        :pinned="message.id === pinnedMessage?.id"
                    />
                    <MessengerChatNotification v-else :message="message" />
                </template>
            </template>
        </div>
        <div @click="$toggleQuiz" class="messenger-chat__quiz-toggle">
            <i class="fa-solid fa-chevron-up"></i>
            <p>Открыть новый опросник с клиентом</p>
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

export default {
    name: 'MessengerChatContent',
    components: {
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
    computed: {
        ...mapGetters(['THIS_USER']),
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
                    messages: sections[key]
                }))
                .sort((first, second) => first.label - second.label);
        },
        lastMessage() {
            if (!this.messages.length) return null;

            const [day] = this.messagesByDays.slice(-1);
            const [message] = day.messages.slice(-1);

            return message;
        }
    },
    watch: {
        lastMessage: {
            handler(newValue, oldValue) {
                if (!newValue) return;
                if (newValue?.id !== oldValue?.id && newValue.from.model.id === this.THIS_USER.id)
                    this.scrollToEnd();
            },
            deep: true
        }
    },
    methods: {
        async scrollToEnd() {
            await this.$nextTick();
            this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight;
        },
        async loadMessages($state) {
            const isLastPage = await this.$store.dispatch('Messenger/loadMessages');
            if (isLastPage) $state.complete();
            else $state.loaded();
        }
    },
    mounted() {
        this.scrollToEnd();
    }
};
</script>
