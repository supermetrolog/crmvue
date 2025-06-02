<template>
    <div class="messenger-quiz__surveys">
        <Spinner v-if="surveysIsLoading" small label="Загрузка завершенных опросов" />
        <AccordionSimple v-else-if="surveysCount">
            <template #title>
                <AccordionSimpleTriggerButton
                    :label="`Последний опрос - ${lastSurveyCreatedAt} | ${surveysCount} завершенных`"
                />
            </template>
            <template #body>
                <div class="px-1 pt-2">
                    <UiButton
                        v-if="surveysCount > 5"
                        v-tippy="'В разработке..'"
                        @click="showAllSurveys"
                        small
                        color="white"
                        icon="fa-solid fa-eye"
                        class="ml-auto mb-2"
                    >
                        <span>Просмотреть все</span>
                    </UiButton>
                    <div class="d-flex flex-column gap-1">
                        <MessengerQuizInlineElement
                            v-for="survey in surveys"
                            :key="survey.id"
                            @show="showSurvey({ surveyId: survey.id })"
                            :quiz="survey"
                        />
                    </div>
                </div>
            </template>
        </AccordionSimple>
    </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import { useNotify } from '@/utils/use/useNotify.js';
import MessengerQuizInlineElement from '@/components/MessengerQuiz/MessengerQuizInlineElement.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useStore } from 'vuex';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import Spinner from '@/components/common/Spinner.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import AccordionSimpleTriggerButton from '@/components/common/Accordion/AccordionSimpleTriggerButton.vue';
import { toBeautifulDateFormat } from '@/utils/formatters/date.js';

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
        surveys.value = response.data.slice(0, 5).toReversed();
        surveysCount.value = response.pagination.totalCount;

        emit('last-survey-loaded', response.data?.[0]);
    }

    surveysIsLoading.value = false;
}

const lastSurveyCreatedAt = computed(() => {
    if (surveys.value.length) {
        return toBeautifulDateFormat(surveys.value[surveys.value.length - 1].created_at);
    }

    return null;
});

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
