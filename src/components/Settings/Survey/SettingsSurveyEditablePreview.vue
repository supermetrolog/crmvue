<template>
    <DashboardCard title="Список вопросов">
        <template #header>
            <SettingsFormHeader
                @add="openQuestionForm"
                @load="loadQuestions"
                @refresh="fetchQuestions"
                title="Список вопросов"
                :pagination="questionsPagination"
            >
                <template #extra>
                    <DashboardChip
                        v-if="currentUserIsAdmin"
                        @click="throwError"
                        class="settings-form__button settings-form__button--info"
                        :class="{ disabled: refreshIsLoading }"
                    >
                        <i class="fa-solid fa-user-cog" />
                        <span class="ml-1">Секретная кнопка</span>
                    </DashboardChip>
                    <DashboardChip
                        @click="refreshQuestions"
                        class="settings-form__button settings-form__button--info"
                        :class="{ disabled: refreshIsLoading }"
                    >
                        <i class="fa-solid fa-rotate" />
                        <span class="ml-1">Обновить вопросы в чате</span>
                    </DashboardChip>
                </template>
            </SettingsFormHeader>
        </template>
        <AnimationTransition :speed="0.2">
            <Button v-if="viewQuestionsIsVisible" @click="viewQuestionsIsVisible = false" danger>
                Скрыть подробный просмотр вопросов
            </Button>
            <Button v-else @click="openQuestionsPreview" success>
                Запустить подробный просмотр вопросов в реальном времени
            </Button>
        </AnimationTransition>
        <AnimationTransition :speed="0.5">
            <div v-if="viewQuestionsIsVisible" class="mt-3">
                <div v-if="previewQuestions.length" class="row">
                    <Loader v-if="questionsIsLoading" />
                    <div v-for="question in previewQuestions" :key="question.id" class="col-6">
                        <MessengerQuizEditableQuestion
                            @edit-answer="editQuestionAnswer"
                            @add-answer="addAnswer"
                            @edit="editQuestion(question)"
                            @delete="deleteQuestion(question)"
                            :question="question"
                            class="settings-form__element"
                        />
                    </div>
                </div>
                <template v-else>
                    <Spinner v-if="questionsIsLoading" />
                    <EmptyData v-else>Список вопросов пуст</EmptyData>
                </template>
            </div>
        </AnimationTransition>
        <teleport to="body">
            <FormQuestion
                v-if="questionFormIsVisible"
                @close="closeQuestionForm"
                @updated="onQuestionUpdated"
                @created="onQuestionCreated"
                @deleted="onQuestionDeleted"
                :form-data="editingQuestion"
            />
            <FormQuestionAnswer
                v-if="questionAnswerFormIsVisible"
                @close="closeQuestionAnswerForm"
                @updated="onQuestionAnswerUpdated"
                @created="onQuestionAnswerCreated"
                @deleted="onQuestionAnswerDeleted"
                :fields="options.fields"
                :questions="options.questions"
                :effects="options.effects"
                :options-loading="optionsIsLoading"
                :form-data="editingQuestionAnswer"
            />
        </teleport>
    </DashboardCard>
</template>
<script setup>
import SettingsFormHeader from '@/components/Settings/SettingsFormHeader.vue';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import Loader from '@/components/common/Loader.vue';
import api from '@/api/api.js';
import { computed, reactive, ref, shallowRef } from 'vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import FormQuestionAnswer from '@/components/Forms/FormQuestionAnswer.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { useNotify } from '@/utils/use/useNotify.js';
import Button from '@/components/common/Button.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import Spinner from '@/components/common/Spinner.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import MessengerQuizEditableQuestion from '@/components/MessengerQuiz/Question/MessengerQuizEditableQuestion.vue';
import { useStore } from 'vuex';
import FormQuestion from '@/components/Forms/FormQuestion.vue';
import { useAuth } from '@/composables/useAuth.js';

const { currentUserIsAdmin } = useAuth();

function throwError() {
    throw new Error('Test Error');
}

const defaultFields = {
    RADIO: 1,
    CHECKBOX: 2,
    TEXTAREA: 3
};

const fieldsByCategory = {
    'yes-no': defaultFields.RADIO,
    checkbox: defaultFields.CHECKBOX,
    'text-answer': defaultFields.TEXTAREA,
    tab: defaultFields.CHECKBOX
};

// options

const options = reactive({
    fields: [],
    questions: [],
    effects: []
});

const optionsIsLoading = ref(false);

async function fetchFieldOptions() {
    const response = await api.field.search({ 'per-page': 0 });
    if (response) {
        options.fields = response.data.map(element => ({
            value: element.id,
            label: `#${element.id} ${element.field_type} (${element.type})`
        }));
    }
}

async function fetchQuestionOptions() {
    const response = await api.question.search({ 'per-page': 0 });

    if (response) {
        options.questions = response.data.map(element => ({
            value: element.id,
            label: `#${element.id} ${element.text}`
        }));
    }
}

async function fetchEffectOptions() {
    const response = await api.effect.search({ 'per-page': 0 });
    if (response) {
        options.effects = response.data.map(effect => ({
            value: effect.id,
            label: effect.title
        }));
    }
}

const optionsIsInitialized = ref(false);

async function fetchOptions() {
    optionsIsLoading.value = true;

    await Promise.allSettled([fetchFieldOptions(), fetchQuestionOptions(), fetchEffectOptions()]);

    optionsIsLoading.value = false;
    optionsIsInitialized.value = true;
}

// forms

const questionAnswerFormIsVisible = shallowRef(false);
const questionFormIsVisible = shallowRef(false);

function openQuestionAnswerForm() {
    if (!optionsIsInitialized.value && !optionsIsLoading.value) fetchOptions();
    questionAnswerFormIsVisible.value = true;
}

function openQuestionForm() {
    questionFormIsVisible.value = true;
}

function closeQuestionAnswerForm() {
    questionAnswerFormIsVisible.value = false;
    editingQuestionAnswer.value = null;
}

const closeQuestionForm = () => {
    questionFormIsVisible.value = false;
    editingQuestion.value = null;
};

// fetch

const questions = ref([]);
const { isLoading: questionsIsLoading } = useDelayedLoader();
const questionsPagination = ref(null);

async function loadQuestions() {
    const response = await api.question.list(questionsPagination.value.currentPage + 1);

    if (response) {
        questions.value.push(...response.data);
        questionsPagination.value = response.pagination;
    }
}

async function fetchQuestions() {
    questionsIsLoading.value = true;

    const response = await api.question.getWithAnswers();
    if (response) {
        questions.value = response.data;
        questionsPagination.value = response.pagination;
    }

    questionsIsLoading.value = false;
}

// view

const viewQuestionsIsVisible = ref(false);

function openQuestionsPreview() {
    fetchQuestions();
    viewQuestionsIsVisible.value = true;
}

const previewQuestions = computed(() =>
    questions.value.filter(element => element.deleted_at === null)
);

// refresh

const { isLoading: refreshIsLoading } = useDelayedLoader();
const store = useStore();

async function refreshQuestions() {
    refreshIsLoading.value = true;
    await store.dispatch('fetchQuestions');
    refreshIsLoading.value = false;
}

// edit

const editingQuestionAnswer = ref(null);
const editingQuestion = ref(null);

function editQuestion(question) {
    editingQuestion.value = question;

    openQuestionForm();
}

function editQuestionAnswer(answer) {
    editingQuestionAnswer.value = answer;

    openQuestionAnswerForm();
}

// create

function addAnswer(questionID, answerType) {
    editingQuestionAnswer.value = {
        category: answerType,
        question_id: questionID,
        field_id: fieldsByCategory[answerType]
    };

    openQuestionAnswerForm();
}

// delete

const notify = useNotify();
const { confirm } = useConfirm();

async function deleteQuestion(question) {
    const confirmed = await confirm(
        'Удалить вопрос',
        `Вы действительно хотите удалить Вопрос "#${question.id} ${question.text}"?`
    );
    if (!confirmed) return;

    const deleted = await api.question.delete(question.id);
    if (deleted) {
        notify.success('Вопрос успешно удален.');
        fetchQuestions();
    }
}

function onQuestionAnswerUpdated() {
    closeQuestionAnswerForm();
    fetchQuestions();
}

function onQuestionAnswerCreated() {
    closeQuestionAnswerForm();
    fetchQuestions();
}

function onQuestionAnswerDeleted() {
    fetchQuestions();
}

function onQuestionUpdated(question) {
    const questionElement = questions.value.find(element => element.id === question.id);
    if (questionElement) Object.assign(questionElement, question);

    closeQuestionForm();
}

function onQuestionCreated() {
    fetchQuestions();
    closeQuestionForm();
}

const onQuestionDeleted = () => {
    fetchQuestions();
};
</script>
