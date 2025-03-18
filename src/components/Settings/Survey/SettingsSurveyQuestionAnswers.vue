<template>
    <DashboardCard>
        <template #header>
            <SettingsFormHeader
                @add="openForm"
                @load="loadQuestionAnswers"
                @refresh="fetchQuestionAnswers"
                title="Управление вариантами ответа"
                :size="questionAnswers.length"
                :pagination="pagination"
            />
        </template>
        <div class="row align-items-end mb-3">
            <UiInput
                v-model="filters.search"
                class="col-6"
                label="Поиск"
                placeholder="ID вопроса, заголовок вопроса, текста ответа.."
            />
            <UiCol cols="2">
                <Button
                    @click="clearFilters"
                    :disabled="!hasFilters || isLoading"
                    danger
                    сдфыы
                    icon
                >
                    <i class="fa-solid fa-trash" />
                    <span>Сбросить</span>
                </Button>
            </UiCol>
            <MultiSelect
                v-model="sort"
                label="Сортировка"
                placeholder="Выберите сортировку"
                :options="sortingOptions"
                class="col-4"
            />
            <UiInput v-model="filters.question_id" class="col-2" label="ID вопроса" type="number" />
            <UiInput v-model="filters.field_id" class="col-2" label="ID Field" type="number" />
            <UiCol cols="8">
                <div class="d-flex gap-2">
                    <UiCheckbox v-model="filters.has_effects" :true-value="1" :false-value="null">
                        С эффектами
                    </UiCheckbox>
                </div>
            </UiCol>
        </div>
        <div class="row position-relative">
            <Loader v-if="isLoading && questionAnswers.length" small label="Загрузка вариантов.." />
            <Spinner v-else-if="isLoading" small center label="Загрузка вариантов.." />
            <UiCol v-else-if="!questionAnswers.length" cols="4" class="mx-auto my-2">
                <EmptyData> Список вариантов ответа пуст.. </EmptyData>
            </UiCol>
            <UiCol v-for="element in questionAnswers" :key="element.id" :cols="4">
                <SettingsFormElement
                    @delete="deleteQuestionAnswer(element)"
                    @edit="editQuestionAnswer(element)"
                    :element="element"
                    can-edit
                    :is-deleted="element.deleted_at !== null"
                    class="h-100"
                >
                    <SettingsSurveyQuestionAnswersElement :element="element" />
                </SettingsFormElement>
            </UiCol>
            <div v-if="questionAnswers.length" class="col-12">
                <Pagination
                    @load-more="loadQuestionAnswers"
                    :pagination
                    :loading="moreIsLoading"
                    :disabled="moreIsLoading"
                />
            </div>
        </div>
        <teleport to="body">
            <FormQuestionAnswer
                v-if="formIsVisible"
                @close="closeForm"
                @updated="onQuestionAnswerUpdated"
                @created="onQuestionAnswerCreated"
                @deleted="onQuestionAnswerDeleted"
                :options-loading="optionsIsLoading"
                :fields="options.fields"
                :questions="options.questions"
                :effects="options.effects"
                :form-data="editingQuestionAnswer"
            />
        </teleport>
    </DashboardCard>
</template>
<script setup>
import SettingsFormHeader from '@/components/Settings/SettingsFormHeader.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import SettingsFormElement from '@/components/Settings/SettingsFormElement.vue';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import Loader from '@/components/common/Loader.vue';
import api from '@/api/api.js';
import { computed, onMounted, reactive, ref, shallowRef, watch } from 'vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import FormQuestionAnswer from '@/components/Forms/FormQuestionAnswer.vue';
import SettingsSurveyQuestionAnswersElement from '@/components/Settings/Survey/SettingsSurveyQuestionAnswersElement.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { useDebounceFn } from '@vueuse/core';
import Button from '@/components/common/Button.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import EmptyData from '@/components/common/EmptyData.vue';
import UiCheckbox from '@/components/common/Forms/UiCheckbox.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import Pagination from '@/components/common/Pagination/Pagination.vue';
import Spinner from '@/components/common/Spinner.vue';

// options

const sortingOptions = [
    {
        value: 'id',
        label: 'По умолчанию (по ID)'
    },
    {
        value: 'updated_at',
        label: 'По дате обновления (сначала старые)'
    },
    {
        value: '-updated_at',
        label: 'По дате обновления (сначала новые)'
    },
    {
        value: 'created_at',
        label: 'По дате создания (сначала старые)'
    },
    {
        value: '-created_at',
        label: 'По дате создания (сначала новые)'
    },
    {
        value: 'question_id',
        label: 'По ID вопроса (от меньш. к больше.)'
    },
    {
        value: '-question_id',
        label: 'По ID вопроса (от больш. к меньш.)'
    }
];

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

// answers

const questionAnswers = ref([]);
const { isLoading } = useDelayedLoader(true);
const pagination = ref(null);

function createPayload() {
    return {
        question_id: filters.question_id,
        search: filters.search,
        field_id: filters.field_id,
        has_effects: filters.has_effects,
        sort: sort.value
    };
}

const fetchQuestionAnswers = async () => {
    isLoading.value = true;

    const response = await api.question.getAnswersWithQuestions({ page: 1, ...createPayload() });
    if (response) {
        questionAnswers.value = response.data;
        pagination.value = response.pagination;
    }

    isLoading.value = false;
};

const moreIsLoading = ref(false);

const loadQuestionAnswers = async () => {
    moreIsLoading.value = true;

    const response = await api.question.getAnswersWithQuestions({
        page: pagination.value.currentPage + 1,
        ...createPayload()
    });

    if (response) {
        questionAnswers.value.push(...response.data);
        pagination.value = response.pagination;
    }

    moreIsLoading.value = false;
};

onMounted(fetchQuestionAnswers);

// filters

const filters = reactive({
    question_id: null,
    search: null,
    field_id: null,
    has_effects: null
});

const sort = ref('-updated_at');

const debouncedFetchQuestionsAnswers = useDebounceFn(fetchQuestionAnswers, 500);

watch(filters, debouncedFetchQuestionsAnswers);
watch(sort, debouncedFetchQuestionsAnswers);

function clearFilters() {
    filters.question_id = null;
    filters.search = null;
    filters.field_id = null;
    filters.has_effects = null;
}

const hasFilters = computed(() => {
    return Object.values(filters).some(isNotNullish);
});

// form

const formIsVisible = shallowRef(false);

function openForm() {
    if (!optionsIsInitialized.value && !optionsIsLoading.value) fetchOptions();
    formIsVisible.value = true;
}

function closeForm() {
    formIsVisible.value = false;
    editingQuestionAnswer.value = null;
}

// create

const onQuestionAnswerCreated = () => {
    closeForm();
    fetchQuestionAnswers();
};

// edit

const editingQuestionAnswer = ref(null);

function editQuestionAnswer(answer) {
    editingQuestionAnswer.value = answer;
    openForm();
}

const onQuestionAnswerUpdated = questionAnswer => {
    const questionAnswerElement = questionAnswers.value.find(
        element => element.id === questionAnswer.id
    );
    if (questionAnswerElement) Object.assign(questionAnswerElement, questionAnswer);

    closeForm();
};

// delete

const { confirm } = useConfirm();
const notify = useNotify();

async function deleteQuestionAnswer(answer) {
    const confirmed = await confirm(
        'Удалить вариант ответа',
        `Вы действительно хотите удалить Вариант ответа #${answer.id}?`
    );

    if (!confirmed) return;

    const deleted = await api.question.deleteAnswer(answer.id);
    if (deleted) {
        notify.success('Вариант ответа успешно удален.');
        fetchQuestionAnswers();
    }
}

const onQuestionAnswerDeleted = () => {
    fetchQuestionAnswers();
};
</script>
