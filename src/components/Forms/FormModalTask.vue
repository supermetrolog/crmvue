<template>
    <UiModal
        v-model:visible="isVisible"
        @close="close"
        :title="isEditing ? `Редактирование задачи #${props?.id}` : 'Создание задачи'"
        :width="1200"
        :close-on-outside-click="false"
        custom-close
        class="task-form"
    >
        <div>
            <DashboardTableTasksItem :task="taskPreview" />
        </div>
        <Stepper v-model:step="step" @complete="submit" :steps="steps" :v="v$.form" keep-alive>
            <template #1>
                <UiField v-if="isEditing" color="light" class="task-form__warning mb-2 mx-auto">
                    <i class="fa-solid fa-warning" />
                    <span>
                        Для изменения исполнителя воспользуйтесь отдельной функций "Переназначить" в
                        карточке задачи.
                    </span>
                </UiField>
                <Spinner v-if="consultantsIsLoading" center />
                <UserPicker
                    v-else
                    v-model="form.user_id"
                    :disabled="isEditing"
                    single
                    :users="consultants"
                >
                    <template v-if="!isEditing" #after-search>
                        <div class="d-flex gap-2 mt-2">
                            <UiButton
                                @click.prevent="assignToSelf"
                                small
                                color="light"
                                icon="fa-solid fa-user-astronaut"
                                :disabled="assignedToSelf"
                            >
                                Назначить себе
                            </UiButton>
                            <UiButton
                                @click.prevent="assignToModerator"
                                small
                                color="light"
                                icon="fa-solid fa-user-tie"
                                :disabled="!canBeAssignedToModerator || assignedToModerator"
                            >
                                Назначить офис-менеджеру
                            </UiButton>
                        </div>
                    </template>
                </UserPicker>
            </template>
            <template #2>
                <div class="task-form__dates">
                    <DatePicker
                        v-model="form.date.start"
                        :presets="startPresets"
                        :min-date="!isEditing ? new Date() : undefined"
                        :v="v$.form.date.start"
                        presets-label="Начать через"
                        size="45px"
                        label="Дата старта"
                        required
                    />
                    <div class="task-form__dates-divider"></div>
                    <DatePicker
                        v-model="form.date.end"
                        :presets="endPresets"
                        :min-date="form.date.start"
                        :v="v$.form.date.end"
                        label="Дата окончания"
                        presets-label="Выполнить за"
                        size="45px"
                        required
                        :start-date="form.date.start"
                        :focus-start-date="endDateIsFocusedToStart"
                    />
                </div>
            </template>
            <template #3>
                <div class="row">
                    <MultiSelect
                        v-model="form.tags"
                        label="Тэги"
                        mode="tags"
                        searchable
                        class="col-12 mb-2"
                        :options="getTagsOptions"
                        :resolve-on-load="true"
                        :close-on-select="false"
                        placeholder="&nbsp;&nbsp;Выберите тэг.."
                    >
                        <template #option="{ option }">
                            <TaskTagOption :tag="option" />
                        </template>
                        <template #tag="{ option, disabled, handleTagRemove }">
                            <div
                                class="multiselect-tag"
                                :style="{ backgroundColor: '#' + option.color, color: '#fff' }"
                            >
                                <span>{{ option.label }}</span>
                                <i
                                    v-if="!disabled"
                                    v-tippy="'Удалить'"
                                    @click="handleTagRemove(option, $event)"
                                    class="ml-1 fa-solid fa-close"
                                />
                            </div>
                        </template>
                    </MultiSelect>
                </div>
                <div class="row">
                    <UiTextarea
                        ref="titleEl"
                        v-model="form.title"
                        :v="v$.form.title"
                        :min-height="50"
                        :max-height="70"
                        auto-height
                        class="col-12"
                        label="Заголовок задачи"
                        placeholder="Заполните заголовок.."
                        required
                    />
                    <UiTextarea
                        v-model="form.message"
                        :autofocus="autofocusMessage"
                        :min-height="90"
                        :max-height="200"
                        auto-height
                        :class="{ 'col-7': hasCustomDescription, 'col-12': !hasCustomDescription }"
                        label="Описание задачи"
                        placeholder="Заполните описание.."
                        helper="Опишите задачу, что нужно сделать, почему и с каким объектом/компанией это связано!"
                    />
                    <FormModalTaskDescription
                        v-if="hasCustomDescription"
                        :template="additionalContent.modelType"
                        :info="additionalContent"
                        class="col-5"
                    />
                </div>
            </template>
            <template #4>
                <Spinner v-if="consultantsIsLoading" center />
                <UserPicker v-else v-model="form.observers" :users="consultantsForObservers" />
            </template>
            <template #5>
                <Spinner v-if="filesIsLoading" label="Загрузка файлов.." center />
                <FileInput
                    v-else
                    v-model:native="form.files"
                    v-model:data="form.current_files"
                    label="Файлы или фотографии к задаче"
                />
            </template>
        </Stepper>
    </UiModal>
</template>
<script setup>
import Stepper from '@/components/common/Stepper.vue';
import DatePicker from '@/components/common/Forms/DatePicker/DatePicker.vue';
import Spinner from '@/components/common/Spinner.vue';
import UserPicker from '@/components/common/Forms/UserPicker/UserPicker.vue';
import {
    helpers,
    maxLength,
    minLength,
    minValue,
    required,
    requiredIf
} from '@vuelidate/validators';
import { useStore } from 'vuex';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import TaskTagOption from '@/components/common/Forms/TaskTagOption.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import {
    computed,
    nextTick,
    onUnmounted,
    ref,
    shallowRef,
    useTemplateRef,
    watch,
    reactive,
    toRef
} from 'vue';
import dayjs from 'dayjs';
import { useTagsOptions } from '@/composables/options/useTagsOptions.js';
import { taskOptions } from '@/const/options/task.options.js';
import FormModalTaskDescription from '@/components/Forms/FormModalTaskDescription.vue';
import { useAuth } from '@/composables/useAuth.js';
import DashboardTableTasksItem from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItem.vue';
import { useDebounceFn, useTimeoutFn } from '@vueuse/core';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import FileInput from '@/components/common/Forms/FileInput.vue';
import api from '@/api/api.js';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiField from '@/components/common/UI/UiField.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useValidation } from '@/composables/useValidation.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { isString } from 'maska/types/utils.js';
import { dayjsFromMoscow } from '@/utils/formatters/date.js';

const store = useStore();
const { getTagsOptions } = useTagsOptions();
const { currentUser } = useAuth();

const steps = [
    {
        name: 'user_id',
        title: 'Выбор исполнителя',
        icon: 'fa-solid fa-user'
    },
    {
        name: 'date',
        title: 'Выбор даты',
        icon: 'fa-solid fa-clock'
    },
    {
        name: 'message',
        title: 'Описание задачи',
        icon: 'fa-solid fa-pen'
    },
    {
        name: 'observers',
        title: 'Наблюдатели',
        icon: 'fa-solid fa-eye'
    },
    {
        name: 'files',
        title: 'Файлы',
        icon: 'fa-solid fa-file-circle-plus'
    }
];

const autofocusMessage = ref(false);

const step = ref(0);
const consultants = ref([]);
const consultantsIsLoading = ref(false);
const hasCustomDescription = ref(false);
const additionalContent = shallowRef({});

const titleEl = useTemplateRef('titleEl');

const form = ref({
    title: null,
    message: null,
    date: {
        end: null,
        start: new Date()
    },
    tags: [],
    user_id: null,
    status: 1,
    observers: [],
    files: [],
    current_files: []
});

const taskPreview = computed(() => {
    return {
        tags: [],
        id: 1,
        created_by_type: 'user',
        created_by_id: currentUser.value.id,
        created_by: currentUser.value,
        title: form.value.title || 'Заполните заголовок..',
        status: 1,
        observers: selectedObservers.value,
        user_id: form.value.user_id,
        user: selectedUser.value,
        end: form.value.date.end,
        start: form.value.date.start
    };
});

const selectedUser = computed(() => {
    return consultants.value.find(element => element.id === form.value.user_id);
});

const selectedObservers = computed(() => {
    return form.value.observers.reduce((acc, element) => {
        const user = consultants.value.find(el => el.id === element);

        if (user)
            acc.push({
                user_id: element,
                user
            });

        return acc;
    }, []);
});

const consultantsForObservers = computed(() => {
    if (store.getters.isAdmin) return consultants.value;
    return consultants.value.filter(
        element => element.id !== form.value.user_id && element.id !== store.getters.THIS_USER.id
    );
});

watch(step, value => {
    if (value === 2) {
        nextTick(() => useTimeoutFn(titleEl.value.focus, 1000, { immediate: true }));
    }
});

const clearForm = () => {
    form.value = {
        title: null,
        message: null,
        date: {
            end: null,
            start: null
        },
        user_id: null,
        status: 1,
        tags: [],
        observers: [],
        files: [],
        current_files: []
    };

    v$.value.$reset();
};

const fetchConsultants = async () => {
    consultantsIsLoading.value = true;

    consultants.value = await store.dispatch('getConsultants');

    consultantsIsLoading.value = false;
};

function parseDate(date, defaultValue = null) {
    if (isNullish(date)) return defaultValue;
    if (isString(date) && isEditing.value) return dayjsFromMoscow(date).toDate();
    return dayjs(date).toDate();
}

const {
    isVisible,
    onPopupShowed,
    destroy: destroyPopup,
    submit: _submit,
    cancel,
    props
} = useAsyncPopup('taskCreator');

onPopupShowed(() => {
    step.value = props.value?.step ?? 0;
    hasCustomDescription.value = props.value?.customDescription ?? false;
    additionalContent.value = props.value?.additionalContent ?? {};

    externalPresets.call = props.value?.callPresets ?? false;

    if (!consultants.value.length) fetchConsultants();

    if (props.value) {
        form.value = {
            title: props.value.title,
            message: props.value.message,
            date: {
                end: parseDate(props.value.end),
                start: parseDate(props.value.start)
            },
            user_id: props.value.user_id,
            status: props.value.status ?? taskOptions.statusTypes.NEW,
            tags: props.value.tags ? props.value.tags.map(element => element.id) : [],
            observers: props.value.observers
                ? props.value.observers.map(element => element.user_id)
                : [],
            current_files: [],
            files: []
        };

        if (isEditing.value && props.value.files_count > 0) fetchFiles();
    }

    if (props.value?.focusMessage) autofocusMessage.value = true;

    generateStartPresets();
});

// presets

const externalPresets = reactive({
    call: false
});

function generateStartPresets() {
    startPresets.value = [
        ...(externalPresets.call ? generateCallStartPresets() : []),
        {
            value: dayjs().add(1, 'day').toDate(),
            label: '1 день'
        },
        {
            value: dayjs().add(3, 'day').toDate(),
            label: '3 дня'
        },
        {
            value: dayjs().add(5, 'day').toDate(),
            label: '5 дней'
        },
        {
            value: dayjs().add(7, 'day').toDate(),
            label: 'Неделя'
        },
        {
            value: dayjs().add(14, 'day').toDate(),
            label: '2 недели'
        },
        {
            value: dayjs().add(1, 'month').toDate(),
            label: 'Месяц'
        },
        {
            value: dayjs().add(3, 'month').toDate(),
            label: '3 месяца'
        },
        {
            value: dayjs().add(6, 'month').toDate(),
            label: 'Пол года'
        },
        {
            value: dayjs().add(9, 'month').toDate(),
            label: '9 месяцев'
        }
    ];
}

function generateCallStartPresets() {
    return [
        {
            value: dayjs().add(30, 'minute').toDate(),
            label: '30 минут'
        },
        {
            value: dayjs().add(1, 'hour').toDate(),
            label: '1 час'
        },
        {
            value: dayjs().add(2, 'hour').toDate(),
            label: '2 часа'
        },
        {
            value: dayjs().add(3, 'hour').toDate(),
            label: '3 часа'
        }
    ];
}

const startPresets = shallowRef([]);

generateStartPresets();

function generateEndPresets() {
    endPresets.value = [
        ...(externalPresets.call ? generateCallEndPresets() : []),
        {
            value: dayjs(form.value.date.start).add(1, 'day').toDate(),
            label: '1 день'
        },
        {
            value: dayjs(form.value.date.start).add(3, 'day').toDate(),
            label: '3 дня'
        },
        {
            value: dayjs(form.value.date.start).add(5, 'day').toDate(),
            label: '5 дней'
        },
        {
            value: dayjs(form.value.date.start).add(7, 'day').toDate(),
            label: 'Неделя'
        },
        {
            value: dayjs(form.value.date.start).add(14, 'day').toDate(),
            label: '2 недели'
        },
        {
            value: dayjs(form.value.date.start).add(1, 'month').toDate(),
            label: 'Месяц'
        },
        {
            value: dayjs(form.value.date.start).add(3, 'month').toDate(),
            label: '3 месяца'
        },
        {
            value: dayjs(form.value.date.start).add(6, 'month').toDate(),
            label: 'Пол года'
        },
        {
            value: dayjs(form.value.date.start).add(9, 'month').toDate(),
            label: '9 месяцев'
        }
    ];
}

function generateCallEndPresets() {
    return [
        {
            value: dayjs(form.value.date.start).add(30, 'minute').toDate(),
            label: '30 минут'
        },
        {
            value: dayjs(form.value.date.start).add(1, 'hour').toDate(),
            label: '1 час'
        },
        {
            value: dayjs(form.value.date.start).add(2, 'hour').toDate(),
            label: '2 часа'
        },
        {
            value: dayjs(form.value.date.start).add(3, 'hour').toDate(),
            label: '3 часа'
        }
    ];
}

const endPresets = shallowRef([]);
generateEndPresets();

const debouncedGenerateEndPresets = useDebounceFn(generateEndPresets, 500);

watch(() => form.value.date.start, debouncedGenerateEndPresets);

// validation

const { v$, validate } = useValidation(
    {
        form: {
            date: {
                start: {
                    required: helpers.withMessage('Выберите дату старта задачи!', required),
                    minValue: helpers.withMessage(
                        'Дата начала задачи должна быть больше текущей даты',
                        requiredIf(() => !isEditing.value, minValue(new Date()))
                    )
                },
                end: {
                    required: helpers.withMessage('Выберите дату истечения задачи!', required),
                    minValue: helpers.withMessage(
                        'Дата начала задачи должна быть раньше даты истечения',
                        minValue(toRef(() => form.value.date.start))
                    )
                }
            },
            user_id: {
                minLength: helpers.withMessage('Выберите сотрудника!', required)
            },
            title: {
                required: helpers.withMessage('Заголовок задачи является обязательным!', required),
                minLength: helpers.withMessage(
                    'Заголовок задачи не может быть меньше 16 символов!',
                    minLength(16)
                ),
                maxLength: helpers.withMessage(
                    'Заголовок задачи не может быть больше 255 символов!',
                    maxLength(255)
                )
            }
        }
    },
    { form }
);

const formToPayload = () => {
    return {
        start: form.value.date.start,
        end: form.value.date.end,
        user_id: Number(form.value.user_id),
        title: form.value.title,
        message: form.value.message,
        status: form.value.status,
        tag_ids: form.value.tags,
        observer_ids: form.value.observers,
        files: form.value.files,
        current_files: form.value.current_files.map(element => element.id)
    };
};

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    _submit(formToPayload());
    clearForm();
}

const close = () => {
    cancel();
    clearForm();
};

const isEditing = computed(() => isNotNullish(props.value?.id));

onUnmounted(() => {
    destroyPopup();
});

// files

const filesIsLoading = ref(false);

async function fetchFiles() {
    filesIsLoading.value = true;

    const response = await api.task.getFiles(props.value.id);
    if (response) form.value.current_files = response;

    filesIsLoading.value = false;
}

// assigning

const assignedToSelf = computed(() => form.value.user_id === currentUser.value.id);

function assignToSelf() {
    form.value.user_id = currentUser.value.id;
}

const canBeAssignedToModerator = computed(() => isNotNullish(store.getters?.moderator));
const assignedToModerator = computed(() => form.value.user_id === store.getters?.moderator?.id);

function assignToModerator() {
    form.value.user_id = store.getters.moderator.id;
}

const endDateIsFocusedToStart = computed(
    () =>
        isNullish(form.value.date.end) ||
        (form.value.date.start && dayjs(form.value.date.end).isBefore(dayjs(form.value.date.start)))
);
</script>
