<template>
    <div class="messenger-quiz__surveys">
        <Spinner v-if="surveysIsLoading" small label="Загрузка завершенных опросов.." class="" />
        <template v-else>
            <Button v-tippy="'В разработке..'" @click="showAllSurveys" class="ml-auto" small icon>
                <i class="fa-solid fa-eye"></i>
                <span>Посмотреть полный список завершенных опросов ({{ surveysCount }})</span>
            </Button>
            <MessengerQuizInlineElement
                v-for="survey in surveys"
                :key="survey.id"
                @show="showSurvey(survey.id)"
                :quiz="survey"
            />
            <Modal
                @close="surveyPreviewIsOpen = false"
                :show="surveyPreviewIsOpen"
                :width="900"
                :min-height="700"
                title="Просмотр результатов опросника"
            >
                <MessengerQuizPreview :quiz-id="previewedSurveyId" />
            </Modal>
        </template>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useNotify } from '@/utils/use/useNotify.js';
import MessengerQuizInlineElement from '@/components/Messenger/Quiz/MessengerQuizInlineElement.vue';
import Button from '@/components/common/Button.vue';
import { useStore } from 'vuex';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import Modal from '@/components/common/Modal.vue';
import MessengerQuizPreview from '@/components/Messenger/Quiz/Preview/MessengerQuizPreview.vue';
import Spinner from '@/components/common/Spinner.vue';

const store = useStore();

const { isLoading: surveysIsLoading } = useDelayedLoader(
    store.getters['Messenger/currentChatHasLastCall']
);

const surveys = ref([]);
const surveysCount = ref(0);

async function fetchSurveys() {
    surveysIsLoading.value = true;

    const response = await store.dispatch('Messenger/getCurrentChatQuizzes', {
        sort: '-created_at'
    });

    if (response) {
        surveys.value = response.data.slice(0, 3).reverse();
        surveysCount.value = response.pagination.totalCount;
    }

    surveysIsLoading.value = false;
}

// show

const surveyPreviewIsOpen = ref(false);
const previewedSurveyId = ref(null);

function showSurvey(surveyId) {
    previewedSurveyId.value = surveyId;
    surveyPreviewIsOpen.value = true;
}

const notify = useNotify();

function showAllSurveys() {
    notify.info('Функция находится в разработке..', 'Функция недоступна');
}

onMounted(() => {
    if (store.getters['Messenger/currentChatHasLastCall']) fetchSurveys();
});
</script>
