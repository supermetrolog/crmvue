<template>
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
            <SettingsFormRowElement
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
            </SettingsFormRowElement>
        </div>
        <teleport to="body">
            <FormQuestion
                v-if="questionFormIsVisible"
                @close="closeQuestionForm"
                @updated="onQuestionUpdated"
                @created="onQuestionCreated"
                @deleted="onQuestionDeleted"
                :form-data="editingQuestion"
            />
        </teleport>
    </DashboardCard>
</template>
<script setup>
import SettingsFormHeader from '@/components/Settings/SettingsFormHeader.vue';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import Loader from '@/components/common/Loader.vue';
import api from '@/api/api.js';
import { onMounted, ref, shallowRef } from 'vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import FormQuestion from '@/components/Forms/FormQuestion.vue';
import { useNotify } from '@/utils/use/useNotify.js';
import SettingsFormRowElement from '@/components/Settings/SettingsFormRowElement.vue';
import { useConfirm } from '@/composables/useConfirm.js';

const onQuestionUpdated = question => {
    const questionElement = questions.value.find(element => element.id === question.id);
    if (questionElement) Object.assign(questionElement, question);

    closeQuestionForm();
};

const onQuestionCreated = () => {
    fetchQuestions();
    closeQuestionForm();
};

const onQuestionDeleted = () => {
    fetchQuestions();
};

const notify = useNotify();
const { confirm } = useConfirm();

const deleteQuestion = async question => {
    const confirmed = await confirm(
        `Вы действительно хотите удалить Вопрос "#${question.id} ${question.text}"?`
    );
    if (!confirmed) return;

    const deleted = await api.question.delete(question.id);
    if (deleted) {
        notify.success('Question успешно удален.');
        await Promise.allSettled([fetchQuestions()]);
    }
};

const editQuestion = question => {
    editingQuestion.value = question;
    questionFormIsVisible.value = true;
};

const loadQuestions = async () => {
    const response = await api.question.list(questionsPagination.value.currentPage + 1);

    if (response) {
        questions.value.push(...response.data);
        questionsPagination.value = response.pagination;
    }
};

const fetchQuestions = async () => {
    questionsIsLoading.value = true;

    const response = await api.question.getWithAnswers();
    if (response) {
        questions.value = response.data;
        questionsPagination.value = response.pagination;
    }

    questionsIsLoading.value = false;
};

const closeQuestionForm = () => {
    questionFormIsVisible.value = false;
    editingQuestion.value = null;
};

const editingQuestion = shallowRef(false);
const questionFormIsVisible = shallowRef(false);

const questions = ref([]);
const { isLoading: questionsIsLoading } = useDelayedLoader();
const questionsPagination = ref(null);

onMounted(fetchQuestions);
</script>
