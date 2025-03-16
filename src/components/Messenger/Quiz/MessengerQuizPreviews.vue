<template>
    <div class="messenger-quiz__surveys">
        <Spinner v-if="surveysIsLoading" small label="Загрузка завершенных опросов.." class="" />
        <template v-else>
            <UiButton
                v-if="surveysCount > 3"
                v-tippy="'В разработке..'"
                @click="showAllSurveys"
                class="ml-auto"
                small
                color="light"
                icon="fa-solid fa-eye"
                shadow
            >
                <span>({{ surveysCount }})</span>
            </UiButton>
            <MessengerQuizInlineElement
                v-for="survey in surveys"
                :key="survey.id"
                @show="showSurvey({ surveyId: survey.id })"
                :quiz="survey"
            />
        </template>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useNotify } from '@/utils/use/useNotify.js';
import MessengerQuizInlineElement from '@/components/Messenger/Quiz/MessengerQuizInlineElement.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useStore } from 'vuex';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import Spinner from '@/components/common/Spinner.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';

const emit = defineEmits(['last-survey-loaded']);

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
        surveys.value = response.data.slice(0, 3).toReversed();
        surveysCount.value = response.pagination.totalCount;

        emit('last-survey-loaded', response.data?.[0]);
    }

    surveysIsLoading.value = false;
}

// show

const notify = useNotify();

function showAllSurveys() {
    notify.info('Функция находится в разработке..', 'Функция недоступна');
}

onMounted(() => {
    if (store.getters['Messenger/currentChatHasLastCall']) fetchSurveys();
    else emit('last-survey-loaded', null);
});

// preview

const { show: showSurvey } = useAsyncPopup('surveyPreview');
</script>
