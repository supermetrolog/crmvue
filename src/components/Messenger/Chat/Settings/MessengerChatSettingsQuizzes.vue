<template>
    <div class="messenger-chat-settings-window modal active">
        <div class="modal__container">
            <div class="modal__header">
                <p>Список завершенных опросов</p>
                <div class="modal__close">
                    <i
                        v-tippy="'Закрыть окно'"
                        @click.prevent="$emit('close')"
                        class="icon fa-solid fa-xmark"
                    ></i>
                </div>
            </div>
            <div class="modal__body">
                <div class="messenger-chat-settings-window__content">
                    <div class="messenger-chat-settings-window__settings">
                        <Input
                            v-model="debouncedQuerySearch"
                            placeholder="ФИО брокера или контакта"
                        />
                    </div>
                    <div v-if="isLoading" class="messenger-chat-settings-window__list">
                        <MessengerQuizElementSkeleton v-for="i in lastQuizzesSize" :key="i" />
                    </div>
                    <div v-else-if="quizzes.length" class="messenger-chat-settings-window__list">
                        <MessengerQuizElement
                            v-for="quiz in quizzes"
                            :key="quiz.id"
                            @click="currentQuizPreview = quiz"
                            :quiz="quiz"
                        />
                    </div>
                    <EmptyData v-else>Список опросов пуст..</EmptyData>
                </div>
            </div>
        </div>
        <teleport to="body">
            <Modal
                v-if="currentQuizPreview"
                @close="currentQuizPreview = null"
                :title="currentQuizPreviewTitle"
                width="800"
            >
                <MessengerQuizPreview :quiz="currentQuizPreview" />
            </Modal>
        </teleport>
    </div>
</template>
<script>
import EmptyData from '@/components/common/EmptyData.vue';
import MessengerQuizElement from '@/components/Messenger/Quiz/MessengerQuizElement.vue';
import Modal from '@/components/common/Modal.vue';
import MessengerQuizPreview from '@/components/Messenger/Quiz/MessengerQuizPreview.vue';
import Input from '@/components/common/Forms/Input.vue';
import dayjs from 'dayjs';
import MessengerQuizElementSkeleton from '@/components/Messenger/Quiz/MessengerQuizElementSkeleton.vue';
import { LoaderMixin } from '@/components/Messenger/loader.mixin';
import { DebouncedQuerySearchMixin } from '@/components/common/Forms/debounced.mixins';

export default {
    name: 'MessengerChatSettingsQuizzes',
    components: {
        MessengerQuizElementSkeleton,
        Input,
        MessengerQuizPreview,
        Modal,
        MessengerQuizElement,
        EmptyData
    },
    mixins: [LoaderMixin, DebouncedQuerySearchMixin],
    emits: ['close'],
    data() {
        return {
            quizzes: [],
            currentQuizPreview: null,
            lastQuizzesSize: 7
        };
    },
    computed: {
        currentQuizPreviewTitle() {
            let title = this.currentQuizPreview.author.short_name;

            if (this.currentQuizPreview.contact)
                title += `, с ${this.currentQuizPreview.contact}, от `;
            else title += ', без вонка, от ';

            return title + dayjs(this.currentQuizPreview.created_at).format('DD.MM.YYYY');
        }
    },
    watch: {
        querySearch() {
            this.fetchQuizzes();
        },
        isLoading(value) {
            if (!value) this.lastQuizzesSize = Math.min(this.quizzes.length, 7) || 1;
        }
    },
    methods: {
        async fetchQuizzes() {
            this.loadingState = true;

            this.quizzes = await this.$store.dispatch('Messenger/getCurrentChatQuizzes');

            this.loadingState = false;
        }
    },
    created() {
        this.fetchQuizzes();
    }
};
</script>
