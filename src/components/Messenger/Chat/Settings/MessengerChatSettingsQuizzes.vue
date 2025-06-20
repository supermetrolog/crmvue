<template>
    <div class="messenger-chat-settings-window modal active">
        <div class="modal__container">
            <div class="modal__header">
                <p>Список завершенных опросов</p>
                <div class="modal__close">
                    <UiTooltipIcon
                        @click.prevent="$emit('close')"
                        tooltip="Закрыть окно"
                        icon="fa-solid fa-xmark"
                        class="icon"
                    />
                </div>
            </div>
            <div class="modal__body">
                <div class="messenger-chat-settings-window__content">
                    <div class="messenger-chat-settings-window__settings">
                        <UiInput
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
                        <InfiniteLoading :key="querySearch" @infinite="load">
                            <template #complete>
                                <EmptyLabel>Опросов больше нет..</EmptyLabel>
                            </template>
                            <template #spinner>
                                <Spinner />
                            </template>
                        </InfiniteLoading>
                    </div>
                    <EmptyData v-else>Список опросов пуст..</EmptyData>
                </div>
            </div>
        </div>
        <teleport to="body">
            <Modal
                @close="currentQuizPreview = null"
                :show="currentQuizPreview"
                :title="currentQuizPreviewTitle"
                width="800"
            >
                <SurveyCard :quiz-id="currentQuizPreview?.id" />
            </Modal>
        </teleport>
    </div>
</template>
<script setup>
import EmptyData from '@/components/common/EmptyData.vue';
import MessengerQuizElement from '@/components/MessengerQuiz/MessengerQuizElement.vue';
import Modal from '@/components/common/Modal.vue';
import SurveyCard from '@/components/SurveyCard/SurveyCard.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import MessengerQuizElementSkeleton from '@/components/MessengerQuiz/MessengerQuizElementSkeleton.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { useInfiniteLoading } from '@/composables/useInfiniteLoading.js';
import { useDebouncedComputed } from '@/composables/useDebouncedComputed.js';
import { computed, ref, shallowRef, watch } from 'vue';
import Spinner from '@/components/common/Spinner.vue';
import InfiniteLoading from 'v3-infinite-loading';
import EmptyLabel from '@/components/common/EmptyLabel.vue';
import { useStore } from 'vuex';
import { toDateFormat } from '@/utils/formatters/date.js';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';

defineEmits(['close']);

const store = useStore();
const { isLoading } = useDelayedLoader();

const loadQuizzes = async page => {
    return await store.dispatch('Messenger/getCurrentChatQuizzes', {
        page,
        search: querySearch.value?.length ? querySearch.value : undefined
    });
};

const { items: quizzes, pagination, load } = useInfiniteLoading(loadQuizzes);

const querySearch = ref(null);
const debouncedQuerySearch = useDebouncedComputed(querySearch);
const currentQuizPreview = ref(null);
const lastQuizzesSize = shallowRef(7);

const currentQuizPreviewTitle = computed(() => {
    return 'Просмотр опроса';
    // eslint-disable-next-line no-unreachable
    let title = currentQuizPreview.value.author.short_name;

    if (currentQuizPreview.value.contact) title += `, с ${currentQuizPreview.value.contact}, от `;
    else title += ', без вонка, от ';

    return title + toDateFormat(currentQuizPreview.value.created_at, 'DD.MM.YYYY');
});

watch(querySearch, () => {
    fetchQuizzes();
});

watch(isLoading, value => {
    if (!value) lastQuizzesSize.value = Math.min(quizzes.value.length, 7) || 1;
});

const fetchQuizzes = async () => {
    isLoading.value = true;

    const response = await loadQuizzes();

    if (response) {
        pagination.value = response.pagination;
        quizzes.value = response.data;
    }

    isLoading.value = false;
};

fetchQuizzes();
</script>
