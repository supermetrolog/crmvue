<template>
    <div class="container-fluid">
        <Teleport to="body">
            <FormField
                v-if="fieldFormIsVisible"
                @close="closeFieldForm"
                @updated="onFieldUpdated"
                @created="onFieldCreated"
                @deleted="fetchFields"
                :form-data="editingField"
            />
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
                :fields="fieldsOptions"
                :questions="questionsOptions"
                :effects="effectsOptions"
                :form-data="editingQuestionAnswer"
            />
        </Teleport>
        <div class="row">
            <div class="col-12">
                <DashboardCard title="Список вопросов">
                    <template #header>
                        <SettingsFormHeader
                            @add="questionFormIsVisible = true"
                            @load="loadQuestions"
                            @refresh="fetchQuestions"
                            title="Список вопросов"
                            :size="previewQuestions.length"
                            :pagination="questionsPagination"
                        >
                            <template #extra>
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
                        <Button
                            v-if="viewQuestionsIsVisible"
                            @click="viewQuestionsIsVisible = false"
                            danger
                        >
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
                                <div
                                    v-for="question in previewQuestions"
                                    :key="question.id"
                                    class="col-6"
                                >
                                    <MessengerQuizQuestion
                                        @edit-answer="editQuestionField"
                                        @add-answer="addAnswer"
                                        @edit="editQuestion(question)"
                                        @delete="deleteQuestion(question)"
                                        show-id
                                        :question="question"
                                        class="settings-form__element"
                                        can-edit
                                    />
                                </div>
                            </div>
                            <template v-else>
                                <Spinner v-if="questionsIsLoading" />
                                <EmptyData v-else>Список вопросов пуст</EmptyData>
                            </template>
                        </div>
                    </AnimationTransition>
                </DashboardCard>
            </div>
            <div class="col-6">
                <DashboardCard>
                    <template #header>
                        <SettingsFormHeader
                            @add="fieldFormIsVisible = true"
                            @load="loadFields"
                            @refresh="fetchFields"
                            title="Управления полями"
                            :size="fields.length"
                            :pagination="fieldsPagination"
                        />
                    </template>
                    <DashboardChip class="mb-2 dashboard-bg-warning-l mw-100">
                        <i class="fa-solid fa-exclamation-triangle" />
                        <span>
                            Пожалуйста, будьте аккуратны. Данные модели следует изменять и добавлять
                            только для новых обновлений. Неправильное изменение может вызвать ошибку
                            мессенджера.
                        </span>
                    </DashboardChip>
                    <div class="d-flex flex-wrap gap-2 mb-2">
                        <Loader v-if="fieldsIsLoading" small />
                        <SettingsFormElement
                            v-for="field in fields"
                            :key="field.id"
                            @delete="deleteField(field)"
                            @edit="editField(field)"
                            :element="field"
                            :is-deleted="field.deleted_at !== null"
                            can-edit
                        >
                            <template #text="{ item }">
                                <span class="mr-1">#{{ item.id }}</span>
                                <span>{{ item.field_type }}({{ item.type }})</span>
                            </template>
                        </SettingsFormElement>
                    </div>
                </DashboardCard>
            </div>
            <div class="col-6">
                <DashboardCard>
                    <template #header>
                        <SettingsFormHeader
                            @add="questionFormIsVisible = true"
                            @load="loadQuestions"
                            @refresh="fetchQuestions"
                            title="Управление вопросами"
                            :size="questions.length"
                            :pagination="questionsPagination"
                        />
                    </template>
                    <div class="d-flex flex-wrap gap-2 mb-2">
                        <Loader v-if="questionsIsLoading" small />
                        <SettingsFormElement
                            v-for="question in questions"
                            :key="question.id"
                            @delete="deleteQuestion(question)"
                            @edit="editQuestion(question)"
                            :element="question"
                            can-edit
                            :is-deleted="question.deleted_at !== null"
                        >
                            <template #text="{ item }">
                                <span class="mr-1">#{{ item.id }}</span>
                                <span>{{ item.text }}</span>
                            </template>
                        </SettingsFormElement>
                    </div>
                </DashboardCard>
            </div>
            <div class="col-12">
                <DashboardCard>
                    <template #header>
                        <SettingsFormHeader
                            @add="questionAnswerFormIsVisible = true"
                            @load="loadQuestionAnswers"
                            @refresh="fetchQuestionAnswers"
                            title="Управление вариантами ответа"
                            :size="questionAnswers.length"
                            :pagination="questionAnswersPagination"
                        />
                    </template>
                    <div class="d-flex flex-wrap gap-2 mb-2">
                        <Loader v-if="answersIsLoading" small />
                        <SettingsFormElement
                            v-for="element in questionAnswers"
                            :key="element.id"
                            @delete="deleteQuestionAnswer(element)"
                            @edit="editQuestionAnswer(element)"
                            :element="element"
                            can-edit
                            :is-deleted="element.deleted_at !== null"
                        >
                            <template #text="{ item }">
                                <span class="mr-1">#{{ item.id }}</span>
                                <span class="mr-1">
                                    Answer for <i>Question #{{ item.question_id }},</i>
                                </span>
                                <span class="mr-1">
                                    with category <i>"{{ item.category }}"</i>
                                </span>
                                <span v-if="item.value === null || item.value.length === 0">
                                    and without label
                                </span>
                                <span v-else>
                                    and with label <i>"{{ item.value }}"</i>
                                </span>
                            </template>
                        </SettingsFormElement>
                    </div>
                </DashboardCard>
            </div>
        </div>
    </div>
</template>

<script setup>
import FormField from '@/components/Forms/FormField.vue';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import FormQuestion from '@/components/Forms/FormQuestion.vue';
import MessengerQuizQuestion from '@/components/Messenger/Quiz/MessengerQuizQuestion.vue';
import { computed, onMounted, ref, shallowRef } from 'vue';
import api from '@/api/api.js';
import EmptyData from '@/components/common/EmptyData.vue';
import FormQuestionAnswer from '@/components/Forms/FormQuestionAnswer.vue';
import Spinner from '@/components/common/Spinner.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { useNotify } from '@/utils/useNotify.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Button from '@/components/common/Button.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import SettingsFormHeader from '@/components/Settings/SettingsFormHeader.vue';
import Loader from '@/components/common/Loader.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import SettingsFormElement from '@/components/Settings/SettingsFormElement.vue';
import { useStore } from 'vuex';

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

const { confirm } = useConfirm();
const notify = useNotify();
const store = useStore();

const questions = ref([]);
const { isLoading: questionsIsLoading } = useDelayedLoader();
const questionsPagination = ref(null);

const fields = ref([]);
const { isLoading: fieldsIsLoading } = useDelayedLoader();
const fieldsPagination = ref(null);

const { isLoading: refreshIsLoading } = useDelayedLoader();

const questionAnswers = ref([]);
const { isLoading: answersIsLoading } = useDelayedLoader();
const questionAnswersPagination = ref(null);

const effects = ref([]);
const { isLoading: effectsIsLoading } = useDelayedLoader();
const effectsPagination = ref(null);

const viewQuestionsIsVisible = shallowRef(false);
const fieldFormIsVisible = shallowRef(false);
const questionFormIsVisible = shallowRef(false);
const questionAnswerFormIsVisible = shallowRef(false);

const editingField = shallowRef(false);
const editingQuestion = shallowRef(false);
const editingQuestionAnswer = shallowRef(false);

const previewQuestions = computed(() =>
    questions.value.filter(element => element.deleted_at === null)
);

const fieldsOptions = computed(() => {
    return fields.value.map(element => ({
        value: element.id,
        label: `#${element.id} ${element.field_type} (${element.type})`
    }));
});

const questionsOptions = computed(() => {
    return questions.value.map(element => ({
        value: element.id,
        label: `#${element.id} ${element.text}`
    }));
});

const effectsOptions = computed(() => {
    return effects.value.map(effect => ({
        value: effect.id,
        label: effect.title
    }));
});

const closeQuestionAnswerForm = () => {
    questionAnswerFormIsVisible.value = false;
    editingQuestionAnswer.value = null;
};

const closeQuestionForm = () => {
    questionFormIsVisible.value = false;
    editingQuestion.value = null;
};

const closeFieldForm = () => {
    fieldFormIsVisible.value = false;
    editingField.value = null;
};

const fetchQuestions = async (page = 1) => {
    questionsIsLoading.value = true;

    const response = await api.question.getWithAnswers(page);
    if (response) {
        questions.value = response.data;
        questionsPagination.value = response.pagination;
    }

    questionsIsLoading.value = false;
};

const fetchFields = async (page = 1) => {
    fieldsIsLoading.value = true;

    const response = await api.field.list(page);
    if (response) {
        fields.value = response.data;
        fieldsPagination.value = response.pagination;
    }

    fieldsIsLoading.value = false;
};

const fetchQuestionAnswers = async (page = 1) => {
    answersIsLoading.value = true;

    const response = await api.question.getAnswers(page);
    if (response) {
        questionAnswers.value = response.data;
        questionAnswersPagination.value = response.pagination;
    }

    answersIsLoading.value = false;
};

const fetchEffects = async (page = 1) => {
    effectsIsLoading.value = true;

    const response = await api.effect.list(page);
    if (response) {
        effects.value = response.data;
        effectsPagination.value = response.pagination;
    }

    effectsIsLoading.value = false;
};

const loadFields = async () => {
    const response = await api.field.list(fieldsPagination.value.currentPage + 1);

    if (response) {
        fields.value.push(...response.data);
        fieldsPagination.value = response.pagination;
    }
};

const loadQuestions = async () => {
    const response = await api.question.list(questionsPagination.value.currentPage + 1);

    if (response) {
        questions.value.push(...response.data);
        questionsPagination.value = response.pagination;
    }
};

const loadQuestionAnswers = async () => {
    const response = await api.question.getAnswers(questionAnswersPagination.value.currentPage + 1);

    if (response) {
        questionAnswers.value.push(...response.data);
        questionAnswersPagination.value = response.pagination;
    }
};

const deleteField = async field => {
    const confirmed = await confirm(
        `Вы действительно хотите удалить Поле "#${field.id} ${field.field_type}(${field.type})"?`
    );
    if (!confirmed) return;

    const deleted = await api.field.delete(field.id);
    if (deleted) {
        notify.success('Field успешно удалено.');
        await Promise.allSettled([fetchFields(), fetchQuestions(), fetchQuestionAnswers()]);
    }
};

const editField = field => {
    editingField.value = field;
    fieldFormIsVisible.value = true;
};

const deleteQuestion = async question => {
    const confirmed = await confirm(
        `Вы действительно хотите удалить Вопрос "#${question.id} ${question.text}"?`
    );
    if (!confirmed) return;

    const deleted = await api.question.delete(question.id);
    if (deleted) {
        notify.success('Question успешно удален.');
        await Promise.allSettled([fetchQuestions(), fetchQuestionAnswers()]);
    }
};

const editQuestion = question => {
    editingQuestion.value = question;
    questionFormIsVisible.value = true;
};

const deleteQuestionAnswer = async answer => {
    const confirmed = await confirm(
        `Вы действительно хотите удалить Вариант ответа #${answer.id}?`
    );
    if (!confirmed) return;

    const deleted = await api.question.deleteAnswer(answer.id);
    if (deleted) {
        notify.success('QuestionAnswer успешно удален.');
        await Promise.allSettled([fetchQuestionAnswers(), fetchQuestions()]);
    }
};

const editQuestionAnswer = answer => {
    editingQuestionAnswer.value = answer;
    questionAnswerFormIsVisible.value = true;
};

const onFieldCreated = () => {
    closeFieldForm();
    fetchFields();
    if (viewQuestionsIsVisible.value) fetchQuestions();
};

const onFieldUpdated = field => {
    const fieldElement = fields.value.find(element => element.id === field.id);
    if (fieldElement) Object.assign(fieldElement, field);

    closeFieldForm();
    if (viewQuestionsIsVisible.value) fetchQuestions();
    fetchQuestionAnswers();
};

const onQuestionUpdated = question => {
    const questionElement = questions.value.find(element => element.id === question.id);
    if (questionElement) Object.assign(questionElement, question);

    closeQuestionForm();
};

const onQuestionCreated = () => {
    fetchQuestions();
    closeQuestionForm();
};

const onQuestionAnswerUpdated = questionAnswer => {
    const questionAnswerElement = questionAnswers.value.find(
        element => element.id === questionAnswer.id
    );
    if (questionAnswerElement) Object.assign(questionAnswerElement, questionAnswer);

    closeQuestionAnswerForm();
    if (viewQuestionsIsVisible.value) fetchQuestions();
};

const onQuestionAnswerCreated = () => {
    closeQuestionAnswerForm();
    fetchQuestionAnswers();

    if (viewQuestionsIsVisible.value) fetchQuestions();
};

const editQuestionField = answer => {
    editingQuestionAnswer.value = answer;
    questionAnswerFormIsVisible.value = true;
};

const onQuestionDeleted = () => {
    fetchQuestions();
    fetchQuestionAnswers();
};

const onQuestionAnswerDeleted = () => {
    fetchQuestionAnswers();
    if (viewQuestionsIsVisible.value) fetchQuestions();
};

const openQuestionsPreview = () => {
    fetchQuestions();
    viewQuestionsIsVisible.value = true;
};

const addAnswer = (questionID, answerType) => {
    editingQuestionAnswer.value = {
        category: answerType,
        question_id: questionID,
        field_id: fieldsByCategory[answerType]
    };

    questionAnswerFormIsVisible.value = true;
};

const refreshQuestions = async () => {
    refreshIsLoading.value = true;
    await store.dispatch('fetchQuestions');
    refreshIsLoading.value = false;
};

onMounted(() => {
    fetchQuestions();
    fetchFields();
    fetchQuestionAnswers();
    fetchEffects();
});
</script>
